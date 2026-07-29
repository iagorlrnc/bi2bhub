import { useState, useEffect, useRef } from 'react'
import {
  X, MessageSquare, Info, History, AlertCircle, Send,
  Paperclip, FileText, Download, Lock, Star, Copy, Trash2,
  Building2, UserCheck, Loader2, Sparkles, RefreshCw, CheckCircle2,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { logAuditActivity } from '@/lib/audit'

interface TicketDrawerProps {
  isOpen: boolean
  ticketId: string | null
  onClose: () => void
  onRefresh: () => void
  staffList?: { id: string; full_name: string }[]
  isAdmin?: boolean
  isFavorite?: boolean
  onToggleFavorite?: (ticketId: string) => void
}

export function TicketDrawer({
  isOpen,
  ticketId,
  onClose,
  onRefresh,
  staffList = [],
  isAdmin = true,
  isFavorite = false,
  onToggleFavorite
}: TicketDrawerProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'chat' | 'details' | 'timeline'>('chat')
  const [ticket, setTicket] = useState<any | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  // 1. Carregar detalhes do chamado
  const fetchTicketDetails = async () => {
    if (!ticketId) return
    try {
      const { data, error } = await supabase
        .from('chamados')
        .select('*, company:empresas(name, trade_name), assigned:usuarios!assigned_to(full_name, avatar_url), creator:usuarios!created_by(full_name, email, avatar_url)')
        .eq('id', ticketId)
        .single()
      if (error) throw error
      setTicket(data)
    } catch (err) {
      console.error('Erro ao buscar detalhes do chamado:', err)
    }
  }

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchTicketDetails()
    } else {
      setTicket(null)
      setMessages([])
    }
  }, [isOpen, ticketId])

  // 2. Carregar mensagens do chamado e escutar realtime
  useEffect(() => {
    if (!ticketId || !isOpen) return

    async function fetchMessages() {
      try {
        let query = supabase
          .from('mensagens_chamado')
          .select('*, sender:usuarios!sender_id(full_name, avatar_url, user_type)')
          .eq('ticket_id', ticketId)
          .order('created_at', { ascending: true })

        if (!isAdmin) {
          query = query.eq('is_internal', false)
        }

        const { data, error } = await query
        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err)
      }
    }

    fetchMessages()

    const channel = supabase
      .channel(`drawer_msgs_${ticketId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensagens_chamado', filter: `ticket_id=eq.${ticketId}` },
        async (payload) => {
          if (!isAdmin && payload.new.is_internal) return

          const { data: p } = await supabase
            .from('usuarios')
            .select('full_name, avatar_url, user_type')
            .eq('id', payload.new.sender_id)
            .single()

          const fullMsg = {
            ...payload.new,
            sender: p || { full_name: 'Usuário', user_type: 'client_user' }
          }

          setMessages(prev => {
            if (prev.some((m: any) => m.id === (fullMsg as any).id)) return prev
            return [...prev, fullMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [ticketId, isOpen, isAdmin])

  // Rolar para o final do chat ao receber mensagem
  useEffect(() => {
    if (activeTab === 'chat' && messages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, activeTab])

  if (!isOpen) return null

  // Ações
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newMessage.trim()
    if (!trimmed && !selectedFile) return
    if (!ticketId || !user?.id || !ticket?.company_id) return

    setIsUploading(true)
    try {
      let attachmentsPayload: any[] = []

      if (selectedFile) {
        const filePath = `${ticket.company_id}/tickets/${ticketId}/${Date.now()}_${selectedFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, selectedFile)

        if (uploadError) throw uploadError

        attachmentsPayload = [{
          name: selectedFile.name,
          file_path: filePath,
          mime_type: selectedFile.type || 'application/octet-stream',
          size: selectedFile.size
        }]
      }

      const content = trimmed || `Arquivo anexado: ${selectedFile?.name}`

      const { data, error } = await supabase
        .from('mensagens_chamado')
        .insert({
          ticket_id: ticketId,
          sender_id: user.id,
          content,
          attachments: attachmentsPayload,
          is_internal: isInternal
        })
        .select()
        .single()

      if (error) throw error

      logAuditActivity({
        userId: user.id,
        companyId: ticket.company_id,
        action: selectedFile ? 'ANEXAR_DOCUMENTO_CHAMADO' : 'ENVIAR_MENSAGEM_CHAMADO',
        entityType: 'chamados',
        entityId: ticketId,
        metadata: {
          origin: isAdmin ? 'Painel Admin' : 'Painel do Cliente',
          file_name: selectedFile?.name,
          is_internal: isInternal
        }
      })

      const { data: myProfile } = await supabase
        .from('usuarios')
        .select('full_name, avatar_url, user_type')
        .eq('id', user.id)
        .single()

      const optimisticMsg = {
        ...data,
        sender: myProfile
      }

      setMessages(prev => {
        if (prev.some(m => m.id === optimisticMsg.id)) return prev
        return [...prev, optimisticMsg]
      })

      setNewMessage('')
      setSelectedFile(null)
      setIsInternal(false)
      toast.success('Mensagem enviada!', { id: `send-msg-${Date.now()}` })
    } catch (err) {
      console.error(err)
      toast.error('Erro ao enviar mensagem.', { id: 'send-msg-error' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadAttachment = async (filePath: string, _name: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 60)
      if (error) throw error
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (err) {
      console.error(err)
      toast.error('Erro ao baixar anexo.', { id: 'download-attachment-error' })
    }
  }

  const handleAssignToMe = async () => {
    if (!ticketId || !user?.id) return
    try {
      const { error } = await supabase
        .from('chamados')
        .update({ assigned_to: user.id, status: 'em_andamento' })
        .eq('id', ticketId)
      if (error) throw error

      logAuditActivity({
        userId: user.id,
        companyId: ticket?.company_id,
        action: 'ATRIBUIR_TECNICO_CHAMADO',
        entityType: 'chamados',
        entityId: ticketId,
        metadata: { origin: 'Painel Admin', assigned_to_self: true }
      })

      const { data: myProfile } = await supabase.from('usuarios').select('full_name').eq('id', user.id).single()
      const myName = myProfile?.full_name || 'Técnico'

      await supabase.from('mensagens_chamado').insert({
        ticket_id: ticketId,
        sender_id: user.id,
        content: `👤 Chamado assumido por ${myName}`,
        is_internal: false
      })

      toast.success('Chamado atribuído a você!', { id: `assign-${ticketId}` })
      fetchTicketDetails()
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao assumir chamado.', { id: `assign-err-${ticketId}` })
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    if (!ticketId) return
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
        userId: user?.id,
        companyId: ticket?.company_id,
        action: 'ATUALIZAR_STATUS_CHAMADO',
        entityType: 'chamados',
        entityId: ticketId,
        metadata: {
          origin: isAdmin ? 'Painel Admin' : 'Painel do Cliente',
          status: newStatus
        }
      })

      const statusLabels: Record<string, string> = {
        aberto: 'Aberto',
        em_andamento: 'Em Atendimento',
        aguardando_cliente: 'Aguardando Cliente',
        resolvido: 'Resolvido',
        fechado: 'Encerrado'
      }
      const label = statusLabels[newStatus] || newStatus

      if (user?.id) {
        await supabase.from('mensagens_chamado').insert({
          ticket_id: ticketId,
          sender_id: user.id,
          content: `📌 Status alterado para "${label}"`,
          is_internal: false
        })
      }

      toast.success('Status alterado com sucesso!', { id: `status-${ticketId}` })
      fetchTicketDetails()
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar status.', { id: `status-err-${ticketId}` })
    }
  }

  const handleUpdatePriority = async (newPriority: string) => {
    if (!ticketId) return
    try {
      const { error } = await supabase
        .from('chamados')
        .update({ priority: newPriority as any })
        .eq('id', ticketId)
      if (error) throw error

      const priorityLabels: Record<string, string> = {
        baixa: 'Baixa',
        media: 'Média',
        alta: 'Alta',
        urgente: 'Urgente / Crítica'
      }
      const label = priorityLabels[newPriority] || newPriority

      if (user?.id) {
        await supabase.from('mensagens_chamado').insert({
          ticket_id: ticketId,
          sender_id: user.id,
          content: `⚡ Prioridade alterada para "${label}"`,
          is_internal: false
        })
      }

      toast.success('Prioridade atualizada!', { id: `priority-${ticketId}` })
      fetchTicketDetails()
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar prioridade.', { id: `priority-err-${ticketId}` })
    }
  }

  const handleAssignStaff = async (staffId: string) => {
    if (!ticketId) return
    const assigned = staffId === 'none' ? null : staffId
    const selectedStaff = staffList.find(s => s.id === staffId)

    setTicket((prev: any) => prev ? {
      ...prev,
      assigned_to: assigned,
      status: assigned && prev.status === 'aberto' ? 'em_andamento' : prev.status,
      assigned: selectedStaff ? { id: selectedStaff.id, full_name: selectedStaff.full_name } : null
    } : prev)

    try {
      const { error } = await supabase
        .from('chamados')
        .update({ assigned_to: assigned, status: assigned ? 'em_andamento' : undefined })
        .eq('id', ticketId)
      if (error) console.warn('Aviso API ao atualizar responsável:', error)

      const staffName = selectedStaff ? selectedStaff.full_name : 'Nenhum responsável (removido)'
      if (user?.id) {
        await supabase.from('mensagens_chamado').insert({
          ticket_id: ticketId,
          sender_id: user.id,
          content: `👤 Responsável pelo chamado definido para "${staffName}"`,
          is_internal: false
        })
      }

      toast.success(selectedStaff ? `Responsável alterado para ${selectedStaff.full_name}!` : 'Responsável removido.', { id: `staff-${ticketId}` })
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao alterar responsável.', { id: `staff-err-${ticketId}` })
    }
  }

  const handleDuplicate = async () => {
    if (!ticket) return
    try {
      const { error } = await supabase
        .from('chamados')
        .insert({
          company_id: ticket.company_id,
          subject: `[Cópia] ${ticket.subject}`,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: 'aberto',
          created_by: user?.id
        })
      if (error) throw error
      toast.success('Chamado duplicado com sucesso!', { id: `dup-${ticket.id}` })
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao duplicar chamado.', { id: `dup-err-${ticket.id}` })
    }
  }

  const handleDelete = async () => {
    if (!ticketId) return
    try {
      const { error } = await supabase
        .from('chamados')
        .delete()
        .eq('id', ticketId)
      if (error) throw error
      toast.success('Chamado excluído.', { id: `del-${ticketId}` })
      onRefresh()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao excluir chamado.', { id: `del-err-${ticketId}` })
    }
  }

  // Badges e Estilos
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolvido':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20">Resolvido</span>
      case 'fechado':
        return <span className="px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-[11px] border border-slate-500/20">Encerrado</span>
      case 'em_andamento':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/20">Em Atendimento</span>
      case 'aguardando_cliente':
        return <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-[11px] border border-cyan-500/20">Aguardando Cliente</span>
      default:
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] border border-blue-500/20">Aberto</span>
    }
  }

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgente':
        return <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px] uppercase">Crítica / Urgente</span>
      case 'alta':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase">Alta</span>
      case 'media':
        return <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase">Média</span>
      default:
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">Baixa</span>
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[hsl(var(--card))] h-full flex flex-col shadow-2xl border-l border-[hsl(var(--border))] cursor-default"
      >
        {/* Topo / Cabeçalho do Drawer */}
        <div className="p-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-brand-500 bg-brand-500/10 px-2.5 py-1 rounded-lg">
                #{ticket?.ticket_number || '---'}
              </span>
              {ticket && getStatusBadge(ticket.status)}
              {ticket && getPriorityBadge(ticket.priority)}
            </div>

            <div className="flex items-center gap-1.5">
              {onToggleFavorite && ticketId && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(ticketId)}
                  className={cn(
                    'p-1.5 rounded-lg border transition-colors',
                    isFavorite
                      ? 'border-amber-400 text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-[hsl(var(--input))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
                  )}
                  title={isFavorite ? 'Remover dos favoritos' : 'Favoritar chamado'}
                >
                  <Star className="h-4 w-4 fill-current" />
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="p-1.5 rounded-lg border border-[hsl(var(--input))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                  title="Duplicar Chamado"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(!confirmDelete)}
                  className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Excluir Chamado"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors ml-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {confirmDelete && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
              <span className="font-medium flex items-center gap-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Tem certeza que deseja excluir este chamado permanentemente?
              </span>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setConfirmDelete(false)} className="px-2 py-1 rounded bg-white dark:bg-slate-800 font-semibold border">Cancelar</button>
                <button onClick={handleDelete} className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold">Excluir</button>
              </div>
            </div>
          )}

          {/* Assunto e Empresa */}
          <div>
            <h2 className="font-heading font-bold text-lg text-[hsl(var(--foreground))] leading-snug">
              {ticket?.subject || 'Carregando assunto...'}
            </h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 flex items-center gap-2">
              <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
                <Building2 className="h-3.5 w-3.5" />
                {ticket?.company?.name || 'Cliente'}
              </span>
              <span>•</span>
              <span>Solicitante: {ticket?.creator?.full_name || 'Desconhecido'}</span>
            </p>
          </div>

          {/* Abas de Navegação */}
          <div className="flex border-b border-[hsl(var(--border))] pt-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 border-b-2 font-semibold text-xs transition-colors',
                activeTab === 'chat'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Conversa & Respostas ({messages.length})
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('details')}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 border-b-2 font-semibold text-xs transition-colors',
                  activeTab === 'details'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                )}
              >
                <Info className="h-3.5 w-3.5" />
                Detalhes
              </button>
            )}

            <button
              onClick={() => setActiveTab('timeline')}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 border-b-2 font-semibold text-xs transition-colors',
                activeTab === 'timeline'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              <History className="h-3.5 w-3.5" />
              Linha do Tempo
            </button>
          </div>
        </div>

        {/* Conteúdo da Aba */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-[hsl(var(--background))]/30">
          {/* Aba Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between">
              {/* Stream de Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Descrição inicial do chamado */}
                {ticket?.description && (
                  <div className="p-3.5 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))] font-semibold">
                      <span>Descrição da Solicitação</span>
                      <span>{new Date(ticket.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-line">
                      {ticket.description}
                    </p>
                  </div>
                )}

                {messages.map((msg, idx) => {
                  const isMe = msg.sender_id === user?.id
                  const userType = msg.sender?.user_type
                  const isClient = userType === 'client_master' || userType === 'client_user'

                  return (
                    <div
                      key={msg.id || idx}
                      className={cn(
                        'flex flex-col max-w-[85%] rounded-2xl px-4 py-3 text-xs border transition-all',
                        msg.is_internal
                          ? 'bg-amber-50/80 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 text-amber-900 dark:text-amber-100 ' + (isMe ? 'ml-auto rounded-tr-none' : 'mr-auto rounded-tl-none')
                          : isMe
                          ? 'bg-brand-500 text-white ml-auto rounded-tr-none border-transparent'
                          : isClient
                          ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 text-emerald-950 dark:text-emerald-100 mr-auto rounded-tl-none'
                          : 'bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-100 mr-auto rounded-tl-none'
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-bold opacity-90">
                          {isMe ? 'Eu' : (msg.sender?.full_name || 'Usuário')}
                        </span>
                        {msg.is_internal && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                            <Lock className="h-2.5 w-2.5" /> Nota Interna
                          </span>
                        )}
                        {!msg.is_internal && !isMe && isClient && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[8px] font-bold uppercase">
                            Cliente
                          </span>
                        )}
                        {!msg.is_internal && !isMe && !isClient && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[8px] font-bold uppercase">
                            Contador
                          </span>
                        )}
                      </div>

                      <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>

                      {/* Anexos */}
                      {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1 border-t border-dashed border-black/10 dark:border-white/10 pt-1.5">
                          {msg.attachments.map((file: any, fIdx: number) => (
                            <button
                              key={fIdx}
                              type="button"
                              onClick={() => handleDownloadAttachment(file.file_path, file.name)}
                              className={cn(
                                'flex items-center gap-1.5 text-xs hover:underline cursor-pointer text-left w-full truncate',
                                isMe ? 'text-brand-100 hover:text-white' : 'text-brand-600 dark:text-brand-400'
                              )}
                            >
                              <FileText className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate flex-1">{file.name}</span>
                              <Download className="h-3 w-3 shrink-0 opacity-70" />
                            </button>
                          ))}
                        </div>
                      )}

                      <span className={cn(
                        'text-[9px] mt-1 text-right block opacity-75',
                        isMe ? 'text-brand-100' : 'text-[hsl(var(--muted-foreground))]'
                      )}>
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Caixa de Entrada de Resposta */}
              <div className="p-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] shrink-0 space-y-2">
                {selectedFile && (
                  <div className="px-3 py-1.5 rounded-lg border border-brand-300 bg-brand-50/30 flex items-center justify-between text-xs text-brand-700">
                    <span className="truncate font-medium">{selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className="text-rose-500 p-0.5"><X className="h-3.5 w-3.5" /></button>
                  </div>
                )}

                {isAdmin && (
                  <label className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] cursor-pointer select-none px-1">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-[hsl(var(--input))] text-amber-500 focus:ring-amber-500 h-3.5 w-3.5"
                    />
                    <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                      <Lock className="h-3 w-3" /> Nota Interna (Não visível ao cliente)
                    </span>
                  </label>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0])
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      'p-2.5 rounded-xl border transition-colors',
                      selectedFile ? 'border-brand-500 bg-brand-50 text-brand-500' : 'border-[hsl(var(--input))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
                    )}
                    title="Anexar arquivo"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>

                  <input
                    type="text"
                    placeholder={
                      isInternal
                        ? "Escreva uma nota de equipe..."
                        : "Escreva sua mensagem ou resposta..."
                    }
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className={cn(
                      'flex-1 rounded-xl border px-3.5 text-xs font-medium focus:outline-none transition-colors',
                      isInternal
                        ? 'border-amber-300 bg-amber-50/20 focus:border-amber-500'
                        : 'border-[hsl(var(--input))] bg-[hsl(var(--background))] focus:border-brand-500'
                    )}
                  />

                  <button
                    type="submit"
                    disabled={isUploading || (!newMessage.trim() && !selectedFile)}
                    className={cn(
                      'px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center transition-colors disabled:opacity-50',
                      isInternal ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-500 hover:bg-brand-600'
                    )}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Aba Detalhes */}
          {activeTab === 'details' && ticket && (
            <div className="p-5 space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                {/* Alterar Status */}
                <div className="space-y-1">
                  <label className="font-semibold text-[hsl(var(--muted-foreground))]">Alterar Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2 font-semibold text-[hsl(var(--foreground))]"
                  >
                    <option value="aberto">Aberto</option>
                    <option value="em_andamento">Em Atendimento</option>
                    <option value="aguardando_cliente">Aguardando Cliente</option>
                    <option value="resolvido">Resolvido</option>
                    <option value="fechado">Encerrado</option>
                  </select>
                </div>

                {/* Alterar Prioridade */}
                <div className="space-y-1">
                  <label className="font-semibold text-[hsl(var(--muted-foreground))]">Alterar Prioridade</label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => handleUpdatePriority(e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2 font-semibold text-[hsl(var(--foreground))]"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente / Crítica</option>
                  </select>
                </div>
              </div>

              {/* Responsável */}
              {isAdmin && (
                <div className="space-y-1">
                  <label className="font-semibold text-[hsl(var(--muted-foreground))]">Técnico Responsável</label>
                  <div className="flex gap-2">
                    <select
                      value={ticket.assigned_to || 'none'}
                      onChange={(e) => handleAssignStaff(e.target.value)}
                      className="flex-1 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2 font-semibold text-[hsl(var(--foreground))]"
                    >
                      <option value="none">Nenhum Responsável</option>
                      {staffList.map(s => (
                        <option key={s.id} value={s.id}>{s.full_name}</option>
                      ))}
                    </select>

                    {(!ticket.assigned_to || ticket.assigned_to !== user?.id) && (
                      <button
                        type="button"
                        onClick={handleAssignToMe}
                        className="px-3 py-2 rounded-xl bg-brand-500 text-white font-semibold text-xs flex items-center gap-1 shrink-0"
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Assumir
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tabela de Propriedades */}
              <div className="border border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--card))] divide-y divide-[hsl(var(--border))] overflow-hidden">
                <div className="p-3 flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))] font-medium">Categoria</span>
                  <span className="font-semibold capitalize text-[hsl(var(--foreground))]">{ticket.category || 'Geral'}</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))] font-medium">Criado em</span>
                  <span className="font-semibold text-[hsl(var(--foreground))]">{new Date(ticket.created_at).toLocaleString('pt-BR')}</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))] font-medium">Última atualização</span>
                  <span className="font-semibold text-[hsl(var(--foreground))]">{new Date(ticket.updated_at).toLocaleString('pt-BR')}</span>
                </div>
                {ticket.resolved_at && (
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-[hsl(var(--muted-foreground))] font-medium">Resolvido em</span>
                    <span className="font-semibold text-emerald-600">{new Date(ticket.resolved_at).toLocaleString('pt-BR')}</span>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Aba Linha do Tempo */}
          {activeTab === 'timeline' && (
            <div className="p-5 space-y-5 text-xs">
              {/* Topo */}
              <div className="pb-3 border-b border-[hsl(var(--border))]">
                <h4 className="font-bold text-sm text-[hsl(var(--foreground))] flex items-center gap-2">
                  <History className="h-4 w-4 text-brand-500" /> Linha do Tempo de Eventos
                </h4>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                  Histórico de criação, alterações de status, prioridade, responsável e encerramento
                </p>
              </div>

              {/* Construtor dos Nós da Linha do Tempo (Apenas Eventos / Sem Mensagens) */}
              {(() => {
                const events: any[] = []

                // 1. Evento de Criação do Chamado
                if (ticket) {
                  events.push({
                    id: `creation-${ticket.id}`,
                    timestamp: ticket.created_at,
                    type: 'creation',
                    title: `Chamado #${ticket.ticket_number || ''} Criado`,
                    author: ticket.creator?.full_name || 'Cliente',
                    authorEmail: ticket.creator?.email,
                    companyName: ticket.company?.name || ticket.company?.trade_name,
                    category: ticket.category,
                    priority: ticket.priority,
                    status: ticket.status,
                    subject: ticket.subject,
                    description: ticket.description
                  })
                }

                // 2. Apenas registros de auditoria de alterações (status, prioridade, responsável)
                messages.forEach((msg) => {
                  const contentStr = msg.content || ''
                  const isAudit = contentStr.startsWith('📌') || contentStr.startsWith('⚡') || contentStr.startsWith('👤') || contentStr.startsWith('system_event:')

                  if (isAudit) {
                    events.push({
                      id: msg.id,
                      timestamp: msg.created_at,
                      type: 'audit',
                      title: contentStr.replace(/^system_event:/, ''),
                      author: msg.sender?.full_name || 'Sistema',
                      isInternal: msg.is_internal
                    })
                  }
                })

                // 3. Evento de Resolução
                if (ticket?.resolved_at || ticket?.status === 'resolvido') {
                  events.push({
                    id: `resolved-${ticket.id}`,
                    timestamp: ticket.resolved_at || ticket.updated_at,
                    type: 'resolution',
                    title: 'Chamado Marcado como Resolvido',
                    description: 'Atendimento concluído com sucesso.',
                    author: 'Suporte Técnico'
                  })
                }

                // 4. Evento de Encerramento
                if (ticket?.closed_at || ticket?.status === 'fechado') {
                  events.push({
                    id: `closed-${ticket.id}`,
                    timestamp: ticket.closed_at || ticket.updated_at,
                    type: 'closure',
                    title: 'Chamado Encerrado',
                    description: 'Solicitação arquivada no histórico.',
                    author: 'Sistema'
                  })
                }

                // Ordenar cronologicamente (do mais antigo ao mais recente)
                events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

                if (events.length === 0) {
                  return (
                    <div className="text-center py-8 text-[hsl(var(--muted-foreground))] italic">
                      Nenhum evento de histórico registrado.
                    </div>
                  )
                }

                return (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[hsl(var(--border))]">
                    {events.map((evt) => {
                      const dateFormatted = new Date(evt.timestamp).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })

                      // RENDERIZAÇÃO: Evento de Criação
                      if (evt.type === 'creation') {
                        return (
                          <div key={evt.id} className="relative group">
                            {/* Marcador do Nó */}
                            <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-brand-500 text-white flex items-center justify-center ring-4 ring-[hsl(var(--background))] shadow-md">
                              <Sparkles className="h-3 w-3" />
                            </div>

                            {/* Conteúdo do Card */}
                            <div className="rounded-2xl border border-brand-200 dark:border-brand-900/40 bg-brand-50/30 dark:bg-brand-950/10 p-4 space-y-2 shadow-2xs">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-bold text-sm text-brand-700 dark:text-brand-400">
                                  {evt.title}
                                </span>
                                <span className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] flex items-center gap-1 bg-[hsl(var(--card))] px-2 py-0.5 rounded-full border border-[hsl(var(--border))]">
                                  <Clock className="h-3 w-3 text-brand-500" /> {dateFormatted}
                                </span>
                              </div>

                              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                                Criado por <strong className="text-[hsl(var(--foreground))]">{evt.author}</strong> {evt.companyName ? `(${evt.companyName})` : ''}
                              </p>

                              <div className="pt-2 border-t border-brand-200/60 dark:border-brand-900/30 space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                                  {evt.category && (
                                    <span className="px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-bold capitalize">
                                      {evt.category}
                                    </span>
                                  )}
                                  {evt.priority && (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold capitalize">
                                      Prioridade: {evt.priority}
                                    </span>
                                  )}
                                </div>
                                <p className="font-semibold text-xs text-[hsl(var(--foreground))]">{evt.subject}</p>
                                {evt.description && (
                                  <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-3 bg-[hsl(var(--card))] p-2.5 rounded-xl border border-[hsl(var(--border))]">
                                    {evt.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      }

                      // RENDERIZAÇÃO: Evento de Auditoria / Sistema
                      if (evt.type === 'audit') {
                        return (
                          <div key={evt.id} className="relative">
                            <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-purple-500 text-white flex items-center justify-center ring-4 ring-[hsl(var(--background))] shadow-md">
                              <RefreshCw className="h-3 w-3" />
                            </div>

                            <div className="rounded-xl border border-purple-200 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-950/10 p-3 flex items-center justify-between gap-3 shadow-2xs">
                              <div className="space-y-0.5">
                                <p className="font-bold text-xs text-purple-900 dark:text-purple-300">
                                  {evt.title}
                                </p>
                                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                                  Alterado por <strong className="text-[hsl(var(--foreground))]">{evt.author}</strong>
                                </p>
                              </div>
                              <span className="text-[10px] text-[hsl(var(--muted-foreground))] shrink-0">
                                {dateFormatted}
                              </span>
                            </div>
                          </div>
                        )
                      }

                      // RENDERIZAÇÃO: Resolução
                      if (evt.type === 'resolution') {
                        return (
                          <div key={evt.id} className="relative">
                            <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-[hsl(var(--background))] shadow-md">
                              <CheckCircle2 className="h-3 w-3" />
                            </div>

                            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 p-3 flex items-center justify-between shadow-2xs">
                              <div>
                                <p className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                                  {evt.title}
                                </p>
                                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{evt.description}</p>
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                {dateFormatted}
                              </span>
                            </div>
                          </div>
                        )
                      }

                      // RENDERIZAÇÃO: Encerramento
                      if (evt.type === 'closure') {
                        return (
                          <div key={evt.id} className="relative">
                            <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-slate-600 text-white flex items-center justify-center ring-4 ring-[hsl(var(--background))] shadow-md">
                              <Lock className="h-3 w-3" />
                            </div>

                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3 flex items-center justify-between shadow-2xs">
                              <div>
                                <p className="font-bold text-xs text-slate-700 dark:text-slate-300">
                                  {evt.title}
                                </p>
                                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{evt.description}</p>
                              </div>
                              <span className="text-[10px] font-semibold text-slate-500">
                                {dateFormatted}
                              </span>
                            </div>
                          </div>
                        )
                      }

                      return null
                    })}
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
