'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'

interface DebouncedInputProps extends Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange'
> {
  value: string
  onDebouncedChange: (value: string) => void
  delay?: number
}

export function DebouncedInput({
  value,
  onDebouncedChange,
  delay = 300,
  ...props
}: DebouncedInputProps) {
  const [text, setText] = useState(value)
  const [prevValue, setPrevValue] = useState(value)
  const debouncedChange = useDebouncedCallback(onDebouncedChange, delay)

  // Sync to external value changes (clear-filters, back/forward) during render
  // to avoid setState-in-effect. This is the React-recommended derived-state pattern.
  if (prevValue !== value) {
    setPrevValue(value)
    setText(value)
  }

  return (
    <Input
      {...props}
      value={text}
      onChange={(e) => {
        setText(e.target.value)
        debouncedChange(e.target.value)
      }}
    />
  )
}
