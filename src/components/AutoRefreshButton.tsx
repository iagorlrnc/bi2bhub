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
    }, 600)
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
      className="group relative flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
      title="Atualizar dados (Auto: a cada 3s)"
    >
      <RefreshCw
        className={cn(
          'h-5 w-5 text-brand-500 transition-transform duration-500',
          isSpinning && 'animate-spin'
        )}
      />
      {/* Indicador de Status Ativo em Tempo Real */}
      <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
    </button>
  )
}
