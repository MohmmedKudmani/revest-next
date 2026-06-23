'use server'

import { revalidatePath } from 'next/cache'
import { client, ApiRequestError, type MutationResponse } from '@/lib/client'
import { toActionError, type ActionResult } from '@/lib/action'
import {
  CreateProductSchema,
  UpdateProductSchema,
  type CreateProductInput,
  type Product,
  type UpdateProductInput,
} from '@/schemas/product.schema'

export async function createProduct(
  input: CreateProductInput,
): Promise<ActionResult<Product>> {
  const parsed = CreateProductSchema.safeParse(input)

  if (!parsed.success) {
    return {
      error: { status: 400, message: 'Validation failed' },
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const { data, message } = await client<MutationResponse<Product>>(
      'product',
      '/products',
      { method: 'POST', body: parsed.data },
    )
    revalidatePath('/products', 'page')
    return { data, message }
  } catch (err) {
    return toActionError(err)
  }
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<ActionResult<Product>> {
  const parsed = UpdateProductSchema.safeParse(input)

  if (!parsed.success) {
    return {
      error: { status: 400, message: 'Validation failed' },
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const { data, message } = await client<MutationResponse<Product>>(
      'product',
      `/products/${id}`,
      { method: 'PATCH', body: parsed.data },
    )
    revalidatePath('/products', 'page')
    return { data, message }
  } catch (err) {
    return toActionError(err)
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const { message } = await client<MutationResponse>(
      'product',
      `/products/${id}`,
      { method: 'DELETE' },
    )
    revalidatePath('/products', 'page')
    return { data: undefined, message }
  } catch (err) {
    if (err instanceof ApiRequestError && err.statusCode === 404)
      revalidatePath('/products', 'page')
    return toActionError(err)
  }
}
