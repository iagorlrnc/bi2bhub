import { useState, useEffect, useMemo } from 'react'
import {
  ScrollText, Search, Eye, Terminal, Loader2, Download,
  Filter, X, ShieldAlert, LogIn, Edit3, Copy, Check, ChevronLeft, ChevronRight, AlertCircle, FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { parseUserAgent } from '@/lib/audit'
import { toast } from 'sonner'

export function AuditPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [actionCategoryFilter, setActionCategoryFilter] = useState<string>('all')
  const [moduleFilter, setModuleFilter] = useState<string>('all')
  const [periodFilter, setPeriodFilter] = useState<string>('all')

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  // Log Selecionado para Modal
  const [selectedLog, setSelectedLog] = useState<any | null>(null)

  const fetchLogs = async (showToast = false, isSilent = false) => {
    if (!isSilent && logs.length === 0) {
      setIsLoading(true)
    }

    try {
      const { data, error } = await supabase
        .from('atividades')
        .select('*, profile:usuarios!user_id(full_name, email, user_type), company:empresas!company_id(name)')
        .order('created_at', { ascending: false })

      if (error) throw error

      const newLogs = data || []
      setLogs(prev => {
        // Se a quantidade de itens e o ID do item mais recente forem idênticos, mantém a mesma referência para evitar piscadas
        if (prev.length === newLogs.length && prev.length > 0 && prev[0]?.id === newLogs[0]?.id) {
          return prev
        }
        return newLogs
      })

      if (showToast) toast.success('Logs de auditoria atualizados!')
    } catch (err: any) {
      console.error('Erro ao buscar logs de auditoria:', err)
      if (showToast) toast.error('Erro ao carregar logs de auditoria do banco.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(false, false)

    const handleGlobalRefresh = () => {
      fetchLogs(false, true)
    }

    window.addEventListener('bi2b:refresh-data', handleGlobalRefresh)
    return () => window.removeEventListener('bi2b:refresh-data', handleGlobalRefresh)
  }, [])

  // Classificação padronizada de Ação (LOGIN, INSERT, UPDATE, DELETE, SECURITY)
  const getActionType = (action: string): 'LOGIN' | 'INSERT' | 'UPDATE' | 'DELETE' | 'SECURITY' | 'OUTROS' => {
    const act = (action || '').toLowerCase()
    if (act.includes('login') || act.includes('auth') || act.includes('acesso')) return 'LOGIN'
    if (act.includes('delete') || act.includes('remove') || act.includes('excluir')) return 'DELETE'
    if (act.includes('update') || act.includes('edit') || act.includes('alterar') || act.includes('status')) return 'UPDATE'
    if (act.includes('create') || act.includes('upload') || act.includes('insert') || act.includes('novo')) return 'INSERT'
    if (act.includes('permissao') || act.includes('role') || act.includes('bloqueio') || act.includes('senha')) return 'SECURITY'
    return 'OUTROS'
  }

  // Filtragem Dinâmica
  const filteredLogs = useMemo(() => {
    const now = new Date()

    return logs.filter(log => {
      const user = log.profile?.full_name || 'Usuário Desconhecido'
      const email = log.profile?.email || ''
      const action = log.action || ''
      const actionType = getActionType(log.action)
      const entity = log.entity_type || ''
      const ip = log.metadata?.ip_address || ''
      const metadataStr = JSON.stringify(log.metadata || {})

      // 1. Pesquisa global por texto
      const search = searchTerm.toLowerCase()
      const matchesSearch =
        !searchTerm ||
        user.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search) ||
        action.toLowerCase().includes(search) ||
        actionType.toLowerCase().includes(search) ||
        entity.toLowerCase().includes(search) ||
        ip.toLowerCase().includes(search) ||
        metadataStr.toLowerCase().includes(search)

      // 2. Filtro por Categoria de Ação
      const matchesCategory =
        actionCategoryFilter === 'all' || actionType === actionCategoryFilter

      // 3. Filtro por Módulo / Entidade
      const matchesModule =
        moduleFilter === 'all' || entity.toLowerCase() === moduleFilter.toLowerCase()

      // 4. Filtro por Período
      let matchesPeriod = true
      if (periodFilter !== 'all') {
        const logDate = new Date(log.created_at)
        const diffDays = (now.getTime() - logDate.getTime()) / (1000 * 3600 * 24)

        if (periodFilter === 'today') {
          matchesPeriod = logDate.toDateString() === now.toDateString()
        } else if (periodFilter === '7days') {
          matchesPeriod = diffDays <= 7
        } else if (periodFilter === '30days') {
          matchesPeriod = diffDays <= 30
        }
      }

      return matchesSearch && matchesCategory && matchesModule && matchesPeriod
    })
  }, [logs, searchTerm, actionCategoryFilter, moduleFilter, periodFilter])

  // KPIs Resumo baseados nos dados filtrados/totais
  const kpis = useMemo(() => {
    const total = logs.length
    const logins = logs.filter(l => getActionType(l.action) === 'LOGIN').length
    const modifs = logs.filter(l => {
      const type = getActionType(l.action)
      return type === 'INSERT' || type === 'UPDATE'
    }).length
    const criticas = logs.filter(l => {
      const type = getActionType(l.action)
      return type === 'DELETE' || type === 'SECURITY'
    }).length

    return { total, logins, modifs, criticas }
  }, [logs])

  // Paginação
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredLogs.slice(start, start + pageSize)
  }, [filteredLogs, currentPage, pageSize])

  // Resetar página quando alterar filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, actionCategoryFilter, moduleFilter, periodFilter, pageSize])

  // Limpar Filtros
  const handleClearFilters = () => {
    setSearchTerm('')
    setActionCategoryFilter('all')
    setModuleFilter('all')
    setPeriodFilter('all')
  }

  const hasActiveFilters =
    searchTerm !== '' ||
    actionCategoryFilter !== 'all' ||
    moduleFilter !== 'all' ||
    periodFilter !== 'all'

  // Exportar para CSV
  const exportToCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error('Nenhum registro para exportar.')
      return
    }

    const headers = ['ID', 'Data/Hora', 'Usuario', 'Email', 'Acao', 'Tipo Acao', 'Modulo', 'IP', 'Metadata']
    const rows = filteredLogs.map(l => [
      l.id,
      new Date(l.created_at).toLocaleString('pt-BR'),
      `"${l.profile?.full_name || 'Desconhecido'}"`,
      `"${l.profile?.email || 'N/A'}"`,
      `"${l.action || ''}"`,
      getActionType(l.action),
      `"${l.entity_type || ''}"`,
      l.metadata?.ip_address || '127.0.0.1',
      `"${JSON.stringify(l.metadata || {}).replace(/"/g, '""')}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `auditoria_bi2b_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Relatório CSV baixado com sucesso!')
  }

  // Exportar para JSON
  const exportToJSON = () => {
    if (filteredLogs.length === 0) {
      toast.error('Nenhum registro para exportar.')
      return
    }

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(filteredLogs, null, 2))}`
    const link = document.createElement('a')
    link.setAttribute('href', jsonString)
    link.setAttribute('download', `auditoria_bi2b_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Relatório JSON baixado com sucesso!')
  }

  // Copiar Payload JSON
  const handleCopyPayload = (metadata: any) => {
    const text = JSON.stringify(metadata, null, 2)
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Payload JSON copiado para a área de transferência!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Extrair módulos únicos existentes nos logs para o select
  const uniqueModules = useMemo(() => {
    const mods = new Set<string>()
    logs.forEach(l => {
      if (l.entity_type) mods.add(l.entity_type)
    })
    return Array.from(mods)
  }, [logs])

  return (
    <div className="space-y-6">
      {/* 1. Cabeçalho Superior */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 rounded-xl shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <ScrollText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-[hsl(var(--foreground))] tracking-tight">
              Logs de Auditoria de Segurança
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
              Rastreamento de acessos, alterações de banco de dados e logs em tempo real.
            </p>
          </div>
        </div>

        {/* Botões de Ação Superior */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))] text-xs font-semibold text-[hsl(var(--foreground))] transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={exportToJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))] text-xs font-semibold text-[hsl(var(--foreground))] transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            <span>Exportar JSON</span>
          </button>
        </div>
      </div>

      {/* 2. Cards Resumo (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Total de Registros</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ScrollText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[hsl(var(--foreground))] mt-2 tracking-tight">
            {kpis.total}
          </p>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Eventos registrados no banco</p>
        </div>

        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Logins e Acessos</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <LogIn className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[hsl(var(--foreground))] mt-2 tracking-tight">
            {kpis.logins}
          </p>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Autenticações de usuários</p>
        </div>

        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Inserções & Edições</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Edit3 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[hsl(var(--foreground))] mt-2 tracking-tight">
            {kpis.modifs}
          </p>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Criações e atualizações de dados</p>
        </div>

        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">Ações Críticas / Remoções</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[hsl(var(--foreground))] mt-2 tracking-tight">
            {kpis.criticas}
          </p>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Exclusões ou alterações sensíveis</p>
        </div>
      </div>

      {/* 3. Painel de Filtros Avançados */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[hsl(var(--foreground))]">
            <Filter className="h-3.5 w-3.5 text-brand-500" />
            <span>Filtros de Pesquisa e Auditoria</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Busca por Texto */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Pesquisar por usuário, ação, IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 pl-9 pr-3 text-xs font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
            />
          </div>

          {/* Categoria de Ação */}
          <div>
            <select
              value={actionCategoryFilter}
              onChange={(e) => setActionCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 px-3 text-xs font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
            >
              <option value="all">Todas as Ações</option>
              <option value="LOGIN">Apenas Logins</option>
              <option value="INSERT">Inserções (INSERT)</option>
              <option value="UPDATE">Atualizações (UPDATE)</option>
              <option value="DELETE">Exclusões (DELETE)</option>
              <option value="SECURITY">Segurança & Permissões</option>
            </select>
          </div>

          {/* Módulo / Entidade */}
          <div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 px-3 text-xs font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
            >
              <option value="all">Todas as Tabelas</option>
              {uniqueModules.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          {/* Período */}
          <div>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 px-3 text-xs font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
            >
              <option value="all">Todo o Período</option>
              <option value="today">Hoje</option>
              <option value="7days">Últimos 7 Dias</option>
              <option value="30days">Últimos 30 Dias</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Tabela de Registros de Auditoria */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 text-[11px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                <th className="p-3.5 pl-4">Data / Hora</th>
                <th className="p-3.5">Usuário / E-mail</th>
                <th className="p-3.5">Tipo de Ação</th>
                <th className="p-3.5">Ação Real Executada</th>
                <th className="p-3.5">Tabela</th>
                <th className="p-3.5">Endereço IP</th>
                <th className="p-3.5 text-center pr-4">Dados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))] text-xs font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-[hsl(var(--muted-foreground))] font-sans">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
                      <span>Carregando logs de auditoria...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => {
                  const type = getActionType(log.action)
                  const userName = log.profile?.full_name || 'Desconhecido'
                  const userEmail = log.profile?.email || ''

                  return (
                    <tr key={log.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                      {/* Data / Hora */}
                      <td className="p-3.5 pl-4 font-sans text-xs text-[hsl(var(--foreground))] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </td>

                      {/* Usuário / E-mail */}
                      <td className="p-3.5 font-sans">
                        <div className="flex flex-col">
                          <span className="font-bold text-[hsl(var(--foreground))] truncate max-w-[180px]">
                            {userName}
                          </span>
                          {userEmail && (
                            <span className="text-[10px] text-[hsl(var(--muted-foreground))] truncate max-w-[180px]">
                              {userEmail}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tipo de Ação com Badge Colorido */}
                      <td className="p-3.5 font-sans">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border',
                            type === 'INSERT' && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
                            type === 'UPDATE' && 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
                            type === 'DELETE' && 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
                            type === 'LOGIN' && 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
                            type === 'SECURITY' && 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
                            type === 'OUTROS' && 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20'
                          )}
                        >
                          {type}
                        </span>
                      </td>

                      {/* Ação Real */}
                      <td className="p-3.5 font-sans text-[hsl(var(--foreground))] font-medium truncate max-w-[160px]">
                        {log.action}
                      </td>

                      {/* Módulo / Tabela & Origem */}
                      <td className="p-3.5 font-sans">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[hsl(var(--muted-foreground))] truncate max-w-[140px]">
                            {log.entity_type || 'geral'}
                          </span>
                          <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 truncate max-w-[140px]">
                            {log.metadata?.origin || (log.profile?.user_type === 'admin' || log.profile?.user_type === 'staff' ? 'Painel Admin' : 'Painel do Cliente')}
                          </span>
                        </div>
                      </td>

                      {/* IP & Navegador/Dispositivo */}
                      <td className="p-3.5 font-sans">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[hsl(var(--foreground))] truncate max-w-[200px]">
                            {log.metadata?.browser_info || parseUserAgent(log.metadata?.user_agent).formatted}
                          </span>
                          <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                            IP: {log.metadata?.ip_address || '127.0.0.1'}
                          </span>
                        </div>
                      </td>

                      {/* Visualizar Payload */}
                      <td className="p-3.5 pr-4 text-center font-sans">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                          title="Ver metadados do evento"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                /* Estado Vazio Real - Conforme regras da LGPD/Plano (Sem Dados Fictícios) */
                <tr>
                  <td colSpan={7} className="p-12 text-center font-sans">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                      <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-sm text-[hsl(var(--foreground))]">
                        Nenhum registro de auditoria encontrado
                      </h3>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                        {hasActiveFilters
                          ? 'Nenhum evento corresponde aos filtros selecionados. Tente ajustar os termos da busca.'
                          : 'Ainda não existem registros gravados no banco de dados. As ações dos usuários aparecerão aqui automaticamente conforme forem realizadas no sistema.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleClearFilters}
                          className="mt-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          Limpar filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {filteredLogs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 text-xs font-sans text-[hsl(var(--muted-foreground))]">
            <div className="flex items-center gap-2">
              <span>Exibindo</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-1 px-2 text-xs font-semibold text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-2xs"
              >
                <option value={10}>10 por página</option>
                <option value={15}>15 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
              </select>
              <span>de {filteredLogs.length} registros</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="mr-2">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Modal de Detalhes do Payload JSON */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-[hsl(var(--foreground))]">
                    Metadados do Evento
                  </h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] font-mono">
                    ID: {selectedLog.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Informações Gerais Estruturadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs font-sans">
              <div className="p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <span className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))]">Usuário Autor</span>
                <p className="font-bold text-[hsl(var(--foreground))] mt-0.5">
                  {selectedLog.profile?.full_name || 'Desconhecido'}
                </p>
                {selectedLog.profile?.email && (
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{selectedLog.profile.email}</p>
                )}
              </div>

              <div className="p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <span className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))]">Data e Hora</span>
                <p className="font-bold text-[hsl(var(--foreground))] mt-0.5">
                  {new Date(selectedLog.created_at).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <span className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))]">Ação & Módulo</span>
                <p className="font-bold text-[hsl(var(--foreground))] mt-0.5">
                  {selectedLog.action} <span className="text-[hsl(var(--muted-foreground))] font-normal">({selectedLog.entity_type})</span>
                </p>
                <p className="text-[11px] font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                  Origem: {selectedLog.metadata?.origin || (selectedLog.profile?.user_type === 'admin' || selectedLog.profile?.user_type === 'staff' ? 'Painel Admin' : 'Painel do Cliente')}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <span className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))]">Navegador & Dispositivo</span>
                <p className="font-bold text-[hsl(var(--foreground))] mt-0.5">
                  {selectedLog.metadata?.browser_info || parseUserAgent(selectedLog.metadata?.user_agent).formatted}
                </p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] font-mono mt-0.5">
                  IP: {selectedLog.metadata?.ip_address || '127.0.0.1'}
                </p>
              </div>
            </div>

            {/* Visualizador de JSON com Botão Copiar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[hsl(var(--foreground))]">Estrutura JSON Completa</span>
                <button
                  type="button"
                  onClick={() => handleCopyPayload(selectedLog.metadata)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
                </button>
              </div>

              <div className="rounded-xl bg-gray-950 p-4 text-xs font-mono text-emerald-400 max-h-[320px] overflow-auto shadow-inner border border-gray-800">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="mt-5 pt-3 border-t border-[hsl(var(--border))] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 text-[hsl(var(--foreground))] text-xs font-bold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
