import { redirect } from 'next/navigation'
import { normalizeSearchParams } from '@/lib/utils'
import { getOrders } from './fn'
import { getAllProductsFlat } from '@/app/products/fn'
import { OrderQuerySchema } from '@/schemas/order.schema'
import { OrdersView } from '@/components/pages/orders'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const rawParams = normalizeSearchParams(await searchParams)
  const query = OrderQuerySchema.parse(rawParams)

  const [{ data, pagination }, products] = await Promise.all([
    getOrders(query),
    getAllProductsFlat(),
  ])

  if (pagination.totalPages > 0 && pagination.page > pagination.totalPages) {
    const sp = new URLSearchParams(rawParams)
    sp.set('page', String(pagination.totalPages))
    redirect(`/orders?${sp.toString()}`)
  }

  return (
    <OrdersView
      orders={data}
      products={products}
      pagination={pagination}
      query={query}
    />
  )
}
