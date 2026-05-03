'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { SaleTransaction } from '@/lib/server/market-aggregates'

interface DvfSalesMapProps {
  transactions: SaleTransaction[]
  postalCode: string
}

const CENTERS: Record<string, [number, number]> = {
  '20000': [41.9267, 8.7368],
  '20090': [41.9052, 8.7495],
  '20167': [41.9692, 8.7986],
}

const COLORS = {
  apartment: '#2E86AB',
  villa: '#C9A96E',
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

function formatAddress(t: SaleTransaction): string {
  const parts = [t.number, t.street].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Adresse partielle'
}

export default function DvfSalesMap({ transactions, postalCode }: DvfSalesMapProps) {
  // Filter to geolocated transactions only
  const geoTx = useMemo(
    () => transactions.filter((t) => t.lat != null && t.lng != null),
    [transactions],
  )

  // Compute center: mean of geolocated points or fallback to CP center
  const center = useMemo<[number, number]>(() => {
    if (!geoTx.length) {
      return CENTERS[postalCode] ?? [41.9192, 8.7386]
    }
    const lat = geoTx.reduce((s, t) => s + (t.lat ?? 0), 0) / geoTx.length
    const lng = geoTx.reduce((s, t) => s + (t.lng ?? 0), 0) / geoTx.length
    return [lat, lng]
  }, [geoTx, postalCode])

  // Hydration guard — Leaflet needs window
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="h-80 rounded-xl bg-[#FAF5EC] border border-gray-100 flex items-center justify-center">
        <p className="text-sm text-[#9B9B9B]">Chargement de la carte…</p>
      </div>
    )
  }

  if (!geoTx.length) {
    return (
      <div className="h-80 rounded-xl bg-[#FAF5EC] border border-gray-100 flex items-center justify-center px-4 text-center">
        <p className="text-sm text-[#9B9B9B] max-w-md">
          Géolocalisation indisponible pour les transactions récentes de ce secteur. Le tableau
          des ventes ci-dessous reste consultable.
        </p>
      </div>
    )
  }

  // Marker radius scaled by price/m² (visual emphasis)
  const sqms = geoTx.map((t) => t.pricePerSqm)
  const minSqm = Math.min(...sqms)
  const maxSqm = Math.max(...sqms)
  const span = Math.max(1, maxSqm - minSqm)

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="h-80 md:h-96 z-0 bg-[#D6EEF5]"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {geoTx.map((t) => {
          const ratio = (t.pricePerSqm - minSqm) / span
          const radius = 6 + ratio * 8
          const color = t.type === 'villa' ? COLORS.villa : COLORS.apartment

          return (
            <CircleMarker
              key={t.id}
              center={[t.lat as number, t.lng as number]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.55,
                weight: 2,
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={1} sticky>
                <span style={{ fontWeight: 600, color: '#1B4F72' }}>
                  {t.pricePerSqm.toLocaleString('fr-FR')} €/m²
                </span>
              </Tooltip>
              <Popup>
                <div style={{ minWidth: 180, fontFamily: 'Open Sans, sans-serif' }}>
                  <p style={{ fontWeight: 700, color: '#1B4F72', marginBottom: 4 }}>
                    {t.type === 'villa' ? 'Villa / Maison' : 'Appartement'}
                  </p>
                  <p style={{ fontSize: 12, color: '#5C5C5C', marginBottom: 6 }}>
                    {formatAddress(t)}
                  </p>
                  <p style={{ fontSize: 13, color: '#1B4F72', fontWeight: 600 }}>
                    {t.price.toLocaleString('fr-FR')} €
                    <span style={{ color: '#9B9B9B', fontWeight: 400, marginLeft: 6 }}>
                      ({t.pricePerSqm.toLocaleString('fr-FR')} €/m²)
                    </span>
                  </p>
                  <p style={{ fontSize: 12, color: '#5C5C5C', marginTop: 4 }}>
                    {t.surface} m²
                    {t.rooms ? ` • ${t.rooms} pièce${t.rooms > 1 ? 's' : ''}` : ''}
                    {' • '}
                    {formatDate(t.date)}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 text-xs text-[#5C5C5C]">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS.apartment }}
              aria-hidden="true"
            />
            Appartement
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS.villa }}
              aria-hidden="true"
            />
            Villa / Maison
          </span>
        </div>
        <p className="text-xs text-[#9B9B9B]">
          {geoTx.length} vente{geoTx.length > 1 ? 's' : ''} géolocalisée
          {geoTx.length > 1 ? 's' : ''} — taille proportionnelle au prix/m²
        </p>
      </div>
    </div>
  )
}
