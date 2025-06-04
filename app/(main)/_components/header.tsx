"use client";
import GuestDialog from "./guest-dialog";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import LoginDialog from "./login-dialog";
import ProfileSet from "./(mypage)/profile-set";
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkSession()

    // セッション変更の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoggedIn) {
    return (
      <header className="flex items-center justify-between p-2 shadow-sm">
        <Link href="/">
            <Image src="/image/logo2.png" alt="ロゴ" width={100} height={100} />
        </Link>
        <ProfileSet />
        <LoginDialog/>
    </header>
    )
  }

  return (
    <header className="flex items-center justify-between pl-2 pt-2 shadow-sm">
        <Link href="/">
            <Image src="/image/logo2.png" alt="ロゴ" width={100} height={100} />
        </Link>
        <div className="flex">
        <GuestDialog/>
        </div>
    </header>
  );
}