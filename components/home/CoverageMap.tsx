'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

/* ─── Zone color palette ─────────────────────────────────────────────────── */
const ZONE_COLORS: Record<string, { base: string; hover: string; glow: string }> = {
  '20000': { base: '#1E4A7A', hover: '#2E6EC4', glow: 'rgba(46,110,196,0.55)' },
  '20090': { base: '#7A1E4A', hover: '#C42E6E', glow: 'rgba(196,46,110,0.55)' },
  '20167': { base: '#1E7A4A', hover: '#2EC482', glow: 'rgba(46,196,130,0.55)' },
}

/* ─── Accurate cadastral zone polygons — coordinates validated on OSM ─────── */
// All polygons clipped to land. [lng, lat] = GeoJSON convention.
const CADASTRAL_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [

    // ══ 20000 — Ajaccio Centre / Vieille Ville / Cours Napoléon ══════════════
    // City centre: Citadelle → Cours Napoléon → collines ouest
    {
      type: 'Feature',
      properties: { cp: '20000', label: 'Centre historique / Cours Napoléon', section: 'BM' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7218, 41.9310], // pl. de Gaulle
          [8.7265, 41.9298], // Cours Napoléon N
          [8.7320, 41.9290], // bd Pascal Rossini
          [8.7358, 41.9256], // gendarmerie
          [8.7330, 41.9212], // rue Fesch
          [8.7268, 41.9208], // place Foch
          [8.7230, 41.9220], // Citadelle
          [8.7188, 41.9248], // port
          [8.7200, 41.9285], // quai Napoléon
          [8.7218, 41.9310],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { cp: '20000', label: 'Quartier des Étrangers', section: 'BL' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7080, 41.9320], // rte des Sanguinaires N
          [8.7188, 41.9320], // limite centre
          [8.7218, 41.9310],
          [8.7200, 41.9285],
          [8.7160, 41.9270], // bd Lantivy
          [8.7095, 41.9275], // résidences vue mer
          [8.7055, 41.9295], // av. de la Grande Armée
          [8.7080, 41.9320],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { cp: '20000', label: 'Trottel / Parc Berthault', section: 'BN' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7265, 41.9298],
          [8.7305, 41.9360], // plateau Trottel
          [8.7380, 41.9375], // Parc Berthault
          [8.7420, 41.9345],
          [8.7390, 41.9300],
          [8.7358, 41.9256],
          [8.7320, 41.9290],
          [8.7265, 41.9298],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { cp: '20000', label: 'Terre Sacrée / Sanguinaires', section: 'BP' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.6880, 41.9155], // rte des Sanguinaires S
          [8.7010, 41.9185], // Scudo d'Ajaccio
          [8.7055, 41.9295],
          [8.7080, 41.9320],
          [8.7040, 41.9350], // limite presqu'île
          [8.6960, 41.9310],
          [8.6900, 41.9240],
          [8.6860, 41.9185],
          [8.6880, 41.9155],
        ]],
      },
    },

    // ══ 20090 — Ajaccio Sud / Est ════════════════════════════════════════════
    // Madonuccia, Binda, Candia, Pietralba, Octroi, Saint-Jean, Aspretto
    {
      type: 'Feature',
      properties: { cp: '20090', label: 'Madonuccia / Octroi', section: 'CE' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7358, 41.9256], // jonction centre
          [8.7420, 41.9250],
          [8.7470, 41.9230], // av. du 1er Consul
          [8.7455, 41.9185],
          [8.7390, 41.9160], // Madonuccia
          [8.7310, 41.9175],
          [8.7268, 41.9208],
          [8.7330, 41.9212],
          [8.7358, 41.9256],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { cp: '20090', label: 'Pietralba / Saint-Jean', section: 'CF' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7420, 41.9250],
          [8.7510, 41.9265],
          [8.7565, 41.9240], // Pietralba
          [8.7590, 41.9185],
          [8.7540, 41.9145],
          [8.7455, 41.9130],
          [8.7390, 41.9160],
          [8.7455, 41.9185],
          [8.7470, 41.9230],
          [8.7420, 41.9250],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { cp: '20090', label: 'Binda / Candia', section: 'CG' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7510, 41.9265],
          [8.7610, 41.9285], // bd de la Citadelle
          [8.7665, 41.9260],
          [8.7665, 41.9200],
          [8.7590, 41.9185],
          [8.7565, 41.9240],
          [8.7510, 41.9265],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { cp: '20090', label: 'Aspretto / Campo dell\'Oro', section: 'CH' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7665, 41.9200],
          [8.7750, 41.9210], // aéroport N
          [8.7820, 41.9175],
          [8.7835, 41.9120],
          [8.7760, 41.9085], // Aspretto
          [8.7660, 41.9080],
          [8.7590, 41.9110],
          [8.7540, 41.9145],
          [8.7590, 41.9185],
          [8.7665, 41.9200],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { cp: '20090', label: 'Pietrina / Jardins de l\'Empereur', section: 'CI' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7380, 41.9375],
          [8.7440, 41.9395], // Jardins de l'Emp.
          [8.7530, 41.9380],
          [8.7610, 41.9340],
          [8.7610, 41.9285],
          [8.7510, 41.9265],
          [8.7420, 41.9250],
          [8.7390, 41.9300],
          [8.7420, 41.9345],
          [8.7380, 41.9375],
        ]],
      },
    },

    // ══ 20167 — Mezzavia (Ajaccio uniquement, Alata exclue) ══════════════════
    // Zone collines nord-est: entre la RN193 et les hauteurs
    {
      type: 'Feature',
      properties: { cp: '20167', label: 'Mezzavia', section: 'AH' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7530, 41.9380],
          [8.7650, 41.9440], // Mezzavia village
          [8.7750, 41.9500],
          [8.7870, 41.9480],
          [8.7910, 41.9400],
          [8.7860, 41.9330],
          [8.7750, 41.9310],
          [8.7665, 41.9340],
          [8.7610, 41.9340],
          [8.7530, 41.9380],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { cp: '20167', label: 'Mezzavia Nord (Stiletto)', section: 'AJ' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [8.7750, 41.9500],
          [8.7870, 41.9560], // Stiletto
          [8.8000, 41.9530],
          [8.8040, 41.9440],
          [8.7970, 41.9370],
          [8.7910, 41.9400],
          [8.7870, 41.9480],
          [8.7750, 41.9500],
        ]],
      },
    },
  ],
}

