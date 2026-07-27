import { useState, useEffect } from 'react'
import { Building2, Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
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
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  
  // Estado de Criação / Edição
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

  const handleCopyId = (company: any) => {
    const code = company.codigo_exclusivo || company.id
    navigator.clipboard.writeText(code)
    setCopiedCompanyId(company.id)
    toast.success('ID de 4 dígitos copiado!')
    setTimeout(() => setCopiedCompanyId(null), 2000)
  }

  const fetchCompanies = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, name, trade_name, cnpj, email, phone, plan, max_users, is_active, created_at, address_city, address_state, codigo_exclusivo')
        .order('name', { ascending: true })
      if (error) throw error
      setCompanies(data || [])
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      toast.error('Erro ao buscar empresas.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

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

    // Validar com Zod
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
      console.error(err)
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
      console.error(err)
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
        console.error(err)
        toast.error('Erro ao deletar empresa.')
      }
    }
  }

  const filteredCompanies = companies.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.cnpj || '').includes(searchTerm)
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
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Gestão de Empresas (Tenants)</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Gerencie as contas corporativas dos clientes e limites de usuários ativos</p>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20"
        >
          <Plus className="h-4 w-4" />
          Cadastrar Empresa
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* Lista de Empresas (Tabela) */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                <th className="p-4">Empresa</th>
                <th className="p-4">ID Exclusivo</th>
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
                          onClick={() => handleCopyId(company)}
                          className="p-1 rounded text-[hsl(var(--muted-foreground))] hover:text-brand-500 transition-colors"
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
                          className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
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
                          className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id, company.name)}
                          className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/20"
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
                  <td colSpan={6} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                    Nenhuma empresa cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro/Edição de Empresa (CRUD) */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
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
