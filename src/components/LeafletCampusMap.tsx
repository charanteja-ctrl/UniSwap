"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Navigation,
  Search,
  Compass,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Sparkles,
  Layers,
} from "lucide-react";

export interface CampusMeetingPoint {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  description: string;
  category: "library" | "hostel" | "academic" | "dining" | "gate" | "hub";
}

export const VITAP_PRESET_POINTS: CampusMeetingPoint[] = [
  {
    id: "vit-lib",
    name: "Central Library Ground Floor (24/7 Desk)",
    code: "LIBRARY",
    lat: 16.4965,
    lng: 80.4988,
    description: "Primary 24/7 campus exchange spot; high security & well-lit.",
    category: "library",
  },
  {
    id: "vit-mh1",
    name: "Men's Hostel 1 (MH-1) Gazebo",
    code: "MH-1",
    lat: 16.4985,
    lng: 80.4975,
    description: "Outdoor shaded gazebo beside MH-1 dining courtyard.",
    category: "hostel",
  },
  {
    id: "vit-mh2",
    name: "Men's Hostel 2 (MH-2) Entrance Courtyard",
    code: "MH-2",
    lat: 16.4990,
    lng: 80.4968,
    description: "Front foyer near student bicycle stand.",
    category: "hostel",
  },
  {
    id: "vit-lh",
    name: "Ladies Hostels (LH-1 / LH-2) Main Gate",
    code: "LH GATE",
    lat: 16.4952,
    lng: 80.5015,
    description: "Secured guard counter with 24/7 monitored waiting lounge.",
    category: "hostel",
  },
  {
    id: "vit-ab1",
    name: "Academic Block 1 (AB-1) Cafeteria",
    code: "AB-1 FOOD",
    lat: 16.4978,
    lng: 80.5002,
    description: "Central dining & daytime student commons.",
    category: "dining",
  },
  {
    id: "vit-rock",
    name: "Rock Plaza & Amphitheater",
    code: "ROCK PLAZA",
    lat: 16.4960,
    lng: 80.4998,
    description: "Open air student meetup plaza near activity center.",
    category: "hub",
  },
  {
    id: "vit-gate",
    name: "VIT-AP University Main Entrance Gate",
    code: "MAIN GATE",
    lat: 16.4940,
    lng: 80.5020,
    description: "Main security checkpost along Inavolu Road.",
    category: "gate",
  },
];

interface LeafletCampusMapProps {
  selectedLocationName?: string;
  onSelectLocation?: (location: { name: string; lat: number; lng: number }) => void;
  className?: string;
}

