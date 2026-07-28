import { useState, useEffect, useMemo } from 'react'
import {
  Search, Plus, MessageSquare, Star,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

import { TicketFilters, initialFilterState, type TicketFilterState } from '@/components/tickets/TicketFilters'
import { NewTicketModal } from '@/components/tickets/NewTicketModal'
import { TicketDrawer } from '@/components/tickets/TicketDrawer'

export function TicketsPage() {
  const { company, isLoading: authLoading } = useAuth()

  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estados UI
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<TicketFilterState>(initialFilterState)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Carregar Chamados da Empresa do Cliente
  const fetchTickets = async () => {
    if (!company?.id) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('chamados')
        .select('*, company:empresas(name), assigned:usuarios!assigned_to(full_name, avatar_url), creator:usuarios!created_by(full_name)')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (err) {
      console.error('Erro ao buscar chamados:', err)
      toast.error('Erro ao carregar chamados.', { id: 'client-fetch-tickets-err' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (!company?.id) {
      setIsLoading(false)
      return
    }
    fetchTickets()

    // Realtime para chamados da empresa
    const channel = supabase
      .channel(`client_tickets_${company.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chamados', filter: `company_id=eq.${company.id}` },
        () => fetchTickets()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [company?.id, authLoading])

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      if (e.key === '/') {
        e.preventDefault()
        document.getElementById('client-ticket-search')?.focus()
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        setIsNewModalOpen(true)
      } else if (e.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Alternar Favorito
  const toggleFavorite = (id: string) => {
    const isNowFav = !favorites[id]
    setFavorites(prev => ({ ...prev, [id]: isNowFav }))
    toast.success(isNowFav ? 'Chamado marcado como favorito!' : 'Removido dos favoritos.', { id: `fav-${id}` })
  }

  // Filtragem Reativa
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchSubject = (t.subject || '').toLowerCase().includes(term)
        const matchNumber = (t.ticket_number || '').toString().includes(term)
        if (!matchSubject && !matchNumber) return false
      }

      if (filters.status !== 'all' && t.status !== filters.status) return false
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false
      if (filters.category !== 'all' && t.category !== filters.category) return false
      if (filters.onlyFavorites && !favorites[t.id]) return false

      return true
    }).sort((a, b) => {
      if (filters.sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [tickets, searchTerm, filters, favorites])

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize))
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTickets.slice(start, start + pageSize)
  }, [filteredTickets, currentPage, pageSize])

  const openTicketDrawer = (id: string) => {
    setActiveTicketId(id)
    setIsDrawerOpen(true)
  }

  return (
    <div className="space-y-5">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 rounded-2xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl text-[hsl(var(--foreground))] tracking-tight">
              Chamados & Suporte
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {tickets.filter(t => t.status !== 'fechado' && t.status !== 'resolvido').length} chamados em aberto
            </span>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Abra solicitações, tire dúvidas ou acompanhe os atendimentos da sua empresa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              id="client-ticket-search"
              type="text"
              placeholder="Pesquisar chamados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 pl-9 pr-3 text-xs font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Abrir Chamado</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <TicketFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialFilterState)}
        isAdmin={false}
      />

      {/* Tabela / Cards */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-[hsl(var(--muted))]/40 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredTickets.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 text-[hsl(var(--muted-foreground))] font-semibold">
                    <th className="p-3.5 w-10 text-center">★</th>
                    <th className="p-3.5 w-20">#Número</th>
                    <th className="p-3.5">Assunto</th>
                    <th className="p-3.5">Categoria</th>
                    <th className="p-3.5">Atendente</th>
                    <th className="p-3.5">Prioridade</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Data Abertura</th>
                    <th className="p-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {paginatedTickets.map((t) => {
                    const isFav = favorites[t.id] || false

                    return (
                      <tr
                        key={t.id}
                        onClick={() => openTicketDrawer(t.id)}
                        className="group hover:bg-[hsl(var(--muted))]/30 cursor-pointer transition-colors"
                      >
                        <td className="p-3.5 text-center" onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}>
                          <Star className={cn('h-4 w-4 transition-colors', isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700 hover:text-amber-400')} />
                        </td>

                        <td className="p-3.5 font-mono font-bold text-brand-600 dark:text-brand-400">
                          #{t.ticket_number}
                        </td>

                        <td className="p-3.5 font-bold text-[hsl(var(--foreground))] group-hover:text-brand-500">
                          {t.subject}
                        </td>

                        <td className="p-3.5 capitalize font-semibold text-[hsl(var(--muted-foreground))]">
                          {t.category || 'Geral'}
                        </td>

                        <td className="p-3.5 font-medium text-[hsl(var(--foreground))]">
                          {t.assigned?.full_name || 'Aguardando Contador'}
                        </td>

                        <td className="p-3.5">
                          {t.priority === 'urgente' && <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 font-bold text-[10px]">URGENTE</span>}
                          {t.priority === 'alta' && <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-bold text-[10px]">ALTA</span>}
                          {t.priority === 'media' && <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 font-bold text-[10px]">MÉDIA</span>}
                          {t.priority === 'baixa' && <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">BAIXA</span>}
                        </td>

                        <td className="p-3.5">
                          {t.status === 'resolvido' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">Resolvido</span>}
                          {t.status === 'fechado' && <span className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 font-bold text-[10px]">Encerrado</span>}
                          {t.status === 'em_andamento' && <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px]">Em Atendimento</span>}
                          {t.status === 'aguardando_cliente' && <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 font-bold text-[10px]">Aguardando Sua Resposta</span>}
                          {t.status === 'aberto' && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold text-[10px]">Aberto</span>}
                        </td>

                        <td className="p-3.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                          {new Date(t.created_at).toLocaleDateString('pt-BR')}
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => openTicketDrawer(t.id)}
                            className="px-3 py-1 rounded-lg border border-[hsl(var(--input))] font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50"
                          >
                            Ver Respostas
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[hsl(var(--border))]">
              {paginatedTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => openTicketDrawer(t.id)}
                  className="p-4 space-y-2 cursor-pointer active:bg-[hsl(var(--muted))]/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-brand-500">#{t.ticket_number}</span>
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      {new Date(t.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[hsl(var(--foreground))]">{t.subject}</h4>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[hsl(var(--muted-foreground))]">Contador: {t.assigned?.full_name || 'Equipe Contábil'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 font-bold text-[10px]">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            <div className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[hsl(var(--muted-foreground))]">
                  Mostrando {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredTickets.length)} de {filteredTickets.length} chamados
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[hsl(var(--muted-foreground))]">Por página:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-2 py-1 font-semibold text-[hsl(var(--foreground))]"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 font-bold">{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg border disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <MessageSquare className="h-8 w-8 text-brand-500 mb-2" />
            <h3 className="font-bold text-sm text-[hsl(var(--foreground))]">Nenhum chamado cadastrado</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Precisa de ajuda? Abra um novo chamado de atendimento.</p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="mt-3 px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
            >
              Abrir Novo Chamado
            </button>
          </div>
        )}
      </div>

      {/* Drawer */}
      <TicketDrawer
        isOpen={isDrawerOpen}
        ticketId={activeTicketId}
        onClose={() => setIsDrawerOpen(false)}
        onRefresh={fetchTickets}
        isAdmin={false}
        isFavorite={activeTicketId ? favorites[activeTicketId] : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Modal */}
      <NewTicketModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchTickets}
        isAdmin={false}
      />
    </div>
  )
}
