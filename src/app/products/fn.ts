import { client } from '@/lib/client'
import { buildSearchParams } from '@/lib/utils'
import type {
  PaginatedProducts,
  Product,
  ProductQueryInput,
} from '@/schemas/product.schema'

export async function getProducts(
  params: Partial<ProductQueryInput> = {},
): Promise<PaginatedProducts> {
  return client('product', `/products?${buildSearchParams(params)}`)
}

export async function getProduct(id: string): Promise<Product> {
  return client('product', `/products/${id}`)
}

export async function getAllProductsFlat(): Promise<Product[]> {
  const res = await client<PaginatedProducts>(
    'product',
    '/products?limit=100&sortBy=name&order=asc',
  )

  return res.data
}
