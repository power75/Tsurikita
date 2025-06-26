"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MapController from "../MapController";

// Leafletのデフォルトアイコンを修正
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type FishingSpot = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

export default function FishingSpotMap({ 
  lat, 
  lng, 
  name, 
  fishingSpots,
  zoom = 15
}: { 
  lat: number; 
  lng: number; 
  name: string; 
  fishingSpots?: FishingSpot[];
  zoom?: number;
}) {
  return (
    <MapContainer center={[lat, lng]} zoom={zoom} style={{ height: 400, width: "100%" }} scrollWheelZoom={true}>
      <MapController center={[lat, lng]} zoom={zoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {fishingSpots && fishingSpots.length > 0 ? (
        // 複数の釣り場を表示
        fishingSpots.map((spot) => (
          <Marker key={spot.id} position={[spot.latitude, spot.longitude]}>
            <Popup>{spot.name}</Popup>
          </Marker>
        ))
      ) : (
        // 単一の釣り場を表示
        <Marker position={[lat, lng]}>
          <Popup>{name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
} 