/* ─── Tooltip component ──────────────────────────────────────────────────── */
interface TooltipState { visible: boolean; x: number; y: number; label: string; cp: string }

/* ─── GeoJSON layer with hover effects ──────────────────────────────────── */
function CadastralLayer({ onHover }: { onHover: (s: TooltipState) => void }) {
  const map = useMap()
  // Keep a mutable ref so mousemove can read the current label/cp
  const currentTooltip = useRef<TooltipState>({ visible: false, x: 0, y: 0, label: '', cp: '' })

  const styleFeature = (feature?: Feature<Geometry, GeoJsonProperties>) => {
    const cp = feature?.properties?.cp ?? '20000'
    const colors = ZONE_COLORS[cp] ?? ZONE_COLORS['20000']
    return {
      fillColor: colors.base,
      fillOpacity: 0.35,
      color: colors.hover,
      weight: 1.5,
      opacity: 0.8,
    }
  }

  const onEachFeature = (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
    const cp: string = feature.properties?.cp ?? '20000'
    const label: string = feature.properties?.label ?? ''
    const colors = ZONE_COLORS[cp] ?? ZONE_COLORS['20000']

    ;(layer as L.Path).on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const path = e.target as L.Path
        path.setStyle({
          fillColor: colors.hover,
          fillOpacity: 0.72,
          color: '#FFFFFF',
          weight: 2.5,
          opacity: 1,
        })
        path.bringToFront()

        const containerPoint = map.latLngToContainerPoint(e.latlng)
        const next: TooltipState = { visible: true, x: containerPoint.x, y: containerPoint.y, label, cp }
        currentTooltip.current = next
        onHover(next)
      },
      mousemove: (e: L.LeafletMouseEvent) => {
        const containerPoint = map.latLngToContainerPoint(e.latlng)
        const next: TooltipState = { ...currentTooltip.current, x: containerPoint.x, y: containerPoint.y }
        currentTooltip.current = next
        onHover(next)
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const path = e.target as L.Path
        path.setStyle(styleFeature(feature))
        const next: TooltipState = { visible: false, x: 0, y: 0, label: '', cp: '' }
        currentTooltip.current = next
        onHover(next)
      },
    })
  }

  return (
    <GeoJSON
      data={CADASTRAL_GEOJSON}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  )
}

