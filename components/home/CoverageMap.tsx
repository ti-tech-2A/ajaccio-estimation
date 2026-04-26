'use client'

import { useEffect, useState } from 'react'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

interface SectionLayerProps {
  data: FeatureCollection
}

type PostalZone = 'centre' | 'sud' | 'mezzavia'

interface ZoneStyle {
  name: string
  fill: string
  hoverFill: string
  stroke: string
  glow: string
}

const ZONE_ORDER: PostalZone[] = ['centre', 'sud', 'mezzavia']

const ZONE_COLORS: Record<PostalZone, ZoneStyle> = {
  centre: {
    name: 'Centre',
    fill: '#2E86AB',
    hoverFill: '#7DC6E2',
    stroke: '#8CD3EE',
    glow: 'rgba(46, 134, 171, 0.42)',
  },
  sud: {
    name: 'Sud',
    fill: '#C4813A',
    hoverFill: '#E4B66A',
    stroke: '#F0C77B',
    glow: 'rgba(196, 129, 58, 0.42)',
  },
  mezzavia: {
    name: 'Mezzavia',
    fill: '#6B7F55',
    hoverFill: '#A7BC80',
    stroke: '#B9CA94',
    glow: 'rgba(107, 127, 85, 0.42)',
  },
}

function sectionName(feature?: Feature<Geometry, GeoJsonProperties>) {
  const section = String(feature?.properties?.section ?? feature?.properties?.code ?? '').trim()
  return section ? `Section ${section}` : 'Section cadastrale'
}

function zoneForSection(section: string): PostalZone {
  const value = section.toUpperCase()

  if (['AC', 'AD', 'AE', 'AF', 'AG'].includes(value)) return 'mezzavia'
  if (value.startsWith('C') || value.startsWith('D') || value.startsWith('E')) return 'sud'

  return 'centre'
}

