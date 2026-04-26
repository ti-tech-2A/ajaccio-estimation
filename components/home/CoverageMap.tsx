'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

type PostalCode = '20000' | '20090' | '20167'

interface ZoneStyle {
  name: string
  base: string
  hover: string
  stroke: string
  glow: string
}

const ZONE_ORDER: PostalCode[] = ['20000', '20090', '20167']

const ZONE_COLORS: Record<PostalCode, ZoneStyle> = {
  '20000': {
    name: 'Centre',
    base: '#2E86AB',
    hover: '#7DC6E2',
    stroke: '#8CD3EE',
    glow: 'rgba(46, 134, 171, 0.42)',
  },
  '20090': {
    name: 'Sud',
    base: '#C4813A',
    hover: '#E4B66A',
    stroke: '#F0C77B',
    glow: 'rgba(196, 129, 58, 0.42)',
  },
  '20167': {
    name: 'Mezzavia',
    base: '#6B7F55',
    hover: '#A7BC80',
    stroke: '#B9CA94',
    glow: 'rgba(107, 127, 85, 0.42)',
  },
}

function cpForSection(section: string): PostalCode {
  if (!section) return '20000'

  const value = section.toUpperCase()

  if (['AC', 'AD', 'AE', 'AF', 'AG'].includes(value)) return '20167'
  if (value.startsWith('C') || value.startsWith('D') || value.startsWith('E')) return '20090'

  return '20000'
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  label: string
  cp: PostalCode | ''
}

function CadastralLayer({
  data,
  onHover,
}: {
  data: FeatureCollection
  onHover: (state: TooltipState) => void
}) {
  const map = useMap()
  const currentTooltip = useRef<TooltipState>({ visible: false, x: 0, y: 0, label: '', cp: '' })

  const styleFeature = (feature?: Feature<Geometry, GeoJsonProperties>) => {
    const section = String(feature?.properties?.section ?? feature?.properties?.code ?? '')
    const cp = cpForSection(section)
    const colors = ZONE_COLORS[cp]

    return {
      fillColor: colors.base,
      fillOpacity: 0.28,
      color: colors.stroke,
      weight: 1.35,
      opacity: 0.72,
      lineJoin: 'round' as const,
    }
  }

  const onEachFeature = (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
    const section = String(feature?.properties?.section ?? feature?.properties?.code ?? '')
    const cp = cpForSection(section)
    const colors = ZONE_COLORS[cp]
    const label = section ? `Section ${section}` : 'Section cadastrale'

    ;(layer as L.Path).on({
      mouseover: (event: L.LeafletMouseEvent) => {
        const path = event.target as L.Path
        path.setStyle({
          fillColor: colors.hover,
          fillOpacity: 0.5,
          color: '#F7F2EA',
          weight: 2.15,
          opacity: 0.96,
        })
        path.bringToFront()

        const point = map.latLngToContainerPoint(event.latlng)
        const next: TooltipState = { visible: true, x: point.x, y: point.y, label, cp }
        currentTooltip.current = next
        onHover(next)
      },
      mousemove: (event: L.LeafletMouseEvent) => {
        const point = map.latLngToContainerPoint(event.latlng)
        const next: TooltipState = { ...currentTooltip.current, x: point.x, y: point.y }
        currentTooltip.current = next
        onHover(next)
      },
      mouseout: (event: L.LeafletMouseEvent) => {
        const path = event.target as L.Path
        path.setStyle(styleFeature(feature))

        const next: TooltipState = { visible: false, x: 0, y: 0, label: '', cp: '' }
        currentTooltip.current = next
        onHover(next)
      },
    })
  }

  return (
    <GeoJSON
      key={data.features.length}
      data={data}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  )
}

