import { useState, useEffect } from 'react'
import {
  Wallet,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  QrCode,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  Eye,
  ChevronRight,
  BadgeCheck,
  Printer,
  Send,
  X,
  FileCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { financeService } from '@/lib/financeService'
import type { Cobranca, PlanoEmpresa, FinancialSummary } from '@/types/finance'
import { PaymentModal } from '@/components/finance/PaymentModal'
import { FilePreviewModal, type PreviewFile } from '@/components/FilePreviewModal'
import { cn } from '@/lib/utils'

export function FinancePage() {
  const { user, profile, company, companyUser } = useAuth()
  const companyId = profile?.company_id || company?.id || companyUser?.company_id || ''
  const companyName = company?.trade_name || company?.name || 'Empresa Cliente'

  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [plano, setPlano] = useState<PlanoEmpresa | null>(null)
  const [summary, setSummary] = useState<FinancialSummary | null>(null)

  // Filtros
  const [activeTab, setActiveTab] = useState<'cobrancas' | 'plano' | 'historico'>('cobrancas')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [typeFilter, setTypeFilter] = useState<string>('todos')

  // Modais
  const [selectedCobranca, setSelectedCobranca] = useState<Cobranca | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null)

  // Modais extras para Plano e Recibo
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [selectedPlanOption, setSelectedPlanOption] = useState('Pró')
  const [planNotes, setPlanNotes] = useState('')
  const [isSubmittingPlanReq, setIsSubmittingPlanReq] = useState(false)
  const [selectedReceiptCobranca, setSelectedReceiptCobranca] = useState<Cobranca | null>(null)
  const [historySearchQuery, setHistorySearchQuery] = useState('')

  const loadData = async () => {
    try {
      let targetCompanyId = profile?.company_id || company?.id || companyUser?.company_id
      if (!targetCompanyId && user?.id) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('company_id')
          .eq('id', user.id)
          .maybeSingle()

        if (userData?.company_id) {
          targetCompanyId = userData.company_id
        }
      }

      if (!targetCompanyId) return

      const allCobrancas = await financeService.getCobrancas(targetCompanyId)
      const currentPlan = await financeService.getCompanyPlan(targetCompanyId)
      const currentSummary = financeService.getSummary(allCobrancas, currentPlan?.monthly_amount || 0)

      setCobrancas(allCobrancas)
      setPlano(currentPlan)
      setSummary(currentSummary)
    } catch (err) {
      console.error('Erro ao carregar dados financeiros:', err)
    }
  }

  useEffect(() => {
    loadData()

    const handleUpdate = () => loadData()
    window.addEventListener('bi2b_finance_updated', handleUpdate)

    // Polling automático de segurança a cada 1 segundo
    const interval = setInterval(() => {
      loadData()
    }, 1000)

    // Inscrição em tempo real no Supabase Postgres Changes
    const channel = supabase
      .channel(`client_finance_realtime_${user?.id || 'client'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'planos_empresa' },
        () => loadData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cobrancas' },
        () => loadData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'empresas' },
        () => loadData()
      )
      .subscribe()

    return () => {
      window.removeEventListener('bi2b_finance_updated', handleUpdate)
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, company, companyUser])

  const handleSendPlanRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingPlanReq(true)
    try {
      if (companyId) {
        await financeService.requestPlanChange({
          companyId,
          companyName,
          currentPlan: plano?.plan_name || 'Básico',
          requestedPlan: selectedPlanOption,
          notes: planNotes,
          userId: user?.id,
        })
      }
      toast.success(`Solicitação enviada ao escritório! Seu contador entrará em contato para confirmar a migração para o Plano ${selectedPlanOption}.`)
      setIsPlanModalOpen(false)
      setPlanNotes('')
    } catch (err) {
      console.error('Erro ao solicitar plano:', err)
      toast.error('Erro ao registrar solicitação de plano.')
    } finally {
      setIsSubmittingPlanReq(false)
    }
  }

  // Filtragem de cobranças
  const filteredCobrancas = cobrancas.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reference_period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === 'todos'
        ? true
        : statusFilter === 'pendentes'
        ? item.status === 'pendente' || item.status === 'atrasado' || item.status === 'em_processamento'
        : item.status === statusFilter

    const matchesType = typeFilter === 'todos' ? true : item.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Formatadores
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    } catch {
      return dateStr
    }
  }

  const getStatusBadge = (status: Cobranca['status'], receiptStatus?: Cobranca['receipt_status']) => {
    if (status === 'em_processamento' || receiptStatus === 'pendente_aprovacao') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <Clock className="h-3.5 w-3.5 animate-spin" /> Aguardando Validação
        </span>
      )
    }

    switch (status) {
      case 'pago':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Pago
          </span>
        )
      case 'atrasado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-3.5 w-3.5" /> Atrasado
          </span>
        )
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="h-3.5 w-3.5" /> Pendente
          </span>
        )
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-500 border border-gray-500/20">
            Cancelado
          </span>
        )
    }
  }

  const getTypeLabel = (type: Cobranca['type']) => {
    switch (type) {
      case 'plano':
        return 'Mensalidade do Plano'
      case 'honorarios':
        return 'Honorários Contábeis'
      case 'servico_extra':
        return 'Serviço Avulso'
      case 'imposto_taxa':
        return 'Impostos / Taxas'
      default:
        return 'Outros'
    }
  }

  const handleOpenPayment = (item: Cobranca) => {
    setSelectedCobranca(item)
    setIsPaymentModalOpen(true)
  }

  // Próxima cobrança pendente para destaque
  const nextPending = cobrancas.find(
    (c) => c.status === 'pendente' || c.status === 'atrasado'
  )

  // Plano ativo corrente ou fallback
  const activePlan = plano || {
    plan_name: 'Pró',
    monthly_amount: 850.00,
    due_day: 10,
    status: 'ativo',
    auto_generate: true,
  }

  // Cobranças pagas para o Histórico
  const paidCobrancas = cobrancas.filter((c) => c.status === 'pago')
  const filteredPaidCobrancas = paidCobrancas.filter(
    (c) =>
      c.title.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      c.reference_period.toLowerCase().includes(historySearchQuery.toLowerCase())
  )

  const totalPaidSum = paidCobrancas.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2.5">
          <Wallet className="h-7 w-7 text-brand-500 dark:text-cyan-400" />
          Finanças & Pagamentos
        </h1>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
          Gerencie o pagamento do plano contábil, fatura mensal e cobranças avulsas da sua empresa.
        </p>
      </div>

      {/* Hero Banner do Plano Mensal */}
      <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#0d6084]/20 text-[#0d6084] dark:bg-cyan-400/20 dark:text-cyan-300 border border-[#0d6084]/30">
              Plano Ativo • {activePlan.plan_name}
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[hsl(var(--foreground))]">
              {companyName}
            </h2>
            <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">
              Mensalidade de <strong>{formatCurrency(activePlan.monthly_amount)}</strong> com vencimento todo dia <strong>{activePlan.due_day}</strong>.
            </p>
          </div>

          {nextPending ? (
            <div className="bg-[hsl(var(--card))]/90 backdrop-blur border border-[hsl(var(--border))] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 min-w-[260px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  Próxima Fatura
                </span>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">Vence: {formatDate(nextPending.due_date)}</span>
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{nextPending.title}</p>
                <p className="font-heading text-xl font-black text-[#0d6084] dark:text-cyan-400">
                  {formatCurrency(nextPending.amount)}
                </p>
              </div>
              <button
                onClick={() => handleOpenPayment(nextPending)}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="h-4 w-4" /> Pagar Fatura Atual
              </button>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 shrink-0" />
              <div>
                <p className="font-bold text-sm">Todas as faturas estão em dia!</p>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Sua empresa está 100% em conformidade financeira com a contabilidade.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Financeiros */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[hsl(var(--muted-foreground))]">
              <span className="text-xs font-semibold uppercase">Mensalidade</span>
              <DollarSign className="h-4 w-4 text-[#0d6084] dark:text-cyan-400" />
            </div>
            <p className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">
              {formatCurrency(activePlan.monthly_amount)}
            </p>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))]">Plano {activePlan.plan_name}</p>
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[hsl(var(--muted-foreground))]">
              <span className="text-xs font-semibold uppercase">Pendentes</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="font-heading text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(summary.totalPending)}
            </p>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{summary.countPending} fatura(s) pendente(s)</p>
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[hsl(var(--muted-foreground))]">
              <span className="text-xs font-semibold uppercase">Atrasadas</span>
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            <p className="font-heading text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(summary.totalOverdue)}
            </p>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{summary.countOverdue} fatura(s) em atraso</p>
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-[hsl(var(--muted-foreground))]">
              <span className="text-xs font-semibold uppercase">Total Pago</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(summary.totalPaid)}
            </p>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{summary.countPaid} fatura(s) quitada(s)</p>
          </div>
        </div>
      )}

      {/* Navegação por Abas */}
      <div className="border-b border-[hsl(var(--border))] flex gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('cobrancas')}
          className={cn(
            "pb-3 border-b-2 transition-all flex items-center gap-2 text-xs sm:text-sm",
            activeTab === 'cobrancas'
              ? "border-[#0d6084] text-[#0d6084] dark:border-cyan-400 dark:text-cyan-400 font-bold"
              : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          <FileText className="h-4 w-4" />
          Minhas Cobranças & Faturas
        </button>
        <button
          onClick={() => setActiveTab('plano')}
          className={cn(
            "pb-3 border-b-2 transition-all flex items-center gap-2 text-xs sm:text-sm",
            activeTab === 'plano'
              ? "border-[#0d6084] text-[#0d6084] dark:border-cyan-400 dark:text-cyan-400 font-bold"
              : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          <BadgeCheck className="h-4 w-4" />
          Meu Plano
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={cn(
            "pb-3 border-b-2 transition-all flex items-center gap-2 text-xs sm:text-sm",
            activeTab === 'historico'
              ? "border-[#0d6084] text-[#0d6084] dark:border-cyan-400 dark:text-cyan-400 font-bold"
              : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          <Clock className="h-4 w-4" />
          Histórico de Pagamentos
        </button>
      </div>

      {/* ABA 1: COBRANÇAS & FATURAS */}
      {activeTab === 'cobrancas' && (
        <div className="space-y-4">
          {/* Barra de Filtro e Busca */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Buscar por referência, título ou valor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-xl pl-9 pr-4 py-2 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[#0d6084]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] font-medium">
                <Filter className="h-3.5 w-3.5" /> Status:
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-xl px-3 py-1.5 text-xs font-semibold text-[hsl(var(--foreground))]"
              >
                <option value="todos">Todos os Status</option>
                <option value="pendentes">Pendentes / Atrasados</option>
                <option value="pago">Pagos</option>
                <option value="em_processamento">Aguardando Validação</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-xl px-3 py-1.5 text-xs font-semibold text-[hsl(var(--foreground))]"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="plano">Mensalidade do Plano</option>
                <option value="honorarios">Honorários</option>
                <option value="servico_extra">Serviços Avulsos</option>
              </select>
            </div>
          </div>

          {/* Lista de Cobranças */}
          {filteredCobrancas.length === 0 ? (
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-12 text-center text-[hsl(var(--muted-foreground))]">
              <FileText className="mx-auto h-12 w-12 opacity-30 mb-3" />
              <p className="font-semibold text-sm">Nenhuma cobrança encontrada.</p>
              <p className="text-xs mt-1">Tente ajustar os filtros de busca acima.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredCobrancas.map((item) => {
                const isOverdue = item.status === 'atrasado'
                const isPending = item.status === 'pendente' || isOverdue

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "group rounded-2xl border bg-[hsl(var(--card))] p-5 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4",
                      isOverdue
                        ? "border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/10"
                        : "border-[hsl(var(--border))]"
                    )}
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                          {getTypeLabel(item.type)}
                        </span>
                        <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
                          Ref: {item.reference_period}
                        </span>
                        {getStatusBadge(item.status, item.receipt_status)}
                      </div>
                      <h3 className="font-heading text-base font-bold text-[hsl(var(--foreground))] group-hover:text-[#0d6084] dark:group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 pt-1 text-xs text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          Vencimento: <strong className={cn("text-[hsl(var(--foreground))]", isOverdue && "text-rose-600 dark:text-rose-400")}>{formatDate(item.due_date)}</strong>
                        </span>
                        {item.paid_at && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Pago em: {new Date(item.paid_at).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 border-[hsl(var(--border))] pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] uppercase font-semibold text-[hsl(var(--muted-foreground))] block">Valor</span>
                        <span className="font-heading text-xl font-extrabold text-[#0d6084] dark:text-cyan-400">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>

                      {isPending ? (
                        <button
                          onClick={() => handleOpenPayment(item)}
                          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                        >
                          <QrCode className="h-4 w-4" /> Pagar Agora
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (item.receipt_url) {
                              setPreviewFile({
                                name: item.receipt_name || 'Comprovante.pdf',
                                filePath: item.receipt_url,
                                bucket: 'documents'
                              })
                            } else {
                              setSelectedReceiptCobranca(item)
                            }
                          }}
                          className="w-full sm:w-auto px-3.5 py-2 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 text-[hsl(var(--foreground))] font-semibold text-xs rounded-xl border border-[hsl(var(--border))] flex items-center justify-center gap-2 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" /> Ver Recibo / Detalhes
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: MEU PLANO CONTÁBIL */}
      {activeTab === 'plano' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">
                  Visão Geral do Seu Plano Ativo
                </h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Detalhes do plano contábil da sua empresa com a Bi2B
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Plano {activePlan.plan_name} • Ativo
                </span>
                <button
                  onClick={() => setIsPlanModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#0d6084] hover:bg-[#0b4d6a] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                >
                  Alterar Plano <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-[hsl(var(--border))] pb-5">
              <div className="p-4 rounded-xl bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border))] space-y-1">
                <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Valor Mensal</span>
                <p className="font-heading text-2xl font-extrabold text-[#0d6084] dark:text-cyan-400">
                  {formatCurrency(activePlan.monthly_amount)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border))] space-y-1">
                <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Vencimento Fixo</span>
                <p className="font-heading text-xl font-bold text-[hsl(var(--foreground))]">
                  Todo dia {activePlan.due_day}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border))] space-y-1">
                <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Recorrência</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="h-4 w-4" /> Automática
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-heading text-sm font-bold text-[hsl(var(--foreground))]">
                Recursos e Coberturas Inclusas no Plano {activePlan.plan_name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  'Emissão e envio de Guias de Impostos (DAS, FGTS, INSS, IR)',
                  'Escrituração Contábil, Fiscal e Societária completa',
                  'Elaboração de Balancetes e Demonstração do Resultado (DRE)',
                  'Gestão e guarda de documentos ilimitados no Drive Seguro',
                  'Suporte prioritário via Chamados da plataforma',
                  'Folha de Pagamento para Sócios (Pró-Labore)',
                  'Atendimento dedicado de contador responsável',
                  'Relatórios mensais de conformidade fiscal e tributária',
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[hsl(var(--muted))]/40 border border-[hsl(var(--border))]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-[hsl(var(--foreground))]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: HISTÓRICO DE PAGAMENTOS */}
      {activeTab === 'historico' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Total Quitado Acumulado</span>
              <p className="font-heading text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalPaidSum)}
              </p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">Faturas pagas com sucesso</p>
            </div>

            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Qtd de Comprovantes</span>
              <p className="font-heading text-2xl font-extrabold text-[hsl(var(--foreground))]">
                {paidCobrancas.length} faturas
              </p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">Registros consolidados no sistema</p>
            </div>

            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Status Financeiro</span>
              <p className="font-heading text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-5 w-5" /> Adimplente
              </p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">Nenhuma pendência financeira pendente</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[hsl(var(--border))] pb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-[hsl(var(--foreground))]">Histórico Consolidado de Quitações</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Registro oficial de todas as faturas e cobranças pagas pela sua empresa</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Filtrar por período ou título..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[hsl(var(--foreground))]"
                />
              </div>
            </div>

            {filteredPaidCobrancas.length === 0 ? (
              <div className="p-8 text-center text-[hsl(var(--muted-foreground))] space-y-2">
                <FileCheck className="mx-auto h-10 w-10 opacity-30" />
                <p className="text-xs font-semibold">Nenhum registro de quitação no filtro selecionado.</p>
              </div>
            ) : (
              <div className="divide-y divide-[hsl(var(--border))]">
                {filteredPaidCobrancas.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[hsl(var(--foreground))]">{item.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {item.payment_method?.toUpperCase() || 'PIX'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                        Ref: <strong>{item.reference_period}</strong> • Pago em: <strong>{item.paid_at ? new Date(item.paid_at).toLocaleDateString('pt-BR') : formatDate(item.due_date)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase block font-semibold">Valor Pago</span>
                        <span className="font-heading text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          if (item.receipt_url) {
                            setPreviewFile({
                              name: item.receipt_name || 'Comprovante_Pagamento.pdf',
                              filePath: item.receipt_url,
                              bucket: 'documents'
                            })
                          } else {
                            setSelectedReceiptCobranca(item)
                          }
                        }}
                        className="px-3 py-2 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] font-semibold text-xs rounded-xl border border-[hsl(var(--border))] flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Printer className="h-3.5 w-3.5 text-[#0d6084] dark:text-cyan-400" /> Ver Recibo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Pagamento Interativo */}
      {selectedCobranca && (
        <PaymentModal
          cobranca={selectedCobranca}
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedCobranca(null)
          }}
          onSuccess={() => {
            loadData()
          }}
        />
      )}

      {/* Modal de Pré-visualização de Arquivos */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {/* MODAL: SOLICITAR ALTERAÇÃO DE PLANO */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl space-y-4 text-[hsl(var(--foreground))]">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
              <h3 className="font-heading text-lg font-bold flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-[#0d6084] dark:text-cyan-400" />
                Alterar Plano Contábil
              </h3>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendPlanRequest} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Selecione o Plano Desejado</label>
                <select
                  value={selectedPlanOption}
                  onChange={(e) => setSelectedPlanOption(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="Básico">Plano Básico</option>
                  <option value="Pró">Plano Pró</option>
                  <option value="Plus">Plano Plus</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Observações ou Necessidades Especiais</label>
                <textarea
                  rows={3}
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  placeholder="Ex: Gostaria de incluir emissão de folha de mais 2 funcionários..."
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl p-3 text-xs focus:outline-none focus:border-[#0d6084]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPlanReq}
                  className="px-4 py-2 bg-[#0d6084] hover:bg-[#0b4d6a] text-white font-bold rounded-xl shadow flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmittingPlanReq ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECIBO DIGITAL OFICIAL */}
      {selectedReceiptCobranca && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl space-y-5 text-[hsl(var(--foreground))]">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                <div>
                  <h3 className="font-heading text-base font-bold">Recibo Digital de Quitação</h3>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Bi2B Consultoria & Assessoria Contábil</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceiptCobranca(null)}
                className="p-1 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border))] space-y-3 text-xs leading-relaxed">
              <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-2 text-[11px]">
                <span className="font-bold text-[hsl(var(--muted-foreground))]">RECIBO Nº: REC-{selectedReceiptCobranca.id.slice(0, 8).toUpperCase()}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">QUITAÇÃO CONFIRMADA</span>
              </div>

              <p>
                Declaramos que recebemos de <strong>{companyName}</strong> a quantia de{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedReceiptCobranca.amount)}</strong> referente a{' '}
                <strong>{selectedReceiptCobranca.title}</strong> (Competência {selectedReceiptCobranca.reference_period}).
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]">
                <div>Forma: <strong className="text-[hsl(var(--foreground))]">{selectedReceiptCobranca.payment_method?.toUpperCase() || 'PIX'}</strong></div>
                <div>Data Pagamento: <strong className="text-[hsl(var(--foreground))]">{selectedReceiptCobranca.paid_at ? new Date(selectedReceiptCobranca.paid_at).toLocaleDateString('pt-BR') : formatDate(selectedReceiptCobranca.due_date)}</strong></div>
                <div className="col-span-2">Aprovado Por: <strong className="text-[#0d6084] dark:text-cyan-400 font-bold">{selectedReceiptCobranca.approved_by_name || 'Equipe Contábil Bi2B'}</strong></div>
                <div className="col-span-2 truncate">ID Transação: <strong className="text-[hsl(var(--foreground))]">{selectedReceiptCobranca.id}</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  window.print()
                }}
                className="px-4 py-2 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] font-bold text-xs rounded-xl border border-[hsl(var(--border))] flex items-center gap-2 transition-all shadow-sm"
              >
                <Printer className="h-4 w-4" /> Imprimir Recibo
              </button>

              <button
                onClick={() => setSelectedReceiptCobranca(null)}
                className="px-5 py-2 bg-[#0d6084] hover:bg-[#0b4d6a] text-white font-bold text-xs rounded-xl shadow transition-all"
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
