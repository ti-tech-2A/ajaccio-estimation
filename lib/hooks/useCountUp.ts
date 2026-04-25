'use client'

import { useEffect, useRef, useState } from 'react'

interface UseCountUpOptions {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  separator?: string
}

interface UseCountUpResult {
  ref: React.RefObject<HTMLElement | null>
  value: number
  displayValue: string
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

function formatNumber(value: number, decimals: number, separator: string): string {
  const fixed = value.toFixed(decimals)
  if (!separator) return fixed

  const [intPart, decPart] = fixed.split('.')
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted
}

export function useCountUp({
  end,
  duration = 1500,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ' ',
}: UseCountUpOptions): UseCountUpResult {
  const ref = useRef<HTMLElement | null>(null)
  const [value, setValue] = useState(0)
  const hasStarted = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          startAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, duration])

  function startAnimation() {
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuart(progress)
      const current = eased * end

      setValue(current)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setValue(end)
      }
    }

    requestAnimationFrame(tick)
  }

  const displayValue =
    prefix + formatNumber(value, decimals, separator) + suffix

  return { ref, value, displayValue }
}
