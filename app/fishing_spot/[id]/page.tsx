import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import CatchImage from "@/app/(main)/_components/(catch)/mycatchImage";
import CatchInfo from "@/app/(main)/_components/(catch)/catchInfo";
import FishingSpotMapWrapper from "../FishingSpotMapWrapper";

// 日付を「何月何日」形式に変換する関数
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default async function FishingSpotDetail({ params }: any) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: fishingSpot } = await supabase
    .from("fishing_spots")
    .select("*")
    .eq("id", id)
    .single();

  if (!fishingSpot) {
    notFound();
  }

  const { data: catches, error: catchesError } = await supabase
    .from("catches")
    .select("*")
    .eq("fishing_spot", fishingSpot.name)
    .order("created_at", { ascending: false })
    .limit(4);

  if (catchesError || !catches) {
    // エラー処理または空の場合の表示
    return (
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">この釣り場での最近の釣果</h2>
        <p className="text-center">釣果情報の取得に失敗しました。</p>
      </div>
    );
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
    // プロフィールがなくても表示は続ける
  }

  // プロフィール情報をマップに変換
  const profileMap = new Map(profiles?.map(profile => [profile.id, profile]));

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-center">{fishingSpot.name}</h1>
      {fishingSpot.image_url && (
        <div className="relative w-full max-w-4xl h-96 mb-4">
          <Image
            src={fishingSpot.image_url}
            alt={fishingSpot.name}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      )}
      <div className="space-y-6 w-full max-w-4xl">
        <div>
          <h2 className="text-xl font-semibold mb-2">説明</h2>
          <p>{fishingSpot.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">アクセス情報</h2>
          <p>{fishingSpot.access_info}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">駐車場</h2>
          <p>{fishingSpot.parking}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">注意事項</h2>
          <p>{fishingSpot.caution}</p>
        </div>
        {fishingSpot.latitude && fishingSpot.longitude && (
          <div>
            <h2 className="text-xl font-semibold mb-2">地図</h2>
            <FishingSpotMapWrapper lat={Number(fishingSpot.latitude)} lng={Number(fishingSpot.longitude)} name={fishingSpot.name} />
          </div>
        )}
        {fishingSpot.google_map_url && (
          <div>
            <a
              href={fishingSpot.google_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google Mapで見る
            </a>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">この釣り場での最近の釣果</h2>
        {catches && catches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {catches.map((item: any) => (
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
        ) : (
          <p className="text-center">この釣り場の釣果はまだありません。</p>
        )}
      </div>
    </div>
  );
} 