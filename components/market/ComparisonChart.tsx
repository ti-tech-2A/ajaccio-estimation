'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ComparisonEntry {
  cp: string
  Appartements: number
  Villas: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; fill: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="bg-white shadow-md rounded-lg px-3 py-2 text-sm text-[#1B4F72]">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.fill }}>
          {entry.name} : {entry.value.toLocaleString('fr-FR')} €/m²
        </p>
      ))}
    </div>
  )
}

interface CustomLegendProps {
  payload?: Array<{ value: string; color: string }>
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload) return null
  return (
    <div className="flex justify-center gap-6 mt-2">
      {payload.map((entry) => (
        <span key={entry.value} className="flex items-center gap-1.5 text-sm text-[#5C5C5C]">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  )
}

interface ComparisonChartProps {
  data: ComparisonEntry[]
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis
          dataKey="cp"
          tick={{ fontSize: 12, fill: '#9B9B9B' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => v.toLocaleString('fr-FR') + ' €'}
          tick={{ fontSize: 11, fill: '#9B9B9B' }}
          tickLine={false}
          axisLine={false}
          width={72}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="Appartements" fill="#2E86AB" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Villas" fill="#C9A96E" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
