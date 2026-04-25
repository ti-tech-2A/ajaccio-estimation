'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlyPrice } from '@/data/market-data'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="bg-white shadow-md rounded-lg px-3 py-2 text-sm text-[#1B4F72]">
      <p className="font-semibold">{label}</p>
      <p>{payload[0].value.toLocaleString('fr-FR')} €/m²</p>
    </div>
  )
}

interface PriceChartProps {
  data: MonthlyPrice[]
  color?: string
}

export function PriceChart({ data, color = '#2E86AB' }: PriceChartProps) {
  const gradientId = `priceGradient-${color.replace('#', '')}`

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9B9B9B' }}
          interval={3}
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
        <Area
          type="monotone"
          dataKey="pricePerSqm"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
