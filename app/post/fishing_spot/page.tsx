"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function FishingSpotForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
    if (!name || !latitude || !longitude) {
      setError("釣り場名・緯度・経度は必須です");
      setIsUploading(false);
      return;
    }
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("ログインが必要です");
      let imageUrl = null;
      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0) {
        // APIルートを使用してS3にアップロード
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('folder', 'upload/fishing-spots'); // 釣り場画像用フォルダ
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || "画像のアップロードに失敗しました");
        }
        
        imageUrl = data.fileUrl;
      }
      const { data, error: insertError } = await supabase
        .from("fishing_spots")
        .insert({
          name,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          description: formData.get("description") || null,
          image_url: imageUrl,
          access_info: formData.get("access_info") || null,
          parking: formData.get("parking") || null,
          caution: formData.get("caution") || null,
          google_map_url: formData.get("google_map_url") || null,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (insertError) throw insertError;
      router.push(`/fishing_spot/${data.id}`);
    } catch (err: any) {
      setError(err.message || "登録に失敗しました");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">釣り場新規作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">釣り場名（必須）</label>
          <Input name="name" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">緯度（必須）</label>
          <Input name="latitude" type="number" step="any" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">経度（必須）</label>
          <Input name="longitude" type="number" step="any" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">説明</label>
          <Textarea name="description" />
        </div>
        <div>
          <label className="block font-semibold mb-1">画像</label>
          <Input name="image" type="file" accept="image/*"
            onChange={e => {
              const files = e.target.files;
              if (files && files[0]) {
                setImagePreview(URL.createObjectURL(files[0]));
              } else {
                setImagePreview(null);
              }
            }}
          />
          {imagePreview && (
            <img src={imagePreview} alt="プレビュー" className="w-40 h-40 object-contain rounded-md mt-2" />
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">アクセス情報</label>
          <Textarea name="access_info" />
        </div>
        <div>
          <label className="block font-semibold mb-1">駐車場</label>
          <Textarea name="parking" />
        </div>
        <div>
          <label className="block font-semibold mb-1">注意事項</label>
          <Textarea name="caution" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Google Map URL</label>
          <Input name="google_map_url" type="url" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? "登録中..." : "登録"}
        </Button>
      </form>
    </div>
  );
} 