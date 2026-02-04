"use client";

import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

/* Fix default marker issue */
delete (L.Icon.Default.prototype as any)._getIconUrl;

const markerIcon = L.icon({
  iconUrl: "/assets/img/logo/wedlyvite-location.png", // 👉 simpan di /public/marker.png
  iconSize: [40, 50],
  iconAnchor: [20, 53],
});

function LocationMarker({
  value,
  onSelect,
}: {
  value?: [number, number] | null;
  onSelect: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect(lat, lng);
    },
  });

  if (value) {
    map.setView(value, map.getZoom(), { animate: true });
  }

  return value ? (
    <Marker position={value} icon={markerIcon} />
  ) : null;
}

export default function MapPicker({
  className,
  value,
  onChange,
  zoom,
}: {
  className?: string;
  value?: [number, number] | null;
  onChange?: (lat: number, lng: number) => void;
  zoom?: number;
}) {
  return (
    <div
      className={cn(
        "w-full h-75 sm:h-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm",
        className
      )}
    >
      <MapContainer
        center={value ?? [-6.2, 106.8166]}
        zoom={zoom ?? 15}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          value={value}
          onSelect={(lat, lng) => {
            onChange?.(lat, lng)
          }}
        />
      </MapContainer>
    </div>
  );
}