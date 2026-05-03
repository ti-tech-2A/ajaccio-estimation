'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import type { YearlyPoint } from '@/lib/server/market-aggregates'

interface YearlyEvolutionChartProps {
  data: YearlyPoint[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; payload: YearlyPoint }>
  label?: string | number
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null
  const point = payload[0].payload
  return (
    <div className="bg-white shadow-md rounded-lg px-3 py-2 text-sm">
      <p className="font-semibold text-[#1B4F72]">Année {point.year}</p>
      <p className="text-[#1B4F72]">
        {point.medianSqm > 0 ? `${point.medianSqm.toLocaleString('fr-FR')} €/m²` : '—'}
      </p>
      <p className="text-xs text-[#9B9B9B]">
        {point.count > 0 ? `${point.count} ventes` : 'données insuffisantes'}
      </p>
    </div>
  )
}

export function YearlyEvolutionChart({ data }: YearlyEvolutionChartProps) {
  const valid = data.filter((d) => d.medianSqm > 0)
  if (!valid.length) {
    return (
      <p className="text-sm text-[#9B9B9B] py-6 text-center">
        Données annuelles insuffisantes pour produire un historique.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 24, right: 8, left: 8, bottom: 0 }}
      >
        <defs>
          <linearGradient id="yearlyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2E86AB" stopOpacity={0.95} />
            <stop offset="95%" stopColor="#2E86AB" stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: '#5C5C5C', fontWeight: 600 }}
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FAF5EC' }} />
        <Bar
          dataKey="medianSqm"
          fill="url(#yearlyGrad)"
          radius={[8, 8, 0, 0]}
          maxBarSize={56}
        >
          <LabelList
            dataKey="medianSqm"
            position="top"
            style={{ fill: '#1B4F72', fontSize: 11, fontWeight: 600 }}
            formatter={(v: number) =>
              v > 0 ? `${(v / 1000).toFixed(1)}k` : ''
            }
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
