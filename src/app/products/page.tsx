import { normalizeSearchParams } from '@/lib/utils'
import { getProducts } from './fn'
import { ProductQuerySchema } from '@/schemas/product.schema'
import { ProductsView } from '@/components/pages/products'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const query = ProductQuerySchema.parse(
    normalizeSearchParams(await searchParams),
  )
  const { data, pagination } = await getProducts(query)

  return <ProductsView products={data} pagination={pagination} query={query} />
}
