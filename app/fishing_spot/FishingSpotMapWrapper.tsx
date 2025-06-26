"use client";
import dynamic from "next/dynamic";

const FishingSpotMap = dynamic(() => import("./[id]/FishingSpotMap"), { ssr: false });

type FishingSpot = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

export default function FishingSpotMapWrapper({ 
  lat, 
  lng, 
  name, 
  fishingSpots,
  zoom = 5
}: { 
  lat: number; 
  lng: number; 
  name: string; 
  fishingSpots?: FishingSpot[];
  zoom?: number;
}) {
  return <FishingSpotMap lat={lat} lng={lng} name={name} fishingSpots={fishingSpots} zoom={zoom} />;
} 