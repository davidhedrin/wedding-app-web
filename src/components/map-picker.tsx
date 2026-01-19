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
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return position ? (
    <Marker position={position} icon={markerIcon} />
  ) : null;
}

export default function MapPicker({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (lat: number, lng: number) => void;
}) {
  return (
    <div
      className={cn(
        "w-full h-75 sm:h-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm",
        className
      )}
    >
      <MapContainer
        center={[-6.2000, 106.8166]}
        zoom={15}
        className="h-full w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker onSelect={(lat, lng) => {
          onChange?.(lat, lng)
        }} />
      </MapContainer>
    </div>
  );
}