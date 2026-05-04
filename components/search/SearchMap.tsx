"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Gym } from "@/data/gyms";
import { findDiscipline } from "@/data/disciplines";

interface Props {
  gyms: Gym[];
  hoveredSlug?: string | null;
  onPinClick?: (slug: string) => void;
  className?: string;
  locale: "he" | "en";
}

export function SearchMap({
  gyms,
  hoveredSlug,
  onPinClick,
  className,
  locale,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [31.9, 34.85],
      zoom: 9,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(
      "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors © CARTO",
        maxZoom: 19,
      },
    ).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Render markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    if (gyms.length === 0) return;

    const bounds = L.latLngBounds([]);
    for (const g of gyms) {
      const primary = g.discipline_slugs[0]
        ? findDiscipline(g.discipline_slugs[0])
        : null;
      const color = primary?.pin_color ?? "#0F4C5C";

      const html = `
        <div class="dojan-pin" data-slug="${g.slug}" style="--pin-color: ${color}">
          <div class="dojan-pin-bubble">
            <span class="dojan-pin-rating">${g.rating.toFixed(1)}</span>
          </div>
        </div>
      `;
      const icon = L.divIcon({
        className: "dojan-pin-wrapper",
        html,
        iconSize: [44, 44],
        iconAnchor: [22, 40],
      });

      const marker = L.marker([g.location[1], g.location[0]], { icon }).addTo(
        map,
      );

      const name = locale === "he" ? g.name_he : g.name_en;
      const neigh = locale === "he" ? g.neighborhood_he : g.neighborhood_en;
      marker.bindPopup(
        `<a href="/${locale === "he" ? "" : "en/"}gyms/${g.slug}"
           style="display:flex;gap:10px;text-decoration:none;color:inherit;width:240px;padding:10px;align-items:center">
          <img src="${g.cover_image}" alt="" width="64" height="64"
               style="width:64px;height:64px;border-radius:8px;object-fit:cover;flex-shrink:0" />
          <div style="min-width:0;flex:1">
            <div style="font-weight:700;font-size:14px;color:#0E1116;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</div>
            <div style="font-size:12px;color:#6F7782">${neigh}</div>
            <div style="font-size:12px;color:#0F4C5C;font-weight:600;margin-top:2px">★ ${g.rating.toFixed(1)} · ${g.review_count}</div>
          </div>
        </a>`,
        { closeButton: false, offset: [0, -30] },
      );

      marker.on("click", () => onPinClick?.(g.slug));
      markersRef.current[g.slug] = marker;
      bounds.extend([g.location[1], g.location[0]]);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [gyms, onPinClick, locale]);

  // Highlight hovered pin
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([slug, marker]) => {
      const el = marker.getElement()?.querySelector(".dojan-pin");
      if (el) {
        el.classList.toggle("is-active", slug === hoveredSlug);
      }
    });
  }, [hoveredSlug]);

  return (
    <>
      <div ref={containerRef} className={className} />
      <style jsx global>{`
        .dojan-pin-wrapper {
          background: transparent;
          border: 0;
        }
        .dojan-pin {
          position: relative;
          width: 44px;
          height: 44px;
          transition: transform 200ms ease-out;
          cursor: pointer;
        }
        .dojan-pin-bubble {
          position: absolute;
          inset: 0;
          background: var(--pin-color);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: grid;
          place-items: center;
          box-shadow:
            0 4px 12px rgba(15, 17, 22, 0.25),
            0 0 0 3px white;
          transition: all 200ms ease-out;
        }
        .dojan-pin-rating {
          color: white;
          font-weight: 700;
          font-size: 11px;
          font-family: var(--font-inter, system-ui), sans-serif;
          transform: rotate(45deg);
        }
        .dojan-pin:hover,
        .dojan-pin.is-active {
          transform: scale(1.18) translateY(-3px);
          z-index: 1000;
        }
        .dojan-pin:hover .dojan-pin-bubble,
        .dojan-pin.is-active .dojan-pin-bubble {
          box-shadow:
            0 8px 20px rgba(15, 17, 22, 0.35),
            0 0 0 4px white;
        }
      `}</style>
    </>
  );
}
