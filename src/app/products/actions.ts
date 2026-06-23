'use server'

import { revalidatePath } from 'next/cache'
import { ApiRequestError, apiFetch } from '@/lib/client'
import {
  CreateProductSchema,
  UpdateProductSchema,
  type CreateProductInput,
  type Product,
  type UpdateProductInput,
} from '@/schemas/product.schema'

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

export async function createProduct(
  input: CreateProductInput,
): Promise<ActionResult<Product>> {
  const parsed = CreateProductSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    }
  }

  try {
    const product = await apiFetch<Product>(`${PRODUCT_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })

    revalidatePath('/products', 'page')

    return { ok: true, data: product }
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { ok: false, error: err.message }
    }

    return { ok: false, error: 'Service unavailable. Try again.' }
  }
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<ActionResult<Product>> {
  const parsed = UpdateProductSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    }
  }

  try {
    const product = await apiFetch<Product>(`${PRODUCT_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })

    revalidatePath('/products', 'page')

    return { ok: true, data: product }
  } catch (err) {
    if (err instanceof ApiRequestError) {
      if (err.statusCode === 404) {
        return {
          ok: false,
          error: 'Product not found — may already be deleted.',
        }
      }
      return { ok: false, error: err.message }
    }
    return { ok: false, error: 'Service unavailable. Try again.' }
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`${PRODUCT_URL}/products/${id}`, { method: 'DELETE' })

    revalidatePath('/products', 'page')

    return { ok: true, data: undefined }
  } catch (err) {
    if (err instanceof ApiRequestError) {
      if (err.statusCode === 404) {
        revalidatePath('/products', 'page')

        return {
          ok: false,
          error: 'Product not found — may already be deleted.',
        }
      }
      return { ok: false, error: err.message }
    }
    return { ok: false, error: 'Service unavailable. Try again.' }
  }
}
