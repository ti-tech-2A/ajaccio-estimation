'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const fixLeafletIcon = () => {
  // @ts-expect-error Leaflet icon fix for Next.js bundling
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

const MARKERS = [
  { cp: '20000', label: 'Ajaccio Centre', lat: 41.9267, lng: 8.7368 },
  { cp: '20090', label: 'Ajaccio Sud', lat: 41.9052, lng: 8.7495 },
  { cp: '20167', label: 'Mezzavia', lat: 41.9692, lng: 8.7986 },
]

export default function CoverageMap() {
  useEffect(() => {
    fixLeafletIcon()
  }, [])

  return (
    <MapContainer
      center={[41.9192, 8.7386]}
      zoom={12}
      className="h-64 md:h-80 rounded-xl z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {MARKERS.map((m) => (
        <Marker key={m.cp} position={[m.lat, m.lng]}>
          <Popup>
            {m.label} — CP {m.cp}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
