import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { User, Mail, Phone, Building2, Shield, KeyRound, Loader2, CheckCircle2 } from 'lucide-react'
import { logAuditActivity } from '@/lib/audit'
import { STRONG_PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from '@/constants'

export function ProfilePage() {
  const { user, profile, company, refreshProfile, isClientMaster } = useAuth()

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Sincronizar estado inicial quando o perfil for carregado assincronamente
  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name)
    if (profile?.phone) setPhone(profile.phone)
  }, [profile])

  // Troca de Senha
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    if (!fullName.trim()) {
      toast.error('Informe o nome completo.')
      return
    }

    setIsUpdatingProfile(true)
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          full_name: fullName.trim(),
          phone: phone.replace(/\D/g, '') || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      logAuditActivity({
        userId: user.id,
        companyId: company?.id,
        action: 'ATUALIZAR_PERFIL',
        entityType: 'usuarios',
        entityId: user.id,
        metadata: { full_name: fullName.trim() }
      })

      toast.success('Perfil atualizado com sucesso!')
      await refreshProfile()
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Erro ao atualizar perfil:', err)
      toast.error(err.message || 'Erro ao atualizar dados do perfil.')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword) {
      toast.error('Informe a nova senha.')
      return
    }

    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      toast.error(PASSWORD_REQUIREMENTS_MESSAGE)
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    setIsUpdatingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error

      logAuditActivity({
        userId: user?.id,
        companyId: company?.id,
        action: 'ALTERAR_SENHA',
        entityType: 'auth',
        metadata: { method: 'profile_page' }
      })

      toast.success('Senha alterada com sucesso!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Erro ao alterar senha:', err)
      toast.error(err.message || 'Erro ao alterar senha de acesso.')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto py-2">
      {/* Cabeçalho */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">Meu Perfil</h1>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Gerencie suas informações pessoais, dados de contato e credenciais de acesso ao portal.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card de Resumo do Usuário */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 text-2xl font-bold shadow-inner">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
            </div>
            <h2 className="font-bold text-base text-[hsl(var(--foreground))]">{profile?.full_name || 'Usuário'}</h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{profile?.email}</p>

            <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] flex justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-3 py-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                <Shield className="h-3 w-3" />
                {isClientMaster ? 'Gestor Master' : 'Usuário Cliente'}
              </span>
            </div>
          </div>

          {/* Dados da Empresa Vinculada */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2.5">
              <Building2 className="h-4 w-4 text-brand-500" />
              <span>Empresa Vinculada</span>
            </div>
            {company ? (
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[hsl(var(--muted-foreground))]">Razão Social:</span>
                  <p className="font-semibold text-[hsl(var(--foreground))] line-clamp-1">{company.name}</p>
                </div>
                <div>
                  <span className="text-[hsl(var(--muted-foreground))]">CNPJ:</span>
                  <p className="font-mono text-[hsl(var(--foreground))]">{company.cnpj}</p>
                </div>
                <div>
                  <span className="text-[hsl(var(--muted-foreground))]">Plano Ativo:</span>
                  <p className="font-semibold text-brand-600 dark:text-brand-400 uppercase text-[11px]">{company.plan}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[hsl(var(--muted-foreground))] italic">Nenhuma empresa vinculada.</p>
            )}
          </div>
        </div>

        {/* Formulários de Edição */}
        <div className="md:col-span-2 space-y-6">
          {/* Form Dados Pessoais */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] pb-3">
              <User className="h-4 w-4 text-brand-500" />
              <h3 className="font-bold text-sm text-[hsl(var(--foreground))]">Informações Pessoais</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--foreground))] mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--foreground))] mb-1.5">
                  E-mail de Acesso (Não editável)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--muted))]/50 pl-10 pr-3.5 py-2 text-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--foreground))] mb-1.5">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 90000-0000"
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] pl-10 pr-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Salvar Perfil</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Form Troca de Senha */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[hsl(var(--border))] pb-3">
              <KeyRound className="h-4 w-4 text-brand-500" />
              <h3 className="font-bold text-sm text-[hsl(var(--foreground))]">Segurança e Senha</h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--foreground))] mb-1.5">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">
                  Mínimo 8 caracteres (maiúscula, minúscula, número e símbolo).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--foreground))] mb-1.5">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3.5 py-2 text-sm text-[hsl(var(--foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword || !newPassword}
                  className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Atualizando...</span>
                    </>
                  ) : (
                    <span>Alterar Senha</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
