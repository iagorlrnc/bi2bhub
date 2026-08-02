import { useState, useEffect } from 'react'
import {
  Wallet,
  DollarSign,
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Bell,
  Eye,
  FileCheck,
  Trash2,
  X,
  Loader2,
  Check,
  Send,
  ChevronRight,
  ArrowRight,
  Filter,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { financeService } from '@/lib/financeService'
import type { Cobranca, PlanoEmpresa, FinancialSummary, CobrancaType, SolicitacaoPlano } from '@/types/finance'
import { FilePreviewModal, type PreviewFile } from '@/components/FilePreviewModal'
import { cn, isBi2bCompany } from '@/lib/utils'

export function AdminFinancePage() {
  const { user, profile } = useAuth()
  const [companies, setCompanies] = useState<any[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all')

  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [planosMap, setPlanosMap] = useState<Record<string, PlanoEmpresa>>({})
  const [planRequests, setPlanRequests] = useState<SolicitacaoPlano[]>([])
  const [summary, setSummary] = useState<FinancialSummary | null>(null)

  // Filtros
  const [activeTab, setActiveTab] = useState<'cobrancas' | 'planos' | 'comprovantes' | 'solicitacoes'>('cobrancas')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [typeFilter, setTypeFilter] = useState<string>('todos')
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('todos')

  // Modais
  const [isNewChargeModalOpen, setIsNewChargeModalOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null)
  const [editingPlanCompany, setEditingPlanCompany] = useState<any | null>(null)

  // Formulário de Nova Cobrança
  const [newCompanyId, setNewCompanyId] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<CobrancaType>('honorarios')
  const [newAmount, setNewAmount] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newRefPeriod, setNewRefPeriod] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newSendNotif, setNewSendNotif] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Formulário de Edição de Plano
  const [planName, setPlanName] = useState('Pró')
  const [planAmount, setPlanAmount] = useState('850.00')
  const [planDueDay, setPlanDueDay] = useState('10')

  // Buscar empresas do Supabase
  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, name, trade_name, cnpj, plan, is_active')
        .eq('is_active', true)
        .order('name')

      if (!error && data) {
        const filtered = data.filter((c) => !isBi2bCompany(c))
        setCompanies(filtered)
        if (filtered.length > 0 && !newCompanyId) {
          setNewCompanyId(filtered[0].id)
        }
      }
    } catch (err) {
      console.error('Erro ao buscar empresas:', err)
    }
  }

  // Carregar dados de cobrança e solicitações de plano
  const loadData = async () => {
    try {
      const list = await financeService.getCobrancas(selectedCompanyId)
      const requests = await financeService.getPlanRequests(selectedCompanyId)
      setPlanRequests(requests)

      // Buscar todos os planos cadastrados no Supabase em uma única consulta
      const { data: allPlans } = await supabase
        .from('planos_empresa')
        .select('*, empresas(id, name, trade_name, plan)')

      const map: Record<string, PlanoEmpresa> = {}
      if (allPlans) {
        for (const p of allPlans) {
          if (p.company_id && !isBi2bCompany(p.empresas)) {
            map[p.company_id] = {
              company_id: p.company_id,
              company_name: p.empresas?.trade_name || p.empresas?.name || 'Empresa Cliente',
              plan_name: p.plan_name || 'Básico',
              monthly_amount: Number(p.monthly_amount) || 0,
              due_day: Number(p.due_day) || 10,
              status: p.status || 'ativo',
              auto_generate: p.auto_generate ?? true,
              updated_at: p.updated_at || new Date().toISOString(),
            }
          }
        }
      }
      setPlanosMap(map)

      const activePlanAmount =
        selectedCompanyId !== 'all'
          ? map[selectedCompanyId]?.monthly_amount || 0
          : Object.values(map).reduce((sum, p) => sum + (p.monthly_amount || 0), 0)

      const sum = financeService.getSummary(list, activePlanAmount)
      setCobrancas(list)
      setSummary(sum)
    } catch (err) {
      console.error('Erro ao carregar cobranças:', err)
    }
  }

  useEffect(() => {
    fetchCompanies()
    loadData()

    const handleUpdate = () => loadData()
    window.addEventListener('bi2b_finance_updated', handleUpdate)

    // Polling automático de segurança a cada 1 segundo
    const interval = setInterval(() => {
      loadData()
    }, 1000)

    // Inscrição em tempo real no Supabase Postgres Changes
    const channel = supabase
      .channel('admin_finance_realtime')
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
  }, [selectedCompanyId])

  // Filtragem de cobranças
  const filteredCobrancas = cobrancas.filter((item: Cobranca) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.company_name && item.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.reference_period.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'todos'
        ? true
        : statusFilter === 'pendentes'
        ? item.status === 'pendente' || item.status === 'atrasado'
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

  // Criar nova cobrança
  const handleCreateCharge = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompanyId || !newTitle || !newAmount || !newDueDate || !newRefPeriod) {
      toast.error('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const numAmount = parseFloat(newAmount.replace(',', '.'))
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Informe um valor numérico válido.')
      return
    }

    setIsSubmitting(true)
    try {
      const comp = companies.find((c: any) => c.id === newCompanyId)
      const compName = comp?.trade_name || comp?.name || 'Empresa Cliente'

      await financeService.createCharge(
        {
          company_id: newCompanyId,
          title: newTitle,
          type: newType,
          amount: numAmount,
          due_date: newDueDate,
          reference_period: newRefPeriod,
          description: newDescription,
          send_notification: newSendNotif,
        },
        compName,
        user?.id
      )

      toast.success('Cobrança gerada e enviada com sucesso!')
      setIsNewChargeModalOpen(false)
      setNewTitle('')
      setNewAmount('')
      setNewDescription('')
      loadData()
    } catch (err) {
      console.error('Erro ao criar cobrança:', err)
      toast.error('Erro ao gerar cobrança.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Dar baixa manual
  const handleMarkAsPaid = async (charge: Cobranca) => {
    try {
      let approverName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name
      if (!approverName && user?.id) {
        const { data: uData } = await supabase.from('usuarios').select('full_name, email').eq('id', user.id).maybeSingle()
        approverName = uData?.full_name || uData?.email
      }
      approverName = approverName || user?.email || 'Administrador Bi2B'

      await financeService.updateStatus(charge.id, 'pago', {
        paymentMethod: 'manual',
        receiptStatus: 'aprovado',
        notes: 'Baixa efetuada manualmente pelo escritório admin.',
        userId: user?.id,
        approverName,
      })
      toast.success(`Baixa efetuada na cobrança "${charge.title}"!`)
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao dar baixa na cobrança.')
    }
  }

  // Enviar lembrete
  const handleSendReminder = async (charge: Cobranca) => {
    try {
      await financeService.sendReminder(charge.id, user?.id)
      toast.success(`Lembrete de cobrança enviado para os usuários de ${charge.company_name}!`)
    } catch (err) {
      console.error(err)
      toast.error('Erro ao enviar lembrete.')
    }
  }

  // Aprovar comprovante
  const handleApproveReceipt = async (charge: Cobranca) => {
    try {
      let approverName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name
      if (!approverName && user?.id) {
        const { data: uData } = await supabase.from('usuarios').select('full_name, email').eq('id', user.id).maybeSingle()
        approverName = uData?.full_name || uData?.email
      }
      approverName = approverName || user?.email || 'Administrador Bi2B'

      await financeService.reviewReceipt(charge.id, true, 'Comprovante validado pelo escritório.', user?.id, approverName)
      toast.success('Comprovante aprovado! Pagamento confirmado.')
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao aprovar comprovante.')
    }
  }

  // Rejeitar comprovante
  const handleRejectReceipt = async (charge: Cobranca) => {
    try {
      await financeService.reviewReceipt(charge.id, false, 'Comprovante inconsistente ou ilegível.', user?.id)
      toast.warning('Comprovante rejeitado. Cliente notificado para reenviar.')
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao rejeitar comprovante.')
    }
  }

  // Excluir cobrança
  const handleDeleteCharge = async (charge: Cobranca) => {
    if (!confirm(`Deseja realmente excluir a cobrança "${charge.title}"?`)) return
    try {
      await financeService.deleteCharge(charge.id, user?.id)
      toast.success('Cobrança excluída.')
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao excluir cobrança.')
    }
  }

  // Aprovar solicitação de migração de plano
  const handleApprovePlanRequest = async (req: SolicitacaoPlano) => {
    try {
      const approverName = profile?.full_name || profile?.email || 'Administrador Bi2B'
      await financeService.approvePlanRequest(req.id, req.company_id, req.requested_plan, user?.id, approverName)
      toast.success(`Solicitação APROVADA! O plano da empresa "${req.company_name}" foi migrado para o Plano ${req.requested_plan}.`)
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao aprovar solicitação de plano.')
    }
  }

  // Recusar solicitação de migração de plano
  const handleRejectPlanRequest = async (req: SolicitacaoPlano) => {
    const reason = prompt(`Informe o motivo da recusa para a empresa "${req.company_name}":`, 'No momento não é possível realizar a alteração de plano.')
    if (reason === null) return
    try {
      await financeService.rejectPlanRequest(req.id, req.company_id, reason, user?.id)
      toast.warning('Solicitação de plano recusada e cliente notificado.')
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao recusar solicitação de plano.')
    }
  }

  // Atualizar plano da empresa
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPlanCompany) return

    try {
      await financeService.updateCompanyPlan(editingPlanCompany.id, {
        plan_name: planName,
        monthly_amount: parseFloat(planAmount),
        due_day: parseInt(planDueDay, 10),
      })
      toast.success(`Plano da empresa ${editingPlanCompany.trade_name || editingPlanCompany.name} atualizado!`)
      setEditingPlanCompany(null)
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar plano.')
    }
  }

  // Gerar mensalidade do mês atual para uma empresa
  const handleGenerateMonthlyCharge = async (comp: any) => {
    try {
      const plan = planosMap[comp.id] || (await financeService.getCompanyPlan(comp.id)) || {
        plan_name: 'Pró',
        monthly_amount: 850.00,
        due_day: 10,
      }
      const now = new Date()
      const monthStr = (now.getMonth() + 1).toString().padStart(2, '0')
      const yearStr = now.getFullYear().toString()
      const refPeriod = `${monthStr}/${yearStr}`
      const dueDate = `${yearStr}-${monthStr}-${plan.due_day.toString().padStart(2, '0')}`

      await financeService.createCharge(
        {
          company_id: comp.id,
          title: `Mensalidade Plano ${plan.plan_name} - ${refPeriod}`,
          type: 'plano',
          amount: plan.monthly_amount,
          due_date: dueDate,
          reference_period: refPeriod,
          description: `Cobrança mensal referente ao plano ${plan.plan_name} da contabilidade.`,
          send_notification: true,
        },
        comp.trade_name || comp.name,
        user?.id
      )

      toast.success(`Mensalidade de ${refPeriod} gerada para ${comp.trade_name || comp.name}!`)
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao gerar mensalidade.')
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[hsl(var(--border))] pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <Wallet className="h-5 w-5" />
          </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Gestão Financeira & Cobranças</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Emita cobranças, controle mensalidades e valide comprovantes dos clientes
              </p>
            </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1 min-w-[280px]">
            <label className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              Empresa Cliente
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[hsl(var(--muted-foreground))]">
                <Building2 className="h-4 w-4" />
              </div>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--card))] pl-9 pr-8 py-2 text-sm font-bold text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-sm appearance-none cursor-pointer transition-all"
              >
                <option value="">Selecione uma empresa...</option>
                <option value="all">Todas as Empresas </option>
                {companies.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.trade_name || c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[hsl(var(--muted-foreground))]">
                <ChevronRight className="h-4 w-4 rotate-90" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsNewChargeModalOpen(true)}
            className="flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="h-4 w-4" /> Nova Cobrança
          </button>
        </div>
      </div>

      {!selectedCompanyId ? (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-12 text-center shadow-sm">
          <Building2 className="mx-auto h-12 w-12 text-[hsl(var(--muted-foreground))] opacity-30 mb-3" />
          <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Selecione uma Empresa Cliente</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-md mx-auto mt-1">
            Escolha uma empresa no menu acima ou selecione "Todas as Empresas" para gerenciar cobranças, mensalidades e comprovantes.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* RESUMO DE MÉTRICAS */}
          {summary && (
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                <span className="text-xs font-bold text-[hsl(var(--foreground))]">
                  {selectedCompanyId === 'all'
                    ? `Visão Geral (${companies.length} Empresas)`
                    : companies.find((c: any) => c.id === selectedCompanyId)?.trade_name || 'Empresa Selecionada'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3.5 py-2 rounded-xl border border-amber-500/20 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>A Receber: <strong>{formatCurrency(summary.totalPending + summary.totalOverdue)}</strong></span>
                </div>
                <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3.5 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Faturado Mês: <strong>{formatCurrency(summary.totalPaid)}</strong></span>
                </div>
                {summary.countPendingReceipts > 0 && (
                  <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3.5 py-2 rounded-xl border border-purple-500/20 flex items-center gap-2 animate-bounce">
                    <FileCheck className="h-4 w-4" />
                    <span>{summary.countPendingReceipts} Comprovante(s) p/ Validar</span>
                  </div>
                )}
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
          <DollarSign className="h-4 w-4" />
          Gerenciar Cobranças
        </button>
        <button
          onClick={() => setActiveTab('planos')}
          className={cn(
            "pb-3 border-b-2 transition-all flex items-center gap-2 text-xs sm:text-sm",
            activeTab === 'planos'
              ? "border-[#0d6084] text-[#0d6084] dark:border-cyan-400 dark:text-cyan-400 font-bold"
              : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          <Building2 className="h-4 w-4" />
          Planos e Mensalidades por Empresa
        </button>
        <button
          onClick={() => setActiveTab('comprovantes')}
          className={cn(
            "pb-3 border-b-2 transition-all flex items-center gap-2 text-xs sm:text-sm relative",
            activeTab === 'comprovantes'
              ? "border-[#0d6084] text-[#0d6084] dark:border-cyan-400 dark:text-cyan-400 font-bold"
              : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          <FileCheck className="h-4 w-4" />
          Comprovantes Pendentes
          {summary && summary.countPendingReceipts > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-purple-600 text-white font-bold">
              {summary.countPendingReceipts}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('solicitacoes')}
          className={cn(
            "pb-3 border-b-2 transition-all flex items-center gap-2 text-xs sm:text-sm relative",
            activeTab === 'solicitacoes'
              ? "border-[#0d6084] text-[#0d6084] dark:border-cyan-400 dark:text-cyan-400 font-bold"
              : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          <RefreshCw className="h-4 w-4" />
          Solicitações de Alteração de Planos
          {planRequests.filter((r) => r.status === 'pendente').length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold animate-pulse">
              {planRequests.filter((r) => r.status === 'pendente').length}
            </span>
          )}
        </button>
      </div>

      {/* ABA 1: GERENCIAR COBRANÇAS */}
      {activeTab === 'cobrancas' && (
        <div className="space-y-4">
          {/* Busca e Filtro */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4 shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Buscar por empresa, título ou mês..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-xl pl-9 pr-4 py-2 text-xs text-[hsl(var(--foreground))]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs font-semibold text-[hsl(var(--foreground))]"
              >
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Atrasado</option>
                <option value="pago">Pago</option>
                <option value="em_processamento">Aguardando Validação</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs font-semibold text-[hsl(var(--foreground))]"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="plano">Mensalidades</option>
                <option value="honorarios">Honorários</option>
                <option value="servico_extra">Serviços Avulsos</option>
              </select>
            </div>
          </div>

          {/* Tabela de Cobranças */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[hsl(var(--foreground))]">
                <thead className="bg-[hsl(var(--muted))]/60 text-[hsl(var(--muted-foreground))] uppercase font-semibold border-b border-[hsl(var(--border))]">
                  <tr>
                    <th className="p-4">Empresa / Título</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Ref.</th>
                    <th className="p-4">Vencimento</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {filteredCobrancas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[hsl(var(--muted-foreground))] font-medium">
                        Nenhuma cobrança encontrada.
                      </td>
                    </tr>
                  ) : (
                    filteredCobrancas.map((item: Cobranca) => (
                      <tr key={item.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-sm text-[hsl(var(--foreground))]">{item.company_name}</div>
                          <div className="text-xs text-[hsl(var(--muted-foreground))]">{item.title}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-[hsl(var(--muted))] text-[10px] font-bold">
                            {item.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-medium">{item.reference_period}</td>
                        <td className="p-4 font-mono font-medium">{formatDate(item.due_date)}</td>
                        <td className="p-4 font-bold text-sm text-[#0d6084] dark:text-cyan-400">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="p-4">
                          {item.status === 'pago' ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              Pago
                            </span>
                          ) : item.status === 'atrasado' ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                              Atrasado
                            </span>
                          ) : item.status === 'em_processamento' ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                              Comprovante Enviado
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status !== 'pago' && (
                              <>
                                <button
                                  onClick={() => handleMarkAsPaid(item)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition-all"
                                  title="Dar baixa manual"
                                >
                                  Dar Baixa
                                </button>
                                <button
                                  onClick={() => handleSendReminder(item)}
                                  className="p-1.5 text-amber-600 hover:bg-amber-500/10 rounded-lg"
                                  title="Enviar lembrete ao cliente"
                                >
                                  <Bell className="h-4 w-4" />
                                </button>
                              </>
                            )}

                            {item.receipt_url && (
                              <button
                                onClick={() => {
                                  setPreviewFile({
                                    name: item.receipt_name || 'Comprovante.pdf',
                                    filePath: item.receipt_url!,
                                    bucket: 'documents'
                                  })
                                }}
                                className="p-1.5 text-purple-600 hover:bg-purple-500/10 rounded-lg"
                                title="Ver Comprovante"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteCharge(item)}
                              className="p-1.5 text-rose-600 hover:bg-rose-500/10 rounded-lg"
                              title="Excluir cobrança"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: PLANOS E MENSALIDADES POR EMPRESA */}
      {activeTab === 'planos' && (
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4">
            <div>
              <h3 className="font-heading text-base font-bold">Configuração de Planos Recorrentes</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Defina o valor da mensalidade e dia de vencimento de cada empresa cliente</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((comp: any) => {
              const compPlanRaw = comp.plan || 'básico'
              const defaultPlanName = compPlanRaw.charAt(0).toUpperCase() + compPlanRaw.slice(1)
              const defaultAmount = defaultPlanName.toLowerCase() === 'plus' ? 1450.00 : defaultPlanName.toLowerCase() === 'pró' ? 850.00 : 450.00

              const plan = planosMap[comp.id] || {
                plan_name: defaultPlanName,
                monthly_amount: defaultAmount,
                due_day: 10,
              }

              return (
                <div key={comp.id} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[hsl(var(--foreground))]">{comp.trade_name || comp.name}</h4>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{comp.cnpj}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0d6084]/10 text-[#0d6084] dark:bg-cyan-400/20 dark:text-cyan-300">
                      Plano {plan.plan_name}
                    </span>
                  </div>

                  <div className="border-t border-b border-[hsl(var(--border))] py-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[hsl(var(--muted-foreground))] block">Mensalidade</span>
                      <span className="font-heading text-lg font-extrabold text-[#0d6084] dark:text-cyan-400">
                        {formatCurrency(plan.monthly_amount)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-[hsl(var(--muted-foreground))] block">Dia Vencimento</span>
                      <span className="font-bold text-sm text-[hsl(var(--foreground))]">Dia {plan.due_day}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setEditingPlanCompany(comp)
                        setPlanName(plan.plan_name)
                        setPlanAmount(plan.monthly_amount.toString())
                        setPlanDueDay(plan.due_day.toString())
                      }}
                      className="flex-1 py-1.5 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 text-xs font-semibold rounded-lg border border-[hsl(var(--border))]"
                    >
                      Ajustar Plano
                    </button>
                    <button
                      onClick={() => handleGenerateMonthlyCharge(comp)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Gerar Fatura Mês
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ABA 3: COMPROVANTES PENDENTES */}
      {activeTab === 'comprovantes' && (
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4">
            <div>
              <h3 className="font-heading text-base font-bold">Fila de Validação de Comprovantes</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Comprovantes anexados pelos clientes aguardando confirmação do escritório</p>
            </div>
          </div>

          <div className="divide-y divide-[hsl(var(--border))]">
            {cobrancas.filter((c: Cobranca) => c.receipt_status === 'pendente_aprovacao').length === 0 ? (
              <div className="p-8 text-center text-[hsl(var(--muted-foreground))] font-medium">
                Nenhum comprovante pendente de validação no momento.
              </div>
            ) : (
              cobrancas
                .filter((c: Cobranca) => c.receipt_status === 'pendente_aprovacao')
                .map((item: Cobranca) => (
                  <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[hsl(var(--foreground))]">{item.company_name}</span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">({item.title})</span>
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-0.5">
                        Arquivo: {item.receipt_name || 'Comprovante.pdf'} • Enviado em {item.receipt_uploaded_at ? new Date(item.receipt_uploaded_at).toLocaleString('pt-BR') : 'Hoje'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.receipt_url && (
                        <button
                          onClick={() => {
                            const isHttp = item.receipt_url?.startsWith('http://') || item.receipt_url?.startsWith('https://') || item.receipt_url?.startsWith('data:')
                            setPreviewFile({
                              name: item.receipt_name || 'Comprovante.pdf',
                              url: isHttp ? item.receipt_url : undefined,
                              filePath: item.receipt_url!,
                              bucket: 'documents'
                            })
                          }}
                          className="px-3 py-1.5 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 text-xs font-semibold rounded-lg flex items-center gap-1 border border-[hsl(var(--border))]"
                        >
                          <Eye className="h-3.5 w-3.5" /> Visualizar
                        </button>
                      )}
                      <button
                        onClick={() => handleApproveReceipt(item)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="h-4 w-4" /> Aprovar Pagamento
                      </button>
                      <button
                        onClick={() => handleRejectReceipt(item)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                      >
                        <X className="h-4 w-4" /> Rejeitar
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* ABA 4: SOLICITAÇÕES DE ALTERAÇÃO DE PLANO */}
      {activeTab === 'solicitacoes' && (
        <div className="space-y-6">
          {/* Filtro e Lista */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[hsl(var(--border))] pb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-[hsl(var(--foreground))]">Solicitações Detalhadas de Migração de Plano</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Gerencie as solicitações enviadas pelos clientes para upgrade/downgrade de pacote</p>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-xl px-3 py-1.5 text-xs font-bold text-[hsl(var(--foreground))] focus:outline-none"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="pendente">Apenas Pendentes</option>
                  <option value="aprovado">Aprovadas</option>
                  <option value="recusado">Recusadas</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-[hsl(var(--border))] space-y-3">
              {planRequests.filter((r) => requestStatusFilter === 'todos' || r.status === requestStatusFilter).length === 0 ? (
                <div className="p-8 text-center text-[hsl(var(--muted-foreground))] font-medium">
                  Nenhuma solicitação de alteração de plano encontrada.
                </div>
              ) : (
                planRequests
                  .filter((r) => requestStatusFilter === 'todos' || r.status === requestStatusFilter)
                  .map((item: SolicitacaoPlano) => (
                    <div key={item.id} className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-[hsl(var(--foreground))]">{item.company_name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[hsl(var(--muted))] border border-[hsl(var(--border))] font-medium text-[hsl(var(--muted-foreground))]">
                            ID: #{item.company_id.slice(0, 8)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className="px-2.5 py-1 rounded-lg bg-gray-500/10 text-gray-700 dark:text-gray-300 border border-gray-500/20">
                            Plano Atual: {item.current_plan || 'Básico'}
                          </span>
                          <ArrowRight className="h-4 w-4 text-[#0d6084] dark:text-cyan-400" />
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Solicitado: Plano {item.requested_plan}
                          </span>
                        </div>

                        {item.notes && (
                          <p className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))]/30 p-2.5 rounded-xl border border-[hsl(var(--border))] mt-1">
                            <strong className="text-[hsl(var(--foreground))]">Observações do Cliente:</strong> {item.notes}
                          </p>
                        )}

                        <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-2 pt-1">
                          <Clock className="h-3.5 w-3.5" /> Solicitado em: {new Date(item.created_at).toLocaleString('pt-BR')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === 'pendente' && (
                          <>
                            <button
                              onClick={() => handleApprovePlanRequest(item)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                            >
                              <Check className="h-4 w-4" /> Aprovar Migração
                            </button>
                            <button
                              onClick={() => handleRejectPlanRequest(item)}
                              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                            >
                              <X className="h-4 w-4" /> Recusar
                            </button>
                          </>
                        )}

                        {item.status === 'aprovado' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-4 w-4" /> Migração Aprovada ({item.reviewed_by || 'Admin'})
                          </span>
                        )}

                        {item.status === 'recusado' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <X className="h-4 w-4" /> Solicitação Recusada
                          </span>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
        </div>
      )}

      {/* MODAL: NOVA COBRANÇA */}
      {isNewChargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl p-6 text-[hsl(var(--foreground))] space-y-4">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
              <h3 className="font-heading text-lg font-bold flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#0d6084]" /> Criar Nova Cobrança
              </h3>
              <button onClick={() => setIsNewChargeModalOpen(false)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCharge} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Empresa Destinatária</label>
                <select
                  value={newCompanyId}
                  onChange={(e) => setNewCompanyId(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                >
                  {companies.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.trade_name || c.name} ({c.cnpj})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Tipo de Cobrança</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CobrancaType)}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                  >
                    <option value="plano">Mensalidade do Plano</option>
                    <option value="honorarios">Honorários Contábeis</option>
                    <option value="servico_extra">Serviço Avulso</option>
                    <option value="imposto_taxa">Imposto / Taxa</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Mês de Referência (MM/AAAA)</label>
                  <input
                    type="text"
                    placeholder="07/2026"
                    value={newRefPeriod}
                    onChange={(e) => setNewRefPeriod(e.target.value)}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Título da Cobrança</label>
                <input
                  type="text"
                  placeholder="Ex: Honorários Contábeis - Julho/2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Valor (R$)</label>
                  <input
                    type="text"
                    placeholder="850.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs font-bold text-[hsl(var(--foreground))]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Observações / Instruções</label>
                <textarea
                  rows={2}
                  placeholder="Instruções adicionais para o cliente..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="sendNotif"
                  checked={newSendNotif}
                  onChange={(e) => setNewSendNotif(e.target.checked)}
                  className="rounded border-[hsl(var(--border))]"
                />
                <label htmlFor="sendNotif" className="text-xs font-medium cursor-pointer">
                  Enviar notificação automática no painel do cliente ao gerar
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[hsl(var(--border))]">
                <button
                  type="button"
                  onClick={() => setIsNewChargeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 text-[hsl(var(--foreground))] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-[#0d6084] hover:bg-[#0b4d6a] text-white rounded-xl shadow-md flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Emissão de Cobrança
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PLANO */}
      {editingPlanCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl p-6 text-[hsl(var(--foreground))] space-y-4">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
              <h3 className="font-heading text-base font-bold">
                Ajustar Plano: {editingPlanCompany.trade_name || editingPlanCompany.name}
              </h3>
              <button onClick={() => setEditingPlanCompany(null)} className="text-[hsl(var(--muted-foreground))]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nome do Plano</label>
                <select
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Básico">Básico</option>
                  <option value="Pró">Pró</option>
                  <option value="Plus">Plus</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Valor da Mensalidade (R$)</label>
                <input
                  type="text"
                  value={planAmount}
                  onChange={(e) => setPlanAmount(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Dia Fixo de Vencimento (1 a 31)</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={planDueDay}
                  onChange={(e) => setPlanDueDay(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingPlanCompany(null)}
                  className="px-4 py-2 bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] rounded-xl"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0d6084] text-white font-bold rounded-xl shadow-md">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Pré-visualização de Arquivos */}
      {previewFile && <FilePreviewModal file={previewFile} isOpen={!!previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  )
}
