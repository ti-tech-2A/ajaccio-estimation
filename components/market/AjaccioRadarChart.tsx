'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const radarData = [
  { subject: 'Prix', '20000': 85, '20090': 75, '20167': 70 },
  { subject: 'Volume', '20000': 80, '20090': 75, '20167': 40 },
  { subject: 'Évolution', '20000': 80, '20090': 70, '20167': 60 },
  { subject: 'Accessibilité', '20000': 65, '20090': 80, '20167': 85 },
  { subject: 'Prestige', '20000': 90, '20090': 65, '20167': 55 },
]

export default function AjaccioRadarChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#D6EEF5" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: '#5C5C5C',
              fontSize: 12,
              fontFamily: 'var(--font-open-sans)',
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#9B9B9B', fontSize: 10 }}
            tickCount={5}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #D6EEF5',
              backgroundColor: '#FAF5EC',
              color: '#5C5C5C',
              fontSize: 12,
            }}
          />
          <Radar
            name="20000 — Centre"
            dataKey="20000"
            stroke="#1B4F72"
            fill="#1B4F72"
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Radar
            name="20090 — Sud"
            dataKey="20090"
            stroke="#2E86AB"
            fill="#2E86AB"
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Radar
            name="20167 — Mezzavia"
            dataKey="20167"
            stroke="#C9A96E"
            fill="#C9A96E"
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              fontFamily: 'var(--font-open-sans)',
              color: '#5C5C5C',
              paddingTop: 8,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
