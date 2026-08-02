import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'

export function AutoRefreshButton() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')
  const queryClient = useQueryClient()

  const triggerRefresh = useCallback(() => {
    setIsSpinning(true)
    
    // 1. Invalidar React Query cache se utilizado
    queryClient.invalidateQueries()
    
    // 2. Disparar eventos globais customizados para escuta das páginas
    window.dispatchEvent(new CustomEvent('bi2b:refresh-data'))
    window.dispatchEvent(new CustomEvent('bi2b_finance_updated'))

    setTimeout(() => {
      setIsSpinning(false)
    }, 400)
  }, [queryClient])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }

    updateTime()
    const timer = setInterval(() => {
      updateTime()
      triggerRefresh()
    }, 1000)

    return () => clearInterval(timer)
  }, [triggerRefresh])

  return (
    <button
      type="button"
      onClick={triggerRefresh}
      className="group relative flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))] shadow-sm"
      title="Atualização automática (Horário em tempo real)"
    >
      <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
      <span className="tabular-nums tracking-wider text-[hsl(var(--foreground))]">
        {currentTime || new Date().toLocaleTimeString('pt-BR')}
      </span>
      <RefreshCw
        className={cn(
          'h-3.5 w-3.5 text-brand-500 transition-transform duration-300 ml-0.5',
          isSpinning && 'animate-spin'
        )}
      />
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
    </button>
  )
}
