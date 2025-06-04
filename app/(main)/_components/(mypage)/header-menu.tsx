"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export default function Headermenu() {
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')  // ルートパスへリダイレクト
    }   
  const [open, setOpen] = useState(false);

    return (
      <div className="pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border cursor-pointer">
              <Menu size={36} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-1">
            <DropdownMenuItem asChild>
              <Link href="/private">マイページ</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="private/profile">プロフィール</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/private">あなたの釣果</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="private/areas">お気に入り釣り場</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
                ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }