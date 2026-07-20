import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, UserX, UserCheck, Mail, Shield, Check, Trash2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function TeamPage() {
  const { company, user, isLoading: authLoading } = useAuth()
  const [team, setTeam] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'usuario_master' | 'usuario_comum'>('usuario_comum')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['dashboard', 'drive', 'tickets'])
  const [isLoading, setIsLoading] = useState(true)

  // Estados para edição de permissões
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [editingMember, setEditingMember] = useState<any | null>(null)
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const maxUsers = company?.max_users || 5
  const currentTotal = team.length + invites.length

  const fetchData = useCallback(async () => {
    if (!company?.id) return
    setIsLoading(true)
    try {
      // 1. Buscar membros
      const { data: teamData, error: teamError } = await supabase
        .from('usuarios_empresa')
        .select(`
          id,
          role,
          permissions,
          is_active,
          usuarios:user_id (
            id,
            full_name,
            email
          )
        `)
        .eq('company_id', company.id)
      if (teamError) throw teamError

      const mappedTeam = (teamData || []).map((tu: any) => ({
        id: tu.usuarios?.id,
        companyUserId: tu.id,
        name: tu.usuarios?.full_name || 'Usuário',
        email: tu.usuarios?.email || '',
        role: tu.role,
        status: tu.is_active ? 'active' : 'inactive',
        permissions: tu.permissions || []
      }))
      setTeam(mappedTeam)

      // 2. Buscar convites pendentes
      const { data: inviteData, error: inviteError } = await supabase
        .from('convites')
        .select('*')
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
      console.error('Erro ao buscar dados da equipe:', err)
      toast.error('Erro ao carregar dados da equipe.')
    } finally {
      setIsLoading(false)
    }
  }, [company?.id])

  useEffect(() => {
    if (authLoading) return
    if (!company?.id) {
      setIsLoading(false)
      return
    }
    fetchData()
  }, [company?.id, authLoading, fetchData])

  const handleToggleStatus = async (userId: string) => {
    const member = team.find(m => m.id === userId)
    if (!member) return
    const nextStatus = member.status === 'active' ? false : true
    try {
      const { error } = await supabase
        .from('usuarios_empresa')
        .update({ is_active: nextStatus })
        .eq('user_id', userId)
      if (error) throw error
      toast.info(`Status do usuário atualizado.`)
      fetchData()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao alterar status do usuário.')
    }
  }

  const handleRemoveUser = async (userId: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover ${name} da equipe?`)) {
      try {
        const { error } = await supabase
          .from('usuarios_empresa')
          .delete()
          .eq('user_id', userId)
        if (error) throw error
        toast.success(`Usuário ${name} removido da empresa.`)
        fetchData()
      } catch (err) {
        console.error(err)
        toast.error('Erro ao remover usuário.')
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
      const { error } = await supabase
        .from('convites')
        .insert({
          company_id: company.id,
          email: inviteEmail.trim(),
          role: inviteRole,
          permissions: inviteRole === 'usuario_master' ? ['all'] : selectedPermissions,
          token: Math.random().toString(36).substring(2) + Date.now().toString(36),
          invited_by: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      if (error) throw error
      toast.success(`Convite enviado para ${inviteEmail}`)
      setInviteEmail('')
      setIsOpenModal(false)
      fetchData()
    } catch (err) {
      console.error(err)
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
      console.error(err)
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
      console.error('Erro ao atualizar permissões:', err)
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
          O seu plano permite no máximo 5 usuários simultâneos por empresa. Libere espaço inativando ou excluindo membros.
        </p>
      </div>

      {/* Grade/Lista de Membros */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4">
        <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Membros da Equipe</h3>
        <div className="divide-y divide-[hsl(var(--border))]">
          {isLoading ? (
            <div className="py-4 text-center text-xs text-[hsl(var(--muted-foreground))]">
              Carregando membros da equipe...
            </div>
          ) : team.length > 0 ? (
            team.map(member => (
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
                    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    member.role === 'usuario_master'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                  )}>
                    <Shield className="h-3 w-3" />
                    {member.role === 'usuario_master' ? 'Master' : 'Usuário'}
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
                      disabled={member.role === 'usuario_master' || member.id === user?.id}
                      className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
                      title={member.id === user?.id ? 'Você não pode editar o seu próprio perfil' : member.role === 'usuario_master' ? 'Administradores Master possuem acesso total' : 'Editar permissões'}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(member.id)}
                      disabled={member.role === 'usuario_master' || member.id === user?.id}
                      className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
                      title={member.id === user?.id ? 'Você não pode desativar o seu próprio perfil' : member.role === 'usuario_master' ? 'O usuário Master não pode ser desativado' : (member.status === 'active' ? 'Desativar usuário' : 'Ativar usuário')}
                    >
                      {member.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleRemoveUser(member.id, member.name)}
                      disabled={member.role === 'usuario_master' || member.id === user?.id}
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
      </div>

      {/* Convites Pendentes */}
      {invites.length > 0 && (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Convites Pendentes</h3>
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
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
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
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nível de permissão</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="usuario_comum">Usuário padrão (Apenas módulos liberados)</option>
                  <option value="usuario_master" disabled>Administrador Master (Limite de 1 por empresa atingido)</option>
                </select>
              </div>

              {inviteRole === 'usuario_comum' && (
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-2">Permissões de Acesso</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'strategic', label: 'Guias e Impostos' },
                      { id: 'monitoring', label: 'Tarefas' },
                      { id: 'drive', label: 'Drive de Arquivos' },
                      { id: 'tickets', label: 'Central de Chamados' },
                    ].map(perm => (
                      <button
                        type="button"
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={cn(
                          'flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all',
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
                  className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20"
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
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
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
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--muted))] px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">E-mail</label>
                <input
                  type="email"
                  disabled
                  value={editingMember.email || ''}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--muted))] px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-2">Módulos Liberados</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'strategic', label: 'Visão Estratégica' },
                    { id: 'monitoring', label: 'Monitoramento' },
                    { id: 'xml', label: 'XML Fiscal' },
                    { id: 'drive', label: 'Drive de Arquivos' },
                    { id: 'tickets', label: 'Central de Chamados' },
                  ].map(perm => (
                    <button
                      type="button"
                      key={perm.id}
                      onClick={() => toggleEditPermission(perm.id)}
                      className={cn(
                        'flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all',
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
                  className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5"
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
