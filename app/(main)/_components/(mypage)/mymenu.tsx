"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export default function Mymenu() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border cursor-pointer">
              <Menu size={36} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">プロフィール</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/mycatch">あなたの釣果</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/area">お気に入り釣り場</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-10">
      <Link href="./profile" className="w-full">
        <Button variant="outline" size="lg" className="w-full text-lg cursor-pointer">
          プロフィール
        </Button>
      </Link>
      <Link href="./mycatch" className="w-full">
        <Button variant="outline" size="lg" className="w-full text-lg cursor-pointer">
          あなたの釣果
        </Button>
      </Link>
      <Link href="./area" className="w-full">
        <Button variant="outline" size="lg" className="w-full text-lg cursor-pointer">
          お気に入り釣り場
        </Button>
      </Link>
    </div>
  );
}