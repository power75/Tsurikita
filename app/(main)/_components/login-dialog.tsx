"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginDialog() {
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')  // ルートパスへリダイレクト
    }   
    return (
        <Button className="cursor-pointer mr-3" onClick={handleLogout}>
            ログアウト
        </Button>
    );
}