export default function LeafletCampusMap({
  selectedLocationName,
  onSelectLocation,
  className = "",
}: LeafletCampusMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const draggableMarkerRef = useRef<any>(null);

  const [currentCoord, setCurrentCoord] = useState<{ lat: number; lng: number }>({
    lat: 16.4971,
    lng: 80.4992,
  });
  const [selectedLabel, setSelectedLabel] = useState<string>(
    selectedLocationName || "Central Library Ground Floor (24/7 Desk)"
  );
  const [isLocating, setIsLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      // Import Leaflet on client-side only
      const L = (await import("leaflet")).default;

      // Prevent re-initialization if already initialized
      if (mapInstanceRef.current) {
        return;
      }

      // Initialize map centered at VIT-AP Amaravati
      const map = L.map(mapContainerRef.current, {
        center: [16.4971, 80.4992],
        zoom: 16,
        zoomControl: false,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Custom DivIcon generator for sleek modern marker styling
      const createCustomIcon = (label: string, isDraggablePin: boolean = false) => {
        return L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              background: ${isDraggablePin ? "#eab308" : "#0A2540"};
              color: ${isDraggablePin ? "#0a152d" : "#ffffff"};
              font-family: inherit;
              font-size: 11px;
              font-weight: 800;
              padding: 4px 10px;
              border-radius: 9999px;
              border: 2px solid ${isDraggablePin ? "#ffffff" : "#60a5fa"};
              box-shadow: 0 4px 14px rgba(0,0,0,0.3);
              white-space: nowrap;
              transform: translate(-50%, -50%);
              cursor: pointer;
            ">
              <span style="font-size: 13px;">${isDraggablePin ? "📍" : "🏛️"}</span>
              <span>${label}</span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
      };

      // Plot preset VIT-AP landmarks
      VITAP_PRESET_POINTS.forEach((point) => {
        const marker = L.marker([point.lat, point.lng], {
          icon: createCustomIcon(point.code, false),
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0a1b33; line-height: 1.4;">
            <strong style="font-size: 13px; color: #0A2540;">${point.name}</strong>
            <p style="margin: 4px 0; color: #475569;">${point.description}</p>
            <div style="font-size: 10px; font-family: monospace; color: #2563eb; margin-top: 4px;">
              Lat: ${point.lat.toFixed(4)}° N, Lng: ${point.lng.toFixed(4)}° E
            </div>
          </div>
        `);

        marker.on("click", () => {
          setSelectedLabel(point.name);
          setCurrentCoord({ lat: point.lat, lng: point.lng });
          if (draggableMarkerRef.current) {
            draggableMarkerRef.current.setLatLng([point.lat, point.lng]);
          }
          if (onSelectLocation) {
            onSelectLocation({ name: point.name, lat: point.lat, lng: point.lng });
          }
        });
      });

      // Draggable Meeting Point Marker
      const draggableMarker = L.marker([16.4965, 80.4988], {
        draggable: true,
        icon: createCustomIcon("EXCHANGE PIN (DRAGGABLE)", true),
        zIndexOffset: 1000,
      }).addTo(map);

      draggableMarkerRef.current = draggableMarker;

      draggableMarker.on("dragend", () => {
        const position = draggableMarker.getLatLng();
        const customName = `Custom Campus Spot (${position.lat.toFixed(4)}°N, ${position.lng.toFixed(4)}°E)`;
        setCurrentCoord({ lat: position.lat, lng: position.lng });
        setSelectedLabel(customName);
        if (onSelectLocation) {
          onSelectLocation({ name: customName, lat: position.lat, lng: position.lng });
        }
      });

      // Allow clicking anywhere on or near campus to pin an exchange location!
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        draggableMarker.setLatLng([lat, lng]);

        // Find nearest landmark if within 150 meters, else label custom
        let closest = VITAP_PRESET_POINTS[0];
        let minDist = 9999;
        VITAP_PRESET_POINTS.forEach((pt) => {
          const d = Math.hypot(pt.lat - lat, pt.lng - lng);
          if (d < minDist) {
            minDist = d;
            closest = pt;
          }
        });

        const chosenLabel =
          minDist < 0.001
            ? closest.name
            : `Campus Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;

        setSelectedLabel(chosenLabel);
        setCurrentCoord({ lat, lng });

        if (onSelectLocation) {
          onSelectLocation({ name: chosenLabel, lat, lng });
        }
      });

      if (isMounted) setMapReady(true);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 17);
          if (draggableMarkerRef.current) {
            draggableMarkerRef.current.setLatLng([latitude, longitude]);
          }
          const myLocName = `My Current Location (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`;
          setSelectedLabel(myLocName);
          setCurrentCoord({ lat: latitude, lng: longitude });
          if (onSelectLocation) {
            onSelectLocation({ name: myLocName, lat: latitude, lng: longitude });
          }
        }
      },
      (err) => {
        setIsLocating(false);
        // Fallback gracefully to center of VIT-AP
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([16.4971, 80.4992], 16);
        }
      },
      { timeout: 8000 }
    );
  };

  const handleSelectPreset = (point: CampusMeetingPoint) => {
    setSelectedLabel(point.name);
    setCurrentCoord({ lat: point.lat, lng: point.lng });
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([point.lat, point.lng], 17);
      if (draggableMarkerRef.current) {
        draggableMarkerRef.current.setLatLng([point.lat, point.lng]);
      }
    }
    if (onSelectLocation) {
      onSelectLocation({ name: point.name, lat: point.lat, lng: point.lng });
    }
  };

  const filteredPresets = searchQuery
    ? VITAP_PRESET_POINTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : VITAP_PRESET_POINTS;

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col space-y-4 p-6 ${className}`}>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Leaflet.js + OpenStreetMap Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            VIT-AP University Interactive Campus Map
          </h3>
          <p className="text-xs text-slate-500">
            Click/tap anywhere on campus or drag the gold pin to select a precise physical meetup point.
          </p>
        </div>

        {/* Quick Geolocation & Recenter Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-xs disabled:opacity-50"
          >
            <Crosshair className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Locating..." : "Find My Location"}</span>
          </button>
        </div>
      </div>

      {/* Search Bar for Landmarks */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search campus spot: Library, MH-1, LH Gate, AB-1 Cafeteria..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Preset Landmark Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {filteredPresets.map((point) => (
          <button
            key={point.id}
            type="button"
            onClick={() => handleSelectPreset(point)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition border ${
              selectedLabel === point.name
                ? "bg-[#0A2540] text-yellow-400 border-[#0A2540]"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            }`}
          >
            {point.code}
          </button>
        ))}
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
        {/* Leaflet HTML Mount */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Custom Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-900 flex items-center justify-center font-bold text-sm border border-slate-200 shadow-sm transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-900 flex items-center justify-center font-bold text-sm border border-slate-200 shadow-sm transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Live Coordinate Badge Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-white text-xs shadow-lg space-y-0.5">
          <div className="font-bold flex items-center gap-1.5 text-yellow-400">
            <MapPin className="w-3.5 h-3.5 fill-current" />
            <span>{selectedLabel}</span>
          </div>
          <div className="text-[10px] text-blue-200 font-mono">
            GPS: {currentCoord.lat.toFixed(4)}° N, {currentCoord.lng.toFixed(4)}° E (Amaravati, AP)
          </div>
        </div>
      </div>

      {/* Confirmation & Selected Location Summary */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
            Selected Exchange Point for Pickup
          </span>
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <span>{selectedLabel}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            Recorded Coordinates: {currentCoord.lat.toFixed(5)}, {currentCoord.lng.toFixed(5)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onSelectLocation) {
              onSelectLocation({
                name: selectedLabel,
                lat: currentCoord.lat,
                lng: currentCoord.lng,
              });
            }
          }}
          className="px-5 py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Confirm Exchange Point</span>
        </button>
      </div>
    </div>
  );
}
