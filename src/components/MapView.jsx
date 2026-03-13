import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";

const IMAGE_SIZE = 8192;
const bounds = [
  [0, 0],
  [IMAGE_SIZE, IMAGE_SIZE],
];

/* Custom marker icons */
function createIcon(bgColor, borderColor, label) {
  return L.divIcon({
    className: "",
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    html: `<div style="
      width:26px;height:26px;
      display:flex;align-items:center;justify-content:center;
      background:${bgColor};
      border:2px solid ${borderColor};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
    "><span style="
      transform:rotate(45deg);
      font-size:11px;
      font-weight:800;
      color:#fff;
      font-family:Teko,sans-serif;
      text-shadow:0 1px 2px rgba(0,0,0,0.3);
    ">${label}</span></div>`,
  });
}

const guessIcon = createIcon("#3b82f6", "#2563eb", "?");
const actualIcon = createIcon("#ef4444", "#dc2626", "✓");
const previewIcon = createIcon("rgba(59,130,246,0.5)", "rgba(37,99,235,0.6)", "");

function ClickHandler({ onMapClick, disabled }) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/* Use fitBounds to show both markers properly */
function FitBoundsView({ guessPos, actualPos }) {
  const map = useMap();
  useEffect(() => {
    if (guessPos && actualPos) {
      const b = L.latLngBounds([guessPos, actualPos]);
      map.flyToBounds(b, { padding: [80, 80], duration: 1.2, maxZoom: 2 });
    } else if (actualPos) {
      map.flyTo(actualPos, 1, { duration: 1 });
    }
  }, [guessPos, actualPos, map]);
  return null;
}

export default function MapView({
  guessPosition,
  actualPosition,
  showResult,
  onMapClick,
  disabled,
}) {
  return (
    <MapContainer
      crs={L.CRS.Simple}
      center={[IMAGE_SIZE / 2, IMAGE_SIZE / 2]}
      zoom={-1}
      minZoom={-3}
      maxZoom={4}
      maxBounds={[[-500, -500], [IMAGE_SIZE + 500, IMAGE_SIZE + 500]]}
      maxBoundsViscosity={0.8}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      <ImageOverlay url="/erangel_8192.png" bounds={bounds} />
      <ClickHandler onMapClick={onMapClick} disabled={disabled} />

      {guessPosition && !showResult && (
        <Marker position={guessPosition} icon={previewIcon} />
      )}
      {guessPosition && showResult && (
        <Marker position={guessPosition} icon={guessIcon} />
      )}
      {actualPosition && showResult && (
        <Marker position={actualPosition} icon={actualIcon} />
      )}
      {guessPosition && actualPosition && showResult && (
        <Polyline
          positions={[guessPosition, actualPosition]}
          pathOptions={{
            color: "#ef4444",
            weight: 2,
            dashArray: "8 5",
            opacity: 0.8,
          }}
        />
      )}
      {showResult && (
        <FitBoundsView guessPos={guessPosition} actualPos={actualPosition} />
      )}
    </MapContainer>
  );
}
