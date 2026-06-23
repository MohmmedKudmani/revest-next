import { normalizeSearchParams } from '@/lib/utils'
import { getOrders } from './fn'
import { getAllProductsFlat } from '@/app/products/fn'
import { OrderQuerySchema } from '@/schemas/order.schema'
import { OrdersView } from '@/components/orders'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const query = OrderQuerySchema.parse(
    normalizeSearchParams(await searchParams),
  )

  const [{ data, pagination }, products] = await Promise.all([
    getOrders(query),
    getAllProductsFlat(),
  ])

  return (
    <OrdersView
      orders={data}
      products={products}
      pagination={pagination}
      query={query}
    />
  )
}
