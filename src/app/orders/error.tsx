'use client'

import { useEffect } from 'react'
import { RouteError } from '@/components/layout/route-error'

export default function OrdersError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <RouteError
      title="Couldn't load orders"
      description="We couldn't load your orders. The service may be temporarily unavailable. Please try again in a moment."
    />
  )
}