function MapLegend() {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-[800] w-[min(230px,calc(100%-2rem))] rounded-2xl border border-white/12 bg-[#08162A]/82 p-3 shadow-[0_22px_55px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/48">
          Zones DVF
        </span>
        <span className="text-[0.62rem] font-medium text-[#C9A96E]">Ajaccio</span>
      </div>

      <div className="grid gap-2">
        {ZONE_ORDER.map((cp) => {
          const colors = ZONE_COLORS[cp]

          return (
            <div key={cp} className="flex items-center gap-2.5">
              <span
                className="h-3.5 w-3.5 rounded-[4px] border border-white/20 shadow-[0_0_14px_var(--zone-glow)]"
                style={{
                  background: `linear-gradient(135deg, ${colors.hover}, ${colors.base})`,
                  '--zone-glow': colors.glow,
                } as React.CSSProperties}
              />
              <span className="min-w-12 text-xs font-bold text-white">{cp}</span>
              <span className="truncate text-xs font-medium text-white/62">{colors.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="absolute inset-0 z-[900] flex items-center justify-center rounded-[22px] bg-[#08162A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(46,134,171,0.22),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(196,129,58,0.16),transparent_38%)]" />
      <div className="relative text-center">
        <div className="mx-auto mb-4 h-11 w-11 rounded-full border border-[#C9A96E]/20 border-t-[#C9A96E] shadow-[0_0_28px_rgba(201,169,110,0.18)] [animation:coverage-spin_0.9s_linear_infinite]" />
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#C9A96E]">
          Chargement des sections
        </span>
      </div>
    </div>
  )
}

export default function CoverageMap() {
  const frameRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    cp: '',
  })
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch('https://cadastre.data.gouv.fr/bundler/cadastre-etalab/communes/2A004/geojson/sections', {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<FeatureCollection>
      })
      .then((featureCollection) => setGeoData(featureCollection))
      .catch((fetchError) => {
        if ((fetchError as Error).name !== 'AbortError') setError(true)
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const id = 'coverage-map-premium-styles'

    if (document.getElementById(id)) return

    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @keyframes coverage-spin { to { transform: rotate(360deg); } }
      .coverage-map-frame .leaflet-container {
        font-family: var(--font-body);
        background: #08162A;
      }
      .coverage-map-frame .leaflet-tile-pane {
        filter: saturate(0.78) contrast(1.08) brightness(0.78);
      }
      .coverage-map-frame .leaflet-overlay-pane {
        filter: drop-shadow(0 14px 22px rgba(0,0,0,0.18));
      }
      .coverage-map-frame .leaflet-interactive {
        transition: fill .22s ease, fill-opacity .22s ease, stroke .18s ease, stroke-width .18s ease, opacity .18s ease;
        vector-effect: non-scaling-stroke;
      }
      .coverage-map-frame .leaflet-control-container .leaflet-top.leaflet-right {
        top: 14px;
        right: 14px;
      }
      .coverage-map-frame .leaflet-control-zoom {
        overflow: hidden;
        border: 1px solid rgba(247,242,234,0.14);
        border-radius: 14px;
        background: rgba(8,22,42,0.76);
        box-shadow: 0 18px 38px -24px rgba(0,0,0,0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }
      .coverage-map-frame .leaflet-control-zoom a {
        width: 38px;
        height: 38px;
        border: 0;
        border-bottom: 1px solid rgba(247,242,234,0.12);
        background: transparent;
        color: #F7F2EA;
        font: 600 21px/38px var(--font-body);
        transition: background-color .18s ease, color .18s ease;
      }
      .coverage-map-frame .leaflet-control-zoom a:last-child {
        border-bottom: 0;
      }
      .coverage-map-frame .leaflet-control-zoom a:hover,
      .coverage-map-frame .leaflet-control-zoom a:focus {
        background: rgba(201,169,110,0.18);
        color: #D4A853;
      }
      .coverage-map-frame .leaflet-control-attribution {
        margin: 0 10px 10px 0;
        border: 1px solid rgba(15,42,74,0.08);
        border-radius: 999px;
        background: rgba(247,242,234,0.88);
        color: rgba(15,42,74,0.78);
        box-shadow: 0 10px 28px -20px rgba(0,0,0,0.7);
        font-size: 10px;
        line-height: 1.2;
        padding: 4px 8px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      .coverage-map-frame .leaflet-control-attribution a {
        color: #1B4F72;
        font-weight: 700;
        text-decoration: none;
      }
    `
    document.head.appendChild(style)
  }, [])

  const activeColors = tooltip.cp ? ZONE_COLORS[tooltip.cp] : null
  const shouldFlipTooltip = frameRef.current
    ? tooltip.x > frameRef.current.clientWidth - 240
    : false

  return (
    <div
      ref={frameRef}
      className="coverage-map-frame relative h-[340px] overflow-hidden rounded-[24px] border border-[#C9A96E]/22 bg-[#08162A] p-[1px] shadow-[0_34px_80px_-46px_rgba(15,42,74,0.95)] md:h-[430px]"
      role="region"
      aria-label="Carte des zones cadastrales DVF couvertes a Ajaccio"
    >
      <div className="absolute inset-0 rounded-[24px] bg-[linear-gradient(135deg,rgba(201,169,110,0.46),rgba(46,134,171,0.28)_42%,rgba(247,242,234,0.08))]" />
      <div className="relative h-full overflow-hidden rounded-[22px]">
        <div className="pointer-events-none absolute inset-0 z-[650] bg-[radial-gradient(circle_at_18%_16%,rgba(247,242,234,0.13),transparent_24%),linear-gradient(180deg,rgba(8,22,42,0.04),rgba(8,22,42,0.36))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[700] h-28 bg-gradient-to-b from-[#08162A]/80 to-transparent" />

        <div className="pointer-events-none absolute left-4 top-4 z-[800] max-w-[calc(100%-5.5rem)] rounded-2xl border border-white/12 bg-[#08162A]/78 px-4 py-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#C9A96E]">
            Perimetre DVF
          </span>
          <span className="mt-1 block text-sm font-semibold leading-none text-white">
            Sections cadastrales Ajaccio
          </span>
        </div>

        {!geoData && !error && <LoadingSkeleton />}
        {error && (
          <div className="absolute inset-0 z-[900] flex items-center justify-center rounded-[22px] bg-[#08162A]">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/62">
              Carte non disponible
            </span>
          </div>
        )}

        <MapContainer
          center={[41.9267, 8.737]}
          zoom={13}
          className="h-full w-full"
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
            attribution=""
          />
          <ZoomControl position="topright" />
          {geoData && <CadastralLayer data={geoData} onHover={setTooltip} />}
        </MapContainer>

        <MapLegend />

        {tooltip.visible && activeColors && (
          <div
            className="pointer-events-none absolute z-[900] max-w-[210px] rounded-2xl border bg-[#08162A]/90 px-3.5 py-3 shadow-[0_20px_54px_-26px_rgba(0,0,0,0.95)] backdrop-blur-xl"
            style={{
              left: shouldFlipTooltip ? tooltip.x - 14 : tooltip.x + 14,
              top: Math.max(tooltip.y - 58, 16),
              transform: shouldFlipTooltip ? 'translateX(-100%)' : undefined,
              borderColor: activeColors.stroke,
              boxShadow: `0 0 24px ${activeColors.glow}, 0 20px 54px -26px rgba(0,0,0,0.95)`,
            }}
          >
            <div className="text-[0.58rem] font-bold uppercase tracking-[0.18em]" style={{ color: activeColors.hover }}>
              CP {tooltip.cp} - {activeColors.name}
            </div>
            <div className="mt-1 text-sm font-semibold leading-tight text-white">{tooltip.label}</div>
          </div>
        )}
      </div>
    </div>
  )
}
