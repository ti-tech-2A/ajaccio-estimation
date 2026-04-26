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
  const inhabitants = typeof stats?.inhabitants === 'number' ? stats.inhabitants.toLocaleString('fr-FR') : 'n/d'
  const hasStats = apartmentBuildings > 0 || villas > 0

  const villasMarkup =
    villas > 0
      ? `<div class="earth-section-metric earth-section-metric--villa"><strong>${villas}</strong><span>Refs villas DVF</span></div>`
      : ''

  const metricsMarkup = `
    <div class="earth-section-metrics">
      <div class="earth-section-metric earth-section-metric--apartment"><strong>${apartmentBuildings}</strong><span>Refs appart. DVF</span></div>
      ${villasMarkup}
      <div class="earth-section-metric earth-section-metric--inhabitants"><strong>${inhabitants}</strong><span>Nbre habitants</span></div>
    </div>
    ${hasStats ? '' : `<div class="earth-section-empty">${statsReady ? 'Aucune reference DVF typee' : 'Stats DVF en cours'}</div>`}
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

function CommuneTotalsPanel({
  totals,
  statsReady,
}: {
  totals: CommuneTotals | null
  statsReady: boolean
}) {
  const buildingValue = totals ? formatInteger(totals.cadastralBuildings) : statsReady ? 'n/d' : '...'
  const apartmentsValue = totals ? formatInteger(totals.apartments) : statsReady ? 'n/d' : '...'
  const housingValue = totals ? formatInteger(totals.housing) : '...'
  const housesValue = totals ? formatInteger(totals.houses) : '...'
  const vintage = totals ? `${totals.inseeVintage} - Cadastre` : 'Sources officielles'

  return (
    <div className="pointer-events-none absolute left-4 right-4 top-[88px] z-[800] rounded-2xl border border-white/14 bg-[#08162A]/82 p-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.92)] backdrop-blur-xl sm:left-auto sm:right-4 sm:top-[108px] sm:w-[268px]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/50">
          Stock commune
        </span>
        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#D4A853]">
          {vintage}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2">
          <strong className="block text-lg font-extrabold leading-none text-white">{buildingValue}</strong>
          <span className="mt-1 block text-[0.64rem] font-bold leading-tight text-white/58">
            Batiments cadastraux
          </span>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2">
          <strong className="block text-lg font-extrabold leading-none text-[#8CD3EE]">{apartmentsValue}</strong>
          <span className="mt-1 block text-[0.64rem] font-bold leading-tight text-white/58">
            Appartements INSEE
          </span>
        </div>
      </div>
      <p className="mt-2 text-[0.64rem] font-semibold leading-tight text-white/48">
        {housingValue} logements au total - {housesValue} maisons.
      </p>
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
        filter: saturate(1.12) contrast(1.05) brightness(0.96);
      }
      .coverage-earth-frame .leaflet-overlay-pane {
        filter: drop-shadow(0 10px 16px rgba(0,0,0,0.24));
      }
      .coverage-earth-frame .leaflet-interactive {
        cursor: pointer;
        transition: fill .22s ease, fill-opacity .22s ease, stroke .18s ease, stroke-width .18s ease, opacity .18s ease;
        vector-effect: non-scaling-stroke;
      }
      .coverage-earth-frame .leaflet-control-container .leaflet-top.leaflet-right {
        top: 14px;
        right: 14px;
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
        min-width: 202px;
        border: 1px solid rgba(212,168,83,0.32);
        border-radius: 16px;
        background: linear-gradient(180deg, rgba(8,22,42,0.94), rgba(7,21,35,0.88));
        box-shadow: inset 0 1px 0 rgba(247,242,234,0.08), 0 0 24px rgba(212,168,83,0.16);
        padding: 10px;
      }
      .coverage-earth-frame .earth-section-title {
        color: #F7F2EA;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.05;
        margin-bottom: 9px;
      }
      .coverage-earth-frame .earth-section-metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
      }
      .coverage-earth-frame .earth-section-metric {
        min-height: 54px;
        border: 1px solid rgba(247,242,234,0.12);
        border-radius: 11px;
        background: rgba(247,242,234,0.06);
        padding: 7px 8px;
      }
      .coverage-earth-frame .earth-section-metric strong {
        display: block;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 800;
        line-height: 1;
      }
      .coverage-earth-frame .earth-section-metric span {
        display: block;
        margin-top: 5px;
        color: rgba(247,242,234,0.62);
        font-size: 10px;
        font-weight: 700;
        line-height: 1.1;
      }
      .coverage-earth-frame .earth-section-metric--villa strong {
        color: #F0C77B;
      }
      .coverage-earth-frame .earth-section-metric--inhabitants {
        grid-column: 1 / -1;
        min-height: 50px;
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

  const sectionCount = geoData?.features.length ?? 0

  return (
    <div
      className="coverage-earth-frame relative h-[360px] overflow-hidden rounded-[28px] border border-[#D4A853]/24 bg-[#071523] p-[1px] shadow-[0_38px_90px_-46px_rgba(15,42,74,0.98)] md:h-[500px]"
      role="region"
      aria-label="Vue satellite des sections cadastrales couvertes a Ajaccio"
    >
      <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(212,168,83,0.52),rgba(46,134,171,0.24)_44%,rgba(247,242,234,0.08))]" />

      <div className="relative h-full overflow-hidden rounded-[26px]">
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

        <div className="pointer-events-none absolute inset-0 z-[650] bg-[radial-gradient(circle_at_28%_18%,rgba(247,242,234,0.12),transparent_25%),linear-gradient(180deg,rgba(7,21,35,0.06),rgba(7,21,35,0.32)_72%,rgba(7,21,35,0.58))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[700] h-32 bg-gradient-to-b from-[#071523]/72 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[700] h-32 bg-gradient-to-t from-[#071523]/72 to-transparent" />

        <div className="pointer-events-none absolute left-4 top-4 z-[800] max-w-[calc(100%-2rem)] rounded-2xl border border-white/14 bg-[#08162A]/78 px-4 py-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.92)] backdrop-blur-xl">
          <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#D4A853]">
            Vue satellite HD
          </span>
          <span className="mt-1 block text-sm font-semibold leading-none text-white">
            Sections cadastrales Ajaccio
          </span>
        </div>

        <CommuneTotalsPanel totals={communeTotals} statsReady={statsReady} />

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
          Esri imagery | Cadastre Etalab | INSEE RP2022
        </div>
      </div>
    </div>
  )
}
