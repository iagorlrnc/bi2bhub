import { useState, useEffect, useCallback } from 'react'
import {
  Send,
  Trash2,
  Users,
  User,
  Loader2,
  Building,
  ShieldCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn, isBi2bCompany } from '@/lib/utils'
import { getNotificationConfig, NOTIFICATION_TYPES } from '@/constants/notifications'
import type { NotificationType } from '@/types/database.types'

interface Company {
  id: string
  name: string
}

interface UserProfile {
  id: string
  full_name: string
  email: string
  user_type: string
  usuarios_empresa: any
}

function getCompanyIdFromUser(u: any): string | null {
  if (!u?.usuarios_empresa) return null
  if (Array.isArray(u.usuarios_empresa)) {
    return u.usuarios_empresa[0]?.company_id || null
  }
  return u.usuarios_empresa.company_id || null
}

function getCompanyNameFromUser(u: any): string | null {
  if (!u?.usuarios_empresa) return null
  if (Array.isArray(u.usuarios_empresa)) {
    return u.usuarios_empresa[0]?.empresas?.name || null
  }
  return u.usuarios_empresa.empresas?.name || null
}

function userBelongsToCompany(u: any, companyId: string): boolean {
  if (!u?.usuarios_empresa) return false
  if (Array.isArray(u.usuarios_empresa)) {
    return u.usuarios_empresa.some((ue: any) => ue.company_id === companyId)
  }
  return u.usuarios_empresa.company_id === companyId
}

interface NotificationItem {
  id: string
  title: string
  message: string
  type: string
  action_url: string | null
  is_read: boolean
  deleted_by_client?: boolean
  created_at: string
  user_id?: string
  company_id?: string | null
  user: {
    full_name: string
    email: string
  } | null
  company: {
    name: string
  } | null
}

