import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Wallet,
  MessageSquare,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  ExternalLink,
  X,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ROUTES } from '@/constants/routes'

export interface ClientAlertItem {
  id: string
  category: 'plan' | 'ticket' | 'tax' | 'system'
  title: string
  message: string
  createdAt: string
  actionUrl: string
  isRead: boolean
  statusBadge?: 'aprovado' | 'recusado' | 'pendente' | 'respondido'
  rawId?: string
  rawTable?: string
}

export function ClientNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [alerts, setAlerts] = useState<ClientAlertItem[]>([])
  const [filter, setFilter] = useState<'all' | 'plan' | 'ticket' | 'tax' | 'system'>('all')
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Buscar empresa do usuário logado
  const fetchUserCompanyId = useCallback(async (): Promise<string | null> => {
    if (!user?.id) return null
    try {
      const { data } = await supabase
        .from('usuarios_empresa')
        .select('company_id')
        .eq('user_id', user.id)
        .limit(1)
        .single()
      return data?.company_id || null
    } catch {
      return null
    }
  }, [user?.id])

  // Carregar todos os alertas do cliente em tempo real
  const fetchClientAlerts = useCallback(async () => {
    if (!user?.id) return
    try {
      const companyId = await fetchUserCompanyId()
      const items: ClientAlertItem[] = []

      // Notificações reais registradas na tabela public.notificacoes
      let queryNotif = supabase
        .from('notificacoes')
        .select('*')
        .eq('is_read', false)
        .neq('deleted_by_client', true)
        .order('created_at', { ascending: false })
        .limit(30)

      if (companyId) {
        queryNotif = queryNotif.or(`user_id.eq.${user.id},company_id.eq.${companyId}`)
      } else {
        queryNotif = queryNotif.eq('user_id', user.id)
      }

      const { data: notifs } = await queryNotif

      if (notifs) {
        for (const n of notifs) {
          const typeLower = (n.type || '').toLowerCase()
          let cat: 'plan' | 'ticket' | 'tax' | 'system' = 'system'
          if (typeLower.includes('plano') || typeLower.includes('finan')) cat = 'plan'
          else if (typeLower.includes('chamado') || typeLower.includes('ticket')) cat = 'ticket'
          else if (typeLower.includes('imposto') || typeLower.includes('guia')) cat = 'tax'

          items.push({
            id: `notif-${n.id}`,
            category: cat,
            title: n.title || 'Nova Notificação',
            message: n.message || '',
            createdAt: n.created_at,
            actionUrl: n.action_url || ROUTES.NOTIFICATIONS,
            isRead: n.is_read || false,
            rawId: n.id,
            rawTable: 'notificacoes',
          })
        }
      }

      // Ordenar por data mais recente
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setAlerts(items)
    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro ao buscar alertas do cliente:', err)
    }
  }, [user?.id, fetchUserCompanyId])

  useEffect(() => {
    fetchClientAlerts()

    const handleRefresh = () => fetchClientAlerts()
    window.addEventListener('bi2b:refresh-data', handleRefresh)
    window.addEventListener('bi2b_finance_updated', handleRefresh)

    // Inscrever em atualizações no Supabase
    const channel = supabase
      .channel(`client-dropdown-${user?.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notificacoes' }, () => fetchClientAlerts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => fetchClientAlerts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitacoes_plano' }, () => fetchClientAlerts())
      .subscribe()

    return () => {
      window.removeEventListener('bi2b:refresh-data', handleRefresh)
      window.removeEventListener('bi2b_finance_updated', handleRefresh)
      supabase.removeChannel(channel)
    }
  }, [fetchClientAlerts, user?.id])

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = alerts.filter((a) => !a.isRead).length
  const planCount = alerts.filter((a) => a.category === 'plan').length
  const ticketCount = alerts.filter((a) => a.category === 'ticket').length
  const taxCount = alerts.filter((a) => a.category === 'tax').length

  const filteredAlerts = alerts.filter((item) => {
    if (filter === 'all') return true
    return item.category === filter
  })

  // Ao clicar em um alerta
  const handleAlertClick = async (alertItem: ClientAlertItem) => {
    setIsOpen(false)

    if (alertItem.rawTable === 'notificacoes' && alertItem.rawId) {
      try {
        await supabase
          .from('notificacoes')
          .update({ is_read: true })
          .eq('id', alertItem.rawId)
      } catch (err) {
        if (import.meta.env.DEV) console.error(err)
      }
    }

    navigate(alertItem.actionUrl)
  }

  const handleMarkAllRead = async (silentParam: boolean | unknown = false) => {
    const silent = typeof silentParam === 'boolean' ? silentParam : false
    try {
      setLoading(true)
      // 1. Atualizar instantaneamente a interface
      setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })))

      const unreadRawIds = alerts
        .filter((a) => !a.isRead && a.rawTable === 'notificacoes' && a.rawId)
        .map((a) => a.rawId as string)

      if (unreadRawIds.length > 0) {
        const { error: idErr } = await supabase
          .from('notificacoes')
          .update({ is_read: true })
          .in('id', unreadRawIds)

        if (idErr) console.warn('Aviso update notificacoes por ID:', idErr.message)
      }

      if (user?.id) {
        await supabase
          .from('notificacoes')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false)
      }

      if (!silent) {
        toast.success('Todas as notificações foram marcadas como lidas.')
      }
      window.dispatchEvent(new CustomEvent('bi2b:refresh-data'))
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      if (!silent) toast.error('Erro ao marcar notificações como lidas.')
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMin = Math.floor(diffMs / (1000 * 60))

      if (diffMin < 1) return 'Agora mesmo'
      if (diffMin < 60) return `Há ${diffMin} min`

      const diffHours = Math.floor(diffMin / 60)
      if (diffHours < 24) return `Há ${diffHours}h`

      const diffDays = Math.floor(diffHours / 24)
      if (diffDays === 1) return 'Ontem'
      if (diffDays < 7) return `Há ${diffDays} dias`

      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    } catch {
      return 'Recente'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do Sininho no Header do Cliente */}
      <button
        type="button"
        onClick={() => {
          const nextState = !isOpen
          setIsOpen(nextState)
          if (nextState) {
            handleMarkAllRead(true)
          }
        }}
        className={cn(
          'relative rounded-xl p-2 transition-all duration-200 cursor-pointer border shadow-xs',
          isOpen
            ? 'bg-brand-500/15 border-brand-500/40 text-brand-600 dark:text-brand-400'
            : 'border-[hsl(var(--border))]/60 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
        )}
        title="Minhas Notificações e Avisos"
      >
        <Bell className="h-5 w-5 shrink-0" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Flutuante */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-md">
          {/* Header do Dropdown */}
          <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3 bg-[hsl(var(--muted))]/30">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold text-xs">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[hsl(var(--foreground))] leading-none">Minhas Notificações</h3>
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                  {unreadCount === 0 ? 'Nenhuma notificação nova' : `${unreadCount} aviso(s) não lido(s)`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => handleMarkAllRead(false)}
                  disabled={loading}
                  className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1 rounded hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  title="Marcar todas como lidas"
                >
                  Marcar lidas
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Abas de Filtro */}
          <div className="flex items-center gap-1 border-b border-[hsl(var(--border))] px-3 py-2 bg-[hsl(var(--background))]/50 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer',
                filter === 'all'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
              )}
            >
              Todas ({alerts.length})
            </button>
            {planCount > 0 && (
              <button
                type="button"
                onClick={() => setFilter('plan')}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1',
                  filter === 'plan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                )}
              >
                <Wallet className="h-3 w-3" /> Planos ({planCount})
              </button>
            )}
            {ticketCount > 0 && (
              <button
                type="button"
                onClick={() => setFilter('ticket')}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1',
                  filter === 'ticket'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-sky-600 dark:text-sky-400 hover:bg-sky-500/10'
                )}
              >
                <MessageSquare className="h-3 w-3" /> Chamados ({ticketCount})
              </button>
            )}
            {taxCount > 0 && (
              <button
                type="button"
                onClick={() => setFilter('tax')}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1',
                  filter === 'tax'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-600 dark:text-purple-400 hover:bg-purple-500/10'
                )}
              >
                <FileSpreadsheet className="h-3 w-3" /> Impostos ({taxCount})
              </button>
            )}
          </div>

          {/* Lista de Alertas / Notificações */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-[hsl(var(--border))]/50">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => handleAlertClick(item)}
                    className="p-3.5 hover:bg-[hsl(var(--muted))]/40 transition-colors cursor-pointer flex items-start gap-3 group relative"
                  >
                    {/* Ícone por categoria / status */}
                    {item.statusBadge === 'aprovado' ? (
                      <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5 shadow-2xs">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    ) : item.statusBadge === 'recusado' ? (
                      <div className="p-2 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shrink-0 mt-0.5 shadow-2xs">
                        <XCircle className="h-4 w-4" />
                      </div>
                    ) : item.category === 'plan' ? (
                      <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5 shadow-2xs">
                        <Wallet className="h-4 w-4" />
                      </div>
                    ) : item.category === 'ticket' ? (
                      <div className="p-2 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 shrink-0 mt-0.5 shadow-2xs">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                    ) : item.category === 'tax' ? (
                      <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 shrink-0 mt-0.5 shadow-2xs">
                        <FileSpreadsheet className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30 shrink-0 mt-0.5 shadow-2xs">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    )}

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[hsl(var(--foreground))] truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] shrink-0">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-snug line-clamp-2">
                        {item.message}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-center" />
                  </div>
                )
              })
            ) : (
              <div className="py-10 text-center px-4 space-y-2">
                <Bell className="h-8 w-8 text-emerald-500 mx-auto opacity-80" />
                <p className="text-xs font-bold text-[hsl(var(--foreground))]">Nenhuma notificação nova</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                  Sua empresa está em dia! Você receberá avisos sobre chamados, impostos e planos aqui.
                </p>
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div className="border-t border-[hsl(var(--border))] p-2.5 bg-[hsl(var(--muted))]/30 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                navigate(ROUTES.NOTIFICATIONS)
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Ver Minhas Notificações Completas</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
