'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface BanAddressSuggestion {
  label: string
  postcode: string
  city: string
  name: string
  type: string
  longitude: number | null
  latitude: number | null
}

interface BanAddressAutocompleteProps {
  id: string
  value: string
  onChange: (value: string, suggestion?: BanAddressSuggestion) => void
  postalCode?: string
  placeholder?: string
  inputClassName?: string
  listClassName?: string
  optionClassName?: string
  icon?: ReactNode
}

export default function BanAddressAutocomplete({
  id,
  value,
  onChange,
  postalCode,
  placeholder,
  inputClassName,
  listClassName,
  optionClassName,
  icon,
}: BanAddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<BanAddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function searchAddresses(query: string, postcode?: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: query.trim() })
        if (postcode) params.set('postcode', postcode)

        const response = await fetch(`/api/address/search?${params}`)
        if (!response.ok) throw new Error(`Address search HTTP ${response.status}`)

        const payload = (await response.json()) as { suggestions?: BanAddressSuggestion[] }
        const nextSuggestions = payload.suggestions ?? []
        setSuggestions(nextSuggestions)
        setShowSuggestions(nextSuggestions.length > 0)
      } catch {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 280)
  }

  function handleInputChange(nextValue: string) {
    onChange(nextValue)
    searchAddresses(nextValue, postalCode)
  }

  function handleSuggestionSelect(suggestion: BanAddressSuggestion) {
    onChange(suggestion.label, suggestion)
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {icon}
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={`${id}-suggestions`}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id={`${id}-suggestions`}
          role="listbox"
          className={listClassName}
        >
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.label}-${index}`} role="option">
              <button
                type="button"
                className={optionClassName}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
