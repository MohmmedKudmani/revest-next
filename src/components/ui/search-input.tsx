'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'

interface SearchInputProps {
  value: string
  onSearch: (value: string) => void
  placeholder?: string
  className?: string
  delay?: number
}

export function SearchInput({
  value,
  onSearch,
  placeholder,
  className,
  delay = 300,
}: SearchInputProps) {
  const [text, setText] = useState(value)
  const [prevValue, setPrevValue] = useState(value)
  const debouncedSearch = useDebouncedCallback(onSearch, delay)

  // Sync to external value changes (clear-filters, back/forward) during render
  // to avoid setState-in-effect. This is the React-recommended derived-state pattern.
  if (prevValue !== value) {
    setPrevValue(value)
    setText(value)
  }

  return (
    <InputGroup className={className}>
      <InputGroupAddon align="inline-start">
        <MagnifyingGlassIcon size={14} />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          debouncedSearch(e.target.value)
        }}
      />
    </InputGroup>
  )
}
