"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PostButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/post")}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-500 hover:bg-blue-600"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
} 