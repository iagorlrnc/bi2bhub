import { useState, useEffect } from 'react'
import { Search, Key, UserX, Loader2, Edit2, UserPlus, Users, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { cn, isBi2bCompany } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { logAuditActivity } from '@/lib/audit'
import { STRONG_PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from '@/constants'

export function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'client_master' | 'client_user' | 'pending'>('all')

  // Estados para edição/vinculação
  const [companies, setCompanies] = useState<any[]>([])
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [editFullName, setEditFullName] = useState('')
  const [editUserType, setEditUserType] = useState<'admin' | 'client_master' | 'client_user'>('client_user')
  const [editCompanyId, setEditCompanyId] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  // Estados para redefinição de senha
  const [isOpenResetModal, setIsOpenResetModal] = useState(false)
  const [resetUser, setResetUser] = useState<any | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isResetting, setIsResetting] = useState(false)

  const handleApproveUserAccess = async (userToApprove: any) => {
    try {
      const companyUserObj = Array.isArray(userToApprove.company_users) ? userToApprove.company_users[0] : userToApprove.company_users
      const matchedComp = companies.find(c => (c.codigo_exclusivo && String(c.codigo_exclusivo).trim() === userToApprove.codigo_empresa) || c.id === userToApprove.codigo_empresa)
      const companyIdToLink = userToApprove.company_id || companyUserObj?.company_id || companyUserObj?.company?.id || matchedComp?.id

      const { error: userError } = await (supabase as any)
        .from('usuarios')
        .update({ is_active: true, status_reason: null, company_id: companyIdToLink || null })
        .eq('id', userToApprove.id)

      if (userError) throw userError

      if (companyIdToLink) {
        const { error: linkError } = await (supabase as any)
          .from('usuarios_empresa')
          .upsert({
            company_id: companyIdToLink,
            user_id: userToApprove.id,
            role: userToApprove.user_type === 'client_master' ? 'usuario_master' : 'usuario_comum',
            permissions: userToApprove.user_type === 'client_master' ? ['all'] : ['dashboard', 'strategic', 'monitoring', 'xml', 'drive', 'tickets'],
            is_active: true
          }, { onConflict: 'user_id' })

        if (linkError) throw linkError
      } else {
        const { error: linkError } = await supabase
          .from('usuarios_empresa')
          .update({ is_active: true })
          .eq('user_id', userToApprove.id)

        if (linkError) throw linkError
      }

      logAuditActivity({
        userId: currentUser?.id,
        companyId: companyIdToLink || userToApprove.companies?.[0]?.id || null,
        action: 'APROVAR_SOLICITACAO_USUARIO',
        entityType: 'usuarios',
        entityId: userToApprove.id,
        metadata: {
          approved_user_id: userToApprove.id,
          approved_user_name: userToApprove.full_name,
          approved_user_email: userToApprove.email,
          user_type: userToApprove.user_type,
          origin: 'Painel Admin (Aprovação de Usuário)'
        }
      })

      toast.success(`Acesso de ${userToApprove.full_name} aprovado com sucesso!`)
      fetchUsers()
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Erro ao aprovar:', err)
      toast.error(err.message || 'Erro ao aprovar acesso do usuário.')
    }
  }

  const handleRejectUserAccess = async (userToReject: any) => {
    if (confirm(`Deseja recusar a solicitação de acesso de ${userToReject.full_name}?`)) {
      try {
        const { error: linkError } = await supabase
          .from('usuarios_empresa')
          .delete()
          .eq('user_id', userToReject.id)

        if (linkError) throw linkError

        logAuditActivity({
          userId: currentUser?.id,
          companyId: userToReject.companies?.[0]?.id || null,
          action: 'RECUSAR_SOLICITACAO_USUARIO',
          entityType: 'usuarios',
          entityId: userToReject.id,
          metadata: {
            rejected_user_id: userToReject.id,
            rejected_user_name: userToReject.full_name,
            rejected_user_email: userToReject.email,
            origin: 'Painel Admin'
          }
        })

        toast.info(`Solicitação de ${userToReject.full_name} recusada.`)
        fetchUsers()
      } catch (err) {
        if (import.meta.env.DEV) console.error(err)
        toast.error('Erro ao recusar solicitação.')
      }
    }
  }

  const handleDeleteUser = async (userToDelete: any) => {
    if (userToDelete.id === currentUser?.id) {
      toast.error('Você não pode remover a sua própria conta.')
      return
    }

    const userName = userToDelete.full_name || userToDelete.email
    if (confirm(`Tem certeza que deseja apagar permanentemente o usuário ${userName} da autenticação e do banco de dados? Esta ação não pode ser desfeita.`)) {
      try {
        const targetId = userToDelete.id

        // Desvincular e limpar chaves estrangeiras em tabelas dependentes (chamados, mensagens, notificacoes, etc)
        // para evitar violações de Foreign Key ao remover da tabela usuarios
        await Promise.allSettled([
          (supabase as any).from('chamados').update({ assigned_to: null }).eq('assigned_to', targetId),
          (supabase as any).from('chamados').update({ created_by: null }).eq('created_by', targetId),
          (supabase as any).from('mensagens_chamado').update({ sender_id: null }).eq('sender_id', targetId),
          (supabase as any).from('chamados_mensagens').update({ sender_id: null }).eq('sender_id', targetId),
          (supabase as any).from('atividades').update({ user_id: null }).eq('user_id', targetId),
          (supabase as any).from('notificacoes').delete().eq('user_id', targetId),
          (supabase as any).from('usuarios_empresa').delete().eq('user_id', targetId)
        ])

        // 1. Chamar RPC SECURITY DEFINER para remover do auth.users, usuarios e usuarios_empresa
        const { error: rpcError } = await (supabase as any).rpc('admin_deletar_usuario', {
          target_user_id: targetId
        })

        if (rpcError) {
          if (import.meta.env.DEV) {
            console.warn('RPC admin_deletar_usuario retornou aviso, executando remoção direta:', rpcError.message)
          }
          // Fallback: Excluir vínculo em usuarios_empresa e registro em usuarios
          await (supabase as any).from('usuarios_empresa').delete().eq('user_id', targetId)
          const { error: deleteErr } = await (supabase as any).from('usuarios').delete().eq('id', targetId)
          if (deleteErr) throw deleteErr
        }

        logAuditActivity({
          userId: currentUser?.id,
          companyId: userToDelete.companies?.[0]?.id || null,
          action: 'EXCLUIR_USUARIO',
          entityType: 'usuarios',
          entityId: targetId,
          metadata: {
            deleted_user_name: userName,
            deleted_user_email: userToDelete.email
          }
        })

        toast.success(`Usuário ${userName} removido da autenticação e do banco de dados com sucesso!`)
        fetchUsers()
      } catch (err: any) {
        if (import.meta.env.DEV) console.error('Erro ao excluir usuário:', err)

        let userFriendlyMsg = err.message || 'Erro ao apagar usuário do banco de dados.'
        if (userFriendlyMsg.includes('foreign key constraint') || userFriendlyMsg.includes('violates') || userFriendlyMsg.includes('fkey')) {
          userFriendlyMsg = `Não é possível excluir o usuário "${userName}" porque existem chamados, mensagens ou histórico de atendimentos vinculados a este usuário.`
        }

        toast.error(userFriendlyMsg)
      }
    }
  }

  const fetchUsers = async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*, company_users:usuarios_empresa(company_id, is_active, company:empresas(id, name, codigo_exclusivo))')
        .order('full_name', { ascending: true })
      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro ao buscar usuários:', err)
      if (!silent) toast.error('Erro ao buscar usuários do banco.')
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, name, trade_name, codigo_exclusivo')
        .eq('is_active', true)
        .order('name', { ascending: true })
      if (error) throw error
      setCompanies((data || []).filter((c) => !isBi2bCompany(c)))
    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro ao buscar empresas:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchCompanies()

    const handleRefresh = () => fetchUsers(true)
    window.addEventListener('bi2b:refresh-data', handleRefresh)
    return () => window.removeEventListener('bi2b:refresh-data', handleRefresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (id === currentUser?.id) {
      toast.error('Você não pode desativar o seu próprio usuário.')
      return
    }
    try {
      const nextStatus = !currentStatus
      
      const { error: userError } = await (supabase as any)
        .from('usuarios')
        .update({
          is_active: nextStatus,
          status_reason: nextStatus ? null : 'Desativado pelo Administrador'
        })
        .eq('id', id)
      if (userError) throw userError

      const { error: linkError } = await (supabase as any)
        .from('usuarios_empresa')
        .update({ is_active: nextStatus })
        .eq('user_id', id)

      if (linkError && import.meta.env.DEV) {
        console.warn('Aviso RLS ao atualizar usuarios_empresa:', linkError.message)
      }

      toast.success(nextStatus ? 'Status do usuário ativado com sucesso!' : 'Status do usuário desativado com sucesso.')
      fetchUsers()
    } catch (err: any) {
      if (import.meta.env.DEV) console.error(err)
      toast.error(err.message || 'Erro ao atualizar status do usuário.')
    }
  }

  const handleOpenResetModal = (user: any) => {
    setResetUser(user)
    setNewPassword('')
    setConfirmPassword('')
    setIsOpenResetModal(true)
  }

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetUser) return

    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      toast.error(PASSWORD_REQUIREMENTS_MESSAGE)
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    setIsResetting(true)
    try {
      let { error } = await (supabase as any).rpc('admin_redefinir_senha_usuario', {
        target_user_id: resetUser.id,
        new_password: newPassword
      })

      if (error) {
        const { error: err2 } = await (supabase as any).rpc('admin_reset_user_password', {
          target_user_id: resetUser.id,
          new_password: newPassword
        })
        if (err2) throw error
      }

      toast.success(`Senha de ${resetUser.full_name} alterada com sucesso!`)
      setIsOpenResetModal(false)
      setResetUser(null)
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Erro ao redefinir senha:', err)
      toast.error(err.message || 'Erro ao redefinir a senha do usuário.')
    } finally {
      setIsResetting(false)
    }
  }

  const handleOpenEdit = (user: any) => {
    setEditingUser(user)
    setEditFullName(user.full_name || '')
    setEditUserType(user.user_type || 'client_user')
    const companyUserObj = Array.isArray(user.company_users) ? user.company_users[0] : user.company_users
    const isRemoved = user.status_reason === 'Removido pelo Gestor' || user.status_reason === 'Removido pelo Usuário Master' || (!companyUserObj && user.user_type !== 'admin')
    const linkedCompanyId = isRemoved
      ? ''
      : (user.company_id || companyUserObj?.company_id || companyUserObj?.company?.id || '')
    setEditCompanyId(linkedCompanyId)
    setIsOpenEditModal(true)
  }

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setIsSaving(true)
    try {
      // Validar limite de 1 gestor por empresa
      if (editUserType === 'client_master') {
        if (!editCompanyId) {
          toast.error('Selecione uma empresa para vincular o usuário.')
          setIsSaving(false)
          return
        }

        const { data: existingMaster, error: masterCheckError } = await supabase
          .from('usuarios_empresa')
          .select('id, user_id')
          .eq('company_id', editCompanyId)
          .eq('role', 'usuario_master')
          .neq('user_id', editingUser.id)
          .maybeSingle()

        if (masterCheckError) throw masterCheckError
        if (existingMaster) {
          toast.error('Esta empresa já possui um Gestor. Cada empresa pode ter apenas 1 Gestor.')
          setIsSaving(false)
          return
        }
      }

      const matchedComp = companies.find(c => c.id === editCompanyId)
      const isBi2bOffice = matchedComp?.name?.toLowerCase().includes('bi2b') || editUserType === 'admin'
      const finalUserType = isBi2bOffice ? 'admin' : editUserType

      // 1. Atualizar o perfil do usuário
      const { error: profileError } = await (supabase as any)
        .from('usuarios')
        .update({
          full_name: editFullName,
          user_type: finalUserType,
          company_id: editCompanyId || null,
          codigo_empresa: matchedComp?.codigo_exclusivo || editCompanyId || null,
          status_reason: null
        })
        .eq('id', editingUser.id)

      if (profileError) throw profileError

      // 2. Tratar vinculação com a empresa
      // Remove qualquer vínculo anterior existente para evitar problemas de restrição
      const { error: deleteError } = await supabase
        .from('usuarios_empresa')
        .delete()
        .eq('user_id', editingUser.id)

      if (deleteError) throw deleteError

      // Se for do tipo cliente, cria o novo vínculo
      if (editUserType === 'client_master' || editUserType === 'client_user') {
        if (!editCompanyId) {
          toast.error('Selecione uma empresa para vincular o usuário.')
          setIsSaving(false)
          return
        }

        const { error: insertError } = await (supabase as any)
          .from('usuarios_empresa')
          .insert({
            user_id: editingUser.id,
            company_id: editCompanyId,
            role: (editUserType === 'client_master' ? 'usuario_master' : 'usuario_comum') as any,
            permissions: editUserType === 'client_master' ? ['all'] : ['dashboard', 'strategic', 'monitoring', 'xml', 'drive', 'tickets'],
            is_active: editingUser.is_active ?? true
          })
        if (insertError) throw insertError
      }

      logAuditActivity({
        userId: currentUser?.id,
        action: 'ATUALIZAR_PERFIL_USUARIO',
        entityType: 'usuarios',
        entityId: editingUser.id,
        metadata: { full_name: editFullName, user_type: editUserType, company_id: editCompanyId }
      })

      toast.success('Usuário atualizado com sucesso!')
      setIsOpenEditModal(false)
      fetchUsers()
    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro ao atualizar usuário:', err)
      toast.error('Erro ao atualizar dados e vinculação.')
    } finally {
      setIsSaving(false)
    }
  }

  const isUserPending = (u: any) => {
    if (u.user_type === 'admin') {
      return !u.is_active
    }
    if (u.status_reason) {
      return false
    }
    const companyUserObj = Array.isArray(u.company_users) ? u.company_users[0] : u.company_users
    if (!companyUserObj) {
      return false
    }
    return !u.is_active || companyUserObj.is_active === false
  }

  const pendingCount = users.filter(u => isUserPending(u)).length

  const filteredUsers = users.filter(u => {
    const name = u.full_name || ''
    const email = u.email || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase())
    if (!matchesSearch) return false

    if (filterType === 'pending') {
      return isUserPending(u)
    }

    const matchesType = filterType === 'all' || u.user_type === filterType
    return matchesType
  })

  return (
    <div className="space-y-6">
      {/* Cabeçalho Principal com Botão de Destaque no Topo Direito */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[hsl(var(--border))] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Gestão de Usuários</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Gerencie permissões, contas de acesso e solicitações de novos membros</p>
          </div>
        </div>

        {/* Botão de Solicitações no Cabeçalho Superior */}
        <button
          onClick={() => setFilterType(filterType === 'pending' ? 'all' : 'pending')}
          className={cn(
            'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-md relative shrink-0',
            filterType === 'pending'
              ? 'bg-blue-900 hover:bg-blue-950 text-white shadow-blue-900/30 ring-2 ring-blue-500/40'
              : pendingCount > 0
              ? 'bg-blue-900 hover:bg-blue-950 text-white shadow-blue-900/25 hover:scale-105'
              : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
          )}
        >
          <UserPlus className="h-4 w-4" />
          <span>Solicitações de Acesso</span>
          {pendingCount > 0 && (
            <span className="relative flex items-center justify-center ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative rounded-full bg-white text-blue-900 text-[11px] font-extrabold px-2 py-0.5 shadow-xs">
                {pendingCount}
              </span>
            </span>
          )}
        </button>
      </div>


      {/* Filtros */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'admin', 'client_master', 'client_user'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                'rounded-lg px-3 py-2 text-xs font-semibold capitalize border transition-all flex items-center gap-1.5',
                filterType === type
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]'
              )}
            >
              {type === 'all'
                ? 'Todos'
                : type === 'client_master'
                ? 'Gestor'
                : type === 'client_user'
                ? 'Colaborador'
                : type === 'admin'
                ? 'Administrador'
                : type}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Usuários (Tabela) */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                <th className="p-4">Nome</th>
                <th className="p-4">Perfil</th>
                <th className="p-4">Empresa Vinculada</th>
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
                      <span>Carregando usuários...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => {
                  const companyUserObj = Array.isArray(user.company_users) ? user.company_users[0] : user.company_users
                  const isRemoved = user.status_reason === 'Removido pelo Gestor' || user.status_reason === 'Removido pelo Usuário Master' || (!companyUserObj && user.user_type !== 'admin')
                  
                  const matchedCompany = isRemoved ? null : companies.find(c => 
                    c.id === user.company_id || 
                    c.id === companyUserObj?.company_id || 
                    (c.codigo_exclusivo && String(c.codigo_exclusivo).trim() === user.codigo_empresa) || 
                    c.id === user.codigo_empresa
                  )
                  const rawName = isRemoved ? null : (companyUserObj?.company?.name || user.empresa?.name || matchedCompany?.name)
                  const rawCode = isRemoved ? null : (user.codigo_empresa || companyUserObj?.company?.codigo_exclusivo || matchedCompany?.codigo_exclusivo || null)
                  const companyName = user.user_type === 'admin'
                    ? 'Bi2B Consultoria'
                    : rawName
                    ? `${rawName}${rawCode ? ` (ID: ${rawCode})` : ''}`
                    : 'Sem Empresa Vinculada'
                    
                  return (
                    <tr key={user.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <h4 className="font-semibold text-[hsl(var(--foreground))]">{user.full_name}</h4>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase',
                          user.user_type === 'admin' && 'bg-purple-100 text-purple-700 dark:bg-purple-950/30',
                          user.user_type === 'client_master' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20',
                          user.user_type === 'client_user' && 'bg-gray-100 text-gray-700 dark:bg-gray-800'
                        )}>
                          {user.user_type === 'client_master' ? 'Gestor' : user.user_type === 'client_user' ? 'Colaborador' : user.user_type === 'admin' ? 'Administrador' : user.user_type}
                        </span>
                      </td>
                      <td className="p-4 text-[hsl(var(--muted-foreground))]">
                        {companyName}
                      </td>
                      <td className="p-4">
                        {user.status_reason ? (
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-500/15 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-500/20">
                              Inativo
                            </span>
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border",
                              user.status_reason.toLowerCase().includes('master')
                                ? "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/30"
                                : "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-500/30"
                            )}>
                              <AlertTriangle className="h-3 w-3 shrink-0" />
                              {user.status_reason}
                            </span>
                          </div>
                        ) : !user.is_active ? (
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-500/15 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-500/20">
                            Inativo
                          </span>
                        ) : (
                          <span className={cn(
                            'px-2.5 py-0.5 rounded-md text-xs font-bold border',
                            !isUserPending(user)
                              ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-500/20' 
                              : 'bg-amber-500/15 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-500/20'
                          )}>
                            {!isUserPending(user) ? 'Ativo' : 'Aguardando Aprovação'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isUserPending(user) ? (
                            <>
                              <button
                                onClick={() => handleApproveUserAccess(user)}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white transition-colors"
                                title="Aprovar Solicitação de Acesso"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => handleRejectUserAccess(user)}
                                className="rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors"
                                title="Recusar Solicitação"
                              >
                                Recusar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpenEdit(user)}
                                className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                                title="Editar / Vincular Empresa"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(user.id, user.is_active)}
                                disabled={user.id === currentUser?.id}
                                className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
                                title={user.id === currentUser?.id ? 'Você não pode desativar o seu próprio usuário' : 'Bloquear usuário'}
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleOpenResetModal(user)}
                                className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                                title="Resetar Senha"
                              >
                                <Key className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                disabled={user.id === currentUser?.id}
                                className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={user.id === currentUser?.id ? 'Você não pode apagar o seu próprio usuário' : 'Apagar usuário do banco de dados'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição de Usuário / Vinculação */}
      {isOpenEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-md shadow-none p-6 relative">
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] mb-4 border-b border-[hsl(var(--border))] pb-2">
              Editar Usuário / Vincular Empresa
            </h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">E-mail (Não editável)</label>
                <input
                  type="email"
                  disabled
                  value={editingUser.email || ''}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--muted))] px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Tipo de Perfil</label>
                <select
                  disabled={editingUser.id === currentUser?.id}
                  value={editUserType}
                  onChange={(e) => setEditUserType(e.target.value as any)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none disabled:bg-[hsl(var(--muted))] disabled:cursor-not-allowed text-[hsl(var(--foreground))]"
                >
                  <option value="client_user">Colaborador</option>
                  <option value="client_master">Gestor</option>
                  <option value="admin">Administrador</option>
                </select>
                {editingUser.id === currentUser?.id && (
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Você não pode alterar a função do seu próprio perfil.</p>
                )}
              </div>

              {(editUserType === 'client_master' || editUserType === 'client_user') && (
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Empresa Vinculada</label>
                  <select
                    value={editCompanyId}
                    required
                    onChange={(e) => setEditCompanyId(e.target.value)}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">Selecione uma empresa...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpenEditModal(false)}
                  className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Redefinição de Senha */}
      {isOpenResetModal && resetUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-md shadow-2xl p-6 relative">
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] mb-4 border-b border-[hsl(var(--border))] pb-2 flex items-center gap-2">
              <Key className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Resetar Senha de {resetUser.full_name}
            </h3>
            <form onSubmit={handleConfirmResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">E-mail</label>
                <input
                  type="email"
                  disabled
                  value={resetUser.email || ''}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--muted))] px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nova Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Confirmação da Nova Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpenResetModal(false)
                    setResetUser(null)
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isResetting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isResetting ? 'Redefinindo...' : 'Alterar Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

