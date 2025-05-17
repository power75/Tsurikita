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
        <Buutton>
            ログアウト
        </Buutton>
    );
}
