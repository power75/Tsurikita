"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FishingSpot {
  id: number;
  name: string;
}

interface Fish {
  id: number;
  name: string;
}

export default function CatchPostForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fishingSpots, setFishingSpots] = useState<FishingSpot[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: spotsData } = await supabase
        .from("fishing_spots")
        .select("id, name");
      if (spotsData) setFishingSpots(spotsData);

      const { data: fishesData } = await supabase
        .from("fishes")
        .select("id, name");
      if (fishesData) setFishes(fishesData);
    };

    fetchData();
  }, [supabase]);

  const form = useForm({
    defaultValues: {
      image: undefined as File | undefined,
      fishingSpot: "",
      fish: "",
      comment: "",
    }
  });

  const onSubmit = async (values: any) => {
    setError(null);
    setIsUploading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("ログインが必要です");
      }

      let imageUrl = null;
      if (values.image && values.image.length > 0) {
        const file = values.image[0];
        if (file.size > 1024 * 1024) throw new Error("画像サイズは1MBまでです");
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from("catch-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage
          .from("catch-images")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData?.publicUrl;
      }
      const { error: insertError } = await supabase
        .from("catches")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          fishing_spot: values.fishingSpot,
          fish: values.fish,
          comment: values.comment,
          created_at: new Date().toISOString(),
        });
      if (insertError) throw insertError;
      form.reset();
      setImagePreview(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "投稿に失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4">
        <FormField
          control={form.control}
          name="image"
          rules={{ required: "画像は必須です" }}
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>画像</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image"
                  onChange={e => {
                    const files = e.target.files;
                    if (files && files[0]) {
                      setImagePreview(URL.createObjectURL(files[0]));
                    } else {
                      setImagePreview(null);
                    }
                    onChange(files);
                  }}
                  {...Object.fromEntries(Object.entries(rest).filter(([k]) => k !== "value"))}
                />
              </FormControl>
              {imagePreview && (
                <img src={imagePreview} alt="プレビュー" className="w-40 h-40 object-cover rounded-md mt-2" />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fishingSpot"
          rules={{ required: "釣った場所は必須です" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>釣った場所</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="釣り場を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fishingSpots.map((spot) => (
                    <SelectItem key={spot.id} value={spot.name}>
                      {spot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fish"
          rules={{ required: "魚種は必須です" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>魚種</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="魚種を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fishes.map((fish) => (
                    <SelectItem key={fish.id} value={fish.name}>
                      {fish.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>コメント</FormLabel>
              <FormControl>
                <Textarea placeholder="コメントを入力" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "投稿中..." : "ポスト"}
        </Button>
      </form>
    </Form>
  );
}