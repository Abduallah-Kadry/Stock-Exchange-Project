import { notFound, redirect } from 'next/navigation'
import { fetchStock } from '@/lib/api'

interface StockDetailsProps {
  params: { id: string }
}

export default async function StockDetailsPage({ params }: StockDetailsProps) {
  if (!params?.id) {
    notFound()
  }

  const id = params.id

  try {
    const stock = await fetchStock(id)

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{stock.name}</h1>
          <p className="text-muted-foreground">{stock.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="text-2xl font-semibold">${stock.currentPrice?.toFixed?.(2) ?? 'N/A'}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Stock ID</div>
            <div className="text-xl font-mono">{stock.stockId}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Last Updated</div>
            <div className="text-xl">{stock.updatedAt ? new Date(stock.updatedAt).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    )
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      redirect('/login')
    }
    notFound()
  }
}
