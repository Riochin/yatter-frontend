"use client";

import { Yweet } from "@/types/Yweet";
import { Textarea } from "./Textarea";
import { Button } from "./Button";
import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { setegid } from "node:process";

type PostYweetFormProps = {
   /** 投稿に成功したとき、作成された Yweet を親に渡す */
  onPosted: (yweet: Yweet) => void;
}

export function PostYweetForm({ onPosted }: PostYweetFormProps) {
  // 入力値は次ステップ
  // onposted はそう申請交互で呼ぶ
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmittting] = useState(false);
  const { getAuthenticationHeader } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (content.trim() === "") {
      setError("本文を入力してください");
      return;
    }

    const authentication = getAuthenticationHeader();
    if (!authentication) {
      setError("投稿するにはログインが必要です");
      return;
    }

    setError("");
    setIsSubmittting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/yweets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authentication: authentication,
          },
          body: JSON.stringify({
            yweet: content,
          }),
        }
      );

      if (!res.ok) {
        setError("投稿に失敗しました");
        return;
      }

      const created = (await res.json()) as Yweet;
      onPosted(created);
      setContent("");
    } finally {
      setIsSubmittting(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3"
      onSubmit={handleSubmit}
    >
      <Textarea
        name="yweet"
        placeholder="今どうしてる？"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit">投稿する</Button>
        </div>
      </form>
  )
}