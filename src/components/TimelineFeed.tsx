"use client";

import { Yweet } from "@/types/Yweet";
import { useState } from "react";
import { YweetCard } from "./YweetCard";
import { useAuth } from "@/auth/AuthProvider";
import { PostYweetForm } from "./PostYweetForm";

type TimelineFeedProps = {
  initialYweets: Yweet[];
}

export function TimelineFeed({ initialYweets }: TimelineFeedProps) {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [yweets, setYweets] = useState<Yweet[]>(initialYweets);

  // ここに投稿フォーム
  function handlePosted(created: Yweet) {
    // ここを手順6で追加
    setYweets((prev) => [created, ...prev]);
  }

  return (
    <>
      {isLoggedIn && <PostYweetForm onPosted={handlePosted} />}
      
      {yweets.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500">
          まだ Yweet がありません
        </p>
      ) : (
        yweets.map((yweet) => (
          <YweetCard
            key={yweet.id}
            username={yweet.user.username}
            content={yweet.content}
            avatarUrl={yweet.user.avatar}
          />
        ))
      )}
  </>
  );
}
