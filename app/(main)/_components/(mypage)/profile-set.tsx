"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ProfileSet() {
  const [iconUrl, setIconUrl] = useState("/image/placeholder.png");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("icon_url, username")
          .eq("id", user.id)
          .single();
        setIconUrl(profile?.icon_url || "/image/placeholder.png");
        setUsername(profile?.username || "");
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex items-center gap-5 p-1 rounded-md">
      <div className="w-15 h-15 relative">
        <Image
          src={iconUrl}
          alt="プロフィールアイコン"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <span className="font-semibold text-white leading-tight">{username}</span>
    </div>
  );
}