import { useState, useEffect } from 'react'
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Loader2, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle2, 
  Eye, 
  AlertCircle, 
  UserCheck,
  FileText, 
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { supabase, createIsolatedAuthClient } from '@/lib/supabase'
import { logAuditActivity } from '@/lib/audit'
import { z } from 'zod'

const formatCnpj = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
}

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
}

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

const companySchema = z.object({
  name: z.string().min(3, 'O nome da empresa deve ter no mínimo 3 caracteres.'),
  cnpj: z.string().refine((val) => {
    const clean = val.replace(/\D/g, '')
    return clean.length === 14
  }, 'CNPJ deve conter exatamente 14 dígitos.'),
  email: z.string().email('E-mail inválido.').nullable().or(z.literal('')),
  phone: z.string().refine((val) => {
    if (!val) return true
    const clean = val.replace(/\D/g, '')
    return clean.length >= 10 && clean.length <= 11
  }, 'Telefone inválido (deve conter DDD + 8 ou 9 dígitos).').nullable().or(z.literal('')),
  addressZip: z.string().refine((val) => {
    if (!val) return true
    const clean = val.replace(/\D/g, '')
    return clean.length === 8
  }, 'CEP deve conter exatamente 8 dígitos.').nullable().or(z.literal('')),
  maxUsers: z.number().min(1, 'A empresa deve aceitar no mínimo 1 usuário.').max(100, 'Limite do plano de no máximo 100 usuários.')
})

