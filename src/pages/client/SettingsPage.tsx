import { useState, useEffect } from 'react'
import { User, Lock, Bell, Eye, EyeOff, Check, Moon, Sun, Monitor, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { STRONG_PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from '@/constants'

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function SettingsPage() {
  const { profile, company, refreshProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'theme'>('profile')

  // Estado dos formulários de Perfil
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile ? formatPhone(profile.phone || '') : '')
  const [email] = useState(profile?.email || '')

  // Estado dos campos de Senha
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Estado das Preferências de Notificação
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(true)
  const [notifTicket, setNotifTicket] = useState(true)
  const [notifDocument, setNotifDocument] = useState(true)

  // Estados de Carregamento e Salvamento
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingNotifs, setIsSavingNotifs] = useState(false)

  // Sincronizar dados do perfil globais com o estado local ao carregar
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(formatPhone(profile.phone || ''))
    }
  }, [profile])

  // Buscar configurações reais de notificação da empresa no Supabase
  useEffect(() => {
    async function loadSettings() {
      if (!company?.id) return
      setIsLoadingSettings(true)
      try {
        const { data, error } = await supabase
          .from('configuracoes')
          .select('notification_email, notification_push, notification_ticket, notification_document')
          .eq('company_id', company.id)
          .maybeSingle()

        if (error) throw error
        if (data) {
          setNotifEmail(data.notification_email)
          setNotifPush(data.notification_push)
          setNotifTicket(data.notification_ticket)
          setNotifDocument(data.notification_document)
        }
      } catch (err) {
        console.error('Erro ao carregar preferências de notificação:', err)
      } finally {
        setIsLoadingSettings(false)
      }
    }
    loadSettings()
  }, [company?.id])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.id) return
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone && (cleanPhone.length < 10 || cleanPhone.length > 11)) {
      toast.error('Telefone inválido (deve conter DDD + 8 ou 9 dígitos).')
      return
    }
    setIsSavingProfile(true)
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          full_name: fullName.trim(),
          phone: cleanPhone
        })
        .eq('id', profile.id)

      if (error) throw error
      await refreshProfile()
      toast.success('Perfil atualizado com sucesso!')
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao atualizar perfil.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.email) {
      toast.error('Sessão inválida. Por favor, faça login novamente.')
      return
    }
    if (!currentPassword) {
      toast.error('Por favor, informe sua senha atual.')
      return
    }
    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      toast.error(PASSWORD_REQUIREMENTS_MESSAGE)
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('A nova senha e a confirmação não coincidem!')
      return
    }

    try {
      // 1. Reautenticar para verificar se a senha atual está correta
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: currentPassword
      })
      if (authError) {
        toast.error('A senha atual fornecida está incorreta.')
        return
      }

      // 2. Atualizar a senha
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error

      toast.success('Senha atualizada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar a senha.')
    }
  }

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company?.id) return
    setIsSavingNotifs(true)
    try {
      const { error } = await supabase
        .from('configuracoes')
        .update({
          notification_email: notifEmail,
          notification_push: notifPush,
          notification_ticket: notifTicket,
          notification_document: notifDocument
        })
        .eq('company_id', company.id)

      if (error) throw error
      toast.success('Preferências de notificação salvas!')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar preferências.')
    } finally {
      setIsSavingNotifs(false)
    }
  }

  return (
    <div className="space-y-6">


      {/* Contêiner de Configurações */}
      <div className="grid gap-6 md:grid-cols-4 items-start">
        {/* Abas de Navegação */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 flex flex-col gap-1">
          {[
            { id: 'profile', label: 'Meu Perfil', icon: User },
            { id: 'security', label: 'Segurança', icon: Lock },
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'theme', label: 'Aparência / Tema', icon: Sun },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-left',
                activeTab === tab.id
                  ? 'bg-brand-500 text-white'
                  : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Área de Conteúdo */}
        <div className="md:col-span-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          {/* Meu Perfil */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2">
                Informações Pessoais
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Telefone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">E-mail (Não editável)</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--muted))] px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed"
                />
              </div>

              {company && (
                <div className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-xl p-4 mt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">Vínculo Corporativo</h4>
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{company.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">CNPJ: {company.cnpj}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center justify-center gap-2 rounded-lg gradient-brand px-6 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {isSavingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}

          {/* Segurança */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2">
                Alterar Senha
              </h3>

              <div className="space-y-3 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Senha Atual</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 pr-10 text-sm focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nova Senha</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-lg gradient-brand px-6 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20"
                >
                  Alterar Senha
                </button>
              </div>
            </form>
          )}

          {/* Notificações */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2">
                Preferências de Notificação
              </h3>

              {isLoadingSettings ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-500 mr-2" />
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">Carregando preferências...</span>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-w-xl">
                    {[
                      { state: notifEmail, setter: setNotifEmail, label: 'Notificações por E-mail', desc: 'Receba alertas importantes e guias diretamente no seu email cadastrado.' },
                      { state: notifPush, setter: setNotifPush, label: 'Notificações no Navegador (Push)', desc: 'Exibir balões de alertas quando o portal estiver aberto.' },
                      { state: notifTicket, setter: setNotifTicket, label: 'Atualização de Chamados', desc: 'Notifique-me a cada resposta de contador nos chamados ativos.' },
                      { state: notifDocument, setter: setNotifDocument, label: 'Novos Documentos Recebidos', desc: 'Envie um alerta sempre que a contabilidade anexar um novo balanço ou guia tributária no Drive.' },
                    ].map((pref, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <button
                          onClick={() => pref.setter(!pref.state)}
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all mt-0.5',
                            pref.state ? 'border-brand-500 bg-brand-500 text-white' : 'border-[hsl(var(--border))]'
                          )}
                        >
                          {pref.state && <Check className="h-3.5 w-3.5" />}
                        </button>
                        <div>
                          <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">{pref.label}</h4>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed">{pref.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[hsl(var(--border))]">
                    <button
                      onClick={handleSaveNotifications}
                      disabled={isSavingNotifs}
                      className="flex items-center justify-center gap-2 rounded-lg gradient-brand px-6 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 disabled:opacity-50"
                    >
                      {isSavingNotifs && <Loader2 className="h-4 w-4 animate-spin" />}
                      Salvar Preferências
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tema */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2">
                Aparência da Plataforma
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Escolha a aparência visual que melhor se adapta às suas necessidades de trabalho.</p>

              <div className="grid gap-4 sm:grid-cols-3 max-w-2xl">
                {[
                  { id: 'light', label: 'Modo Claro', desc: 'Visual clássico com cores vibrantes e alto contraste.', icon: Sun },
                  { id: 'dark', label: 'Modo Escuro', desc: 'Aparência escura, reduz a fadiga ocular em ambientes pouca luz.', icon: Moon },
                  { id: 'system', label: 'Sistema', desc: 'Acompanha o tema configurado no sistema operacional.', icon: Monitor },
                ].map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setTheme(option.id as any)}
                    className={cn(
                      'border rounded-xl p-4 cursor-pointer flex flex-col justify-between h-36 transition-all hover-lift',
                      theme === option.id
                        ? 'border-brand-500 ring-2 ring-brand-500/20'
                        : 'border-[hsl(var(--border))]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <option.icon className={cn(
                        'h-5 w-5',
                        theme === option.id ? 'text-brand-500' : 'text-[hsl(var(--muted-foreground))]'
                      )} />
                      {theme === option.id && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">{option.label}</h4>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">{option.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
