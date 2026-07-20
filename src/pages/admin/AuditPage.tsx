import { useState, useEffect } from 'react'
import { ScrollText, Search, Eye, Terminal, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function AuditPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLog, setSelectedLog] = useState<any | null>(null)

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('atividades')
        .select('*, profile:usuarios!user_id(full_name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setLogs(data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erro ao buscar logs de auditoria.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const getActionLabel = (action: string) => {
    const act = (action || '').toLowerCase()
    if (act.includes('login')) return 'LOGIN'
    if (act.includes('delete') || act.includes('remove')) return 'DELETE'
    if (act.includes('update') || act.includes('edit')) return 'UPDATE'
    if (act.includes('create') || act.includes('upload') || act.includes('insert')) return 'INSERT'
    return action.toUpperCase()
  }

  const filteredLogs = logs.filter(log => {
    const user = log.profile?.full_name || 'Desconhecido'
    const action = getActionLabel(log.action)
    const table = log.entity_type || ''
    
    return user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      action.includes(searchTerm.toUpperCase()) || 
      table.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <ScrollText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Logs de Auditoria de Segurança</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Rastreamento de acessos de usuários, modificações de banco de dados e logs de auditorias RLS</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Pesquisar logs por usuário, ação (ex: UPDATE) ou tabela..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Lista de Logs (Tabela) */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Usuário</th>
                <th className="p-4">Ação Real</th>
                <th className="p-4">Tipo de Ação</th>
                <th className="p-4">Tabela/Módulo</th>
                <th className="p-4">IP de Acesso</th>
                <th className="p-4 text-center">Dados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))] text-sm font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                      <span>Carregando logs de auditoria...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map(log => {
                  const mappedAction = getActionLabel(log.action)
                  return (
                    <tr key={log.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                      <td className="p-4 text-xs text-[hsl(var(--muted-foreground))] font-sans">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-4 font-sans font-semibold text-[hsl(var(--foreground))]">
                        {log.profile?.full_name || 'Desconhecido'}
                      </td>
                      <td className="p-4 text-xs text-[hsl(var(--muted-foreground))]">{log.action}</td>
                      <td className="p-4">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-semibold uppercase',
                          mappedAction === 'INSERT' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20',
                          mappedAction === 'UPDATE' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/20',
                          mappedAction === 'DELETE' && 'bg-rose-100 text-rose-700 dark:bg-rose-950/20',
                          mappedAction === 'LOGIN' && 'bg-blue-100 text-blue-700 dark:bg-blue-950/20'
                        )}>
                          {mappedAction}
                        </span>
                      </td>
                      <td className="p-4 text-[hsl(var(--muted-foreground))]">{log.entity_type}</td>
                      <td className="p-4 text-xs text-[hsl(var(--muted-foreground))]">
                        {log.metadata?.ip_address || '127.0.0.1'}
                      </td>
                      <td className="p-4 text-center font-sans">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
                          title="Ver payload de dados"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))] font-sans">
                    Nenhum log de auditoria encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal com Detalhes do Payload */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4 border-b border-[hsl(var(--border))] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-brand-500" />
                <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Payload de Alteração</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1.5 hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-4 text-sm font-mono bg-black text-emerald-400 p-4 rounded-xl max-h-[400px] overflow-auto">
              <div>
                <p className="text-gray-400 text-xs border-b border-gray-800 pb-1 uppercase font-sans">Informações Gerais</p>
                <p className="mt-1">ID do Registro: {selectedLog.entity_id || 'N/A'}</p>
                <p>Navegador (User-Agent): {selectedLog.metadata?.user_agent || 'N/A'}</p>
              </div>

              {selectedLog.metadata && (
                <div>
                  <p className="text-gray-400 text-xs border-b border-gray-800 pb-1 uppercase font-sans">Payload Metadata Completo</p>
                  <pre className="mt-1 text-xs whitespace-pre-wrap">{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
