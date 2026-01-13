"use client";

import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

export default function MapPicker({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full h-75 sm:h-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm",
        className
      )}
      {...props}
    >
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        className="h-full w-full"
        trackResize={true}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