export function CompaniesPage() {
  // Controle de Sub-abas: 'empresas' (Cadastradas) ou 'solicitacoes' (Pendentes de Aprovação)
  const [viewTab, setViewTab] = useState<'empresas' | 'solicitacoes'>('empresas')

  const [companies, setCompanies] = useState<any[]>([])
  const [companyRequests, setCompanyRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedRequestModal, setSelectedRequestModal] = useState<any | null>(null)
  
  // Estado de Criação / Edição Direta
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [tradeName, setTradeName] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [stateRegistration, setStateRegistration] = useState('')
  const [municipalRegistration, setMunicipalRegistration] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [addressStreet, setAddressStreet] = useState('')
  const [addressNumber, setAddressNumber] = useState('')
  const [addressComplement, setAddressComplement] = useState('')
  const [addressNeighborhood, setAddressNeighborhood] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressState, setAddressState] = useState('')
  const [addressZip, setAddressZip] = useState('')
  const [plan, setPlan] = useState('básico')
  const [maxUsers, setMaxUsers] = useState(5)

  const [copiedCompanyId, setCopiedCompanyId] = useState<string | null>(null)

  const handleCopyId = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCompanyId(id)
    toast.success('Chave de Acesso copiada!')
    setTimeout(() => setCopiedCompanyId(null), 2000)
  }

  // Buscar Empresas Ativas (Real Supabase)
  const fetchCompanies = async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })
      if (error) throw error
      setCompanies(data || [])
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      if (!silent) toast.error('Erro ao buscar empresas ativas do Supabase.')
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  // Buscar Solicitações Pendentes (Real Supabase: empresas com is_active = false)
  const fetchCompanyRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('is_active', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCompanyRequests(data || [])
    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro ao buscar solicitações pendentes do Supabase:', err)
      setCompanyRequests([])
    }
  }

  useEffect(() => {
    fetchCompanies()
    fetchCompanyRequests()

    const handleRefresh = () => {
      fetchCompanies(true)
      fetchCompanyRequests()
    }
    window.addEventListener('bi2b:refresh-data', handleRefresh)
    return () => window.removeEventListener('bi2b:refresh-data', handleRefresh)
  }, [])

  // APROVAR SOLICITAÇÃO DA EMPRESA E DO GESTOR VINCULADO (Real Supabase)
  const handleApproveRequest = async (req: any) => {
    try {
      const randomCode = req.codigo_exclusivo || String(Math.floor(1000 + Math.random() * 9000))
      
      // 1. Ativar a Empresa no Supabase
      const { error: companyErr } = await supabase
        .from('empresas')
        .update({
          is_active: true,
          codigo_exclusivo: randomCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.id)

      if (companyErr) throw companyErr

      // 2. Aprovar e Vincular o Gestor na tabela de Usuários e Vínculos
      // Buscar o gestor vinculado a esta empresa na tabela 'usuarios' (criado na etapa do cadastro)
      const { data: userByCompany } = await supabase
        .from('usuarios')
        .select('id, email')
        .eq('company_id', req.id)
        .eq('user_type', 'client_master')
        .maybeSingle()

      let existingUser: any = userByCompany
      let gestorEmail = userByCompany?.email || req.admin_email || (req.email ? req.email.trim().toLowerCase() : '')

      if (!existingUser && gestorEmail) {
        const { data: userByEmail } = await supabase
          .from('usuarios')
          .select('id, email')
          .eq('email', gestorEmail)
          .maybeSingle()
        existingUser = userByEmail
      }

      let gestorUserId: string | null = null

      if (existingUser) {
        gestorUserId = existingUser.id
        // Atualizar perfil do gestor existente para master ativado e vinculado
        await supabase
          .from('usuarios')
          .update({
            user_type: 'client_master',
            company_id: req.id,
            codigo_empresa: randomCode,
            is_active: true,
            status_reason: null
          })
          .eq('id', existingUser.id)
      } else if (gestorEmail) {
        // Tentar registrar no Supabase Auth usando cliente isolado para não deslogar o Administrador
        let authUserId: string | null = null
        try {
          const authClient = createIsolatedAuthClient()
          const tempPassword = 'GestorPass' + randomCode + '!'
          const { data: authData } = await authClient.auth.signUp({
            email: gestorEmail,
            password: tempPassword,
            options: {
              data: {
                full_name: req.admin_name || 'Gestor Responsável',
                phone: req.phone || null,
                company_id: req.id,
                codigo_empresa: randomCode,
                user_type: 'client_master'
              }
            }
          })
          if (authData?.user?.id) {
            authUserId = authData.user.id
          }
        } catch (e) {
          if (import.meta.env.DEV) console.warn('Aviso Supabase Auth ao aprovar gestor:', e)
        }

        // Inserir perfil de Gestor em usuarios se ainda não existir
        const newUserId = authUserId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'usr_' + Date.now())
        const { data: newUser } = await supabase
          .from('usuarios')
          .insert({
            id: newUserId,
            email: gestorEmail,
            full_name: req.admin_name || 'Gestor Responsável',
            phone: req.phone || null,
            user_type: 'client_master',
            company_id: req.id,
            codigo_empresa: randomCode,
            is_active: true
          })
          .select('id')
          .maybeSingle()

        gestorUserId = newUser?.id || newUserId
      }

      // 3. Vincular em usuarios_empresa como 'usuario_master' com permissões totais ativadas
      if (gestorUserId) {
        await supabase
          .from('usuarios_empresa')
          .upsert({
            company_id: req.id,
            user_id: gestorUserId,
            role: 'usuario_master',
            permissions: ['all'],
            is_active: true
          }, { onConflict: 'company_id,user_id' })
      }

      logAuditActivity({
        action: 'APROVAR_SOLICITACAO_EMPRESA',
        entityType: 'empresas',
        entityId: req.id,
        metadata: { 
          company_name: req.name, 
          cnpj: req.cnpj, 
          codigo_exclusivo: randomCode,
          gestor_name: req.admin_name,
          gestor_email: gestorEmail
        }
      })

      toast.success(`Empresa "${req.name}" APROVADA! O Gestor "${req.admin_name || 'Responsável'}" foi automaticamente aprovado e vinculado.`)
      if (selectedRequestModal?.id === req.id) {
        setSelectedRequestModal(null)
      }

      fetchCompanies()
      fetchCompanyRequests()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao aprovar empresa e gestor no Supabase.')
    }
  }

  // RECUSAR SOLICITAÇÃO DA EMPRESA (Real Supabase: Deleta o registro pendente)
  const handleRejectRequest = async (req: any) => {
    if (!confirm(`Tem certeza que deseja recusar e excluir a solicitação da empresa "${req.name}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', req.id)

      if (error) throw error

      logAuditActivity({
        action: 'RECUSAR_SOLICITACAO_EMPRESA',
        entityType: 'empresas',
        entityId: req.id,
        metadata: { company_name: req.name, cnpj: req.cnpj }
      })

      toast.success(`Solicitação de "${req.name}" recusada e removida do Supabase.`)
      if (selectedRequestModal?.id === req.id) {
        setSelectedRequestModal(null)
      }

      fetchCompanies()
      fetchCompanyRequests()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao recusar solicitação no Supabase.')
    }
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setName('')
    setTradeName('')
    setCnpj('')
    setStateRegistration('')
    setMunicipalRegistration('')
    setEmail('')
    setPhone('')
    setAddressStreet('')
    setAddressNumber('')
    setAddressComplement('')
    setAddressNeighborhood('')
    setAddressCity('')
    setAddressState('')
    setAddressZip('')
    setPlan('básico')
    setMaxUsers(5)
    setIsOpenModal(true)
  }

  const handleOpenEdit = (company: any) => {
    setEditingId(company.id)
    setName(company.name || '')
    setTradeName(company.trade_name || '')
    setCnpj(formatCnpj(company.cnpj || ''))
    setStateRegistration(company.state_registration || '')
    setMunicipalRegistration(company.municipal_registration || '')
    setEmail(company.email || '')
    setPhone(formatPhone(company.phone || ''))
    setAddressStreet(company.address_street || '')
    setAddressNumber(company.address_number || '')
    setAddressComplement(company.address_complement || '')
    setAddressNeighborhood(company.address_neighborhood || '')
    setAddressCity(company.address_city || '')
    setAddressState(company.address_state || '')
    setAddressZip(formatCep(company.address_zip || ''))
    setPlan(company.plan || 'básico')
    setMaxUsers(company.max_users || 5)
    setIsOpenModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !cnpj) return

    const cleanCnpj = cnpj.replace(/\D/g, '')
    const cleanPhone = phone ? phone.replace(/\D/g, '') : null
    const cleanZip = addressZip ? addressZip.replace(/\D/g, '') : null

    try {
      companySchema.parse({
        name,
        cnpj: cleanCnpj,
        email: email || '',
        phone: cleanPhone || '',
        addressZip: cleanZip || '',
        maxUsers
      })
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        toast.error(err.issues[0].message)
        return
      }
    }

    const companyData = {
      name,
      trade_name: tradeName || null,
      cnpj: cleanCnpj,
      state_registration: stateRegistration || null,
      municipal_registration: municipalRegistration || null,
      email: email || null,
      phone: cleanPhone,
      address_street: addressStreet || null,
      address_number: addressNumber || null,
      address_complement: addressComplement || null,
      address_neighborhood: addressNeighborhood || null,
      address_city: addressCity || null,
      address_state: addressState || null,
      address_zip: cleanZip,
      plan: plan as any,
      max_users: maxUsers
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('empresas')
          .update(companyData)
          .eq('id', editingId)
        if (error) throw error
        logAuditActivity({
          action: 'ATUALIZAR_EMPRESA',
          entityType: 'empresas',
          entityId: editingId,
          metadata: { company_name: companyData.name, cnpj: companyData.cnpj }
        })
        toast.success('Empresa editada com sucesso!')
      } else {
        const randomCode = String(Math.floor(1000 + Math.random() * 9000))
        const { data: createdCompany, error } = await supabase
          .from('empresas')
          .insert({
            ...companyData,
            codigo_exclusivo: randomCode,
            is_active: true
          })
          .select('id')
          .single()

        if (error) throw error

        logAuditActivity({
          action: 'CRIAR_EMPRESA',
          entityType: 'empresas',
          entityId: createdCompany?.id,
          metadata: { company_name: companyData.name, cnpj: companyData.cnpj, codigo_exclusivo: randomCode }
        })

        toast.success(`Empresa cadastrada com sucesso! ID Exclusivo: ${randomCode}`)
      }
      setIsOpenModal(false)
      fetchCompanies()
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      toast.error('Erro ao salvar empresa.')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('empresas')
        .update({ is_active: !currentStatus })
        .eq('id', id)
      if (error) throw error

      logAuditActivity({
        action: 'ALTERAR_STATUS_EMPRESA',
        entityType: 'empresas',
        entityId: id,
        metadata: { is_active: !currentStatus }
      })

      toast.success(`Status da empresa atualizado com sucesso.`)
      fetchCompanies()
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      toast.error('Erro ao atualizar status.')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja deletar a empresa ${name}? Essa ação é irreversível e excluirá todos os dados (RLS).`)) {
      try {
        const { error } = await supabase
          .from('empresas')
          .delete()
          .eq('id', id)
        if (error) throw error

        logAuditActivity({
          action: 'EXCLUIR_EMPRESA',
          entityType: 'empresas',
          entityId: id,
          metadata: { company_name: name }
        })

        toast.success(`Empresa ${name} deletada com sucesso.`)
        fetchCompanies()
      } catch (err) {
        if (import.meta.env.DEV) console.error(err)
        toast.error('Erro ao deletar empresa.')
      }
    }
  }

  const filteredCompanies = companies.filter(c => 
    c.is_active !== false && (
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.cnpj || '').includes(searchTerm)
    )
  )

  const filteredRequests = companyRequests.filter(r =>
    (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.cnpj || '').includes(searchTerm) ||
    (r.admin_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30">
            <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Gestão de Empresas</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Gerencie empresas ativas e aprovações de solicitações do portal público</p>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Cadastrar Empresa
        </button>
      </div>

      {/* SUB-NAVEGAÇÃO: EMPRESAS CADASTRADAS VS SOLICITAÇÕES PENDENTES */}
      <div className="flex border-b border-[hsl(var(--border))] space-x-6 text-sm font-semibold">
        <button
          onClick={() => setViewTab('empresas')}
          className={cn(
            "pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer select-none",
            viewTab === 'empresas'
              ? "border-brand-500 text-brand-600 dark:text-brand-400 font-bold"
              : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          <Building2 className="h-4 w-4" />
          <span>Empresas Ativas</span>
          <span className="ml-1 rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-xs font-bold">
            {filteredCompanies.length}
          </span>
        </button>

        <button
          onClick={() => setViewTab('solicitacoes')}
          className={cn(
            "pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer select-none relative",
            viewTab === 'solicitacoes'
              ? "border-brand-500 text-brand-600 dark:text-brand-400 font-bold"
              : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          <Clock className="h-4 w-4" />
          <span>Painel de Solicitações</span>
          {companyRequests.length > 0 && (
            <span className="rounded-full bg-blue-900 text-white px-2 py-0.5 text-xs font-extrabold animate-pulse shadow-xs">
              {companyRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder={viewTab === 'empresas' ? "Buscar por nome ou CNPJ..." : "Buscar solicitação por empresa, CNPJ ou gestor..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* VISÃO 1: TABELA DE EMPRESAS ATIVAS */}
      {/* ========================================================= */}
      {viewTab === 'empresas' && (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  <th className="p-4">Empresa</th>
                  <th className="p-4">ID</th>
                  <th className="p-4">Contato</th>
                  <th className="p-4">Plano</th>
                  <th className="p-4">Limite de Usuários</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))] text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                        <span>Carregando empresas...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCompanies.length > 0 ? (
                  filteredCompanies.map(company => (
                    <tr key={company.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <h4 className="font-semibold text-[hsl(var(--foreground))]">{company.name}</h4>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">CNPJ: {formatCnpj(company.cnpj)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold tracking-widest text-[hsl(var(--foreground))] bg-[hsl(var(--muted))] px-2.5 py-1 rounded border border-[hsl(var(--border))] select-all">
                            {company.codigo_exclusivo || company.id}
                          </span>
                          <button
                            onClick={() => handleCopyId(company.codigo_exclusivo || company.id, company.id)}
                            className="p-1 rounded text-[hsl(var(--muted-foreground))] hover:text-brand-500 transition-colors cursor-pointer"
                            title="Copiar ID de 4 dígitos"
                          >
                            {copiedCompanyId === company.id ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-[hsl(var(--foreground))]">{company.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase',
                          company.plan === 'plus' && 'bg-purple-100 text-purple-700 dark:bg-purple-950/30',
                          company.plan === 'pró' && 'bg-blue-100 text-blue-700 dark:bg-blue-950/30',
                          company.plan === 'básico' && 'bg-gray-100 text-gray-700 dark:bg-gray-800'
                        )}>
                          {company.plan}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-[hsl(var(--foreground))]">
                        {company.max_users} usuários
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-semibold',
                          company.is_active 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                        )}>
                          {company.is_active ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleToggleStatus(company.id, company.is_active)}
                            className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] cursor-pointer"
                            title={company.is_active ? 'Inativar empresa' : 'Ativar empresa'}
                          >
                            {company.is_active ? (
                              <ToggleRight className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(company)}
                            className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(company.id, company.name)}
                            className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/20 cursor-pointer"
                            title="Deletar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                      Nenhuma empresa ativa cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VISÃO 2: PAINEL DE SOLICITAÇÕES PENDENTES DE EMPRESAS */}
      {/* ========================================================= */}
      {viewTab === 'solicitacoes' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* BANNER INFORMATIVO DO PAINEL */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
              <span>Solicitações de Cadastro de Novas Empresas</span>
            </div>
            <p className="text-xs text-[hsl(var(--foreground))] leading-relaxed">
              Exibindo as solicitações de empresas cadastradas via aba pública do portal.<br/>Ao aprovar uma solicitação, a empresa será ativada e estará pronta para receber vínculos de colaboradores.
            </p>
          </div>

          {/* LISTA DE CARDS DE SOLICITAÇÕES */}
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-lg space-y-4 hover:border-brand-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Badge e Token Topo */}
                    <div className="flex items-center justify-between pb-3 border-b border-[hsl(var(--border))]">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[11px] font-bold border border-amber-500/20">
                          <Clock className="h-3 w-3" />
                          SOLICITAÇÃO PENDENTE
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase font-bold">Token:</span>
                        <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                          #{req.codigo_exclusivo || '8419'}
                        </span>
                      </div>
                    </div>

                    {/* Dados da Empresa */}
                    <div className="pt-3 space-y-2">
                      <div>
                        <h3 className="font-bold text-base text-[hsl(var(--foreground))]">{req.name}</h3>
                        {req.trade_name && req.trade_name !== req.name && (
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">Fantasia: {req.trade_name}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-[hsl(var(--muted-foreground))]">CNPJ: </span>
                          <span className="font-mono font-semibold text-[hsl(var(--foreground))]">{formatCnpj(req.cnpj)}</span>
                        </div>
                        <div>
                          <span className="text-[hsl(var(--muted-foreground))]">E-mail: </span>
                          <span className="font-semibold text-[hsl(var(--foreground))] truncate block">{req.email || 'Não informado'}</span>
                        </div>
                        <div>
                          <span className="text-[hsl(var(--muted-foreground))]">Telefone: </span>
                          <span className="font-semibold text-[hsl(var(--foreground))]">{req.phone ? formatPhone(req.phone) : 'Não informado'}</span>
                        </div>
                        <div>
                          <span className="text-[hsl(var(--muted-foreground))]">Data: </span>
                          <span className="font-semibold text-[hsl(var(--foreground))]">
                            {new Date(req.created_at || Date.now()).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Administrador Responsável */}
                      <div className="mt-3 p-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[hsl(var(--foreground))]">
                          <UserCheck className="h-3.5 w-3.5 text-brand-500" />
                          <span>Responsável: {req.admin_name || 'Gestor Master'}</span>
                        </div>
                        <p className="text-[11px] text-[hsl(var(--muted-foreground))] pl-5">
                          Cargo: {req.admin_role || 'Administrador'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ações de Aprovação / Recusa */}
                  <div className="pt-4 border-t border-[hsl(var(--border))] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedRequestModal(req)}
                      className="flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors p-1"
                    >
                      <Eye className="h-4 w-4" />
                      Detalhes
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectRequest(req)}
                        className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Recusar
                      </button>
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className="px-4 py-1.5 rounded-lg gradient-brand text-white text-xs font-bold shadow-sm shadow-brand-500/20 hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Aprovar Empresa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-12 text-center text-xs text-[hsl(var(--muted-foreground))]">
              <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-500 mb-3 opacity-60" />
              <p className="font-semibold text-sm text-[hsl(var(--foreground))]">Nenhuma solicitação pendente no momento</p>
              <p className="mt-1">Todas as empresas enviadas via portal foram analisadas e processadas.</p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE DETALHES DA SOLICITAÇÃO DE EMPRESA */}
      {/* ========================================================= */}
      {selectedRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg shadow-2xl p-6 relative space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
                <FileText className="h-5 w-5" />
                <span>Detalhes da Solicitação de Empresa</span>
              </div>
              <button
                onClick={() => setSelectedRequestModal(null)}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3.5 space-y-2">
                <p className="font-bold text-sm text-[hsl(var(--foreground))]">{selectedRequestModal.name}</p>
                <p className="text-[hsl(var(--muted-foreground))]">CNPJ: <span className="font-mono text-[hsl(var(--foreground))]">{formatCnpj(selectedRequestModal.cnpj)}</span></p>
                <p className="text-[hsl(var(--muted-foreground))]">E-mail Corporativo: <span className="text-[hsl(var(--foreground))] font-semibold">{selectedRequestModal.email}</span></p>
                <p className="text-[hsl(var(--muted-foreground))]">Telefone Comercial: <span className="text-[hsl(var(--foreground))] font-semibold">{selectedRequestModal.phone ? formatPhone(selectedRequestModal.phone) : 'Não informado'}</span></p>
              </div>

              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3.5 space-y-1.5">
                <p className="font-bold text-xs text-[hsl(var(--foreground))] uppercase tracking-wider">Administrador Responsável</p>
                <p className="text-[hsl(var(--foreground))] font-semibold">{selectedRequestModal.admin_name}</p>
                <p className="text-[hsl(var(--muted-foreground))]">Cargo: {selectedRequestModal.admin_role}</p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-brand-500/30 bg-brand-500/10 p-3.5">
                <div>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase font-bold">Chave de Conexão Gerada</p>
                  <p className="font-mono text-xl font-black text-brand-600 dark:text-brand-400">#{selectedRequestModal.codigo_exclusivo || '8419'}</p>
                </div>
                <button
                  onClick={() => handleCopyId(selectedRequestModal.codigo_exclusivo || '8419', selectedRequestModal.id)}
                  className="px-3 py-1.5 rounded-lg bg-brand-500 text-white font-bold text-xs hover:brightness-110 transition-all"
                >
                  Copiar Chave
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[hsl(var(--border))]">
              <button
                onClick={() => handleRejectRequest(selectedRequestModal)}
                className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-500/10 transition-colors"
              >
                Recusar Solicitação
              </button>
              <button
                onClick={() => handleApproveRequest(selectedRequestModal)}
                className="px-5 py-2 rounded-xl gradient-brand text-white font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Aprovar Empresa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro/Edição Direta de Empresa (CRUD) */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] mb-4 border-b border-[hsl(var(--border))] pb-2">
              {editingId ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Seção 1: Identificação */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500">Identificação da Empresa</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Razão Social</label>
                    <input
                      type="text"
                      required
                      placeholder="Empresa Exemplo Ltda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nome Fantasia</label>
                    <input
                      type="text"
                      placeholder="Nome Fantasia"
                      value={tradeName}
                      onChange={(e) => setTradeName(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">CNPJ</label>
                    <input
                      type="text"
                      required
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Telefone</label>
                    <input
                      type="text"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Inscrição Estadual</label>
                    <input
                      type="text"
                      placeholder="Isento ou Número"
                      value={stateRegistration}
                      onChange={(e) => setStateRegistration(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Inscrição Municipal</label>
                    <input
                      type="text"
                      placeholder="Número"
                      value={municipalRegistration}
                      onChange={(e) => setMunicipalRegistration(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Endereço */}
              <div className="space-y-4 pt-4 border-t border-[hsl(var(--border))]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">CEP</label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={addressZip}
                      onChange={(e) => setAddressZip(formatCep(e.target.value))}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Rua / Logradouro</label>
                    <input
                      type="text"
                      placeholder="Av. Paulista"
                      value={addressStreet}
                      onChange={(e) => setAddressStreet(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Número</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={addressNumber}
                      onChange={(e) => setAddressNumber(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Bairro</label>
                    <input
                      type="text"
                      placeholder="Centro"
                      value={addressNeighborhood}
                      onChange={(e) => setAddressNeighborhood(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Complemento</label>
                    <input
                      type="text"
                      placeholder="Sala 101"
                      value={addressComplement}
                      onChange={(e) => setAddressComplement(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Cidade</label>
                    <input
                      type="text"
                      placeholder="São Paulo"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Estado (UF)</label>
                    <input
                      type="text"
                      placeholder="SP"
                      maxLength={2}
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 3: Contato & Configurações */}
              <div className="space-y-4 pt-4 border-t border-[hsl(var(--border))]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500">Contato & Configurações</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Email de Contato</label>
                    <input
                      type="email"
                      placeholder="contato@empresa.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Plano Comercial</label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value="básico">Básico</option>
                      <option value="pró">Pró</option>
                      <option value="plus">Plus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Limite Máximo Usuários</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={maxUsers}
                      onChange={(e) => setMaxUsers(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[hsl(var(--border))]">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20"
                >
                  {editingId ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
