import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'

export function AutoRefreshButton() {
  const [isSpinning, setIsSpinning] = useState(false)
  const queryClient = useQueryClient()

  const triggerRefresh = useCallback(() => {
    setIsSpinning(true)
    
    // 1. Invalidar React Query cache se utilizado
    queryClient.invalidateQueries()
    
    // 2. Disparar evento global customizado para escuta das páginas
    window.dispatchEvent(new CustomEvent('bi2b:refresh-data'))

    setTimeout(() => {
      setIsSpinning(false)
    }, 800)
  }, [queryClient])

  useEffect(() => {
    const interval = setInterval(() => {
      triggerRefresh()
    }, 3000)

    return () => clearInterval(interval)
  }, [triggerRefresh])

  return (
    <button
      type="button"
      onClick={triggerRefresh}
      className="group relative flex items-center justify-center rounded-xl p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors border border-[hsl(var(--border))]/40 bg-[hsl(var(--card))]"
      title="Atualização automática a cada 3 segundos (Clique para atualizar agora)"
    >
      <RefreshCw
        className={cn(
          'h-4 w-4 text-brand-500 transition-transform duration-700',
          isSpinning && 'animate-spin'
        )}
      />
      {/* Indicador de Status Ativo em Tempo Real */}
      <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
    </button>
  )
}