export function AdminNotificationsPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [history, setHistory] = useState<NotificationItem[]>([])

  // Formulário de Envio
  const [targetType, setTargetType] = useState<'company' | 'user'>('company')
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [notifType, setNotifType] = useState<NotificationType>('info')
  const [actionUrl, setActionUrl] = useState<string>('')

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    try {
      let histData: any[] = []
      const { data: hist, error: histErr } = await supabase
        .from('notificacoes')
        .select('*, user:usuarios(full_name, email), company:empresas(name)')
        .order('created_at', { ascending: false })
        .limit(150)

      if (!histErr && hist) {
        histData = hist
      } else {
        const { data: plainHist, error: plainErr } = await supabase
          .from('notificacoes')
          .select('id, user_id, company_id, company_name, title, message, type, action_url, is_read, created_at')
          .order('created_at', { ascending: false })
          .limit(150)

        if (plainErr) throw plainErr
        histData = plainHist || []
      }

      setHistory(histData)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Erro ao carregar histórico:', err)
    }
  }, [])

  const fetchData = useCallback(
    async (isInitial = false) => {
      if (isInitial) setIsInitialLoading(true)
      try {
        // 1. Buscar empresas ativas
        const { data: cos, error: cosErr } = await supabase
          .from('empresas')
          .select('id, name, trade_name, codigo_exclusivo')
          .eq('is_active', true)
          .order('name')
        if (cosErr) throw cosErr
        setCompanies((cos || []).filter((c) => !isBi2bCompany(c)))

        // 2. Buscar usuários ativos
        const { data: usrs, error: usrsErr } = await supabase
          .from('usuarios')
          .select(`
          id,
          full_name,
          email,
          user_type,
          usuarios_empresa (
            company_id,
            empresas (
              name
            )
          )
        `)
          .eq('is_active', true)
          .order('full_name')
        if (usrsErr) throw usrsErr
        setUsers((usrs as any) || [])

        // 3. Buscar notificações
        await fetchHistory()
      } catch (err: any) {
        if (import.meta.env.DEV) console.error('Erro ao carregar dados:', err)
        toast.error('Erro ao carregar dados de notificações.')
      } finally {
        if (isInitial) setIsInitialLoading(false)
      }
    },
    [fetchHistory]
  )

  useEffect(() => {
    fetchData(true)

    const handleRefresh = () => fetchHistory()
    window.addEventListener('bi2b:refresh-data', handleRefresh)
    window.addEventListener('bi2b_finance_updated', handleRefresh)

    const channel = supabase
      .channel('admin-notifications-page-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notificacoes' }, () => fetchHistory())
      .subscribe()

    return () => {
      window.removeEventListener('bi2b:refresh-data', handleRefresh)
      window.removeEventListener('bi2b_finance_updated', handleRefresh)
      supabase.removeChannel(channel)
    }
  }, [fetchData, fetchHistory])

  // Submeter envio de notificação
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      toast.error('Por favor, preencha o título e a mensagem.')
      return
    }

    setIsSubmitting(true)
    try {
      if (targetType === 'company') {
        if (!selectedCompanyId) {
          toast.error('Selecione uma empresa ou "Todas as Empresas".')
          setIsSubmitting(false)
          return
        }

        if (selectedCompanyId === 'ALL_COMPANIES') {
          if (users.length === 0) {
            toast.error('Nenhum usuário ativo encontrado.')
            setIsSubmitting(false)
            return
          }

          const notificationsToInsert = users.map((u) => ({
            user_id: u.id,
            company_id: getCompanyIdFromUser(u),
            title: title.trim(),
            message: message.trim(),
            type: notifType,
            action_url: actionUrl.trim() || null,
            is_read: false,
          }))

          const { error: insErr } = await supabase.from('notificacoes').insert(notificationsToInsert)
          if (insErr) throw insErr
          toast.success(`Notificação enviada para ${notificationsToInsert.length} usuários em todas as empresas.`)
        } else {
          let companyUsers = users.filter((u) => userBelongsToCompany(u, selectedCompanyId))

          if (companyUsers.length === 0) {
            const { data: members, error: memErr } = await supabase
              .from('usuarios_empresa')
              .select('user_id')
              .eq('company_id', selectedCompanyId)

            if (memErr) throw memErr
            if (members && members.length > 0) {
              companyUsers = members.map((m) => ({ id: m.user_id } as any))
            }
          }

          if (companyUsers.length === 0) {
            toast.error('Esta empresa não possui nenhum membro cadastrado.')
            setIsSubmitting(false)
            return
          }

          const notificationsToInsert = companyUsers.map((member) => ({
            user_id: member.id,
            company_id: selectedCompanyId,
            title: title.trim(),
            message: message.trim(),
            type: notifType,
            action_url: actionUrl.trim() || null,
            is_read: false,
          }))

          const { error: insErr } = await supabase.from('notificacoes').insert(notificationsToInsert)
          if (insErr) throw insErr
          toast.success(`Notificação enviada para todos os ${companyUsers.length} membros da empresa.`)
        }
      } else {
        if (!selectedUserId) {
          toast.error('Selecione um usuário ou "Todos os Usuários".')
          setIsSubmitting(false)
          return
        }

        if (selectedUserId === 'ALL_USERS') {
          if (users.length === 0) {
            toast.error('Nenhum usuário ativo encontrado.')
            setIsSubmitting(false)
            return
          }

          const notificationsToInsert = users.map((u) => ({
            user_id: u.id,
            company_id: getCompanyIdFromUser(u),
            title: title.trim(),
            message: message.trim(),
            type: notifType,
            action_url: actionUrl.trim() || null,
            is_read: false,
          }))

          const { error: insErr } = await supabase.from('notificacoes').insert(notificationsToInsert)
          if (insErr) throw insErr
          toast.success(`Notificação enviada para todos os ${users.length} usuários.`)
        } else {
          const targetUser = users.find((u) => u.id === selectedUserId)
          const userCompanyId = getCompanyIdFromUser(targetUser)

          const { error: insErr } = await supabase.from('notificacoes').insert({
            user_id: selectedUserId,
            company_id: userCompanyId,
            title: title.trim(),
            message: message.trim(),
            type: notifType,
            action_url: actionUrl.trim() || null,
            is_read: false,
          })

          if (insErr) throw insErr
          toast.success(`Notificação enviada para ${targetUser?.full_name || 'o usuário'}.`)
        }
      }

      setTitle('')
      setMessage('')
      setActionUrl('')
      fetchHistory()
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Erro ao enviar notificação:', err)
      toast.error(err?.message ? `Erro ao enviar: ${err.message}` : 'Erro ao enviar notificação.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Deletar notificação do histórico
  const handleDelete = async (id: string) => {
    setIsDeletingId(id)
    try {
      setHistory((prev) => prev.filter((item) => item.id !== id))
      await supabase.from('notificacoes').delete().eq('id', id)
      toast.success('Notificação excluída do histórico.')
    } catch (err: any) {
      if (import.meta.env.DEV) console.error(err)
      toast.error('Erro ao excluir notificação.')
    } finally {
      setIsDeletingId(null)
    }
  }

  const selectedTypeConfig = getNotificationConfig(notifType)

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30 shadow-2xs">
            <Send className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Enviar Comunicados</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Envie alertas, avisos e notificações importantes para empresas e usuários da plataforma
            </p>
          </div>
        </div>
      </div>

      {isInitialLoading ? (
        <div className="flex h-[400px] items-center justify-center gap-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-xs">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          <span className="text-sm text-[hsl(var(--muted-foreground))] font-medium">Carregando formulário de comunicados...</span>
        </div>
      ) : (
        /* ==================== ÁREA DE ENVIO DE COMUNICADOS PARA CLIENTES ==================== */
        <div className="grid gap-6 lg:grid-cols-5 items-start">
          {/* Formulário de Envio */}
          <div className="lg:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2.5 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-500" /> Nova Notificação
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo de Destino */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[hsl(var(--foreground))]">Destinatário</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetType('company')}
                    className={cn(
                      'flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                      targetType === 'company'
                        ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300'
                        : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/55 text-[hsl(var(--muted-foreground))]'
                    )}
                  >
                    <Building className="h-3.5 w-3.5" />
                    Por Empresa
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('user')}
                    className={cn(
                      'flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                      targetType === 'user'
                        ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300'
                        : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/55 text-[hsl(var(--muted-foreground))]'
                    )}
                  >
                    <User className="h-3.5 w-3.5" />
                    Por Usuário
                  </button>
                </div>
              </div>

              {/* Seleção baseada no Tipo */}
              {targetType === 'company' ? (
                <div className="space-y-1.5">
                  <label htmlFor="company-select" className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    Selecionar Empresa
                  </label>
                  <select
                    id="company-select"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="">Selecione uma empresa...</option>
                    <option value="ALL_COMPANIES">TODAS AS EMPRESAS (Envio Global)</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="user-select" className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    Selecionar Usuário
                  </label>
                  <select
                    id="user-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="">Selecione um usuário...</option>
                    <option value="ALL_USERS">TODOS OS USUÁRIOS (Envio Global)</option>
                    {users.map((u) => {
                      const compName = getCompanyNameFromUser(u) || 'Sem Empresa'
                      return (
                        <option key={u.id} value={u.id}>
                          {u.full_name} ({compName} — {u.email})
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {/* Seleção de Categoria */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[hsl(var(--foreground))] flex items-center justify-between">
                  <span>Tipo / Categoria (Selecione a cor)</span>
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', selectedTypeConfig.badgeBg, selectedTypeConfig.badgeText, selectedTypeConfig.badgeBorder)}>
                    {selectedTypeConfig.shortLabel}
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {Object.values(NOTIFICATION_TYPES).map((t) => {
                    const TIcon = t.icon
                    const isSelected = notifType === t.value

                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setNotifType(t.value)}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer text-xs font-semibold',
                          isSelected ? t.activeRing : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/40'
                        )}
                      >
                        <div className={cn('p-1.5 rounded-md shrink-0 border', t.iconBg, t.borderColor)}>
                          <TIcon className={cn('h-3.5 w-3.5', t.iconColor)} />
                        </div>
                        <span className="truncate text-[11px] text-[hsl(var(--foreground))]">{t.shortLabel}</span>
                      </button>
                    )
                  })}
                </div>

                <div
                  className={cn(
                    'p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all mt-1',
                    selectedTypeConfig.badgeBg,
                    selectedTypeConfig.badgeBorder,
                    selectedTypeConfig.badgeText
                  )}
                >
                  <selectedTypeConfig.icon className={cn('h-4 w-4 shrink-0', selectedTypeConfig.iconColor)} />
                  <p className="text-[11px] opacity-90 leading-tight">{selectedTypeConfig.description}</p>
                </div>
              </div>

              {/* Título */}
              <div className="space-y-1.5">
                <label htmlFor="notif-title" className="text-xs font-semibold text-[hsl(var(--foreground))]">
                  Título
                </label>
                <input
                  id="notif-title"
                  type="text"
                  placeholder="Ex: Novo documento disponível para download"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Mensagem */}
              <div className="space-y-1.5">
                <label htmlFor="notif-message" className="text-xs font-semibold text-[hsl(var(--foreground))]">
                  Mensagem
                </label>
                <textarea
                  id="notif-message"
                  rows={4}
                  placeholder="Descreva o conteúdo detalhado da notificação para o cliente..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              {/* URL de Ação Opcional */}
              <div className="space-y-1.5">
                <label htmlFor="notif-action" className="text-xs font-semibold text-[hsl(var(--foreground))] flex items-center justify-between">
                  <span>Link de Atalho</span>
                </label>
                <input
                  id="notif-action"
                  type="text"
                  placeholder="Ex: /chamados ou /impostos"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
                />

                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Atalhos rápidos:</span>
                  {[
                    { label: 'Impostos', url: '/impostos' },
                    { label: 'Tarefas', url: '/tarefas' },
                    { label: 'Chamados', url: '/chamados' },
                    { label: 'Drive', url: '/drive' },
                    { label: 'Equipe', url: '/equipe' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setActionUrl(preset.url)}
                      className="px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))] text-[10px] font-medium text-[hsl(var(--foreground))] transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl gradient-brand py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" /> Enviar Notificação
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Histórico de Disparos */}
          <div className="lg:col-span-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm space-y-4 flex flex-col h-full min-h-[500px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[hsl(var(--border))] pb-2.5">
              <h2 className="text-base font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-500" /> Histórico de Disparos Realizados
              </h2>

              <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                {history.length} envios
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[580px]">
              {history.length > 0 ? (
                history.map((item) => {
                  const cfg = getNotificationConfig(item.type)
                  const ConfigIcon = cfg.icon
                  const userObj = item.user || users.find((u) => u.id === item.user_id)
                  const companyObj = item.company || companies.find((c) => c.id === item.company_id)

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]/40 flex items-start gap-3 hover:bg-[hsl(var(--muted))]/10 transition-all"
                    >
                      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-2xs mt-0.5', cfg.iconBg, cfg.borderColor)}>
                        <ConfigIcon className={cn('h-4 w-4', cfg.iconColor)} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-xs font-bold text-[hsl(var(--foreground))] truncate">{item.title}</h4>
                          <span className="text-[10px] text-[hsl(var(--muted-foreground))] shrink-0 font-medium">
                            {new Date(item.created_at).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2">{item.message}</p>

                        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold pt-1">
                          <span className="text-brand-600 dark:text-brand-400">
                            Destino: {companyObj?.name || (item as any).company_name || 'Global'} {userObj ? `(${userObj.full_name})` : ''}
                          </span>
                          <span className={cn('uppercase font-extrabold text-[9px]', item.is_read ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}>
                            {item.is_read ? 'Lida' : 'Pendente'}
                          </span>
                        </div>
                      </div>

                      <button
                        disabled={isDeletingId === item.id}
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-rose-500 hover:bg-rose-500/10 shrink-0 transition-colors cursor-pointer"
                        title="Excluir do Histórico"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })
              ) : (
                <div className="flex h-[350px] flex-col items-center justify-center text-center">
                  <Send className="h-10 w-10 text-[hsl(var(--muted-foreground))] mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Nenhum comunicado enviado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
