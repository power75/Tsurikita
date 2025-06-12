'use server'

import React from 'react';
import { Card } from '@/components/ui/card';
import CatchImage from './mycatchImage';
import CatchInfo from './catchInfo';
import { createClient } from '@/utils/supabase/server';

// 日付を「何月何日」形式に変換する関数
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default async function CatchList({ columns = 4 }: { columns?: number }) {
  const supabase = await createClient();

  // 最新のキャッチを取得
  const { data: catches, error: catchesError } = await supabase
    .from('catches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  if (catchesError) {
    console.error('キャッチデータ取得エラー:', catchesError);
    return null;
  }

  // ユーザーIDのリストを作成
  const userIds = catches.map(item => item.user_id);

  // プロフィール情報を取得（usernameのみ）
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', userIds);

  if (profilesError) {
    console.error('プロフィール取得エラー:', profilesError);
    return null;
  }

  // プロフィール情報をマップに変換
  const profileMap = new Map(profiles.map(profile => [profile.id, profile]));

  return (
    <div className={
        `grid gap-6 ` +
        (columns === 1
          ? 'grid-cols-1'
          : `grid-cols-2 md:grid-cols-${columns}`)
      }>
      {catches.map((item) => (
        <Card key={item.id} className="flex flex-col h-full">
          <div className="flex flex-col w-full max-w-md mx-auto">
            <div className="w-full aspect-[16/9] relative mb-3">
              <CatchImage catchId={item.id} alt={item.fish} />
            </div>
            <CatchInfo 
              userName={profileMap.get(item.user_id)?.username} 
              date={formatDate(item.created_at)} 
              location={item.fishing_spot} 
              fishName={item.fish} 
            />
          </div>
        </Card>
      ))}
    </div>
  );
}