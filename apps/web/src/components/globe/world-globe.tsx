"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { useRouter } from "next/navigation";
import countriesGeo from "@/data/countries.geo.json";
import { STATE_COLOR } from "@/lib/globe-colors";
import type { StateMap } from "@/lib/geo";

interface CountryFeature {
  type: "Feature";
  properties: { code: string; name: string };
  geometry: unknown;
}
const FEATURES = (countriesGeo as { features: CountryFeature[] }).features;

export default function WorldGlobe({ states }: { states: StateMap }) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState<CountryFeature | null>(null);

  // Measure the container so the canvas fills it responsively.
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

  // Gentle auto-rotation + a framed starting view.
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView({ lat: 20, lng: 10, altitude: 2.4 }, 0);
    const controls = g.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.enableZoom = true;
  }, [size.width]);

  const capColor = useMemo(
    () => (feat: object) => {
      const f = feat as CountryFeature;
      const state = states[f.properties.code] ?? "neutral";
      return STATE_COLOR[state];
    },
    [states],
  );

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
          atmosphereAltitude={0.18}
          globeImageUrl={null as unknown as undefined}
          polygonsData={FEATURES}
          polygonAltitude={(f) => (f === hovered ? 0.06 : 0.012)}
          polygonCapColor={capColor}
          polygonSideColor={() => "rgba(0,0,0,0.15)"}
          polygonStrokeColor={() => "#111"}
          polygonLabel={(f) => {
            const c = f as CountryFeature;
            return `<div style="font:600 12px sans-serif;color:#111;background:#f6f3ec;padding:3px 8px;border-radius:6px">${c.properties.name}</div>`;
          }}
          onPolygonHover={(f) => setHovered((f as CountryFeature) ?? null)}
          onPolygonClick={(f) =>
            router.push(`/countries/${(f as CountryFeature).properties.code}`)
          }
          polygonsTransitionDuration={200}
        />
      )}
    </div>
  );
}
