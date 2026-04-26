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

/* ─── Assign a postal code to each cadastral section letter ─────────────── */
// Based on Ajaccio (2A004) official cadastral plan:
//   Sections A*, B*        → city centre + west coast → 20000
//   Sections C*, D*, E*   → south-east suburbs        → 20090
//   Sections AC, AD, AE*  → north-east hills          → 20167
function cpForSection(section: string): string {
  if (!section) return '20000'
  const s = section.toUpperCase()
  // Mezzavia / north-east hills
  if (['AC', 'AD', 'AE', 'AF', 'AG'].includes(s)) return '20167'
  // South / east suburbs (Pietralba, Aspretto, Binda, Candia, Saint-Jean…)
  if (s.startsWith('C') || s.startsWith('D') || s.startsWith('E')) return '20090'
  // Default: centre-ville / presqu'île (A*, B*)
  return '20000'
}

/* ─── Tooltip component ──────────────────────────────────────────────────── */
interface TooltipState { visible: boolean; x: number; y: number; label: string; cp: string }

/* ─── GeoJSON layer with hover effects ──────────────────────────────────── */
function CadastralLayer({
  data,
  onHover,
}: {
  data: FeatureCollection
  onHover: (s: TooltipState) => void
}) {
  const map = useMap()
  const currentTooltip = useRef<TooltipState>({ visible: false, x: 0, y: 0, label: '', cp: '' })

  const styleFeature = (feature?: Feature<Geometry, GeoJsonProperties>) => {
    const section: string = feature?.properties?.section ?? feature?.properties?.code ?? ''
    const cp = cpForSection(section)
    const colors = ZONE_COLORS[cp] ?? ZONE_COLORS['20000']
    return {
      fillColor: colors.base,
      fillOpacity: 0.40,
      color: colors.hover,
      weight: 1.2,
      opacity: 0.85,
    }
  }

  const onEachFeature = (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
    const section: string = feature?.properties?.section ?? feature?.properties?.code ?? ''
    const cp = cpForSection(section)
    const label = `Section ${section}`
    const colors = ZONE_COLORS[cp] ?? ZONE_COLORS['20000']

    ;(layer as L.Path).on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const path = e.target as L.Path
        path.setStyle({ fillColor: colors.hover, fillOpacity: 0.72, color: '#FFFFFF', weight: 2, opacity: 1 })
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

  return <GeoJSON key={JSON.stringify(data).length} data={data} style={styleFeature} onEachFeature={onEachFeature} />
}

/* ─── Legend ─────────────────────────────────────────────────────────────── */
function MapLegend() {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 12, zIndex: 800,
      background: 'rgba(10,20,40,0.85)', backdropFilter: 'blur(8px)',
      borderRadius: 10, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5,
      border: '1px solid rgba(255,255,255,0.12)', pointerEvents: 'none',
    }}>
      {Object.entries(ZONE_COLORS).map(([cp, c]) => (
        <div key={cp} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: c.hover, boxShadow: `0 0 6px ${c.glow}` }} />
          <span style={{ color: '#E8EDF2', fontSize: 11, fontFamily: 'var(--font-dm-sans)', fontWeight: 500 }}>{cp}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Loading skeleton ───────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D1B2E', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, borderRadius: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(201,169,110,0.2)', borderTopColor: '#C9A96E', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <span style={{ color: '#C9A96E', fontSize: 11, fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Chargement des sections…
        </span>
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function CoverageMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '', cp: '' })
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null)
  const [error, setError] = useState(false)

  // Fetch real cadastral sections from etalab API (INSEE 2A004 = Ajaccio)
  useEffect(() => {
    const controller = new AbortController()
    fetch(
      'https://cadastre.data.gouv.fr/bundler/cadastre-etalab/communes/2A004/geojson/sections',
      { signal: controller.signal }
    )
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json() as Promise<FeatureCollection>
      })
      .then((fc) => setGeoData(fc))
      .catch(() => setError(true))
    return () => controller.abort()
  }, [])

  // Inject CSS animations
  useEffect(() => {
    const id = 'dvf-glow-keyframes'
    if (!document.getElementById(id)) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes dvf-pulse { 0%,100% { opacity:.40 } 50% { opacity:.60 } }
        .leaflet-interactive {
          animation: dvf-pulse 3s ease-in-out infinite;
          transition: fill .2s ease, fill-opacity .2s ease, stroke .15s ease;
        }
        .leaflet-interactive:hover { animation: none; filter: drop-shadow(0 0 8px rgba(255,255,255,.25)); }
      `
      document.head.appendChild(style)
    }
  }, [])

  const cp = tooltip.cp as keyof typeof ZONE_COLORS
  const glowColor = cp && ZONE_COLORS[cp] ? ZONE_COLORS[cp].glow : 'transparent'
  const hoverColor = cp && ZONE_COLORS[cp] ? ZONE_COLORS[cp].hover : '#fff'

  return (
    <div ref={containerRef} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }} className="h-64 md:h-80">
      {/* Label */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 800,
        background: 'rgba(10,20,40,0.80)', backdropFilter: 'blur(8px)',
        borderRadius: 8, padding: '5px 10px', pointerEvents: 'none',
        border: '1px solid rgba(255,255,255,0.12)',
      }}>
        <span style={{ color: '#C9A96E', fontSize: 10, fontFamily: 'var(--font-dm-sans)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Sections cadastrales DVF
        </span>
      </div>

      {/* Loading / error state */}
      {!geoData && !error && <LoadingSkeleton />}
      {error && (
        <div style={{ position: 'absolute', inset: 0, background: '#0D1B2E', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, borderRadius: 16 }}>
          <span style={{ color: '#8896A5', fontSize: 12, fontFamily: 'var(--font-dm-sans)' }}>Carte non disponible</span>
        </div>
      )}

      <MapContainer
        center={[41.9267, 8.7370]}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={false}
        zoomControl={true}
        style={{ background: '#0D1B2E' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png" attribution="" />

        {geoData && <CadastralLayer data={geoData} onHover={setTooltip} />}
        <MapLegend />
      </MapContainer>

      {/* Hover tooltip */}
      {tooltip.visible && (
        <div style={{
          position: 'absolute', left: tooltip.x + 14, top: tooltip.y - 50, zIndex: 900, pointerEvents: 'none',
          background: 'rgba(8,16,34,0.92)', backdropFilter: 'blur(10px)',
          border: `1px solid ${hoverColor}`, boxShadow: `0 0 16px ${glowColor}, 0 4px 24px rgba(0,0,0,.5)`,
          borderRadius: 10, padding: '6px 12px', maxWidth: 200, transition: 'box-shadow .2s ease',
        }}>
          <div style={{ color: hoverColor, fontSize: 10, fontFamily: 'var(--font-dm-sans)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>
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
