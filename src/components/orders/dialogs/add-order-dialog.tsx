'use client'

import { useState, useTransition, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  PlusIcon,
  CircleNotchIcon,
  CheckIcon,
  CaretUpDownIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  CreateOrderSchema,
  type CreateOrderInput,
} from '@/schemas/order.schema'
import type { Product } from '@/schemas/product.schema'
import { createOrder } from '@/app/orders/actions'

interface AddOrderDialogProps {
  products: Product[]
}

export function AddOrderDialog({ products }: AddOrderDialogProps) {
  const [open, setOpen] = useState(false)
  const [comboOpen, setComboOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: { productId: '', quantity: 1 },
  })

  const selectedProductId = form.watch('productId')
  const quantity = form.watch('quantity')

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  )

  const liveTotal =
    selectedProduct && quantity > 0
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(selectedProduct.price * quantity)
      : null

  function onSubmit(values: CreateOrderInput) {
    setServerError(null)
    if (selectedProduct && values.quantity > selectedProduct.stock) {
      form.setError('quantity', {
        message: `Only ${selectedProduct.stock} available`,
      })
      return
    }
    startTransition(async () => {
      const result = await createOrder(values)
      if (result.ok) {
        toast.success('Order placed')
        setOpen(false)
        form.reset()
      } else {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            form.setError(field as keyof CreateOrderInput, {
              message: messages[0],
            })
          }
        }
        setServerError(result.error)
      }
    })
  }

  function handleOpenChange(o: boolean) {
    setOpen(o)
    if (!o) {
      form.reset()
      setServerError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <PlusIcon size={17} />
          Add Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Order</DialogTitle>
        </DialogHeader>

        {serverError && (
          <div className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
            {serverError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product *</FormLabel>
                  <FormControl>
                    <Popover open={comboOpen} onOpenChange={setComboOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={comboOpen}
                          className="w-full justify-between font-normal"
                        >
                          {selectedProduct
                            ? `${selectedProduct.name} — ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedProduct.price)}`
                            : 'Select a product…'}
                          <CaretUpDownIcon
                            size={14}
                            className="ml-2 shrink-0 opacity-50"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search products…" />
                          <CommandList>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup>
                              {products.map((product) => {
                                const outOfStock = product.stock === 0
                                return (
                                  <CommandItem
                                    key={product.id}
                                    value={`${product.name} ${product.id}`}
                                    onSelect={() => {
                                      if (!outOfStock) {
                                        field.onChange(product.id)
                                        setComboOpen(false)
                                      }
                                    }}
                                    disabled={outOfStock}
                                    className={cn(
                                      'flex items-center justify-between',
                                      outOfStock && 'opacity-40',
                                    )}
                                  >
                                    <span className="flex items-center gap-2">
                                      <CheckIcon
                                        size={14}
                                        className={cn(
                                          'shrink-0',
                                          field.value === product.id
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      <span>{product.name}</span>
                                    </span>
                                    <span className="text-muted-foreground ml-2 text-xs">
                                      {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                      }).format(product.price)}
                                      {outOfStock
                                        ? ' · out of stock'
                                        : ` · ${product.stock} in stock`}
                                    </span>
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={selectedProduct?.stock ?? undefined}
                      placeholder="1"
                      {...field}
                    />
                  </FormControl>
                  {selectedProduct && (
                    <p className="text-muted-foreground text-xs">
                      {selectedProduct.stock} available
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {liveTotal && (
              <p className="text-muted-foreground text-sm">
                Total:{' '}
                <span className="text-foreground font-medium">{liveTotal}</span>
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <CircleNotchIcon size={15} className="animate-spin" />
                )}
                {isPending ? 'Placing…' : 'Place Order'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
