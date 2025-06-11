"use client";

import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PostButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/post")}
      className="fixed cursor-pointer bottom-6 right-6 h-14 w-14 bg-black hover:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      size="icon"
    >
      <PencilLine className="h-8 w-8 text-white" />
    </Button>
  );
} 