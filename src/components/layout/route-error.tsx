'use client'

import { Button } from '@/components/ui/button'
import { WarningCircleIcon } from '@phosphor-icons/react'

interface RouteErrorProps {
  title: string
  description: string
}

export function RouteError({ title, description }: RouteErrorProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <WarningCircleIcon
        size={40}
        className="text-muted-foreground"
        weight="duotone"
      />
      <div className="space-y-1">
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      </div>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  )
}
