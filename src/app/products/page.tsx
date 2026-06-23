import { redirect } from 'next/navigation'
import { normalizeSearchParams } from '@/lib/utils'
import { getProducts } from './fn'
import { ProductQuerySchema } from '@/schemas/product.schema'
import { ProductsView } from '@/components/pages/products'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const rawParams = normalizeSearchParams(await searchParams)
  const query = ProductQuerySchema.parse(rawParams)
  const { data, pagination } = await getProducts(query)

  if (pagination.totalPages > 0 && pagination.page > pagination.totalPages) {
    const sp = new URLSearchParams(rawParams)
    sp.set('page', String(pagination.totalPages))
    redirect(`/products?${sp.toString()}`)
  }

  return <ProductsView products={data} pagination={pagination} query={query} />
}
