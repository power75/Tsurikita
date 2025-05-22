import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import React from 'react';
export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  //data.user.idにはauth.uidが格納される
  let { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data.user.id)
      .single();

  let username = profiles?.username;

  return (
    <div className="flex flex-col items-center h-screen">
      <p>ようこそ{username}さん</p>
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold">マイページ</h1>
        <p className>ここはプライベートな情報が表示されるページです。</p>
        <p className>ユーザー名: {username}</p>
        <p className>メールアドレス: {data.user.email}</p>
      </div>
    </div>
  );
}