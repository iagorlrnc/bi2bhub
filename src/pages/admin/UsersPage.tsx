import { useState, useEffect } from 'react'
import { Search, Key, UserCheck, UserX, Loader2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'staff' | 'client_master' | 'client_user'>('all')

  // Estados para edição/vinculação
  const [companies, setCompanies] = useState<any[]>([])
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [editFullName, setEditFullName] = useState('')
  const [editUserType, setEditUserType] = useState<'admin' | 'staff' | 'client_master' | 'client_user'>('client_user')
  const [editCompanyId, setEditCompanyId] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  // Estados para redefinição de senha
  const [isOpenResetModal, setIsOpenResetModal] = useState(false)
  const [resetUser, setResetUser] = useState<any | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isResetting, setIsResetting] = useState(false)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*, company_users:usuarios_empresa(company_id, company:empresas(id, name))')
        .order('full_name', { ascending: true })
      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erro ao buscar usuários globais.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true })
      if (error) throw error
      setCompanies(data || [])
    } catch (err) {
      console.error('Erro ao buscar empresas:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchCompanies()
  }, [])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (id === currentUser?.id) {
      toast.error('Você não pode desativar o seu próprio usuário.')
      return
    }
    try {
      const { error } = await (supabase as any)
        .from('usuarios')
        .update({ is_active: !currentStatus })
        .eq('id', id)
      if (error) throw error
      toast.success('Status de acesso do usuário atualizado.')
      fetchUsers()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar status do usuário.')
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

    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    setIsResetting(true)
    try {
      const { error } = await (supabase as any).rpc('admin_reset_user_password', {
        target_user_id: resetUser.id,
        new_password: newPassword
      })

      if (error) throw error

      toast.success(`Senha de ${resetUser.full_name} alterada com sucesso!`)
      setIsOpenResetModal(false)
      setResetUser(null)
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error('Erro ao redefinir senha:', err)
      toast.error(err.message || 'Erro ao redefinir a senha do usuário.')
    } finally {
      setIsResetting(false)
    }
  }

  const handleOpenEdit = (user: any) => {
    setEditingUser(user)
    setEditFullName(user.full_name || '')
    setEditUserType(user.user_type || 'client_user')
    // Obter company_id se existir na relação (relação um-para-um)
    const linkedCompanyId = user.company_users?.company_id || user.company_users?.company?.id || ''
    setEditCompanyId(linkedCompanyId)
    setIsOpenEditModal(true)
  }

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setIsSaving(true)
    try {
      // Validar limite de 1 usuário master por empresa
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
          toast.error('Esta empresa já possui um usuário Master. Cada empresa pode ter apenas 1 usuário Master.')
          setIsSaving(false)
          return
        }
      }

      // 1. Atualizar o perfil do usuário
      const { error: profileError } = await (supabase as any)
        .from('usuarios')
        .update({
          full_name: editFullName,
          user_type: editUserType
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
            is_active: true
          })
        if (insertError) throw insertError
      }

      toast.success('Usuário atualizado com sucesso!')
      setIsOpenEditModal(false)
      fetchUsers()
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err)
      toast.error('Erro ao atualizar dados e vinculação.')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredUsers = users.filter(u => {
    const name = u.full_name || ''
    const email = u.email || ''
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || u.user_type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">


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
          {(['all', 'admin', 'staff', 'client_master', 'client_user'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                'rounded-lg px-3 py-2 text-xs font-semibold capitalize border transition-all',
                filterType === type
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]'
              )}
            >
              {type === 'all' ? 'Todos' : type === 'client_master' ? 'Usuário Master' : type === 'client_user' ? 'Usuário Comum' : type === 'staff' ? 'Contador' : type === 'admin' ? 'Administrador' : type}
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
                  const companyName = user.user_type === 'admin' || user.user_type === 'staff'
                    ? 'Escritório Contábil'
                    : (user.company_users?.company?.name || 'Nenhum')
                    
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
                          user.user_type === 'staff' && 'bg-blue-100 text-blue-700 dark:bg-blue-950/30',
                          user.user_type === 'client_master' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20',
                          user.user_type === 'client_user' && 'bg-gray-100 text-gray-700 dark:bg-gray-800'
                        )}>
                          {user.user_type === 'client_master' ? 'Usuário Master' : user.user_type === 'client_user' ? 'Usuário' : user.user_type === 'staff' ? 'Contador' : user.user_type}
                        </span>
                      </td>
                      <td className="p-4 text-[hsl(var(--muted-foreground))]">
                        {companyName}
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-semibold',
                          user.is_active 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                        )}>
                          {user.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
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
                            title={user.id === currentUser?.id ? 'Você não pode desativar o seu próprio usuário' : (user.is_active ? 'Bloquear usuário' : 'Desbloquear usuário')}
                          >
                            {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleOpenResetModal(user)}
                            className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                            title="Resetar Senha"
                          >
                            <Key className="h-4 w-4" />
                          </button>
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
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
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
                  <option value="client_user">Usuário Comum</option>
                  <option value="client_master">Usuário Master</option>
                  <option value="staff">Contador (Contabilidade)</option>
                  <option value="admin">Administrador (Contabilidade)</option>
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
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
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

