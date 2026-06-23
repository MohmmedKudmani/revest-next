import { apiFetch, buildSearchParams } from '@/lib/client'
import type {
  PaginatedProducts,
  Product,
  ProductQueryInput,
} from '@/schemas/product.schema'

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL!

export async function getProducts(
  params: Partial<ProductQueryInput> = {},
): Promise<PaginatedProducts> {
  return apiFetch(
    `${PRODUCT_URL}/products?${buildSearchParams(params as Record<string, string | number | boolean | undefined>)}`,
  )
}

export async function getProduct(id: string): Promise<Product> {
  return apiFetch(`${PRODUCT_URL}/products/${id}`)
}

export async function getAllProductsFlat(): Promise<Product[]> {
  const res = await apiFetch<PaginatedProducts>(
    `${PRODUCT_URL}/products?limit=100&sortBy=name&order=asc`,
  )
  return res.data
}
