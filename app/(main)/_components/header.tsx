"use client";
import GuestDialog from "./guest-dialog";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { login } from '../../login/actions';

export default function Header() {
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
        <GuestDialog/>
        </div>
    </header>
  );
}