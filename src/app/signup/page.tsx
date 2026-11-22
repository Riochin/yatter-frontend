"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  // username / password は useState で持つ
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);
    
    // 空チェックなどここ
    if (!username.trim() || !password) {
      setError(
        ("ユーザー名とパスワードを入力してください。")
      );
      return;
    }
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password
          }),
        }
      );

      if (!res.ok) {
        setError("ユーザー作成に失敗しました");
        return;
      }
    } finally {
      setSubmitting(false);
    }
  
    try {
      await login(username, password);
      router.push("/");
    } catch(err) {
      // エラー表示
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
      return;
    } finally {
      setSubmitting(false);
    }
  }
  
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
        新規登録
      </h1>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          ユーザー名
          <Input
            required
            type="text"
            name="username"
            placeholder="john"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          パスワード
          <Input
            required
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <Button type="submit" disabled={submitting} className="w-full" >
          {submitting ? "新規登録中..." : "新規登録"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        アカウントがある場合は{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}