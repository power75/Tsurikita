"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { login } from '../../login/actions';
import { Input } from "@/components/ui/input";
export default function GuestDialog() {
    const [open, setOpen] = useState(false);
    return (
           <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mr-3">ログイン / アカウント作成</Button>
            </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-2">ログイン / アカウント作成</DialogTitle>
                    <DialogDescription asChild>
                    <form className="flex flex-col gap-4">
                        <Input id="email" name="email" type="email" placeholder="メールアドレス" required className="hover:border-primary focus:border-primary" />
                        <Input id="password" name="password" type="password" placeholder="パスワード" required className="hover:border-primary focus:border-primary" />
                        <Button formAction={login} className="cursor-pointer hover:opacity-90 transition-opacity">ログイン</Button>
                        <Button asChild className="cursor-pointer hover:opacity-90 transition-opacity">
                        <Link href="/login" onClick={() => setOpen(false)}>
                            アカウント作成
                        </Link>
                        </Button>
                    </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
    </Dialog>
    );
}
