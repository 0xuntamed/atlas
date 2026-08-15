"use client";

import { useEffect, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import type { GeoArc, GeoPoint } from "@/lib/geo";
import { pointsView } from "@/lib/geo";

export default function TripGlobe({
  points,
  arcs,
}: {
  points: GeoPoint[];
  arcs: GeoArc[];
}) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Frame the itinerary; no auto-rotate (this is a focused view).
  useEffect(() => {
    const g = globeRef.current;
    if (!g || size.width === 0) return;
    const view = pointsView(points);
    g.pointOfView(view, 800);
    const controls = g.controls();
    controls.autoRotate = false;
    controls.enableZoom = true;
  }, [size.width, points]);

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          showGlobe
          showAtmosphere
          atmosphereColor="#8ab4c8"
          atmosphereAltitude={0.16}
          globeImageUrl={null as unknown as undefined}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#34d399"}
          pointAltitude={0.02}
          pointRadius={0.32}
          pointLabel={(p) => {
            const g = p as GeoPoint;
            return `<div style="font:600 12px sans-serif;color:#111;background:#f6f3ec;padding:3px 8px;border-radius:6px">${g.order + 1}. ${g.name}</div>`;
          }}
          labelsData={points}
          labelLat="lat"
          labelLng="lng"
          labelText={(p) => (p as GeoPoint).name}
          labelSize={0.9}
          labelDotRadius={0.3}
          labelColor={() => "#f6f3ec"}
          labelResolution={2}
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={() => ["#fbbf24", "#34d399"]}
          arcStroke={0.5}
          arcDashLength={0.5}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcAltitudeAutoScale={0.4}
        />
      )}
    </div>
  );
}
