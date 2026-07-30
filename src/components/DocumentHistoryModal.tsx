import { useState, useEffect } from 'react'
import {
  X,
  History,
  User,
  Clock,
  FileText,
  Loader2,
  Trash2,
  Eye,
  Edit3,
  Download,
  ShieldAlert,
  Info
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { parseUserAgent } from '@/lib/audit'

export interface DocumentHistoryFile {
  id: string
  name: string
  file_path: string
  file_size?: number
  category?: string
  created_at: string
  tags?: string[]
}

interface DocumentHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  file: DocumentHistoryFile | null
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return 'Tamanho desconhecido'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function DocumentHistoryModal({ isOpen, onClose, file }: DocumentHistoryModalProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !file) {
      setLogs([])
      setIsLoading(false)
      setError(null)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    const fetchHistory = async () => {
      try {
        // Buscar registros na tabela de atividades onde a entidade é este documento
        // ou onde o metadata contenha o id ou o caminho do arquivo
        const { data, error: fetchErr } = await supabase
          .from('atividades')
          .select('*, profile:usuarios!user_id(id, full_name, email, user_type)')
          .or(`entity_id.eq.${file.id},metadata->>file_path.eq.${file.file_path}`)
          .order('created_at', { ascending: false })

        if (fetchErr) throw fetchErr

        // Deduplica visualizações mantendo estritamente a ÚLTIMA visualização por usuário
        const rawData = data || []
        const latestViewByUser = new Map<string, any>()
        const otherEvents: any[] = []

        for (const log of rawData) {
          const act = (log.action || '').toUpperCase()
          const isView = act.includes('VISUALIZAR') || act.includes('PREVIEW') || act.includes('VER')

          if (isView) {
            const userKey = log.user_id || log.profile?.email || 'desconhecido'
            if (!latestViewByUser.has(userKey)) {
              latestViewByUser.set(userKey, log)
            } else {
              const existing = latestViewByUser.get(userKey)
              if (new Date(log.created_at) > new Date(existing.created_at)) {
                latestViewByUser.set(userKey, log)
              }
            }
          } else {
            otherEvents.push(log)
          }
        }

        const deduplicatedLogs = [...latestViewByUser.values(), ...otherEvents]
        deduplicatedLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        if (isMounted) {
          setLogs(deduplicatedLogs)
        }
      } catch (err: any) {
        if (import.meta.env.DEV) console.error('Erro ao buscar histórico do documento:', err)
        if (isMounted) setError('Erro ao carregar histórico de acessos.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchHistory()

    return () => {
      isMounted = false
    }
  }, [isOpen, file])

  if (!isOpen || !file) return null

  // Verificar se o documento foi excluído por um usuário
  const isDeletedByUser = file.tags?.includes('deletado_pelo_usuario')
  const deletedByTag = file.tags?.find(t => t.startsWith('deletado_por:'))
  const deletedByName = deletedByTag ? deletedByTag.replace('deletado_por:', '') : 'Usuário'

  const getActionBadge = (action: string) => {
    const act = (action || '').toUpperCase()
    if (act.includes('EXCLUIR') || act.includes('DELETE')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
          <Trash2 className="h-3 w-3" />
          Excluiu Documento
        </span>
      )
    }
    if (act.includes('VISUALIZAR') || act.includes('PREVIEW') || act.includes('VER')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
          <Eye className="h-3 w-3" />
          Visualizado
        </span>
      )
    }
    if (act.includes('BAIXAR') || act.includes('DOWNLOAD')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
          <Download className="h-3 w-3" />
          Baixou Arquivo
        </span>
      )
    }
    if (act.includes('EDITAR') || act.includes('UPDATE') || act.includes('RENOMEAR')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
          <Edit3 className="h-3 w-3" />
          Editou / Renomeou
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
        <FileText className="h-3 w-3" />
        {act}
      </span>
    )
  }

  const getUserBadge = (userType?: string) => {
    switch (userType) {
      case 'admin':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">Admin</span>
      case 'gestor':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">Gestor</span>
      case 'colaborador':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">Colaborador</span>
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">Cliente</span>
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))] bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
              <History className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[hsl(var(--foreground))] truncate">
                Histórico & Detalhes do Documento
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                Auditoria de acessos e alterações realizadas por Administradores, Clientes e Colaboradores
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
            title="Fechar Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informações Resumidas do Documento */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-5 w-5 text-brand-500 shrink-0" />
                <span className="font-bold text-sm text-[hsl(var(--foreground))] truncate" title={file.name}>
                  {file.name}
                </span>
              </div>

              {isDeletedByUser ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Deletado por {deletedByName}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Arquivo Ativo</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 divide-x divide-[hsl(var(--border))]/60 text-xs pt-3 border-t border-[hsl(var(--border))]/60 text-center">
              <div className="px-2">
                <span className="text-[hsl(var(--muted-foreground))] block font-medium">Tamanho</span>
                <span className="font-bold text-sm text-[hsl(var(--foreground))] block mt-0.5">{formatBytes(file.file_size)}</span>
              </div>
              <div className="px-2">
                <span className="text-[hsl(var(--muted-foreground))] block font-medium">Categoria</span>
                <span className="font-bold text-sm text-[hsl(var(--foreground))] capitalize block mt-0.5">{file.category || 'Geral'}</span>
              </div>
              <div className="px-2">
                <span className="text-[hsl(var(--muted-foreground))] block font-medium">Criado em</span>
                <span className="font-bold text-sm text-[hsl(var(--foreground))] block mt-0.5">
                  {new Date(file.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Tabela de Eventos e Histórico de Acesso */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-500" />
                Registros de Interações
              </h4>
              <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">
                {logs.length} {logs.length === 1 ? 'evento registrado' : 'eventos registrados'}
              </span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Carregando histórico do documento...</p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-8 border border-dashed border-[hsl(var(--border))] rounded-xl text-center bg-[hsl(var(--card))]/50 space-y-2">
                <Info className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto opacity-70" />
                <p className="text-xs font-bold text-[hsl(var(--foreground))]">Nenhuma atividade registrada</p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] max-w-sm mx-auto">
                  Interações como visualizações, downloads e edições efetuadas por administradores ou clientes ficarão listadas aqui.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-[hsl(var(--border))] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[hsl(var(--border))] bg-slate-50 dark:bg-slate-900/60 text-[10px] font-extrabold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                      <th className="py-3 px-4">Data / Hora</th>
                      <th className="py-3 px-4">Usuário</th>
                      <th className="py-3 px-4">Evento / Ação</th>
                      <th className="py-3 px-4">Detalhes da Operação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[hsl(var(--border))]">
                    {logs.map((log) => {
                      const ua = parseUserAgent(log.metadata?.user_agent)
                      const userName = log.profile?.full_name || 'Usuário Desconhecido'
                      const userEmail = log.profile?.email || ''
                      const userType = log.profile?.user_type

                      return (
                        <tr key={log.id} className="hover:bg-[hsl(var(--muted))]/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[hsl(var(--foreground))] whitespace-nowrap">
                            {new Date(log.created_at).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(log.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 font-bold text-[hsl(var(--foreground))]">
                                <User className="h-3 w-3 text-slate-400 shrink-0" />
                                <span>{userName}</span>
                                {getUserBadge(userType)}
                              </div>
                              {userEmail && (
                                <span className="block text-[10px] text-[hsl(var(--muted-foreground))] font-mono">
                                  {userEmail}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {getActionBadge(log.action)}
                          </td>
                          <td className="py-3 px-4 text-[11px] text-[hsl(var(--muted-foreground))]">
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium text-[hsl(var(--foreground))]">Dispositivo: </span>
                                <span>{ua.formatted}</span>
                              </div>
                              {log.metadata?.file_name && log.metadata?.file_name !== file.name && (
                                <div>
                                  <span className="font-medium text-[hsl(var(--foreground))]">Nome no evento: </span>
                                  <span className="font-mono text-[10px]">{log.metadata.file_name}</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