function CadastralSections({ data }: SectionLayerProps) {
  const styleFeature = (feature?: Feature<Geometry, GeoJsonProperties>) => {
    const section = String(feature?.properties?.section ?? feature?.properties?.code ?? '').trim()
    const colors = ZONE_COLORS[zoneForSection(section)]

    return {
      fillColor: colors.fill,
      fillOpacity: 0.2,
      color: colors.stroke,
      weight: 1.2,
      opacity: 0.82,
      lineJoin: 'round' as const,
    }
  }

  const onEachFeature = (feature: Feature<Geometry, GeoJsonProperties>, layer: L.Layer) => {
    const path = layer as L.Path
    const section = String(feature?.properties?.section ?? feature?.properties?.code ?? '').trim()
    const zone = zoneForSection(section)
    const colors = ZONE_COLORS[zone]

    path.bindTooltip(`${sectionName(feature)} - ${colors.name}`, {
      sticky: true,
      direction: 'top',
      className: 'earth-section-tooltip',
    })

    path.on({
      mouseover: () => {
        path.setStyle({
          fillColor: colors.hoverFill,
          fillOpacity: 0.38,
          color: '#FFFFFF',
          weight: 2,
          opacity: 1,
        })
        path.bringToFront()
      },
      mouseout: () => {
        path.setStyle(styleFeature(feature))
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

function MapLegend({ sectionCount }: { sectionCount: number }) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-[800] w-[min(245px,calc(100%-2rem))] rounded-2xl border border-white/16 bg-[#08162A]/82 p-3.5 shadow-[0_22px_55px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/50">
          Cadastre officiel
        </span>
        <span className="text-[0.62rem] font-medium text-[#C9A96E]">2A004</span>
      </div>

      <div className="mt-3 grid gap-2">
        {ZONE_ORDER.map((zone) => {
          const colors = ZONE_COLORS[zone]

          return (
            <div key={zone} className="flex items-center gap-2.5">
              <span
                className="h-3.5 w-3.5 rounded-[4px] border border-white/24"
                style={{
                  background: `linear-gradient(135deg, ${colors.hoverFill}, ${colors.fill})`,
                  boxShadow: `0 0 16px ${colors.glow}`,
                }}
              />
              <span className="truncate text-xs font-semibold text-white/78">{colors.name}</span>
            </div>
          )
        })}
        <div className="mt-1 border-t border-white/10 pt-2 text-xs font-medium text-white/58">
          {sectionCount > 0 ? `${sectionCount} sections chargees` : 'Chargement en cours'}
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="absolute inset-0 z-[900] flex items-center justify-center rounded-[26px] bg-[#08162A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(46,134,171,0.26),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(212,168,83,0.2),transparent_38%)]" />
      <div className="relative text-center">
        <div className="mx-auto mb-4 h-11 w-11 rounded-full border border-[#D4A853]/20 border-t-[#D4A853] shadow-[0_0_28px_rgba(212,168,83,0.18)] [animation:earth-spin_0.9s_linear_infinite]" />
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#D4A853]">
          Chargement satellite
        </span>
      </div>
    </div>
  )
}

export default function CoverageMap() {
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
    const id = 'coverage-map-earth-styles'

    if (document.getElementById(id)) return

    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @keyframes earth-spin { to { transform: rotate(360deg); } }
      .coverage-earth-frame .leaflet-container {
        width: 100%;
        height: 100%;
        background: #071523;
        font-family: var(--font-body);
      }
      .coverage-earth-frame .earth-map-tilt {
        transform: perspective(980px) rotateX(46deg) rotateZ(-5.5deg) scale(1.45) translate3d(-1%, -9%, 0);
        transform-origin: 50% 48%;
        will-change: transform;
      }
      .coverage-earth-frame .leaflet-control-container {
        display: none;
      }
      .coverage-earth-frame .leaflet-tile-pane {
        filter: saturate(1.14) contrast(1.06) brightness(0.9);
      }
      .coverage-earth-frame .leaflet-overlay-pane {
        filter: drop-shadow(0 16px 20px rgba(0,0,0,0.28));
      }
      .coverage-earth-frame .leaflet-interactive {
        cursor: default;
        transition: fill .22s ease, fill-opacity .22s ease, stroke .18s ease, stroke-width .18s ease, opacity .18s ease;
        vector-effect: non-scaling-stroke;
      }
      .coverage-earth-frame .earth-section-tooltip.leaflet-tooltip {
        border: 1px solid rgba(212,168,83,0.5);
        border-radius: 14px;
        background: rgba(8,22,42,0.9);
        box-shadow: 0 0 22px rgba(212,168,83,0.32), 0 18px 48px -26px rgba(0,0,0,0.92);
        color: #F7F2EA;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.02em;
        padding: 7px 10px;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }
      .coverage-earth-frame .earth-section-tooltip.leaflet-tooltip::before {
        display: none;
      }
      @media (max-width: 640px) {
        .coverage-earth-frame .earth-map-tilt {
          transform: perspective(760px) rotateX(42deg) rotateZ(-5deg) scale(1.62) translate3d(-1%, -7%, 0);
        }
      }
    `
    document.head.appendChild(style)
  }, [])

  const sectionCount = geoData?.features.length ?? 0

  return (
    <div
      className="coverage-earth-frame relative h-[360px] overflow-hidden rounded-[28px] border border-[#D4A853]/24 bg-[#071523] p-[1px] shadow-[0_38px_90px_-46px_rgba(15,42,74,0.98)] md:h-[500px]"
      role="region"
      aria-label="Vue satellite des sections cadastrales couvertes a Ajaccio"
    >
      <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(212,168,83,0.52),rgba(46,134,171,0.24)_44%,rgba(247,242,234,0.08))]" />

      <div className="relative h-full overflow-hidden rounded-[26px]">
        <div className="absolute inset-[-20%]">
          <MapContainer
            center={[41.9244, 8.7387]}
            zoom={13}
            className="earth-map-tilt"
            scrollWheelZoom={false}
            zoomControl={false}
            attributionControl={false}
            dragging={false}
            doubleClickZoom={false}
            keyboard={false}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Esri, Maxar, Earthstar Geographics"
            />
            {geoData && <CadastralSections data={geoData} />}
          </MapContainer>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[650] bg-[radial-gradient(circle_at_28%_18%,rgba(247,242,234,0.12),transparent_25%),linear-gradient(180deg,rgba(7,21,35,0.06),rgba(7,21,35,0.32)_72%,rgba(7,21,35,0.58))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[700] h-32 bg-gradient-to-b from-[#071523]/72 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[700] h-32 bg-gradient-to-t from-[#071523]/72 to-transparent" />

        <div className="pointer-events-none absolute left-4 top-4 z-[800] max-w-[calc(100%-2rem)] rounded-2xl border border-white/14 bg-[#08162A]/78 px-4 py-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.92)] backdrop-blur-xl">
          <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#D4A853]">
            Vue satellite 3D
          </span>
          <span className="mt-1 block text-sm font-semibold leading-none text-white">
            Sections cadastrales Ajaccio
          </span>
        </div>

        {!geoData && !error && <LoadingSkeleton />}
        {error && (
          <div className="absolute inset-0 z-[900] flex items-center justify-center rounded-[26px] bg-[#071523]">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/62">
              Carte non disponible
            </span>
          </div>
        )}

        <MapLegend sectionCount={sectionCount} />

        <div className="pointer-events-none absolute bottom-3 right-3 z-[800] rounded-full border border-[#0F2A4A]/10 bg-[#F7F2EA]/88 px-3 py-1 text-[0.58rem] font-bold text-[#0F2A4A]/76 shadow-[0_10px_28px_-20px_rgba(0,0,0,0.75)] backdrop-blur-md">
          Esri imagery | Cadastre Etalab
        </div>
      </div>
    </div>
  )
}
