import CatchPostForm from "./catch-post-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function CatchPost() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      redirect("/login"); // 未ログインなら/loginへ
    }
    return (
        <CatchPostForm />
    );
}