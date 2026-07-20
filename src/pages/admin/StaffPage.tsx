import { useState, useEffect } from 'react'
import { UserCog, Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// ===== Provedor / Componente =====

export function StaffPage() {
  const { user: currentUser } = useAuth()
  const [staff, setStaff] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Estado de Edição / Criação
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('Fiscal')

  const fetchStaff = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .in('user_type', ['admin', 'staff'])
        .order('full_name', { ascending: true })
      if (error) throw error
      setStaff(data || [])
    } catch (err) {
      console.error('Erro ao carregar contadores:', err)
      toast.error('Erro ao carregar lista de contadores.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  // Obter cargo/departamento das colunas nativas de profiles, com fallback para o JSON antigo
  const parseStaffFields = (profile: any) => {
    if (!profile) return { role: 'Contador', department: 'Fiscal' }
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
        // Ignorar e usar defaults
      }
    }

    roleVal = roleVal || (profile.user_type === 'admin' ? 'Administrador' : 'Contador')
    deptVal = deptVal || 'Fiscal'
    return { role: roleVal, department: deptVal }
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

    try {
      if (editingId) {
        const { error } = await supabase
          .from('usuarios')
          .update({
            full_name: name,
            role,
            department,
            phone: null // Limpa o JSON legado do telefone
          })
          .eq('id', editingId)
        if (error) throw error
        toast.success('Contador atualizado com sucesso!')
      } else {
        // Para adicionar um novo contador, procuramos se o e-mail já existe no auth/profiles
        const { data: existing, error: findError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email)
          .maybeSingle()
        
        if (findError) throw findError

        if (existing) {
          // Promover usuário a staff (contador) e gravar cargo/depto diretamente
          const { error: promoError } = await supabase
            .from('usuarios')
            .update({
              full_name: name,
              user_type: 'staff',
              role,
              department,
              phone: null, // Limpa o JSON legado do telefone
              is_active: true
            })
            .eq('id', existing.id)
          if (promoError) throw promoError
          toast.success('Contador promovido e vinculado com sucesso!')
        } else {
          toast.error(`O e-mail ${email} não está cadastrado no sistema. Solicite que o usuário se cadastre primeiro na tela inicial.`)
          return
        }
      }
      setIsOpenModal(false)
      fetchStaff()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar contador.')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser?.id) {
      toast.error('Você não pode se remover da equipe de contadores.')
      return
    }
    if (confirm(`Tem certeza que deseja desvincular o contador ${name} do escritório? ele será rebaixado a usuário comum.`)) {
      try {
        const { error } = await supabase
          .from('usuarios')
          .update({
            user_type: 'client_user',
            phone: null,
            role: null,
            department: null
          })
          .eq('id', id)
        if (error) throw error
        toast.success(`Contador ${name} removido da equipe.`)
        fetchStaff()
      } catch (err) {
        console.error(err)
        toast.error('Erro ao remover contador.')
      }
    }
  }

  const filteredStaff = staff.filter(s => {
    const fields = parseStaffFields(s)
    return (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      fields.role.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
            <UserCog className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Gestão de Contadores</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Gerencie a equipe de contadores do escritório e atribuição de departamentos</p>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20"
        >
          <Plus className="h-4 w-4" />
          Novo Contador
        </button>
      </div>

      {/* Filtro de Busca */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Buscar contador por nome, cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grade da Tabela (Dados) */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                <th className="p-4">Contador</th>
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
                      <span>Carregando contadores...</span>
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
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-semibold',
                          member.is_active 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                        )}>
                          {member.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id, member.full_name)}
                            disabled={member.id === currentUser?.id}
                            className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={member.id === currentUser?.id ? 'Você não pode remover o seu próprio usuário' : 'Remover'}
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
                    Nenhum contador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Operações CRUD */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] mb-4 border-b border-[hsl(var(--border))] pb-2">
              {editingId ? 'Editar Contador' : 'Adicionar Novo Contador'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">E-mail corporativo</label>
                  <input
                    type="email"
                    required
                    placeholder="nome@bi2b.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none"
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
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Departamento</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none"
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
                  className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))]"
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
