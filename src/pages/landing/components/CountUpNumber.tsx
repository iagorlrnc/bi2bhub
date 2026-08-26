import { useEffect, useRef, useState } from 'react'

interface CountUpNumberProps {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
  className?: string
}

export function CountUpNumber({
  end,
  prefix = '',
  suffix = '',
  duration = 2000,
  decimals = 0,
  className = '',
}: CountUpNumberProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setCount(end)
      setHasAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime: number | null = null

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3)
            const currentVal = easeProgress * end
            setCount(currentVal)

            if (progress < 1) {
              requestAnimationFrame(step)
            } else {
              setCount(end)
            }
          }

          requestAnimationFrame(step)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  const formattedValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString('pt-BR')

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
