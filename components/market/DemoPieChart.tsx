'use client'

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const pieData = [
  { name: 'Propriétaires', value: 49, color: '#1B4F72' },
  { name: 'Locataires', value: 43, color: '#2E86AB' },
  { name: 'Logements vacants', value: 8, color: '#D6EEF5' },
]

export default function DemoPieChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ name, value }: { name: string; value: number }) =>
              `${name} (${value}%)`
            }
            labelLine={true}
          >
            {pieData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`]}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #D6EEF5',
              backgroundColor: '#FAF5EC',
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              fontFamily: 'var(--font-open-sans)',
              color: '#5C5C5C',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
