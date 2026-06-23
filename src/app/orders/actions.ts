'use server'

import { revalidatePath } from 'next/cache'
import { ApiRequestError, apiFetch } from '@/lib/client'
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  type CreateOrderInput,
  type Order,
  type UpdateOrderInput,
} from '@/schemas/order.schema'
import type { ActionResult } from '@/app/products/actions'

const ORDER_URL = process.env.ORDER_SERVICE_URL

export async function createOrder(
  input: CreateOrderInput,
): Promise<ActionResult<Order>> {
  const parsed = CreateOrderSchema.safeParse(input)

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
    const order = await apiFetch<Order>(`${ORDER_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })

    revalidatePath('/orders', 'page')
    revalidatePath('/products', 'page')

    return { ok: true, data: order }
  } catch (err) {
    if (err instanceof ApiRequestError) {
      if (err.statusCode === 404) {
        return {
          ok: false,
          error: 'Product no longer exists. Refresh the page and try again.',
        }
      }

      return { ok: false, error: err.message }
    }

    return { ok: false, error: 'Service unavailable. Try again.' }
  }
}

export async function updateOrderStatus(
  id: string,
  input: UpdateOrderInput,
): Promise<ActionResult<Order>> {
  const parsed = UpdateOrderSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, error: 'Invalid status' }
  }

  try {
    const order = await apiFetch<Order>(`${ORDER_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })

    revalidatePath('/orders', 'page')
    revalidatePath('/products', 'page')

    return { ok: true, data: order }
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { ok: false, error: err.message }
    }

    return { ok: false, error: 'Service unavailable. Try again.' }
  }
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`${ORDER_URL}/orders/${id}`, { method: 'DELETE' })

    revalidatePath('/orders', 'page')
    revalidatePath('/products', 'page')

    return { ok: true, data: undefined }
  } catch (err) {
    if (err instanceof ApiRequestError) {
      if (err.statusCode === 404) {
        revalidatePath('/orders', 'page')

        return { ok: false, error: 'Order not found — may already be deleted.' }
      }

      return { ok: false, error: err.message }
    }

    return { ok: false, error: 'Service unavailable. Try again.' }
  }
}
