import { useState, useEffect, useCallback } from 'react'
import { Bell, Trash2, Loader2, Search, Filter, CheckCheck, ExternalLink, CheckCircle, CircleDot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { getNotificationConfig, NOTIFICATION_TYPES } from '@/constants/notifications'

export function NotificationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isMarkingAll, setIsMarkingAll] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('id, title, message, type, action_url, is_read, created_at')
        .eq('user_id', user.id)
        .neq('deleted_by_client', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      setNotifications(data || [])
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Erro ao buscar notificações:', err)
      }
      toast.error('Erro ao carregar notificações.')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ deleted_by_client: true })
        .eq('id', id)
      if (error) throw error
      toast.success('Notificação removida.')
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Erro ao remover notificação.')
    }
  }

  const handleToggleRead = async (notif: any) => {
    const newStatus = !notif.is_read
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ is_read: newStatus })
        .eq('id', notif.id)
      if (error) throw error
      setNotifications(prev =>
        prev.map(n => (n.id === notif.id ? { ...n, is_read: newStatus } : n))
      )
    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar status da notificação.')
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    if (unreadIds.length === 0) {
      toast.info('Todas as notificações já estão lidas.')
      return
    }

    setIsMarkingAll(true)
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      if (error) throw error
      toast.success('Todas as notificações foram marcadas como lidas.')
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (err) {
      console.error(err)
      toast.error('Erro ao marcar notificações como lidas.')
    } finally {
      setIsMarkingAll(false)
    }
  }

  const handleActionClick = async (notif: any) => {
    if (!notif.is_read) {
      handleToggleRead(notif)
    }
    if (notif.action_url) {
      navigate(notif.action_url)
    }
  }

  // Filtered Notifications list
  const filteredNotifications = notifications.filter(notif => {
    // Read status filter
    if (readFilter === 'unread' && notif.is_read) return false
    if (readFilter === 'read' && !notif.is_read) return false

    // Category filter
    if (categoryFilter !== 'all' && notif.type !== categoryFilter) return false

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const titleMatch = notif.title?.toLowerCase().includes(query)
      const messageMatch = notif.message?.toLowerCase().includes(query)
      if (!titleMatch && !messageMatch) return false
    }

    return true
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30">
            <Bell className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Notificações</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-500 text-white animate-pulse">
                  {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                </span>
              )}
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Fique atualizado sobre documentos, prazos e chamados da sua empresa</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="flex items-center justify-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all shadow-xs cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            {isMarkingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />
            ) : (
              <CheckCheck className="h-3.5 w-3.5 text-brand-500" />
            )}
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xs">
        {/* Busca */}
        <div className="sm:col-span-6 relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Buscar notificações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Status (Todas, Não Lidas, Lidas) */}
        <div className="sm:col-span-3 flex items-center justify-center p-0.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg">
          <button
            onClick={() => setReadFilter('all')}
            className={cn(
              "flex-1 py-1 px-2 text-[11px] font-semibold rounded-md transition-all cursor-pointer text-center",
              readFilter === 'all'
                ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-xs"
                : "text-[hsl(var(--muted-foreground))]"
            )}
          >
            Todas
          </button>
          <button
            onClick={() => setReadFilter('unread')}
            className={cn(
              "flex-1 py-1 px-2 text-[11px] font-semibold rounded-md transition-all cursor-pointer text-center flex items-center justify-center gap-1",
              readFilter === 'unread'
                ? "bg-[hsl(var(--card))] text-brand-600 dark:text-brand-400 shadow-xs"
                : "text-[hsl(var(--muted-foreground))]"
            )}
          >
            Não lidas
          </button>
          <button
            onClick={() => setReadFilter('read')}
            className={cn(
              "flex-1 py-1 px-2 text-[11px] font-semibold rounded-md transition-all cursor-pointer text-center",
              readFilter === 'read'
                ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-xs"
                : "text-[hsl(var(--muted-foreground))]"
            )}
          >
            Lidas
          </button>
        </div>

        {/* Filtro por Categoria */}
        <div className="sm:col-span-3 flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))] shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-1.5 px-2.5 text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="all">Todas as categorias</option>
            {Object.values(NOTIFICATION_TYPES).map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] divide-y divide-[hsl(var(--border))] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
            <span className="text-sm text-[hsl(var(--muted-foreground))] font-medium">Carregando notificações...</span>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map(notif => {
            const config = getNotificationConfig(notif.type)
            const ConfigIcon = config.icon

            return (
              <div
                key={notif.id}
                className={cn(
                  'p-4 flex items-start gap-3.5 transition-all hover:bg-[hsl(var(--muted))]/10 border-l-4',
                  !notif.is_read 
                    ? 'bg-brand-50/15 dark:bg-brand-950/10 border-l-brand-500' 
                    : 'border-l-transparent'
                )}
              >
                {/* Botão Ponto / Check de status */}
                <button
                  onClick={() => handleToggleRead(notif)}
                  className="mt-1 shrink-0 p-1 text-[hsl(var(--muted-foreground))] hover:text-brand-500 transition-colors cursor-pointer"
                  title={notif.is_read ? 'Marcar como não lida' : 'Marcar como lida'}
                >
                  {notif.is_read ? (
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--muted-foreground))]/60 hover:text-brand-500" />
                  ) : (
                    <CircleDot className="h-4 w-4 text-brand-500 animate-pulse" />
                  )}
                </button>

                {/* Ícone com as cores reais da categoria */}
                <div className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-transform hover:scale-105",
                  config.iconBg,
                  config.borderColor
                )}>
                  <ConfigIcon className={cn("h-4 w-4", config.iconColor)} />
                </div>

                {/* Texto e detalhes */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <h4 className={cn(
                        'text-sm text-[hsl(var(--foreground))]',
                        !notif.is_read ? 'font-bold' : 'font-semibold'
                      )}>
                        {notif.title}
                      </h4>

                      {/* Tag da Categoria */}
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 shrink-0",
                        config.badgeBg,
                        config.badgeText,
                        config.badgeBorder
                      )}>
                        <ConfigIcon className="h-3 w-3" />
                        {config.label.split(' / ')[0]}
                      </span>
                    </div>

                    <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0 font-medium">
                      {new Date(notif.created_at).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                    {notif.message}
                  </p>

                  {/* Link de Ação (URL) */}
                  {notif.action_url && (
                    <div className="pt-2">
                      <button
                        onClick={() => handleActionClick(notif)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold gradient-brand text-white shadow-xs hover:opacity-90 transition-all cursor-pointer"
                      >
                        Acessar módulo <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Botões de Ações Rápidas */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 rounded hover:bg-rose-50 text-[hsl(var(--muted-foreground))] hover:text-rose-500 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                    title="Excluir notificação"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-12 text-center">
            <Bell className="h-10 w-10 text-[hsl(var(--muted-foreground))] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Nenhuma notificação encontrada</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              {searchQuery || readFilter !== 'all' || categoryFilter !== 'all'
                ? 'Tente ajustar os filtros de busca para encontrar o que procura.'
                : 'Você não possui notificações no momento.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
