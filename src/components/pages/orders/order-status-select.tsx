'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { updateOrderStatus } from '@/app/orders/actions'
import type { Order } from '@/schemas/order.schema'
import { handleAction } from '@/lib/handle-action'

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const

const STATUS_LABEL: Record<Order['status'], string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
}

const STATUS_TRIGGER_CLASS: Record<Order['status'], string> = {
  PENDING:
    'bg-warning/10 text-warning border-warning/30 hover:bg-warning/15 focus:ring-warning/20',
  CONFIRMED:
    'bg-success/10 text-success border-success/30 hover:bg-success/15 focus:ring-success/20',
  CANCELLED:
    'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15 focus:ring-destructive/20',
}

const STATUS_DOT_CLASS: Record<Order['status'], string> = {
  PENDING: 'bg-warning',
  CONFIRMED: 'bg-success',
  CANCELLED: 'bg-destructive',
}

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: Order['status']
  disabled?: boolean
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
  disabled,
}: OrderStatusSelectProps) {
  const [optimistic, setOptimistic] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string) {
    const prev = optimistic
    setOptimistic(value as Order['status'])

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, {
        status: value as Order['status'],
      })

      handleAction(result, {
        onSuccess: (_, message) => toast.success(message),
        onError: (error) => {
          setOptimistic(prev)
          toast.error(error)
        },
      })
    })
  }

  return (
    <Select value={optimistic} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger
        size="sm"
        className={cn(
          'w-36 font-medium transition-none!',
          STATUS_TRIGGER_CLASS[optimistic],
        )}
        data-pending={isPending || undefined}
      >
        {/* Render label directly — avoids SelectValue SSR flash */}
        <span className="flex items-center gap-2">
          <span
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              STATUS_DOT_CLASS[optimistic],
            )}
          />
          {STATUS_LABEL[optimistic]}
        </span>
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((s) => (
          <SelectItem key={s} value={s}>
            {STATUS_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