/* ─── Legend ─────────────────────────────────────────────────────────────── */
function MapLegend() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: 12,
        zIndex: 800,
        background: 'rgba(10,20,40,0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: 10,
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        border: '1px solid rgba(255,255,255,0.12)',
        pointerEvents: 'none',
      }}
    >
      {Object.entries(ZONE_COLORS).map(([cp, c]) => (
        <div key={cp} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: 3,
              background: c.hover,
              boxShadow: `0 0 6px ${c.glow}`,
            }}
          />
          <span style={{ color: '#E8EDF2', fontSize: 11, fontFamily: 'var(--font-dm-sans)', fontWeight: 500 }}>
            {cp}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function CoverageMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, label: '', cp: '',
  })

  // Inject CSS animation keyframes for glow pulse on mount
  useEffect(() => {
    const id = 'dvf-glow-keyframes'
    if (!document.getElementById(id)) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = `
        @keyframes dvf-pulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.55; }
        }
        .leaflet-interactive {
          animation: dvf-pulse 3s ease-in-out infinite;
          transition: fill 0.22s ease, fill-opacity 0.22s ease, stroke 0.22s ease, stroke-width 0.18s ease;
        }
        .leaflet-interactive:hover {
          animation: none;
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const cp = tooltip.cp as keyof typeof ZONE_COLORS
  const glowColor = cp && ZONE_COLORS[cp] ? ZONE_COLORS[cp].glow : 'transparent'
  const hoverColor = cp && ZONE_COLORS[cp] ? ZONE_COLORS[cp].hover : '#fff'

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}
      className="h-64 md:h-80"
    >
      {/* Dark overlay title */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 800,
          background: 'rgba(10,20,40,0.80)',
          backdropFilter: 'blur(8px)',
          borderRadius: 8,
          padding: '5px 10px',
          pointerEvents: 'none',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <span style={{
          color: '#C9A96E',
          fontSize: 10,
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Sections cadastrales DVF
        </span>
      </div>

      <MapContainer
        center={[41.9290, 8.7500]}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={false}
        zoomControl={true}
        style={{ background: '#0D1B2E' }}
      >
        {/* Dark DVF-style tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          attribution=""
        />

        <CadastralLayer onHover={setTooltip as (s: TooltipState) => void} />

        {/* Legend rendered inside map bounds */}
        <MapLegend />
      </MapContainer>

      {/* Hover tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x + 14,
            top: tooltip.y - 44,
            zIndex: 900,
            pointerEvents: 'none',
            background: 'rgba(8,16,34,0.92)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${hoverColor}`,
            boxShadow: `0 0 16px ${glowColor}, 0 4px 24px rgba(0,0,0,0.5)`,
            borderRadius: 10,
            padding: '6px 12px',
            maxWidth: 200,
            transition: 'box-shadow 0.2s ease',
          }}
        >
          <div style={{ color: hoverColor, fontSize: 10, fontFamily: 'var(--font-dm-sans)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            CP {tooltip.cp}
          </div>
          <div style={{ color: '#E8EDF2', fontSize: 12, fontFamily: 'var(--font-dm-sans)', fontWeight: 500, marginTop: 2 }}>
            {tooltip.label}
          </div>
        </div>
      )}
    </div>
  )
}
