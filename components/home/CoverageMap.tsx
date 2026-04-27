'use client'

import { useEffect, useState } from 'react'
import { GeoJSON, MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

interface SectionLayerProps {
  data: FeatureCollection
  sectionStats: SectionStatsMap
  statsReady: boolean
}

type PostalZone = 'centre' | 'sud' | 'mezzavia'
type SectionStatsMap = Record<string, { apartmentBuildings: number; villas: number; inhabitants: number | null }>

interface CommuneTotals {
  cadastralBuildings: number
  housing: number
  apartments: number
  houses: number
  otherHousing: number
  cadastreSource: string
  cadastreVintage: string
  inseeSource: string
  inseeVintage: string
}

interface ZoneStyle {
  name: string
  fill: string
  hoverFill: string
  stroke: string
  glow: string
}

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

function sectionCode(feature?: Feature<Geometry, GeoJsonProperties>) {
  return String(feature?.properties?.section ?? feature?.properties?.code ?? '').trim().toUpperCase()
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatInteger(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('fr-FR') : 'n/d'
}

function zoneForSection(section: string): PostalZone {
  const value = section.toUpperCase()

  if (['AC', 'AD', 'AE', 'AF', 'AG'].includes(value)) return 'mezzavia'
  if (value.startsWith('C') || value.startsWith('D') || value.startsWith('E')) return 'sud'

  return 'centre'
}

function buildSectionTooltip(
  feature: Feature<Geometry, GeoJsonProperties>,
  sectionStats: SectionStatsMap,
  statsReady: boolean,
) {
  const section = sectionCode(feature)
  const stats = section ? sectionStats[section] : undefined
  const apartmentBuildings = stats?.apartmentBuildings ?? 0
  const villas = stats?.villas ?? 0
  const inhabitants = typeof stats?.inhabitants === 'number' ? stats.inhabitants.toLocaleString('fr-FR') : null
  const hasStats = apartmentBuildings > 0 || villas > 0

  const inhabitantsMarkup = inhabitants
    ? `<div class="earth-section-metric earth-section-metric--inhabitants"><strong>${inhabitants}</strong><span>Habitants</span></div>`
    : ''

  const metricsMarkup = `
    <div class="earth-section-metrics">
      <div class="earth-section-metric earth-section-metric--apartment"><strong>${apartmentBuildings}</strong><span>Appart. DVF</span></div>
      <div class="earth-section-metric earth-section-metric--villa"><strong>${villas}</strong><span>Villas DVF</span></div>
      ${inhabitantsMarkup}
    </div>
    ${hasStats ? '' : `<div class="earth-section-empty">${statsReady ? 'Aucune ref. DVF typee' : 'Stats DVF en cours'}</div>`}
  `

  return `
    <div class="earth-section-card">
      <div class="earth-section-title">${escapeHtml(sectionName(feature))}</div>
      ${metricsMarkup}
    </div>
  `
}

function CadastralSections({ data, sectionStats, statsReady }: SectionLayerProps) {
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

    path.bindTooltip(buildSectionTooltip(feature, sectionStats, statsReady), {
      sticky: true,
      direction: 'top',
      className: 'earth-section-tooltip',
      opacity: 1,
    })

    path.on({
      click: () => {
        path.openTooltip()
      },
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
      key={`${data.features.length}-${statsReady ? 'ready' : 'loading'}-${Object.keys(sectionStats).length}`}
      data={data}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  )
}

function MapViewportSync() {
  const map = useMap()

  useEffect(() => {
    const timers = [120, 450, 900].map((delay) =>
      window.setTimeout(() => {
        map.invalidateSize()
      }, delay)
    )

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [map])

  return null
}

function MapMetricsBar({ totals }: { totals: CommuneTotals | null }) {
  const housingValue = totals ? formatInteger(totals.housing) : '...'
  const apartmentsValue = totals ? formatInteger(totals.apartments) : '...'
  const buildingValue = totals ? formatInteger(totals.cadastralBuildings) : '...'
  const housesValue = totals ? formatInteger(totals.houses) : '...'
  const metrics = [
    { label: 'Nbre de logements', value: housingValue, tone: 'text-white' },
    { label: 'Nbre appartements', value: apartmentsValue, tone: 'text-[#8CD3EE]' },
    { label: 'Nbre bat. cadastrés', value: buildingValue, tone: 'text-[#F0C77B]' },
    { label: 'Nbre villas', value: housesValue, tone: 'text-[#B9CA94]' },
  ]

  return (
    <div className="pointer-events-none absolute inset-x-2 bottom-2 z-[820] sm:inset-x-4 sm:bottom-4">
      <div className="grid grid-cols-4 gap-1.5 rounded-[18px] border border-white/16 bg-[#071523]/78 p-1.5 shadow-[0_22px_56px_-28px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:gap-2 sm:p-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="min-w-0 rounded-[13px] border border-white/10 bg-white/[0.065] px-1.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:px-3 sm:py-2.5"
          >
            <strong className={`block text-center text-[clamp(0.86rem,2.3vw,1.25rem)] font-extrabold leading-none ${metric.tone}`}>
              {metric.value}
            </strong>
            <span className="mx-auto mt-1.5 block min-h-[1.9em] max-w-[7.2rem] text-center text-[0.48rem] font-bold uppercase leading-[0.95] tracking-[0.08em] text-white/58 sm:min-h-0 sm:text-[0.58rem]">
              {metric.label}
            </span>
          </div>
        ))}
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
  const [sectionStats, setSectionStats] = useState<SectionStatsMap>({})
  const [communeTotals, setCommuneTotals] = useState<CommuneTotals | null>(null)
  const [statsReady, setStatsReady] = useState(false)
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
    const controller = new AbortController()
    let mounted = true

    fetch('/api/cadastre/section-stats', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<{ stats?: SectionStatsMap; communeTotals?: CommuneTotals }>
      })
      .then((payload) => {
        if (mounted) {
          setSectionStats(payload.stats ?? {})
          setCommuneTotals(payload.communeTotals ?? null)
        }
      })
      .catch((fetchError) => {
        if ((fetchError as Error).name !== 'AbortError' && mounted) {
          setSectionStats({})
          setCommuneTotals(null)
        }
      })
      .finally(() => {
        if (mounted) setStatsReady(true)
      })

    return () => {
      mounted = false
      controller.abort()
    }
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
      .coverage-earth-frame .earth-map-surface {
        border-radius: 26px;
      }
      .coverage-earth-frame .leaflet-tile-pane {
        filter: saturate(1.08) contrast(1.02) brightness(1.02);
      }
      .coverage-earth-frame .leaflet-overlay-pane {
        filter: drop-shadow(0 8px 12px rgba(0,0,0,0.18));
      }
      .coverage-earth-frame .leaflet-tooltip-pane {
        z-index: 860;
      }
      .coverage-earth-frame .leaflet-interactive {
        cursor: pointer;
        transition: fill .22s ease, fill-opacity .22s ease, stroke .18s ease, stroke-width .18s ease, opacity .18s ease;
        vector-effect: non-scaling-stroke;
      }
      .coverage-earth-frame .leaflet-control-container .leaflet-top.leaflet-right {
        top: 12px;
        right: 12px;
      }
      .coverage-earth-frame .leaflet-control-zoom {
        overflow: hidden;
        border: 1px solid rgba(247,242,234,0.16);
        border-radius: 14px;
        background: rgba(8,22,42,0.8);
        box-shadow: 0 18px 38px -24px rgba(0,0,0,0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }
      .coverage-earth-frame .leaflet-control-zoom a {
        width: 40px;
        height: 40px;
        border: 0;
        border-bottom: 1px solid rgba(247,242,234,0.12);
        background: transparent;
        color: #F7F2EA;
        font: 700 22px/40px var(--font-body);
        transition: background-color .18s ease, color .18s ease;
      }
      .coverage-earth-frame .leaflet-control-zoom a:last-child {
        border-bottom: 0;
      }
      .coverage-earth-frame .leaflet-control-zoom a:hover,
      .coverage-earth-frame .leaflet-control-zoom a:focus {
        background: rgba(212,168,83,0.18);
        color: #D4A853;
      }
      .coverage-earth-frame .earth-section-tooltip.leaflet-tooltip {
        border: 0;
        border-radius: 16px;
        background: transparent;
        box-shadow: 0 20px 54px -28px rgba(0,0,0,0.96);
        color: #F7F2EA;
        padding: 0;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }
      .coverage-earth-frame .earth-section-tooltip.leaflet-tooltip::before {
        display: none;
      }
      .coverage-earth-frame .earth-section-card {
        min-width: 174px;
        max-width: 196px;
        border: 1px solid rgba(212,168,83,0.32);
        border-radius: 14px;
        background: linear-gradient(180deg, rgba(8,22,42,0.93), rgba(7,21,35,0.86));
        box-shadow: inset 0 1px 0 rgba(247,242,234,0.08), 0 0 20px rgba(212,168,83,0.14);
        padding: 9px;
      }
      .coverage-earth-frame .earth-section-title {
        color: #F7F2EA;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.05;
        margin-bottom: 8px;
      }
      .coverage-earth-frame .earth-section-metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
      }
      .coverage-earth-frame .earth-section-metric {
        min-height: 44px;
        border: 1px solid rgba(247,242,234,0.12);
        border-radius: 10px;
        background: rgba(247,242,234,0.06);
        padding: 6px 7px;
      }
      .coverage-earth-frame .earth-section-metric strong {
        display: block;
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 800;
        line-height: 1;
      }
      .coverage-earth-frame .earth-section-metric span {
        display: block;
        margin-top: 5px;
        color: rgba(247,242,234,0.62);
        font-size: 9.5px;
        font-weight: 700;
        line-height: 1.1;
      }
      .coverage-earth-frame .earth-section-metric--villa strong {
        color: #F0C77B;
      }
      .coverage-earth-frame .earth-section-metric--inhabitants {
        grid-column: 1 / -1;
        min-height: 42px;
      }
      .coverage-earth-frame .earth-section-metric--inhabitants strong {
        color: #8CD3EE;
      }
      .coverage-earth-frame .earth-section-empty {
        margin-top: 7px;
        border-top: 1px solid rgba(247,242,234,0.08);
        padding-top: 7px;
        color: rgba(247,242,234,0.52);
        font-size: 10px;
        font-weight: 700;
        line-height: 1.2;
      }
    `
    document.head.appendChild(style)
  }, [])

  return (
    <div
      className="coverage-earth-frame relative h-[300px] overflow-hidden rounded-[24px] border border-[#D4A853]/24 bg-[#071523] p-[1px] shadow-[0_32px_74px_-44px_rgba(15,42,74,0.98)] md:h-[360px]"
      role="region"
      aria-label="Vue satellite des sections cadastrales couvertes a Ajaccio"
    >
      <div className="absolute inset-0 rounded-[24px] bg-[linear-gradient(135deg,rgba(212,168,83,0.52),rgba(46,134,171,0.24)_44%,rgba(247,242,234,0.08))]" />

      <div className="relative h-full overflow-hidden rounded-[22px]">
        <div className="absolute inset-0">
          <MapContainer
            center={[41.9234, 8.7395]}
            zoom={15}
            minZoom={12}
            maxZoom={18}
            className="earth-map-surface h-full w-full"
            scrollWheelZoom
            zoomControl={false}
            attributionControl={false}
            dragging
            doubleClickZoom
            keyboard
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Esri, Maxar, Earthstar Geographics"
            />
            <ZoomControl position="topright" />
            <MapViewportSync />
            {geoData && <CadastralSections data={geoData} sectionStats={sectionStats} statsReady={statsReady} />}
          </MapContainer>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[650] bg-[radial-gradient(circle_at_28%_18%,rgba(247,242,234,0.08),transparent_25%),linear-gradient(180deg,rgba(7,21,35,0.04),rgba(7,21,35,0.16)_70%,rgba(7,21,35,0.36))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[700] h-28 bg-gradient-to-b from-[#071523]/62 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[700] h-24 bg-gradient-to-t from-[#071523]/58 to-transparent" />

        <MapMetricsBar totals={communeTotals} />

        {!geoData && !error && <LoadingSkeleton />}
        {error && (
          <div className="absolute inset-0 z-[900] flex items-center justify-center rounded-[26px] bg-[#071523]">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/62">
              Carte non disponible
            </span>
          </div>
        )}

      </div>
    </div>
  )
}
