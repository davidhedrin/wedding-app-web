"use client";

import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import Input from "./ui/input";

/* Fix default marker issue */
delete (L.Icon.Default.prototype as any)._getIconUrl;

const markerIcon = L.icon({
  iconUrl: "/assets/img/logo/wedlyvite-location.png",
  iconSize: [40, 50],
  iconAnchor: [20, 53],
});

type LocationResult = {
  display_name: string;
  lat: string;
  lon: string;
};

function LocationMarker({
  value,
  onSelect,
}: {
  value?: [number, number] | null;
  onSelect: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      onSelect(lat, lng);
    },
  });

  useEffect(() => {
    if (value) {
      map.setView(value, map.getZoom(), { animate: true });
    }
  }, [value]);

  return value ? <Marker position={value} icon={markerIcon} /> : null;
}

export default function MapPicker({
  className,
  value,
  address,
  onChange,
  zoom,
}: {
  className?: string;
  value?: [number, number] | null;
  address?: string;
  zoom?: number;
  onChange?: (data: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
}) {
  const [query, setQuery] = useState(address || "");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /* 🔍 SEARCH (forward geocoding) */
  useEffect(() => {
    if (!query) return;

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  /* 📍 Reverse geocoding (map click → address) */
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name;
    } catch {
      return "";
    }
  };

  /* ❌ close dropdown when click outside */
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="space-y-2">
      {/* 🔍 INPUT */}
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true); // hanya buka saat user mengetik
          }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder="Cari lokasi..."
          className="mb-1"
        />

        {/* 🔽 DROPDOWN */}
        {open && results.length > 0 && (
          <div className="absolute z-50 bg-white border w-full max-h-60 overflow-auto rounded-md shadow">
            {results.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  const lat = parseFloat(item.lat);
                  const lng = parseFloat(item.lon);

                  setQuery(item.display_name);
                  setOpen(false);

                  onChange?.({
                    lat,
                    lng,
                    address: item.display_name,
                  });
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {item.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🗺️ MAP */}
      <div
        className={cn(
          "w-full h-75 sm:h-100 rounded-lg overflow-hidden border",
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
            onSelect={async (lat, lng) => {
              const addr = await reverseGeocode(lat, lng);
              setQuery(addr);

              onChange?.({
                lat,
                lng,
                address: addr,
              });
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}