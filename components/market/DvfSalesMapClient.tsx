'use client'

import dynamic from 'next/dynamic'
import type { SaleTransaction } from '@/lib/server/market-aggregates'

const DvfSalesMap = dynamic(() => import('./DvfSalesMap'), {
  ssr: false,
  loading: () => (
    <div className="h-80 rounded-xl bg-[#FAF5EC] border border-gray-100 flex items-center justify-center">
      <p className="text-sm text-[#9B9B9B]">Chargement de la carte…</p>
    </div>
  ),
})

interface DvfSalesMapClientProps {
  transactions: SaleTransaction[]
  postalCode: string
}

export function DvfSalesMapClient(props: DvfSalesMapClientProps) {
  return <DvfSalesMap {...props} />
}
