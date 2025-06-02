"use client";
import GuestDialog from "./guest-dialog";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { login } from '../../login/actions';
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import LoginDialog from "./login-dialog";

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
      <header className="flex items-center justify-between pl-2 pt-2 shadow-sm">
        <Link href="/">
            <Image src="/image/logo2.png" alt="ロゴ" width={100} height={100} />
        </Link>
        <div className="relative p-3">
            <Input placeholder="室蘭港" className="pl-10"/>
            <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex">
        <Button variant="outline" className="mr-3">
          <Link href="/private">
            マイページ
          </Link>
        </Button>
        <LoginDialog/>
        </div>
    </header>
    )
  }

  return (
    <header className="flex items-center justify-between pl-2 pt-2 shadow-sm">
        <Link href="/">
            <Image src="/image/logo2.png" alt="ロゴ" width={100} height={100} />
        </Link>
        <div className="relative p-3">
            <Input placeholder="室蘭港" className="pl-10"/>
            <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex">
        <GuestDialog/>
        </div>
    </header>
  );
}