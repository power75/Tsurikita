"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import FishingSpotMapWrapper from "./FishingSpotMapWrapper";
import RegionSelector from "./RegionSelector";

type FishingSpot = {
  id: number;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
};

type Region = {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
};

const regionMap: { [key: string]: Region } = {
  doou: { name: "道央", lat: 43.0644, lng: 141.3468, zoom: 8 },
  donan: { name: "道南", lat: 41.7686, lng: 140.7289, zoom: 8 },
  dohoku: { name: "道北", lat: 45.4091, lng: 141.6739, zoom: 8 },
  doto: { name: "道東", lat: 43.0644, lng: 144.3869, zoom: 8 },
};

function FishingSpotListContent() {
  const searchParams = useSearchParams();
  const [fishingSpots, setFishingSpots] = useState<FishingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // URLパラメータから初期地域を設定
  const regionParam = searchParams.get('region');
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  const zoomParam = searchParams.get('zoom');
  
  const [selectedRegion, setSelectedRegion] = useState<Region>(() => {
    if (regionParam && regionMap[regionParam]) {
      return regionMap[regionParam];
    }
    if (latParam && lngParam && zoomParam) {
      return {
        name: "選択された地域",
        lat: parseFloat(latParam),
        lng: parseFloat(lngParam),
        zoom: parseInt(zoomParam)
      };
    }
    return { name: "道央", lat: 43.0644, lng: 141.3468, zoom: 8 };
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchFishingSpots = async () => {
      try {
        const { data, error } = await supabase
          .from("fishing_spots")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setFishingSpots(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFishingSpots();
  }, [supabase]);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">釣り場一覧</h1>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">釣り場一覧</h1>
        <p className="text-red-500">釣り場情報の取得に失敗しました。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">釣り場一覧</h1>
      
      <RegionSelector 
        onRegionSelect={handleRegionSelect} 
        selectedRegion={selectedRegion.name}
      />
      
      <div className="mb-4">
        <FishingSpotMapWrapper 
          lat={selectedRegion.lat} 
          lng={selectedRegion.lng} 
          name="釣り場一覧"
          fishingSpots={fishingSpots}
          zoom={selectedRegion.zoom}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fishingSpots?.map((spot) => (
          <div key={spot.id} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">{spot.name}</h2>
            {spot.description && (
              <p className="text-gray-600 mb-2">{spot.description}</p>
            )}
            <p className="text-sm text-gray-500">
              緯度: {spot.latitude}, 経度: {spot.longitude}
            </p>
            <a 
              href={`/fishing_spot/${spot.id}`}
              className="text-blue-500 hover:underline text-sm"
            >
              詳細を見る
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FishingSpotList() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">釣り場一覧</h1>
        <p>読み込み中...</p>
      </div>
    }>
      <FishingSpotListContent />
    </Suspense>
  );
} 