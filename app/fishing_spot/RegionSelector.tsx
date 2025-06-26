"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Region = {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
};

const regions: Region[] = [
  { name: "道央", lat: 43.0644, lng: 141.3468, zoom: 8 }, // 札幌周辺
  { name: "道南", lat: 41.7686, lng: 140.7289, zoom: 8 }, // 函館周辺
  { name: "道北", lat: 45.4091, lng: 141.6739, zoom: 8 }, // 稚内周辺
  { name: "道東", lat: 43.0644, lng: 144.3869, zoom: 8 }, // 釧路周辺
];

type Props = {
  onRegionSelect: (region: Region) => void;
  selectedRegion?: string;
};

export default function RegionSelector({ onRegionSelect, selectedRegion }: Props) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">地域選択</h3>
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <Button
            key={region.name}
            variant={selectedRegion === region.name ? "default" : "outline"}
            onClick={() => onRegionSelect(region)}
            className="text-sm"
          >
            {region.name}
          </Button>
        ))}
      </div>
    </div>
  );
} 