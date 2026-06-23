'use server'

import { revalidatePath } from 'next/cache'
import { client, ApiRequestError, type MutationResponse } from '@/lib/client'
import { toActionError, type ActionResult } from '@/lib/action'
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  type CreateOrderInput,
  type Order,
  type UpdateOrderInput,
} from '@/schemas/order.schema'

export async function createOrder(
  input: CreateOrderInput,
): Promise<ActionResult<Order>> {
  const parsed = CreateOrderSchema.safeParse(input)

  if (!parsed.success) {
    return {
      error: { status: 400, message: 'Validation failed' },
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const { data, message } = await client<MutationResponse<Order>>(
      'order',
      '/orders',
      { method: 'POST', body: parsed.data },
    )
    revalidatePath('/orders', 'page')
    revalidatePath('/products', 'page')
    return { data, message }
  } catch (err) {
    return toActionError(err)
  }
}

export async function updateOrderStatus(
  id: string,
  input: UpdateOrderInput,
): Promise<ActionResult<Order>> {
  const parsed = UpdateOrderSchema.safeParse(input)

  if (!parsed.success) {
    return { error: { status: 400, message: 'Invalid status' } }
  }

  try {
    const { data, message } = await client<MutationResponse<Order>>(
      'order',
      `/orders/${id}`,
      { method: 'PATCH', body: parsed.data },
    )
    revalidatePath('/orders', 'page')
    revalidatePath('/products', 'page')
    return { data, message }
  } catch (err) {
    return toActionError(err)
  }
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  try {
    const { message } = await client<MutationResponse>(
      'order',
      `/orders/${id}`,
      { method: 'DELETE' },
    )
    revalidatePath('/orders', 'page')
    revalidatePath('/products', 'page')
    return { data: undefined, message }
  } catch (err) {
    if (err instanceof ApiRequestError && err.statusCode === 404)
      revalidatePath('/orders', 'page')
    return toActionError(err)
  }
}
