import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, UserX, UserCheck, Mail, Shield, Check, Trash2, Edit2, Copy, Key, UserPlus, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { logAuditActivity } from '@/lib/audit'
import { createAdminNotification } from '@/lib/adminNotifications'
import { ROUTES } from '@/constants/routes'

export interface TeamMember {
  id: string
  companyUserId?: string
  name: string
  email: string
  phone?: string
  role: 'usuario_master' | 'usuario_comum'
  userType?: string
  status: string
  permissions: string[]
  createdAt?: string
  statusReason?: string
}

export function TeamPage() {
  const { company, user, isClientMaster, isAdmin, isLoading: authLoading } = useAuth()
  const [activeMembers, setActiveMembers] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'members' | 'requests'>('members')
  const [copiedId, setCopiedId] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'usuario_master' | 'usuario_comum'>('usuario_comum')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['strategic', 'monitoring', 'drive', 'tickets'])
  const [isLoading, setIsLoading] = useState(true)

  // Estados para edição de permissões
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [editingMember, setEditingMember] = useState<any | null>(null)
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const maxUsers = company?.max_users || 5
  const currentTotal = activeMembers.length + invites.length
  const canManageAccess = isClientMaster || isAdmin

  const fetchData = useCallback(async (silent = false) => {
    if (!company?.id) return
    if (!silent) setIsLoading(true)
    try {
      // 1. Tentar buscar via RPC SECURITY DEFINER para garantir acesso total aos perfis pelo Master
      const { data: rpcData, error: rpcError } = await (supabase as any).rpc('master_obter_membros_equipe', {
        p_company_id: company.id
      })

      if (!rpcError && Array.isArray(rpcData)) {
        const mappedActive: TeamMember[] = []
        const mappedPending: TeamMember[] = []

        rpcData.forEach((u: Record<string, any>) => {
          const isMaster = u.role === 'usuario_master' || u.role === 'client_master' || u.user_type === 'client_master'
          const item: TeamMember = {
            id: u.id,
            companyUserId: u.company_user_id,
            name: u.full_name || (u.email ? u.email.split('@')[0] : 'Usuário'),
            email: u.email || '',
            phone: u.phone || '',
            role: isMaster ? 'usuario_master' : 'usuario_comum',
            userType: u.user_type,
            status: u.link_is_active ? 'active' : 'inactive',
            permissions: u.permissions || [],
            createdAt: u.link_created_at || u.created_at,
            statusReason: u.status_reason
          }

          if (u.link_is_active || u.status_reason === 'Desativado pelo Gestor' || u.status_reason === 'Desativado pelo Usuário Master' || u.status_reason === 'Desativado pelo Administrador') {
            mappedActive.push(item)
          } else if (!u.status_reason) {
            mappedPending.push(item)
          }
        })

        setActiveMembers(mappedActive)
        setPendingRequests(mappedPending)

        // Buscar convites pendentes
        const { data: inviteData } = await supabase
          .from('convites')
          .select('id, email, role, expires_at')
          .eq('company_id', company.id)
          .is('accepted_at', null)

        setInvites((inviteData || []).map((inv: any) => ({
          id: inv.id,
          email: inv.email,
          role: inv.role,
          status: 'pending',
          expires: new Date(inv.expires_at).toLocaleDateString('pt-BR')
        })))

        if (!silent) setIsLoading(false)
        return
      }

      // 2. Fallback: Buscar via queries padrão caso a RPC não esteja pronta
      const { data: teamData, error: teamError } = await supabase
        .from('usuarios_empresa')
        .select(`
          id,
          role,
          permissions,
          is_active,
          created_at,
          user_id,
          usuarios (
            id,
            full_name,
            email,
            phone,
            user_type,
            created_at,
            status_reason
          )
        `)
        .eq('company_id', company.id)
      if (teamError) throw teamError

      const allUserIds = (teamData || []).map((tu: any) => tu.user_id).filter(Boolean)

      let extraUsersMap: Record<string, any> = {}

      if (allUserIds.length > 0) {
        const { data: extraUsers } = await supabase
          .from('usuarios')
          .select('id, full_name, email, phone, user_type, created_at, status_reason')
          .in('id', allUserIds)
        
        if (extraUsers) {
          extraUsers.forEach((u: any) => {
            extraUsersMap[u.id] = u
          })
        }
      }

      const { data: directCompanyUsers } = await supabase
        .from('usuarios')
        .select('id, full_name, email, phone, user_type, created_at, status_reason')
        .or(`company_id.eq.${company.id},codigo_empresa.eq.${(company as any).codigo_exclusivo || company.id}`)

      if (directCompanyUsers) {
        directCompanyUsers.forEach((u: any) => {
          if (!extraUsersMap[u.id]) {
            extraUsersMap[u.id] = u
          }
        })
      }

      const mappedActive: TeamMember[] = []
      const mappedPending: TeamMember[] = []

      ;(teamData || []).forEach((tu: any) => {
        const uRel = Array.isArray(tu.usuarios) ? tu.usuarios[0] : tu.usuarios
        const userObj = (uRel && uRel.full_name) ? uRel : (extraUsersMap[tu.user_id] || uRel)
        const nameVal = userObj?.full_name || (userObj?.email ? userObj.email.split('@')[0] : 'Usuário')
        const emailVal = userObj?.email || ''
        const phoneVal = userObj?.phone || ''
        const isMaster = tu.role === 'usuario_master' || tu.role === 'client_master' || userObj?.user_type === 'client_master'

        const item: TeamMember = {
          id: userObj?.id || tu.user_id,
          companyUserId: tu.id,
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          role: isMaster ? 'usuario_master' : 'usuario_comum',
          userType: userObj?.user_type,
          status: tu.is_active ? 'active' : 'inactive',
          permissions: tu.permissions || [],
          createdAt: userObj?.created_at || tu.created_at,
          statusReason: userObj?.status_reason
        }

        if (tu.is_active || userObj?.status_reason === 'Desativado pelo Gestor' || userObj?.status_reason === 'Desativado pelo Usuário Master' || userObj?.status_reason === 'Desativado pelo Administrador') {
          mappedActive.push(item)
        } else if (!userObj?.status_reason) {
          // Apenas solicitações pendentes de novos acessos entram em pendentes
          mappedPending.push(item)
        }
      })

      setActiveMembers(mappedActive)
      setPendingRequests(mappedPending)

      // 2. Buscar convites pendentes
      const { data: inviteData, error: inviteError } = await supabase
        .from('convites')
        .select('id, email, role, expires_at')
        .eq('company_id', company.id)
        .is('accepted_at', null)
      if (inviteError) throw inviteError

      const mappedInvites = (inviteData || []).map((inv: any) => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        status: 'pending',
        expires: new Date(inv.expires_at).toLocaleDateString('pt-BR')
      }))
      setInvites(mappedInvites)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Erro ao buscar dados da equipe:', err)
      }
      if (!silent) toast.error('Erro ao carregar dados da equipe.')
    } finally {
      if (!silent) setIsLoading(false)
    }
  }, [company?.id, (company as any)?.codigo_exclusivo])

  useEffect(() => {
    if (authLoading) return
    if (!company?.id) {
      setIsLoading(false)
      return
    }
    fetchData()

    const handleRefresh = () => fetchData(true)
    window.addEventListener('bi2b:refresh-data', handleRefresh)
    return () => window.removeEventListener('bi2b:refresh-data', handleRefresh)
  }, [company?.id, authLoading, fetchData])

  const handleCopyCompanyId = () => {
    if (company?.id) {
      const code = (company as any).codigo_exclusivo || company.id
      navigator.clipboard.writeText(code)
      setCopiedId(true)
      toast.success('ID Exclusivo da Empresa copiado!')
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  const handleApproveRequest = async (companyUserId: string, userId: string, name: string) => {
    try {
      // 1. Aprovar vínculo na empresa em usuarios_empresa
      const { error: linkError } = await supabase
        .from('usuarios_empresa')
        .update({ is_active: true })
        .eq('id', companyUserId)
      if (linkError) throw linkError

      // 2. Tentar ativar o perfil em usuarios se a permissão RLS permitir
      if (userId) {
        const { error: userError } = await (supabase as any)
          .from('usuarios')
          .update({ is_active: true })
          .eq('id', userId)

        if (userError && import.meta.env.DEV) {
          console.warn('Aviso RLS ao atualizar tabela usuarios (não impeditivo):', userError.message)
        }
      }

      logAuditActivity({
        userId: user?.id,
        companyId: company?.id,
        action: 'APROVAR_SOLICITACAO_USUARIO',
        entityType: 'usuarios',
        entityId: userId,
        metadata: {
          approved_user_id: userId,
          approved_user_name: name,
          origin: 'Painel do Cliente (Gestor)'
        }
      })

      toast.success(`Acesso de ${name} aprovado com sucesso!`)
      fetchData()
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Erro ao aprovar solicitação:', err)
      toast.error(err.message || 'Erro ao aprovar solicitação de acesso.')
    }
  }

  const handleRejectRequest = async (companyUserId: string, userId: string, name: string) => {
    if (!company?.id) return
    if (confirm(`Deseja recusar a solicitação de acesso de ${name}?`)) {
      try {
        logAuditActivity({
          userId: user?.id,
          companyId: company.id,
          action: 'RECUSAR_SOLICITACAO_USUARIO',
          entityType: 'usuarios',
          entityId: userId,
          metadata: {
            rejected_user_id: userId,
            rejected_user_name: name,
            origin: 'Painel do Cliente (Gestor)'
          }
        })
        // 1. Tentar chamar RPC SECURITY DEFINER para desvinculação atômica e atribuição de motivo
        const { error: rpcError } = await (supabase as any).rpc('master_recusar_solicitacao', {
          p_company_id: company.id,
          p_user_id: userId
        })

        if (rpcError) {
          if (import.meta.env.DEV) console.warn('Aviso RPC master_recusar_solicitacao, executando fallback:', rpcError.message)

          // Fallback manual:
          if (userId) {
            await (supabase as any)
              .from('usuarios')
              .update({
                is_active: false,
                status_reason: 'Solicitação recusada pelo Gestor',
                company_id: null,
                codigo_empresa: null
              })
              .eq('id', userId)
          }

          if (companyUserId) {
            await supabase
              .from('usuarios_empresa')
              .delete()
              .eq('id', companyUserId)
          } else if (userId && company.id) {
            await supabase
              .from('usuarios_empresa')
              .delete()
              .eq('company_id', company.id)
              .eq('user_id', userId)
          }
        }

        toast.info(`Solicitação de ${name} recusada com sucesso.`)
        fetchData()
      } catch (err: any) {
        if (import.meta.env.DEV) console.error('Erro ao recusar solicitação:', err)
        toast.error(err.message || 'Erro ao recusar solicitação.')
      }
    }
  }

  const handleToggleStatus = async (userId: string) => {
    const member = activeMembers.find(m => m.id === userId)
    if (!member || !company?.id) return
    const nextStatus = member.status === 'active' ? false : true
    try {
      if (nextStatus) {
        // Ativar usuário
        await (supabase as any)
          .from('usuarios')
          .update({ is_active: true, status_reason: null })
          .eq('id', userId)

        await (supabase as any)
          .from('usuarios_empresa')
          .update({ is_active: true })
          .eq('company_id', company.id)
          .eq('user_id', userId)

        toast.success(`Usuário ${member.name} ativado com sucesso!`)
      } else {
        // Desativar usuário (Mantém o vínculo com a empresa)
        await (supabase as any)
          .from('usuarios')
          .update({
            is_active: false,
            status_reason: 'Desativado pelo Gestor'
          })
          .eq('id', userId)

        await (supabase as any)
          .from('usuarios_empresa')
          .update({ is_active: false })
          .eq('company_id', company.id)
          .eq('user_id', userId)

        toast.info(`Usuário ${member.name} desativado com sucesso.`)
      }
      fetchData()
    } catch (err: any) {
      if (import.meta.env.DEV) console.error(err)
      toast.error('Erro ao alterar status do usuário.')
    }
  }

  const handleRemoveUser = async (userId: string, name: string) => {
    if (!company?.id) return
    if (confirm(`Tem certeza que deseja remover ${name} da equipe?`)) {
      try {
        // 1. Chamar RPC SECURITY DEFINER para garantir remoção atômica do vínculo e atualização do motivo
        const { error: rpcError } = await (supabase as any).rpc('master_remover_usuario_equipe', {
          p_company_id: company.id,
          p_user_id: userId
        })

        if (rpcError) {
          if (import.meta.env.DEV) {
            console.warn('RPC master_remover_usuario_equipe retornou aviso, executando fallback:', rpcError.message)
          }

          // Fallback: 1º Marca motivo de remoção, desativa e desvincula a empresa na tabela usuarios
          await (supabase as any)
            .from('usuarios')
            .update({
              is_active: false,
              status_reason: 'Removido pelo Gestor',
              company_id: null,
              codigo_empresa: null
            })
            .eq('id', userId)

          // 2º Tenta excluir o vínculo de usuarios_empresa
          const { error: deleteErr } = await supabase
            .from('usuarios_empresa')
            .delete()
            .eq('company_id', company.id)
            .eq('user_id', userId)

          // 3º Se a exclusão falhar devido a RLS, marca usuarios_empresa como inativo
          if (deleteErr) {
            await (supabase as any)
              .from('usuarios_empresa')
              .update({ is_active: false })
              .eq('company_id', company.id)
              .eq('user_id', userId)
          }
        }

        toast.success(`Usuário ${name} removido da empresa com sucesso!`)
        fetchData()
      } catch (err: any) {
        if (import.meta.env.DEV) console.error('Erro ao remover usuário:', err)
        toast.error(err.message || 'Erro ao remover usuário.')
      }
    }
  }

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim() || !company?.id || !user?.id) return

    if (currentTotal >= maxUsers) {
      toast.error(`Limite de ${maxUsers} usuários por empresa atingido!`)
      setIsOpenModal(false)
      return
    }

    try {
      const secureToken = crypto.randomUUID()
      const { error } = await supabase
        .from('convites')
        .insert({
          company_id: company.id,
          email: inviteEmail.trim(),
          role: inviteRole,
          permissions: inviteRole === 'usuario_master' ? ['all'] : selectedPermissions,
          token: secureToken,
          invited_by: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      if (error) throw error

      await createAdminNotification({
        userId: user.id,
        companyId: company.id,
        companyName: company.trade_name || company.name,
        title: 'Novo Convite de Usuário/Colaborador',
        message: `${company.trade_name || company.name} convidou ${inviteEmail.trim()} para participar da equipe.`,
        type: 'info',
        actionUrl: ROUTES.ADMIN_USERS,
      })

      toast.success(`Convite enviado para ${inviteEmail}`)
      setInviteEmail('')
      setIsOpenModal(false)
      fetchData()
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      toast.error('Erro ao enviar convite.')
    }
  }

  const handleDeleteInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('convites')
        .delete()
        .eq('id', inviteId)
      if (error) throw error
      toast.success('Convite excluído.')
      fetchData()
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      toast.error('Erro ao excluir convite.')
    }
  }

  const handleOpenEdit = (member: any) => {
    setEditingMember(member)
    setEditPermissions(member.permissions || [])
    setIsOpenEditModal(true)
  }

  const toggleEditPermission = (perm: string) => {
    setEditPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    )
  }

  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('usuarios_empresa')
        .update({
          permissions: editPermissions
        })
        .eq('id', editingMember.companyUserId)

      if (error) throw error

      toast.success('Permissões atualizadas com sucesso!')
      setIsOpenEditModal(false)
      fetchData()
    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro ao atualizar permissões:', err)
      toast.error('Erro ao salvar as permissões.')
    } finally {
      setIsSaving(false)
    }
  }

  const togglePermission = (perm: string) => {
    setSelectedPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/30">
            <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Gestão de Equipe</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Gerencie os usuários que têm acesso aos dados da sua empresa</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (currentTotal >= maxUsers) {
              toast.error(`Limite de ${maxUsers} usuários atingido!`)
            } else {
              setIsOpenModal(true)
            }
          }}
          disabled={currentTotal >= maxUsers}
          className="flex items-center gap-2 rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Convidar Membro
        </button>
      </div>

      {/* Card do ID Exclusivo da Empresa */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
            <Key className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">ID Exclusivo da Empresa</p>
            <p className="font-mono text-base font-bold tracking-widest text-[hsl(var(--foreground))] select-all">{(company as any)?.codigo_exclusivo || company?.id || 'N/A'}</p>
          </div>
        </div>
        <button
          onClick={handleCopyCompanyId}
          disabled={!company?.id}
          className="flex items-center gap-1.5 rounded-lg border border-brand-500/30 bg-[hsl(var(--card))] px-3.5 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-500/10 transition-colors shadow-xs"
        >
          {copiedId ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copiedId ? 'Copiado!' : 'Copiar ID'}
        </button>
      </div>

      {/* Banner de Progresso de Limite de Usuários */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-[hsl(var(--foreground))]">Limite da Empresa</span>
          <span className="font-semibold text-brand-500">{currentTotal} / {maxUsers} usuários utilizados</span>
        </div>
        <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2">
          <div 
            className="bg-brand-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentTotal / maxUsers) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
          O seu plano permite no máximo {maxUsers} usuários simultâneos por empresa.
        </p>
      </div>



      {/* Seção Principal de Abas: Membros vs Solicitações */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4">
        <div className="flex border-b border-[hsl(var(--border))] gap-6">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'members'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <Users className="h-4 w-4" />
            Membros da Equipe ({activeMembers.length})
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 relative ${
              activeTab === 'requests'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Solicitações de Acesso
            {pendingRequests.length > 0 && (
              <span className="relative flex items-center justify-center ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative rounded-full bg-amber-500 text-white text-[11px] font-extrabold px-2 py-0.5 shadow-xs">
                  {pendingRequests.length}
                </span>
              </span>
            )}
          </button>
        </div>

        {/* ABA 1: MEMBROS DA EQUIPE */}
        {activeTab === 'members' && (
          <div className="divide-y divide-[hsl(var(--border))]">
            {isLoading ? (
              <div className="py-4 text-center text-xs text-[hsl(var(--muted-foreground))]">
                Carregando membros da equipe...
              </div>
            ) : activeMembers.length > 0 ? (
              activeMembers.map(member => (
                <div key={member.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold dark:bg-brand-900/40 dark:text-brand-400">
                      {(member.name || '').charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">{member.name}</h4>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{member.email}</p>
                    </div>
                  </div>

                  {/* Permissões & Cargos/Funções */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                      member.role === 'usuario_master' || member.role === 'client_master' || member.userType === 'client_master'
                        ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40'
                        : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40'
                    )}>
                      <Shield className="h-3 w-3" />
                      {member.role === 'usuario_master' || member.role === 'client_master' || member.userType === 'client_master' ? 'Gestor' : 'Colaborador'}
                    </span>
                    
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      member.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    )}>
                      {member.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        disabled={member.role === 'usuario_master' || member.id === user?.id || !canManageAccess}
                        className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
                        title={member.id === user?.id ? 'Você não pode editar o seu próprio perfil' : member.role === 'usuario_master' ? 'Gestores possuem acesso total' : 'Editar permissões'}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(member.id)}
                        disabled={member.role === 'usuario_master' || member.id === user?.id || !canManageAccess}
                        className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
                        title={member.id === user?.id ? 'Você não pode desativar o seu próprio perfil' : member.role === 'usuario_master' ? 'O Gestor não pode ser desativado' : (member.status === 'active' ? 'Desativar usuário' : 'Ativar usuário')}
                      >
                        {member.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleRemoveUser(member.id, member.name)}
                        disabled={member.role === 'usuario_master' || member.id === user?.id || !canManageAccess}
                        className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={member.id === user?.id ? 'Você não pode remover o seu próprio perfil' : 'Remover'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-[hsl(var(--muted-foreground))]">
                Nenhum membro na equipe.
              </div>
            )}
          </div>
        )}

        {/* ABA 2: SOLICITAÇÕES DE ACESSO PENDENTES */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {!canManageAccess && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Apenas o Gestor ou Administrador pode aprovar novas solicitações.</span>
              </div>
            )}

            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      <th className="p-4">Nome</th>
                      <th className="p-4">Perfil</th>
                      <th className="p-4">Solicitado em</th>
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
                            <span>Carregando solicitações...</span>
                          </div>
                        </td>
                      </tr>
                    ) : pendingRequests.length > 0 ? (
                      pendingRequests.map(req => (
                        <tr key={req.companyUserId} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                          <td className="p-4">
                            <div>
                              <h4 className="font-semibold text-[hsl(var(--foreground))]">{req.name}</h4>
                              <p className="text-xs text-[hsl(var(--muted-foreground))]">{req.email || 'Sem e-mail'}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                              req.role === 'usuario_master' || req.role === 'client_master' || req.userType === 'client_master'
                                ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40'
                                : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40'
                            )}>
                              {req.role === 'usuario_master' || req.role === 'client_master' || req.userType === 'client_master' ? 'Gestor' : 'Colaborador'}
                            </span>
                          </td>
                          <td className="p-4 text-[hsl(var(--muted-foreground))] text-xs font-medium">
                            {req.createdAt
                              ? new Date(req.createdAt).toLocaleString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : '-'}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold border bg-amber-500/15 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-500/20">
                              Aguardando Aprovação
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleApproveRequest(req.companyUserId, req.id, req.name)}
                                disabled={!canManageAccess}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white transition-colors disabled:opacity-50"
                                title="Aprovar Solicitação de Acesso"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => handleRejectRequest(req.companyUserId, req.id, req.name)}
                                disabled={!canManageAccess}
                                className="rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-600 transition-colors disabled:opacity-50"
                                title="Recusar Solicitação"
                              >
                                Recusar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                          Nenhuma solicitação de acesso pendente no momento.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Convites Pendentes */}
      {invites.length > 0 && (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Convites por E-mail Pendentes</h3>
          <div className="divide-y divide-[hsl(var(--border))]">
            {invites.map(invite => (
              <div key={invite.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{invite.email}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Expira em: {invite.expires}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-semibold dark:bg-amber-950/20 dark:text-amber-400">
                    Aguardando aceite
                  </span>
                  <button
                    onClick={() => handleDeleteInvite(invite.id)}
                    className="p-1.5 rounded hover:bg-rose-50 text-[hsl(var(--muted-foreground))] hover:text-rose-500"
                    title="Excluir convite"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg p-6 relative shadow-none">
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] mb-4 border-b border-[hsl(var(--border))] pb-2">
              Convidar Novo Usuário
            </h3>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Email corporativo</label>
                <input
                  type="email"
                  required
                  placeholder="usuario@empresa.com.br"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 shadow-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nível de permissão</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none shadow-none"
                >
                  <option value="usuario_comum">Colaborador (Apenas módulos liberados)</option>
                  <option value="usuario_master" disabled>Gestor (Limite de 1 por empresa atingido)</option>
                </select>
              </div>

              {inviteRole === 'usuario_comum' && (
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-2">Permissões de Acesso</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'strategic', label: 'Guias e Impostos' },
                      { id: 'monitoring', label: 'Tarefas' },
                      { id: 'drive', label: 'Drive' },
                      { id: 'tickets', label: 'Chamados' },
                      { id: 'settings', label: 'Configurações' },
                    ].map(perm => (
                      <button
                        type="button"
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={cn(
                          'flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all shadow-none',
                          selectedPermissions.includes(perm.id)
                            ? 'border-brand-500 bg-brand-50/50 text-[hsl(var(--foreground))] dark:bg-brand-950/20'
                            : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
                        )}
                      >
                        {perm.label}
                        {selectedPermissions.includes(perm.id) && <Check className="h-3 w-3 text-brand-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))] shadow-none"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-none"
                >
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição de Permissões */}
      {isOpenEditModal && editingMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg p-6 relative shadow-none">
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] mb-4 border-b border-[hsl(var(--border))] pb-2">
              Editar Permissões de Acesso
            </h3>
            <form onSubmit={handleSavePermissions} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nome</label>
                <input
                  type="text"
                  disabled
                  value={editingMember.name || ''}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--muted))] px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed shadow-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">E-mail</label>
                <input
                  type="email"
                  disabled
                  value={editingMember.email || ''}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--muted))] px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed shadow-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-2">Módulos Liberados</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'strategic', label: 'Guias e Impostos' },
                    { id: 'monitoring', label: 'Tarefas' },
                    { id: 'drive', label: 'Drive' },
                    { id: 'tickets', label: 'Chamados' },
                    { id: 'settings', label: 'Configurações' },
                  ].map(perm => (
                    <button
                      type="button"
                      key={perm.id}
                      onClick={() => toggleEditPermission(perm.id)}
                      className={cn(
                        'flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all shadow-none',
                        editPermissions.includes(perm.id)
                          ? 'border-brand-500 bg-brand-50/50 text-[hsl(var(--foreground))] dark:bg-brand-950/20'
                          : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
                      )}
                    >
                      {perm.label}
                      {editPermissions.includes(perm.id) && <Check className="h-3 w-3 text-brand-500" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpenEditModal(false)}
                  className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))] shadow-none"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 flex items-center gap-1.5 shadow-none"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
