// supabaseクライアントを作成するための関数をインポート
import { createClient } from '@/utils/supabase/server';
// ユーザーがログインしていない場合にリダイレクトするための関数をインポート
import { redirect } from 'next/navigation';
import { UsernameForm } from "./username-form";
import { IconForm } from "./icon-form";
export default async function Profile() {
  // supabaseクライアントを作成する
  const supabase = await createClient()

  // ユーザーがログインしていない場合にリダイレクトする
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // ユーザーのプロフィールデータを取得する
  let { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('username, icon_url')
    .eq('id', data.user.id)
    .single();

  // ユーザー名を取得する
  let username = profiles?.username;
  // メールアドレスを取得する
  let email = data.user.email;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-2xl font-bold mb-4">プロフィール</h1>
    <div className="flex flex-col gap-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <p className="text-lg">ユーザー名: {username || '未設定'}</p>
          <UsernameForm initialUsername={username} />
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <p className="text-lg">メールアドレス: {email || '未設定'}</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <p className="text-lg">アイコン</p>
          <IconForm initialIcon={profiles?.icon_url} />
        </div>
      </div>
    </div>
    </div>
  )
}
