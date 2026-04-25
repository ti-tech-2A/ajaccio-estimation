import React from 'react'
import { Badge } from '@/components/ui/Badge'
import type { DvfTransaction } from '@/data/market-data'

interface TransactionsTableProps {
  transactions: DvfTransaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="bg-[#1B4F72] text-white">
              <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Surface</th>
              <th className="px-4 py-3 text-left font-semibold">Rue</th>
              <th className="px-4 py-3 text-right font-semibold">Prix</th>
              <th className="px-4 py-3 text-right font-semibold rounded-tr-lg">Prix m²</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={t.id}
                className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5ECD7]'}
              >
                <td className="px-4 py-3 text-[#5C5C5C]">{t.date}</td>
                <td className="px-4 py-3">
                  <Badge variant={t.type === 'appartement' ? 'apartment' : 'villa'} size="sm">
                    {t.type === 'appartement' ? 'Appt.' : 'Villa'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[#5C5C5C]">{t.surface} m²</td>
                <td className="px-4 py-3 text-[#5C5C5C]">{t.street}</td>
                <td className="px-4 py-3 text-right font-medium text-[#1B4F72]">
                  {t.price.toLocaleString('fr-FR')} €
                </td>
                <td className="px-4 py-3 text-right text-[#5C5C5C]">
                  {t.pricePerSqm.toLocaleString('fr-FR')} €/m²
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#9B9B9B] mt-3">
        Source :{' '}
        <a
          href="https://app.dvf.etalab.gouv.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2E86AB] hover:underline"
        >
          données DVF officielles
        </a>
      </p>
    </div>
  )
}
