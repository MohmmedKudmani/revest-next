'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { TrashIcon, CircleNotchIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteOrder } from '@/app/orders/actions'
import type { OrderWithProduct } from '@/schemas/order.schema'
import { handleAction } from '@/lib/handle-action'

export function DeleteOrderButton({ order }: { order: OrderWithProduct }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteOrder(order.id)

      handleAction(result, {
        onSuccess: () => toast.success('Order deleted'),
        onError: (error) => toast.error(error),
      })
      setOpen(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive size-8"
        >
          <TrashIcon size={15} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Order?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete order{' '}
            <span className="text-foreground font-mono text-xs">
              {order.id.slice(0, 8)}…
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 text-white"
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
          >
            {isPending && (
              <CircleNotchIcon size={14} className="animate-spin" />
            )}
            {isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
