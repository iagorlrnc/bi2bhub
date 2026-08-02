import { useState, useEffect } from 'react'
import { Users, Plus, Search, Edit2, Trash2, Loader2, Building2, Copy, Check, UserCheck, UserX, Clock, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { cn, isValid4DigitCode, generate4DigitCode, getCompanyCode, ensureUniqueCompanyCodes } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { logAuditActivity } from '@/lib/audit'

export function StaffPage() {
  const { company: authCompany, user: currentUser } = useAuth()
  const [activeStaff, setActiveStaff] = useState<any[]>([])
  const [pendingCollaborators, setPendingCollaborators] = useState<any[]>([])
  const [officeCompany, setOfficeCompany] = useState<{ id: string; name: string; codigo_exclusivo: string | null } | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'pending'>('members')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(false)

  // Estado de Edição / Criação
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('Fiscal')

  const fetchStaffData = async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      // 0. Higienizar e prevenir choque de códigos entre escritório e clientes
      await ensureUniqueCompanyCodes(supabase)

      // 1. Identificar a empresa escritório (BI2B Consultoria / Empresa do Admin)
      let primaryOffice: any = authCompany

      if (!primaryOffice || !primaryOffice.id) {
        // Tentar obter BI2B Consultoria diretamente por nome no banco
        const { data: bi2bComp } = await supabase
          .from('empresas')
          .select('id, name, codigo_exclusivo')
          .ilike('name', '%BI2B%')
          .maybeSingle()

        if (bi2bComp) {
          primaryOffice = bi2bComp
        } else {
          // Fallback para primeira empresa ativa
          const { data: companiesData } = await supabase
            .from('empresas')
            .select('id, name, codigo_exclusivo')
            .eq('is_active', true)
            .order('created_at', { ascending: true })

          primaryOffice = companiesData && companiesData.length > 0 ? companiesData[0] : null
        }
      }

      // Buscar todos os códigos para sanidade
      const { data: allComps } = await supabase.from('empresas').select('codigo_exclusivo')
      const existingCodes = (allComps || []).map((c: any) => c.codigo_exclusivo)

      if (primaryOffice) {
        const currentCode = primaryOffice.codigo_exclusivo
        if (!isValid4DigitCode(currentCode)) {
          const freshCode = generate4DigitCode(existingCodes)
          await supabase
            .from('empresas')
            .update({ codigo_exclusivo: freshCode })
            .eq('id', primaryOffice.id)
          primaryOffice = { ...primaryOffice, codigo_exclusivo: freshCode }
        }
      }

      setOfficeCompany(primaryOffice)

      const officeCode = primaryOffice?.codigo_exclusivo || getCompanyCode(primaryOffice?.id || '')

      // 2. Buscar Membros Ativos da Equipe (Admins, Gestores e Colaboradores vinculados ao escritório)
      let linkedUserIds: string[] = []
      if (primaryOffice?.id) {
        const { data: empUsers } = await supabase
          .from('usuarios_empresa')
          .select('user_id')
          .eq('company_id', primaryOffice.id)
          .eq('is_active', true)
        
        linkedUserIds = (empUsers || []).map((eu: any) => eu.user_id).filter(Boolean)
      }

      let activeQuery = supabase
        .from('usuarios')
        .select('id, email, full_name, phone, user_type, is_active, avatar_url, created_at, codigo_empresa')
        .eq('is_active', true)

      if (linkedUserIds.length > 0 && officeCode) {
        activeQuery = activeQuery.or(
          `user_type.eq.admin,codigo_empresa.eq.${officeCode},id.in.(${linkedUserIds.join(',')})`
        )
      } else if (officeCode) {
        activeQuery = activeQuery.or(`user_type.eq.admin,codigo_empresa.eq.${officeCode}`)
      } else {
        activeQuery = activeQuery.eq('user_type', 'admin')
      }

      const { data: activeData, error: activeErr } = await activeQuery.order('full_name', { ascending: true })

      if (activeErr) throw activeErr

      // Garantir que todos os colaboradores vinculados à BI2B Consultoria possuam user_type = 'admin' (permissão total)
      if (primaryOffice?.id && activeData && activeData.length > 0) {
        const nonAdminUsers = activeData.filter((u: any) => u.user_type !== 'admin')
        if (nonAdminUsers.length > 0) {
          const nonAdminIds = nonAdminUsers.map((u: any) => u.id)
          await supabase
            .from('usuarios')
            .update({ user_type: 'admin' })
            .in('id', nonAdminIds)

          activeData.forEach((u: any) => {
            if (nonAdminIds.includes(u.id)) {
              u.user_type = 'admin'
            }
          })
        }
      }

      setActiveStaff(activeData || [])

      // 3. Buscar Solicitações Pendentes de Colaboradores (is_active === false)
      let pendingQuery = supabase
        .from('usuarios')
        .select('id, email, full_name, phone, user_type, is_active, codigo_empresa, created_at')
        .eq('is_active', false)

      if (officeCode) {
        pendingQuery = pendingQuery.or(`codigo_empresa.eq.${officeCode},user_type.eq.admin`)
      }

      const { data: pendingData, error: pendingErr } = await pendingQuery.order('created_at', { ascending: false })

      if (pendingErr) throw pendingErr
      setPendingCollaborators(pendingData || [])

    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar dados da equipe:', err)
      }
      if (!silent) toast.error('Erro ao carregar lista de membros da equipe.')
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffData()

    const handleRefresh = () => fetchStaffData(true)
    window.addEventListener('bi2b:refresh-data', handleRefresh)
    return () => window.removeEventListener('bi2b:refresh-data', handleRefresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCopyCode = () => {
    const codeToCopy = officeCompany?.codigo_exclusivo || getCompanyCode(officeCompany?.id || '')
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
      setCopiedCode(true)
      toast.success('Código Exclusivo da Empresa copiado com sucesso!')
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  // Obter cargo/departamento
  const parseStaffFields = (profile: any) => {
    if (!profile) return { role: 'Colaborador', department: 'Fiscal' }
    let roleVal = profile.role
    let deptVal = profile.department

    if (!roleVal || !deptVal) {
      try {
        if (profile.phone && typeof profile.phone === 'string' && profile.phone.startsWith('{')) {
          const parsed = JSON.parse(profile.phone)
          if (!roleVal && parsed.role && typeof parsed.role === 'string') roleVal = parsed.role
          if (!deptVal && parsed.department && typeof parsed.department === 'string') deptVal = parsed.department
        }
      } catch {
        // Ignorar
      }
    }

    roleVal = 'Administrador'
    deptVal = deptVal || 'Fiscal'
    return { role: roleVal, department: deptVal }
  }

  // Aprovar solicitação de colaborador pendente
  const handleApproveCollaborator = async (collaborator: any) => {
    try {
      // 1. Ativar usuário e promover para admin/colaborador do escritório
      const { error: userError } = await (supabase as any)
        .from('usuarios')
        .update({
          is_active: true,
          user_type: 'admin',
          status_reason: null
        })
        .eq('id', collaborator.id)

      if (userError) throw userError

      // 2. Vincular na empresa escritório se existir id
      if (officeCompany?.id) {
        await (supabase as any).from('usuarios_empresa').upsert({
          company_id: officeCompany.id,
          user_id: collaborator.id,
          role: 'usuario_master',
          is_active: true
        }, { onConflict: 'user_id' })
      }

      logAuditActivity({
        userId: currentUser?.id,
        companyId: officeCompany?.id || null,
        action: 'APROVAR_SOLICITACAO_USUARIO',
        entityType: 'usuarios',
        entityId: collaborator.id,
        metadata: {
          approved_user_id: collaborator.id,
          approved_user_name: collaborator.full_name,
          approved_user_email: collaborator.email,
          origin: 'Painel Admin (Gestão de Equipe)'
        }
      })

      toast.success(`Acesso de ${collaborator.full_name} aprovado com sucesso!`)
      fetchStaffData()
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Erro ao aprovar colaborador:', err)
      toast.error(err.message || 'Erro ao aprovar solicitação de acesso.')
    }
  }

  // Recusar solicitação de colaborador pendente
  const handleRejectCollaborator = async (collaborator: any) => {
    if (confirm(`Tem certeza que deseja recusar a solicitação de ${collaborator.full_name}?`)) {
      try {
        await (supabase as any)
          .from('usuarios')
          .update({
            is_active: false,
            status_reason: 'Solicitação recusada pelo Administrador'
          })
          .eq('id', collaborator.id)

        await (supabase as any)
          .from('usuarios_empresa')
          .delete()
          .eq('user_id', collaborator.id)

        logAuditActivity({
          userId: currentUser?.id,
          companyId: officeCompany?.id || null,
          action: 'RECUSAR_SOLICITACAO_USUARIO',
          entityType: 'usuarios',
          entityId: collaborator.id,
          metadata: {
            rejected_user_id: collaborator.id,
            rejected_user_name: collaborator.full_name,
            origin: 'Painel Admin (Gestão de Equipe)'
          }
        })

        toast.info(`Solicitação de ${collaborator.full_name} recusada.`)
        fetchStaffData()
      } catch (err: any) {
        if (import.meta.env.DEV) console.error('Erro ao recusar solicitação:', err)
        toast.error('Erro ao recusar solicitação.')
      }
    }
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setName('')
    setEmail('')
    setRole('')
    setDepartment('Fiscal')
    setIsOpenModal(true)
  }

  const handleOpenEdit = (member: any) => {
    const fields = parseStaffFields(member)
    setEditingId(member.id)
    setName(member.full_name)
    setEmail(member.email)
    setRole(fields.role)
    setDepartment(fields.department)
    setIsOpenModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !role) return

    const staffPayload = JSON.stringify({ role, department })

    try {
      if (editingId) {
        const { error } = await supabase
          .from('usuarios')
          .update({
            full_name: name,
            phone: staffPayload
          })
          .eq('id', editingId)
        if (error) throw error
        toast.success('Membro da equipe atualizado com sucesso!')
      } else {
        const { data: existing, error: findError } = await supabase
          .from('usuarios')
          .select('id, email, full_name, user_type')
          .eq('email', email)
          .maybeSingle()
        
        if (findError) throw findError

        if (existing) {
          const { error: promoError } = await supabase
            .from('usuarios')
            .update({
              full_name: name,
              user_type: 'admin',
              phone: staffPayload,
              is_active: true
            })
            .eq('id', existing.id)
          if (promoError) throw promoError
          toast.success('Colaborador adicionado à equipe com sucesso!')
        } else {
          toast.error(`O e-mail ${email} não possui cadastro. Peça para o colaborador se cadastrar na tela inicial com o Código Exclusivo da empresa.`)
          return
        }
      }
      setIsOpenModal(false)
      fetchStaffData()
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      toast.error('Erro ao salvar membro da equipe.')
    }
  }

  const handleDeleteMember = async (id: string, memberName: string) => {
    if (id === currentUser?.id) {
      toast.error('Você não pode remover o seu próprio usuário da equipe.')
      return
    }
    if (confirm(`Tem certeza que deseja remover ${memberName} da equipe do escritório?`)) {
      try {
        const { error } = await supabase
          .from('usuarios')
          .update({
            user_type: 'client_user',
            phone: null
          })
          .eq('id', id)
        if (error) throw error
        toast.success(`Membro ${memberName} removido da equipe.`)
        fetchStaffData()
      } catch (err) {
        if (import.meta.env.DEV) console.error(err)
        toast.error('Erro ao remover membro da equipe.')
      }
    }
  }

  const filteredStaff = activeStaff.filter(s => {
    const fields = parseStaffFields(s)
    return (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      fields.role.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const filteredPending = pendingCollaborators.filter(p => {
    return (p.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Gestão de Equipe</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Gerencie os colaboradores do escritório e aprove novas solicitações de acesso</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/20 hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Novo Colaborador
        </button>
      </div>

      {/* Cartão de Código Exclusivo do Escritório */}
      <div className="p-4 rounded-xl border border-brand-500/20 bg-brand-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-500" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[hsl(var(--foreground))]">
              Código Exclusivo do Escritório
            </span>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Forneça este código aos novos colaboradores para que se cadastrem na tela inicial e aguardem aprovação.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-3.5 py-2 rounded-xl shadow-2xs">
          <span className="font-mono text-base font-black tracking-widest text-brand-600 dark:text-brand-400">
            #{officeCompany?.codigo_exclusivo || getCompanyCode(officeCompany?.id || '')}
          </span>
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] transition-colors"
            title="Copiar Código do Escritório"
          >
            {copiedCode ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navegação por Sub-abas & Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-4">
        {/* Abas */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('members')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
              activeSubTab === 'members'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            Membros da Equipe ({activeStaff.length})
          </button>

          <button
            onClick={() => setActiveSubTab('pending')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative',
              activeSubTab === 'pending'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
            )}
          >
            <Clock className="h-4 w-4" />
            Solicitações Pendentes
            {pendingCollaborators.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-extrabold animate-pulse">
                {pendingCollaborators.length}
              </span>
            )}
          </button>
        </div>

        {/* Busca */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Buscar por nome, cargo ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--card))] py-2 pl-9 pr-4 text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Conteúdo da Sub-aba: Membros Ativos da Equipe */}
      {activeSubTab === 'members' && (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  <th className="p-4">Colaborador</th>
                  <th className="p-4">Departamento</th>
                  <th className="p-4">Cargo</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))] text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                        <span>Carregando membros da equipe...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStaff.length > 0 ? (
                  filteredStaff.map(member => {
                    const fields = parseStaffFields(member)
                    return (
                      <tr key={member.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <h4 className="font-semibold text-[hsl(var(--foreground))]">{member.full_name}</h4>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">{member.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-[hsl(var(--muted-foreground))] font-medium">
                          {fields.department}
                        </td>
                        <td className="p-4 text-[hsl(var(--muted-foreground))]">
                          {fields.role}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20">
                            Ativo
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(member)}
                              className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                              title="Editar Colaborador"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id, member.full_name)}
                              disabled={member.id === currentUser?.id}
                              className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={member.id === currentUser?.id ? 'Você não pode remover seu próprio usuário' : 'Remover da Equipe'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                      Nenhum colaborador encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo da Sub-aba: Solicitações Pendentes */}
      {activeSubTab === 'pending' && (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  <th className="p-4">Colaborador Solicitante</th>
                  <th className="p-4">Data da Solicitação</th>
                  <th className="p-4">Código Utilizado</th>
                  <th className="p-4 text-center">Ações de Aprovação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))] text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                        <span>Buscando solicitações de acesso...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPending.length > 0 ? (
                  filteredPending.map(pending => (
                    <tr key={pending.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <h4 className="font-semibold text-[hsl(var(--foreground))]">{pending.full_name}</h4>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">{pending.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-[hsl(var(--muted-foreground))] font-semibold">
                        {new Date(pending.created_at).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(pending.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                          #{pending.codigo_empresa || officeCompany?.codigo_exclusivo || getCompanyCode(officeCompany?.id || '')}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApproveCollaborator(pending)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-all"
                            title="Aprovar Acesso"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleRejectCollaborator(pending)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-bold transition-all"
                            title="Recusar Solicitação"
                          >
                            <UserX className="h-3.5 w-3.5" />
                            Recusar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                      Nenhuma solicitação de colaborador pendente no momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Operações CRUD */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] mb-4 border-b border-[hsl(var(--border))] pb-2">
              {editingId ? 'Editar Colaborador' : 'Adicionar Novo Colaborador'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3.5 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">E-mail corporativo</label>
                  <input
                    type="email"
                    required
                    placeholder="nome@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3.5 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Cargo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Analista Fiscal Jr"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3.5 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Departamento</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3.5 py-2 text-sm focus:outline-none"
                >
                  <option value="Fiscal">Fiscal</option>
                  <option value="Contábil">Contábil</option>
                  <option value="Pessoal (DP)">Pessoal (DP)</option>
                  <option value="Societário">Societário</option>
                  <option value="T.I. / Suporte">T.I. / Suporte</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="rounded-xl border border-[hsl(var(--border))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--foreground))]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/20 hover:opacity-95 transition-all"
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
