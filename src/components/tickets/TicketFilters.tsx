
import { useState } from 'react'
import { RotateCcw, ChevronDown, Check, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TicketFilterState {
  status: string
  priority: string
  category: string
  assignedTo: string
  companyId: string
  slaStatus: string
  onlyFavorites: boolean
  sortBy: string
}

export const initialFilterState: TicketFilterState = {
  status: 'all',
  priority: 'all',
  category: 'all',
  assignedTo: 'all',
  companyId: 'all',
  slaStatus: 'all',
  onlyFavorites: false,
  sortBy: 'newest'
}

interface TicketFiltersProps {
  filters: TicketFilterState
  onChange: (filters: TicketFilterState) => void
  onReset: () => void
  staffList?: { id: string; full_name: string }[]
  companiesList?: { id: string; name: string }[]
  isAdmin?: boolean
}

export function TicketFilters({
  filters,
  onChange,
  onReset,
  staffList = [],
  companiesList = [],
  isAdmin = true
}: TicketFiltersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const activeCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'sortBy') return val !== 'newest'
    if (key === 'onlyFavorites') return val === true
    return val !== 'all'
  }).length

  const handleChange = (key: keyof TicketFilterState, value: any) => {
    onChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-3.5 shadow-2xs">
      {/* Barra Visível (Desktop & Mobile) */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          {/* Botão de Filtros (Abre a aba lateral direita) */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs transition-colors cursor-pointer',
              activeCount > 0
                ? 'border-brand-500 bg-brand-50/50 text-brand-600 dark:bg-brand-950/20 dark:text-brand-400'
                : 'border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-brand-300'
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-brand-500" />
            <span>Filtros</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white">
                {activeCount}
              </span>
            )}
          </button>

          {/* Campo "Ordenar Por" (Sempre Visível) */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              className={cn(
                'appearance-none rounded-lg border px-2.5 py-1.5 pr-7 font-medium cursor-pointer focus:outline-none transition-colors text-xs',
                filters.sortBy !== 'newest'
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-brand-300'
              )}
            >
              <option value="newest">Ordenar: Mais Recentes</option>
              <option value="oldest">Ordenar: Mais Antigos</option>
              <option value="priority">Ordenar: Maior Prioridade</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-[hsl(var(--muted-foreground))]" />
          </div>
        </div>

        {/* Botão Limpar (Visível se houver filtros ativos) */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Limpar Filtros</span>
          </button>
        )}
      </div>

      {/* Aba Lateral Direita com todas as opções de Filtro */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[hsl(var(--card))] h-full flex flex-col p-5 space-y-5 shadow-2xl border-l border-[hsl(var(--border))]">
            {/* Cabeçalho da Aba Lateral */}
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-[hsl(var(--foreground))]">Filtros de Chamados</h3>
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))]">Refine a exibição da lista</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Opções de Filtro */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Status */}
              <div>
                <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em Atendimento</option>
                  <option value="aguardando_cliente">Aguardando Cliente</option>
                  <option value="resolvido">Resolvido</option>
                  <option value="fechado">Encerrado</option>
                </select>
              </div>

              {/* Prioridade */}
              <div>
                <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Prioridade</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
                >
                  <option value="all">Todas as Prioridades</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente / Crítica</option>
                </select>
              </div>

              {/* Categoria (Cliente apenas) */}
              {!isAdmin && (
                <div>
                  <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Categoria</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
                  >
                    <option value="all">Todas as Categorias</option>
                    <option value="fiscal">Fiscal</option>
                    <option value="contabil">Contábil</option>
                    <option value="trabalhista">Trabalhista</option>
                    <option value="societario">Societário</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              )}

              {/* Responsável (Admin) */}
              {isAdmin && (
                <div>
                  <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Técnico Responsável</label>
                  <select
                    value={filters.assignedTo}
                    onChange={(e) => handleChange('assignedTo', e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
                  >
                    <option value="all">Todos os Responsáveis</option>
                    <option value="unassigned">Sem Responsável</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>{s.full_name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Empresa (Admin) */}
              {isAdmin && companiesList.length > 0 && (
                <div>
                  <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Empresa Cliente</label>
                  <select
                    value={filters.companyId}
                    onChange={(e) => handleChange('companyId', e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
                  >
                    <option value="all">Todas as Empresas</option>
                    {companiesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Toggle Favoritos */}
              <div className="pt-2 border-t border-[hsl(var(--border))]">
                <label className="flex items-center gap-2 font-semibold cursor-pointer text-[hsl(var(--foreground))] select-none">
                  <input
                    type="checkbox"
                    checked={filters.onlyFavorites}
                    onChange={(e) => handleChange('onlyFavorites', e.target.checked)}
                    className="rounded text-brand-500 focus:ring-brand-500 h-4 w-4"
                  />
                  <span>Mostrar Apenas Favoritos ★</span>
                </label>
              </div>
            </div>

            {/* Rodapé com botões de ação */}
            <div className="pt-3 border-t border-[hsl(var(--border))] flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onReset()
                }}
                className="flex-1 py-2.5 rounded-xl border border-[hsl(var(--border))] font-semibold text-xs text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                Limpar Filtros
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20 transition-colors"
              >
                <Check className="h-4 w-4" /> Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
