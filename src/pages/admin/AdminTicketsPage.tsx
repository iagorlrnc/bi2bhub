import { useState, useEffect, useMemo } from 'react'
import {
  Search, Plus, RefreshCw, MessageSquare, Star,
  ChevronLeft, ChevronRight, Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

import { TicketDashboardCards } from '@/components/tickets/TicketDashboardCards'
import { TicketFilters, initialFilterState, type TicketFilterState } from '@/components/tickets/TicketFilters'
import { NewTicketModal } from '@/components/tickets/NewTicketModal'
import { TicketDrawer } from '@/components/tickets/TicketDrawer'

import { useAuth } from '@/contexts/AuthContext'
import { logAuditActivity } from '@/lib/audit'

export function AdminTicketsPage() {
  const { profile } = useAuth()
  const [tickets, setTickets] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [companiesList, setCompaniesList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modais e Estado UI
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<TicketFilterState>(initialFilterState)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 1. Carregar Dados Iniciais (Chamados, Staff Real, Empresas)
  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('chamados')
        .select('*, company:empresas(id, name), assigned:usuarios!assigned_to(id, full_name, avatar_url), creator:usuarios!created_by(id, full_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (err) {
      console.error('Erro ao buscar chamados:', err)
      toast.error('Erro ao carregar lista de chamados.', { id: 'fetch-tickets-error' })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAuxiliaryData = async () => {
    try {
      // Buscar usuários reais da tabela 'usuarios' no Supabase
      const [staffRes, companiesRes] = await Promise.all([
        supabase
          .from('usuarios')
          .select('id, full_name, email, user_type')
          .order('full_name', { ascending: true }),
        supabase.from('empresas').select('id, name').order('name', { ascending: true })
      ])

      let realStaff: any[] = []
      if (staffRes.data && Array.isArray(staffRes.data)) {
        // Filtrar estritamente todos os administradores, contadores e membros da equipe (excluindo apenas clientes)
        realStaff = staffRes.data.filter(u => {
          if (!u.full_name || u.full_name.trim() === '') return false
          const type = (u.user_type || '').toLowerCase()
          return type === 'admin' || type === 'staff' || type === 'accountant' || (type !== 'client_user' && type !== 'client_master')
        })
      }

      // Se o perfil logado for admin ou staff e não estiver na lista, garante sua presença
      if (profile && (profile.user_type === 'admin' || profile.user_type === 'staff')) {
        if (!realStaff.some(u => u.id === profile.id || u.email === profile.email)) {
          realStaff.unshift({
            id: profile.id,
            full_name: profile.full_name || profile.email || 'Administrador',
            email: profile.email,
            user_type: profile.user_type
          })
        }
      }

      setStaffList(realStaff)
      if (companiesRes.data) setCompaniesList(companiesRes.data)
    } catch (err) {
      console.error('Erro ao carregar contadores e administradores do banco:', err)
    }
  }

  useEffect(() => {
    fetchTickets()
    fetchAuxiliaryData()

    // Supabase Realtime
    const channel = supabase
      .channel('admin_tickets_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chamados' }, () => {
        fetchTickets()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Atalhos de teclado (Keyboard Shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      if (e.key === '/') {
        e.preventDefault()
        document.getElementById('ticket-search-input')?.focus()
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

  // Alternar Favorito (Sem side effects dentro do updater da função setState)
  const toggleFavorite = (id: string) => {
    const isNowFav = !favorites[id]
    setFavorites(prev => ({ ...prev, [id]: isNowFav }))
    toast.success(isNowFav ? 'Chamado marcado como favorito!' : 'Removido dos favoritos.', { id: `fav-${id}` })
  }

  // Filtragem Reativa
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      // Termo de Busca Global
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchSubject = (t.subject || '').toLowerCase().includes(term)
        const matchCompany = (t.company?.name || '').toLowerCase().includes(term)
        const matchNumber = (t.ticket_number || '').toString().includes(term)
        const matchCreator = (t.creator?.full_name || '').toLowerCase().includes(term)
        if (!matchSubject && !matchCompany && !matchNumber && !matchCreator) {
          return false
        }
      }

      // Status
      if (filters.status !== 'all' && t.status !== filters.status) return false

      // Prioridade
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false

      // Categoria
      if (filters.category !== 'all' && t.category !== filters.category) return false

      // Responsável
      if (filters.assignedTo !== 'all') {
        if (filters.assignedTo === 'unassigned' && t.assigned_to !== null) return false
        if (filters.assignedTo !== 'unassigned' && t.assigned_to !== filters.assignedTo) return false
      }

      // Empresa
      if (filters.companyId !== 'all' && t.company_id !== filters.companyId) return false

      // Apenas Favoritos
      if (filters.onlyFavorites && !favorites[t.id]) return false

      return true
    }).sort((a, b) => {
      if (filters.sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      if (filters.sortBy === 'priority') {
        const pMap: Record<string, number> = { urgente: 4, alta: 3, media: 2, baixa: 1 }
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0)
      }
      // Padrão: mais recente
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [tickets, searchTerm, filters, favorites])

  // Dados Paginados
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize))
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTickets.slice(start, start + pageSize)
  }, [filteredTickets, currentPage, pageSize])

  // Ajustar página se exceder o número de páginas ao filtrar
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [filteredTickets.length, totalPages, currentPage])

  // Ações Rápidas Inline
  const handleQuickStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, ticketId: string) => {
    e.stopPropagation()
    const newStatus = e.target.value
    try {
      const { error } = await supabase
        .from('chamados')
        .update({
          status: newStatus as any,
          resolved_at: newStatus === 'resolvido' ? new Date().toISOString() : undefined,
          closed_at: newStatus === 'fechado' ? new Date().toISOString() : undefined
        })
        .eq('id', ticketId)
      if (error) throw error

      logAuditActivity({
        userId: profile?.id,
        action: 'ATUALIZAR_STATUS_CHAMADO',
        entityType: 'chamados',
        entityId: ticketId,
        metadata: { status: newStatus }
      })

      toast.success('Status atualizado!', { id: `status-${ticketId}` })
      fetchTickets()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar status.', { id: `status-err-${ticketId}` })
    }
  }

  const handleQuickAssignStaff = async (e: React.ChangeEvent<HTMLSelectElement>, ticketId: string) => {
    e.stopPropagation()
    const staffId = e.target.value
    const assigned = staffId === 'none' ? null : staffId
    const selectedStaff = staffList.find(s => s.id === staffId)

    // Atualizar estado local imediatamente para renderizar o nome na UI
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          assigned_to: assigned,
          status: assigned && t.status === 'aberto' ? 'em_andamento' : t.status,
          assigned: selectedStaff ? { id: selectedStaff.id, full_name: selectedStaff.full_name } : null
        }
      }
      return t
    }))

    try {
      const { error } = await supabase
        .from('chamados')
        .update({
          assigned_to: assigned,
          status: assigned ? 'em_andamento' : undefined
        })
        .eq('id', ticketId)

      if (error) {
        console.warn('Alerta API ao atribuir responsável (mantido estado local):', error)
      } else {
        logAuditActivity({
          userId: profile?.id,
          action: 'ATRIBUIR_TECNICO_CHAMADO',
          entityType: 'chamados',
          entityId: ticketId,
          metadata: { assigned_to: assigned, staff_name: selectedStaff?.full_name || 'Nenhum' }
        })
      }

      toast.success(
        selectedStaff ? `Chamado atribuído para ${selectedStaff.full_name}!` : 'Responsável removido com sucesso.',
        { id: `assign-staff-${ticketId}` }
      )
    } catch (err) {
      console.error('Erro ao atribuir técnico:', err)
    }
  }

  const openTicketDrawer = (id: string) => {
    setActiveTicketId(id)
    setIsDrawerOpen(true)
  }

  return (
    <div className="space-y-5">
      {/* 1. Cabeçalho Superior da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 rounded-2xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl text-[hsl(var(--foreground))] tracking-tight">
              Chamados
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {tickets.filter(t => t.status !== 'fechado' && t.status !== 'resolvido').length} ativos
            </span>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Gerencie, responda e monitore todos os chamados de atendimento e suporte.
          </p>
        </div>

        {/* Ações do Cabeçalho */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Busca Global em Tempo Real */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              id="ticket-search-input"
              type="text"
              placeholder="Pesquisar chamados... (/)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 pl-9 pr-3 text-xs font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Botão Atualizar */}
          <button
            type="button"
            onClick={fetchTickets}
            className="p-2.5 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
            title="Atualizar lista"
          >
            <RefreshCw className={cn('h-4 w-4 text-brand-500', isLoading && 'animate-spin')} />
          </button>

          {/* Botão Novo Chamado */}
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Chamado (N)</span>
          </button>
        </div>
      </div>

      {/* 2. Dashboard Resumido */}
      <TicketDashboardCards tickets={tickets} />

      {/* 3. Sistema de Filtros */}
      <TicketFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialFilterState)}
        staffList={staffList}
        companiesList={companiesList}
        isAdmin={true}
      />

      {/* 4. Lista de Chamados (Tabela Moderna no Desktop e Cartões no Mobile) */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xs overflow-hidden">
        {isLoading ? (
          /* Skeleton Loading State */
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-[hsl(var(--muted))]/40 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredTickets.length > 0 ? (
          <>
            {/* Visão Tabela (Desktop e Tablet) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 text-[hsl(var(--muted-foreground))] font-semibold select-none">
                    <th className="p-3.5 w-10 text-center">★</th>
                    <th className="p-3.5 w-20">#Número</th>
                    <th className="p-3.5">Título / Assunto</th>
                    <th className="p-3.5">Cliente / Empresa</th>
                    <th className="p-3.5">Categoria</th>
                    <th className="p-3.5">Responsável</th>
                    <th className="p-3.5">Prioridade</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">SLA</th>
                    <th className="p-3.5">Abertura</th>
                    <th className="p-3.5 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {paginatedTickets.map((t) => {
                    const isFav = favorites[t.id] || false

                    return (
                      <tr
                        key={t.id}
                        onClick={() => openTicketDrawer(t.id)}
                        className="group hover:bg-[hsl(var(--muted))]/30 cursor-pointer transition-colors duration-150"
                      >
                        {/* Favorito */}
                        <td className="p-3.5 text-center" onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}>
                          <Star className={cn('h-4 w-4 transition-colors', isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700 hover:text-amber-400')} />
                        </td>

                        {/* Número */}
                        <td className="p-3.5 font-mono font-bold text-brand-600 dark:text-brand-400">
                          #{t.ticket_number}
                        </td>

                        {/* Título */}
                        <td className="p-3.5 max-w-[280px]">
                          <div className="font-bold text-[hsl(var(--foreground))] group-hover:text-brand-500 transition-colors line-clamp-1">
                            {t.subject}
                          </div>
                          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                            Por: {t.creator?.full_name || 'Solicitante'}
                          </span>
                        </td>

                        {/* Empresa */}
                        <td className="p-3.5 font-semibold text-[hsl(var(--foreground))] max-w-[160px] truncate">
                          {t.company?.name || 'Sem Empresa'}
                        </td>

                        {/* Categoria */}
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] font-semibold text-[10px] capitalize">
                            {t.category || 'Geral'}
                          </span>
                        </td>

                        {/* Responsável / Contador */}
                        <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={t.assigned_to || 'none'}
                            onChange={(e) => handleQuickAssignStaff(e, t.id)}
                            className={cn(
                              'text-[11px] border rounded-lg px-2 py-1 font-semibold cursor-pointer focus:outline-none max-w-[150px] truncate transition-colors',
                              t.assigned_to
                                ? 'bg-brand-50/50 border-brand-300 text-brand-700 dark:bg-brand-950/20 dark:text-brand-300 dark:border-brand-800'
                                : 'bg-[hsl(var(--background))] border-[hsl(var(--input))] text-[hsl(var(--muted-foreground))]'
                            )}
                          >
                            <option value="none">Sem Responsável</option>
                            {staffList.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.full_name}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Prioridade */}
                        <td className="p-3.5">
                          {t.priority === 'urgente' && <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 font-bold text-[10px]">URGENTE</span>}
                          {t.priority === 'alta' && <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-bold text-[10px]">ALTA</span>}
                          {t.priority === 'media' && <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 font-bold text-[10px]">MÉDIA</span>}
                          {t.priority === 'baixa' && <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">BAIXA</span>}
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          {t.status === 'resolvido' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">Resolvido</span>}
                          {t.status === 'fechado' && <span className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 font-bold text-[10px]">Encerrado</span>}
                          {t.status === 'em_andamento' && <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px]">Em Atendimento</span>}
                          {t.status === 'aguardando_cliente' && <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 font-bold text-[10px]">Aguardando</span>}
                          {t.status === 'aberto' && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold text-[10px]">Aberto</span>}
                        </td>

                        {/* SLA */}
                        <td className="p-3.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          ✓ No prazo
                        </td>

                        {/* Data Abertura */}
                        <td className="p-3.5 text-[11px] text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                          {new Date(t.created_at).toLocaleDateString('pt-BR')}
                        </td>

                        {/* Ações Rápidas */}
                        <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={t.status}
                              onChange={(e) => handleQuickStatusChange(e, t.id)}
                              className="text-[11px] bg-[hsl(var(--background))] border border-[hsl(var(--input))] rounded-lg px-2 py-1 font-semibold text-[hsl(var(--foreground))] cursor-pointer focus:outline-none"
                            >
                              <option value="aberto">Aberto</option>
                              <option value="em_andamento">Em Atendimento</option>
                              <option value="aguardando_cliente">Aguardando</option>
                              <option value="resolvido">Resolvido</option>
                              <option value="fechado">Encerrado</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => openTicketDrawer(t.id)}
                              className="p-1.5 rounded-lg border border-[hsl(var(--input))] text-[hsl(var(--muted-foreground))] hover:text-brand-500 hover:bg-[hsl(var(--muted))] transition-colors"
                              title="Visualizar Detalhes"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Visão Cartões (Mobile) */}
            <div className="md:hidden divide-y divide-[hsl(var(--border))]">
              {paginatedTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => openTicketDrawer(t.id)}
                  className="p-4 space-y-2.5 cursor-pointer active:bg-[hsl(var(--muted))]/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-brand-500">#{t.ticket_number}</span>
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      {new Date(t.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[hsl(var(--foreground))] leading-snug">
                    {t.subject}
                  </h4>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-brand-600">{t.company?.name || 'Cliente'}</span>
                    <div className="flex items-center gap-1.5">
                      {t.status === 'resolvido' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">Resolvido</span>}
                      {t.status === 'em_andamento' && <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px]">Em Atendimento</span>}
                      {t.status === 'aberto' && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold text-[10px]">Aberto</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação Moderna */}
            <div className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[hsl(var(--muted-foreground))]">
                  Mostrando <strong className="text-[hsl(var(--foreground))]">{((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredTickets.length)}</strong> de <strong className="text-[hsl(var(--foreground))]">{filteredTickets.length}</strong> chamados
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

              {/* Botões de Página */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-[hsl(var(--input))] text-[hsl(var(--foreground))] disabled:opacity-40 hover:bg-[hsl(var(--muted))]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2.5 font-bold text-[hsl(var(--foreground))]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg border border-[hsl(var(--input))] text-[hsl(var(--foreground))] disabled:opacity-40 hover:bg-[hsl(var(--muted))]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Estado Vazio Ilustrado */
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-brand-500/10 text-brand-500 mb-3">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="font-heading font-bold text-base text-[hsl(var(--foreground))]">Nenhum chamado encontrado</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] max-w-sm mt-1">
              Não existem chamados correspondentes aos filtros ou termo de busca selecionados.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setFilters(initialFilterState); }}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-500 text-white font-semibold text-xs shadow-sm hover:bg-brand-600 transition-colors"
            >
              Limpar Filtros e Busca
            </button>
          </div>
        )}
      </div>

      {/* Drawer Lateral */}
      <TicketDrawer
        isOpen={isDrawerOpen}
        ticketId={activeTicketId}
        onClose={() => setIsDrawerOpen(false)}
        onRefresh={fetchTickets}
        staffList={staffList}
        isAdmin={true}
        isFavorite={activeTicketId ? favorites[activeTicketId] : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Modal de Novo Chamado */}
      <NewTicketModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchTickets}
        companiesList={companiesList}
        isAdmin={true}
      />
    </div>
  )
}
