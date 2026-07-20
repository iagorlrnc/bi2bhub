import { useState, useRef, useEffect } from 'react'
import { Columns, Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ColumnConfig {
  id: string
  label: string
  visible: boolean
}

export const defaultColumns: ColumnConfig[] = [
  { id: 'number', label: 'Número', visible: true },
  { id: 'subject', label: 'Título / Assunto', visible: true },
  { id: 'company', label: 'Cliente / Empresa', visible: true },
  { id: 'category', label: 'Categoria', visible: true },
  { id: 'assigned', label: 'Responsável', visible: true },
  { id: 'priority', label: 'Prioridade', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'sla', label: 'SLA', visible: true },
  { id: 'created_at', label: 'Data de Abertura', visible: true },
  { id: 'updated_at', label: 'Última Atualização', visible: false },
  { id: 'actions', label: 'Ações Rápidas', visible: true },
]

interface TicketColumnCustomizerProps {
  columns: ColumnConfig[]
  onChange: (columns: ColumnConfig[]) => void
}

export function TicketColumnCustomizer({ columns, onChange }: TicketColumnCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleColumn = (id: string) => {
    const updated = columns.map(c => (c.id === id ? { ...c, visible: !c.visible } : c))
    onChange(updated)
  }

  const resetDefault = () => {
    onChange(defaultColumns)
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs transition-colors',
          isOpen
            ? 'border-brand-500 bg-brand-50/50 text-brand-600 dark:bg-brand-950/20 dark:text-brand-400'
            : 'border-[hsl(var(--input))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
        )}
        title="Personalizar Colunas Visíveis"
      >
        <Columns className="h-3.5 w-3.5 text-brand-500" />
        <span className="hidden sm:inline">Colunas</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-xl z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-2 mb-2">
            <span className="font-bold text-[hsl(var(--foreground))]">Colunas Visíveis</span>
            <button
              onClick={resetDefault}
              className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5"
            >
              <RotateCcw className="h-2.5 w-2.5" /> Padrão
            </button>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {columns.map(col => (
              <label
                key={col.id}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]/50 cursor-pointer select-none text-[hsl(var(--foreground))]"
              >
                <span>{col.label}</span>
                <div
                  onClick={(e) => {
                    e.preventDefault()
                    toggleColumn(col.id)
                  }}
                  className={cn(
                    'h-4 w-4 rounded border flex items-center justify-center transition-colors',
                    col.visible
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'border-[hsl(var(--input))] bg-[hsl(var(--background))]'
                  )}
                >
                  {col.visible && <Check className="h-3 w-3" />}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
