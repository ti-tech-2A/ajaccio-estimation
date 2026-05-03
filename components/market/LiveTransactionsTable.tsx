import React from 'react'
import { Badge } from '@/components/ui/Badge'
import type { SaleTransaction } from '@/lib/server/market-aggregates'

interface LiveTransactionsTableProps {
  transactions: SaleTransaction[]
  limit?: number
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  const [y, m, d] = iso.slice(0, 10).split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

function formatAddress(t: SaleTransaction): string {
  const parts = [t.number, t.street].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Adresse partielle (DVF)'
}

export function LiveTransactionsTable({ transactions, limit = 12 }: LiveTransactionsTableProps) {
  const rows = transactions.slice(0, limit)

  if (!rows.length) {
    return (
      <div className="rounded-xl bg-[#FAF5EC] border border-gray-100 p-4 text-sm text-[#9B9B9B]">
        Aucune transaction publiée récemment pour ce secteur.
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-[#1B4F72] text-white">
              <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-right font-semibold">Surface</th>
              <th className="px-4 py-3 text-right font-semibold">Pièces</th>
              <th className="px-4 py-3 text-left font-semibold">Adresse</th>
              <th className="px-4 py-3 text-right font-semibold">Prix</th>
              <th className="px-4 py-3 text-right font-semibold rounded-tr-lg">€/m²</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF5EC]'}>
                <td className="px-4 py-3 text-[#5C5C5C] whitespace-nowrap">{formatDate(t.date)}</td>
                <td className="px-4 py-3">
                  <Badge variant={t.type === 'appartement' ? 'apartment' : 'villa'} size="sm">
                    {t.type === 'appartement' ? 'Appt.' : 'Villa'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right text-[#5C5C5C]">{t.surface} m²</td>
                <td className="px-4 py-3 text-right text-[#5C5C5C]">
                  {t.rooms ?? '—'}
                </td>
                <td className="px-4 py-3 text-[#5C5C5C]">{formatAddress(t)}</td>
                <td className="px-4 py-3 text-right font-medium text-[#1B4F72] whitespace-nowrap">
                  {t.price.toLocaleString('fr-FR')} €
                </td>
                <td className="px-4 py-3 text-right text-[#5C5C5C] whitespace-nowrap">
                  {t.pricePerSqm.toLocaleString('fr-FR')} €
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
        </a>{' '}
        — adresses publiques tronquées par Etalab pour respecter la vie privée.
      </p>
    </div>
  )
}
