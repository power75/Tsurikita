'use server'

import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/card'
import CatchImage from '../(catch)/catchImage'
import CatchInfo from '../(catch)/catchInfo'
import { redirect } from 'next/navigation'

// 日付を「何月何日」形式に変換する関数
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default async function Mycatch() {
  const supabase = await createClient()
  
  // ユーザー認証の確認
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('認証エラー:', authError)
    redirect('/login')
  }

  // ユーザープロフィールを取得
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('プロフィール取得エラー:', profileError)
  }

  // ユーザーの釣果記録を取得
  const { data: catches, error: catchError } = await supabase
    .from('catches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (catchError) {
    console.error('データ取得エラー:', catchError)
    throw new Error('データの取得に失敗しました')
  }

  if (!catches || catches.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p className="font-bold mb-2">投稿がありません</p>
        <p>新しい釣果を記録してください</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col mt-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{profile?.username}さんの釣果記録</h2>
      </div>
      <div className="grid gap-8 grid-cols-1 w-full">
        {catches.map((item) => (
          <Card key={item.id} className="flex flex-col h-full p-3">
            <div className="flex flex-col w-full">
              <div className="w-full aspect-[16/9] relative mb-3">
                <CatchImage catchId={item.id} alt={item.fish} />
              </div>
              <CatchInfo 
                userName={profile?.username} 
                date={formatDate(item.created_at)} 
                location={item.fishing_spot} 
                fishName={item.fish} 
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}