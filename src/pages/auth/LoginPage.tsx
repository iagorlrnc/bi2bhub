import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { APP_NAME, STRONG_PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from '@/constants'
import { supabase, createIsolatedAuthClient } from '@/lib/supabase'
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  UserCheck, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Check, 
  FileText,
  Mail, 
  MapPin, 
  User, 
  Copy, 
  MailCheck, 
} from 'lucide-react'
import { toast } from 'sonner'
import logoPng from '@/assets/logo.png'
import logoAzulPng from '@/assets/logoazul.png'
import { useTheme } from '@/contexts/ThemeContext'
import { getClientSubdomainUrl } from '@/utils/subdomain'
import { cn } from '@/lib/utils'

const formatCnpj = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
}

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
}

export function LoginPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const currentLogo = isDark ? logoPng : logoAzulPng

  // Controle de Aba Principais: 'colaborador' (Login) ou 'empresa' (Cadastro Empresa)
  const [activeTab, setActiveTab] = useState<'colaborador' | 'empresa'>('colaborador')

  // --- ESTADOS DE LOGIN DO COLABORADOR ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn, userType } = useAuth()
  const navigate = useNavigate()
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return Number(sessionStorage.getItem('login_failed_attempts') || 0)
  })
  const [lockoutTime, setLockoutTime] = useState<number | null>(() => {
    const stored = sessionStorage.getItem('login_lockout_until')
    return stored ? Number(stored) : null
  })

  // --- ESTADOS DE CADASTRO DA EMPRESA EM ETAPAS ---
  const [companyStepStarted, setCompanyStepStarted] = useState(false)
  const [companyStep, setCompanyStep] = useState(1)
  const [isSubmittingCompany, setIsSubmittingCompany] = useState(false)

  // 1° Etapa: Dados da Empresa
  const [companyName, setCompanyName] = useState('') // Razão Social
  const [companyTradeName, setCompanyTradeName] = useState('') // Nome Fantasia
  const [companyCnpj, setCompanyCnpj] = useState('') // CNPJ
  const [companyStateRegistration, setCompanyStateRegistration] = useState('') // Inscrição Estadual
  const [companyMunicipalRegistration, setCompanyMunicipalRegistration] = useState('') // Inscrição Municipal
  const [companyPlan, setCompanyPlan] = useState<'básico' | 'pró' | 'plus'>('básico') // Plano Bi2B

  // 2° Etapa: Contato & Endereço
  const [companyEmail, setCompanyEmail] = useState('') // E-mail Corporativo
  const [companyPhone, setCompanyPhone] = useState('') // Telefone
  const [addressZip, setAddressZip] = useState('') // CEP
  const [addressStreet, setAddressStreet] = useState('') // Rua
  const [addressNumber, setAddressNumber] = useState('') // Número
  const [addressComplement, setAddressComplement] = useState('') // Complemento
  const [addressNeighborhood, setAddressNeighborhood] = useState('') // Bairro
  const [addressCity, setAddressCity] = useState('') // Cidade
  const [addressState, setAddressState] = useState('') // Estado (UF)

  // Etapa Dados do Gestor (1° Etapa Dados Pessoais do Gestor)
  const [adminFullName, setAdminFullName] = useState('') // Nome Completo
  const [adminEmail, setAdminEmail] = useState('') // E-mail do Gestor
  const [adminPhone, setAdminPhone] = useState('') // Telefone do Gestor
  const [adminPassword, setAdminPassword] = useState('') // Senha
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('') // Confirmação de Senha
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [showAdminConfirmPassword, setShowAdminConfirmPassword] = useState(false)

  // Revisão de Dados & ID Gerado
  const [acceptedCompanyTerms, setAcceptedCompanyTerms] = useState(false)
  const [generatedToken] = useState(() => Math.floor(1000 + Math.random() * 9000).toString())
  const [copiedToken, setCopiedToken] = useState(false)

  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedToken)
    setCopiedToken(true)
    toast.success('ID Exclusivo copiado!')
    setTimeout(() => setCopiedToken(false), 2000)
  }

  // Handler de Login de Colaborador / Cliente
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }

    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingSeconds = Math.ceil((lockoutTime - Date.now()) / 1000)
      toast.error(`Muitas tentativas falhas. Tente novamente em ${remainingSeconds} segundos.`)
      return
    }

    setIsSubmitting(true)
    try {
      await signIn(email, password)

      const mockStorage = localStorage.getItem('bi2b_mock_session')
      let currentUserType = userType

      if (mockStorage) {
        try {
          const parsed = JSON.parse(mockStorage)
          currentUserType = parsed.mockProfile?.user_type
        } catch (e) {
          // ignore
        }
      }

      if (currentUserType && (currentUserType === 'admin' || currentUserType === 'staff')) {
        toast.error('Esta área de login é exclusiva para Clientes. Por favor, utilize o subdomínio de administração.')
        return
      }

      toast.success('Login realizado com sucesso!')
      setFailedAttempts(0)
      setLockoutTime(null)
      sessionStorage.removeItem('login_failed_attempts')
      sessionStorage.removeItem('login_lockout_until')

      const clientUrl = getClientSubdomainUrl('/taxes')
      if (clientUrl.startsWith('http') && window.location.hostname !== new URL(clientUrl).hostname) {
        window.location.href = clientUrl
      } else {
        navigate(ROUTES.TAXES)
      }
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error("LOGIN_ERROR:", err)
      }
      const nextAttempts = failedAttempts + 1
      setFailedAttempts(nextAttempts)
      sessionStorage.setItem('login_failed_attempts', String(nextAttempts))

      if (nextAttempts >= 5) {
        const multiplier = Math.pow(2, Math.min(nextAttempts - 5, 4))
        const lockDuration = 30 * 1000 * multiplier
        const unlockAt = Date.now() + lockDuration
        setLockoutTime(unlockAt)
        sessionStorage.setItem('login_lockout_until', String(unlockAt))
        toast.error(`Número máximo de tentativas atingido. Entrada bloqueada por ${Math.ceil(lockDuration / 1000)} segundos.`)
      } else {
        toast.error(err.message || 'Email ou senha incorretos')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validações do Cadastro da Empresa por Etapa

  // 1° Etapa Dados da Empresa
  const validateCompanyStep1 = () => {
    if (!companyName.trim() || companyName.trim().length < 3) {
      toast.error('Informe a Razão Social da Empresa.')
      return false
    }
    const cleanCnpj = companyCnpj.replace(/\D/g, '')
    if (!cleanCnpj || cleanCnpj.length !== 14) {
      toast.error('Informe um CNPJ válido com 14 dígitos.')
      return false
    }
    return true
  }

  // 2° Etapa Contato & Endereço
  const validateCompanyStep2 = () => {
    if (!companyEmail.trim() || !companyEmail.includes('@')) {
      toast.error('Informe um e-mail corporativo válido.')
      return false
    }
    const cleanPhone = companyPhone.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Informe um telefone corporativo válido.')
      return false
    }
    return true
  }

  // Etapa Dados do Gestor (1° Etapa Dados Pessoais)
  const validateCompanyStep3 = () => {
    if (!adminFullName.trim() || adminFullName.trim().length < 3) {
      toast.error('Informe o Nome Completo do Gestor.')
      return false
    }
    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      toast.error('Informe um e-mail válido para o Gestor (será usado para autenticação).')
      return false
    }
    if (!STRONG_PASSWORD_REGEX.test(adminPassword)) {
      toast.error(PASSWORD_REQUIREMENTS_MESSAGE)
      return false
    }
    if (adminPassword !== adminConfirmPassword) {
      toast.error('As senhas do gestor não coincidem.')
      return false
    }
    return true
  }

  // Revisão de Dados & Termos
  const validateCompanyStep4 = () => {
    if (!acceptedCompanyTerms) {
      toast.error('Você precisa aceitar os Termos de Serviço e Política LGPD para concluir.')
      return false
    }
    return true
  }

  const handleNextCompanyStep = () => {
    if (companyStep === 1 && validateCompanyStep1()) setCompanyStep(2)
    else if (companyStep === 2 && validateCompanyStep2()) setCompanyStep(3)
    else if (companyStep === 3 && validateCompanyStep3()) setCompanyStep(4)
  }

  const handleBackCompanyStep = () => {
    if (companyStep > 1) {
      setCompanyStep((prev) => prev - 1)
    }
  }

  // Envio Final do Cadastro da Empresa & Gestor (Gravação Direta no Supabase)
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCompanyStep1() || !validateCompanyStep2() || !validateCompanyStep3() || !validateCompanyStep4()) return

    setIsSubmittingCompany(true)
    try {
      const cleanCompanyPhone = companyPhone.replace(/\D/g, '')
      const cleanAdminPhone = adminPhone ? adminPhone.replace(/\D/g, '') : cleanCompanyPhone
      const cleanZip = addressZip.replace(/\D/g, '')
      // E-mail exclusivo do Gestor para Autenticação e Perfil de Acesso
      const gestorEmail = adminEmail.trim().toLowerCase()
      // E-mail Oficial da Empresa exclusivo para contato comercial
      const companyCorporateEmail = companyEmail.trim().toLowerCase()

      // 1. Salvar a Empresa na tabela 'empresas' (inativa até aprovação do Administrador)
      const { data: createdCompany, error: companyErr } = await (supabase as any)
        .from('empresas')
        .insert({
          name: companyName.trim(),
          trade_name: companyTradeName.trim() || companyName.trim(),
          cnpj: companyCnpj.replace(/\D/g, ''),
          state_registration: companyStateRegistration.trim() || null,
          municipal_registration: companyMunicipalRegistration.trim() || null,
          plan: companyPlan,
          email: companyCorporateEmail,
          phone: cleanCompanyPhone || null,
          address_zip: cleanZip || null,
          address_street: addressStreet.trim() || null,
          address_number: addressNumber.trim() || null,
          address_complement: addressComplement.trim() || null,
          address_neighborhood: addressNeighborhood.trim() || null,
          address_city: addressCity.trim() || null,
          address_state: addressState.trim() || null,
          admin_name: adminFullName.trim(),
          admin_role: 'Gestor',
          codigo_exclusivo: generatedToken,
          is_active: false
        })
        .select('id')
        .single()

      if (companyErr) throw companyErr

      const companyId = createdCompany?.id

      // 2. Registrar o Usuário Gestor no Supabase Auth para que possua credenciais no authentication
      let gestorUserId: string | null = null

      if (gestorEmail && adminPassword) {
        try {
          const authClient = createIsolatedAuthClient()
          const { data: authData, error: authErr } = await authClient.auth.signUp({
            email: gestorEmail,
            password: adminPassword,
            options: {
              data: {
                full_name: adminFullName.trim(),
                phone: cleanAdminPhone || null,
                company_id: companyId || null,
                codigo_empresa: generatedToken,
                user_type: 'client_master'
              }
            }
          })

          if (authErr) {
            if (import.meta.env.DEV) console.warn('Aviso Supabase Auth signUp:', authErr.message)
          }

          if (authData?.user?.id) {
            gestorUserId = authData.user.id
          }
        } catch (authException) {
          if (import.meta.env.DEV) console.warn('Exceção ao criar no Supabase Auth:', authException)
        }
      }

      // 3. Salvar o Usuário Gestor na tabela 'usuarios' e em 'usuarios_empresa'
      if (gestorEmail) {
        const { data: existingUser } = await (supabase as any)
          .from('usuarios')
          .select('id')
          .eq('email', gestorEmail)
          .maybeSingle()

        const finalUserId = gestorUserId || existingUser?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'usr_' + Date.now())

        if (existingUser) {
          await (supabase as any)
            .from('usuarios')
            .update({
              full_name: adminFullName.trim(),
              phone: cleanAdminPhone || null,
              user_type: 'client_master',
              company_id: companyId || null,
              codigo_empresa: generatedToken,
              is_active: false,
              status_reason: 'Aguardando aprovação da empresa'
            })
            .eq('id', existingUser.id)
        } else {
          await (supabase as any)
            .from('usuarios')
            .insert({
              id: finalUserId,
              email: gestorEmail,
              full_name: adminFullName.trim(),
              phone: cleanAdminPhone || null,
              user_type: 'client_master',
              company_id: companyId || null,
              codigo_empresa: generatedToken,
              is_active: false,
              status_reason: 'Aguardando aprovação da empresa'
            })
        }

        // 4. Criar vínculo em usuarios_empresa como gestor/master com status inativo aguardando aprovação
        if (companyId) {
          await (supabase as any)
            .from('usuarios_empresa')
            .upsert({
              company_id: companyId,
              user_id: finalUserId,
              role: 'usuario_master',
              permissions: ['all'],
              is_active: false
            }, { onConflict: 'company_id,user_id' })
        }
      }

      toast.success(`Solicitação de empresa e cadastro do Gestor enviados! ID Gerado: #${generatedToken}`)
      
      // Avança para a Etapa 5: Confirmação de E-mail
      setCompanyStep(5)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('ERRO_CADASTRO_EMPRESA_GESTOR_SUPABASE:', err)
      toast.error(err.message || 'Ocorreu um erro ao enviar a solicitação para o Supabase.')
    } finally {
      setIsSubmittingCompany(false)
    }
  }

  const companySteps = [
    { number: 1, title: 'Dados Empresa', icon: Building2 },
    { number: 2, title: 'Contato & Endereço', icon: Mail },
    { number: 3, title: 'Dados do Gestor', icon: User },
    { number: 4, title: 'Revisão & ID', icon: FileText },
    { number: 5, title: 'Confirmação', icon: MailCheck },
  ]

  return (
    <div className="animate-fade-in-up w-full py-2">
      <div className={cn("mx-auto transition-all duration-300", activeTab === 'empresa' ? "max-w-lg" : "max-w-md")}>
        
        {/* Logotipo da Aplicação */}
        <div className="mb-6 text-center">
          <img src={currentLogo} alt={APP_NAME} className="mx-auto h-11 w-auto object-contain mb-2 drop-shadow-sm" />
          <h1 className="text-2xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">Portal Bi2B</h1>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            Acesse seu painel ou cadastre a estrutura da sua empresa
          </p>
        </div>

        {/* TAB TOGGLE: COLABORADOR / EMPRESA */}
        <div className="flex rounded-2xl bg-[hsl(var(--muted))]/60 p-1 mb-6 border border-[hsl(var(--border))] shadow-xs backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab('colaborador')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer select-none",
              activeTab === 'colaborador'
                ? "bg-[hsl(var(--card))] text-brand-600 dark:text-brand-400 shadow-md border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            )}
          >
            <UserCheck className="h-4 w-4" />
            <span>Colaborador</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('empresa')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer select-none",
              activeTab === 'empresa'
                ? "bg-[hsl(var(--card))] text-brand-600 dark:text-brand-400 shadow-md border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            )}
          >
            <Building2 className="h-4 w-4" />
            <span>Empresa</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* ABA 1: LOGIN DO COLABORADOR */}
        {/* ========================================================= */}
        {activeTab === 'colaborador' && (
          <div className="rounded-3xl border border-cyan-500/20 bg-[hsl(var(--card))] p-6 shadow-xl space-y-5 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-[#0d6084] to-blue-600" />

            <div>
              <h2 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Autenticação</h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Informe suas credenciais para acessar o Painel.</p>
            </div>

            <form onSubmit={handleSubmitLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                  E-mail do Colaborador *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@empresa.com.br"
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    Senha *
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 pr-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-brand py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/20 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Atalho rápido para preenchimento de teste */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('cliente@bi2b.com.br')
                    setPassword('123456')
                  }}
                  className="text-xs text-brand-500 dark:text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-all cursor-pointer"
                >
                  Preencher dados de teste (cliente@bi2b.com.br / 123456)
                </button>
              </div>

              {/* Divisor Visual */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[hsl(var(--border))]" />
                </div>
                <div className="relative bg-[hsl(var(--card))] px-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  Ou
                </div>
              </div>

              {/* Botão de Cadastro (Criar Nova Conta) */}
              <button
                type="button"
                onClick={() => navigate(ROUTES.REGISTER)}
                className="w-full border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted))]/50 py-3 text-xs font-bold text-[hsl(var(--foreground))] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <span>Criar nova conta de colaborador</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 2: CADASTRO DA EMPRESA EM ETAPAS */}
        {/* ========================================================= */}
        {activeTab === 'empresa' && (
          <div className="rounded-3xl border border-cyan-500/20 bg-[hsl(var(--card))] p-6 shadow-xl space-y-6 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-[#0d6084] to-blue-600" />
            
            
            {/* TELA INICIAL DA EMPRESA (ALERTA DE PROSSEGUIR) */}
            {!companyStepStarted ? (
              <div className="space-y-5 text-center py-3 animate-fade-in">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm ring-4 ring-brand-500/10">
                  <Building2 className="h-7 w-7 text-brand-500" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">Cadastrar Nova Empresa no Portal</h2>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed max-w-sm mx-auto">
                    Crie a conta corporativa da sua empresa e defina o Gestor para gerenciar acessos e integrações contábeis.
                  </p>
                </div>

                {/* ALERTA INFORMATIVO */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-left space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>Atenção antes de prosseguir</span>
                  </div>
                  <p className="text-[11px] text-[hsl(var(--foreground))] leading-relaxed">
                    O cadastro de empresa passa por uma validação pelo Painel Administrativo. Ao prosseguir, você preencherá os dados da empresa, contato, endereço e criará a conta do <strong>Gestor</strong>.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyStepStarted(true)
                      setCompanyStep(1)
                    }}
                    className="w-full gradient-brand py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/20 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Prosseguir com Cadastro da Empresa</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* WIZARD EM ETAPAS DO CADASTRO DA EMPRESA */
              <div className="space-y-6">
                
                {/* CABEÇALHO COM STEPS */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-brand-500" />
                      <span>Cadastro da Empresa</span>
                    </h2>
                    <span className="text-[11px] font-bold text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-full">
                      Etapa {companyStep} de 5
                    </span>
                  </div>

                  {/* INDICADOR VISUAL DAS ETAPAS */}
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {companySteps.map((s) => {
                      const Icon = s.icon
                      const isActive = companyStep === s.number
                      const isDone = companyStep > s.number
                      return (
                        <div
                          key={s.number}
                          className={cn(
                            "flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all text-center",
                            isActive
                              ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold"
                              : isDone
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] opacity-60"
                          )}
                          title={s.title}
                        >
                          {isDone ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Icon className="h-3.5 w-3.5" />
                          )}
                          <span className="text-[9px] truncate max-w-full mt-0.5">{s.title}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <form onSubmit={handleCompanySubmit}>
                  
                  {/* ========================================================= */}
                  {/* 1° ETAPA DADOS DA EMPRESA */}
                  {/* ========================================================= */}
                  {companyStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="border-b border-[hsl(var(--border))] pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5" />
                          Dados Principais da Empresa
                        </h3>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                          Razão Social *
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Ex: Bi2B Consultoria LTDA"
                          className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                          Nome Fantasia
                        </label>
                        <input
                          type="text"
                          value={companyTradeName}
                          onChange={(e) => setCompanyTradeName(e.target.value)}
                          placeholder="Ex: Bi2B Consultoria"
                          className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                          CNPJ *
                        </label>
                        <input
                          type="text"
                          value={companyCnpj}
                          onChange={(e) => setCompanyCnpj(formatCnpj(e.target.value))}
                          placeholder="00.000.000/0001-00"
                          maxLength={18}
                          className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm font-mono text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Inscrição Estadual
                          </label>
                          <input
                            type="text"
                            value={companyStateRegistration}
                            onChange={(e) => setCompanyStateRegistration(e.target.value)}
                            placeholder="Número IE"
                            className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Inscrição Municipal
                          </label>
                          <input
                            type="text"
                            value={companyMunicipalRegistration}
                            onChange={(e) => setCompanyMunicipalRegistration(e.target.value)}
                            placeholder="Número IM"
                            className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                          Plano Bi2B Escolhido
                        </label>
                        <select
                          value={companyPlan}
                          onChange={(e) => setCompanyPlan(e.target.value as any)}
                          className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] focus:border-brand-500 focus:outline-none"
                        >
                          <option value="básico">Plano Básico (Até 5 usuários)</option>
                          <option value="pró">Plano Pró (Até 25 usuários)</option>
                          <option value="plus">Plano Plus (Até 100 usuários)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* 2° ETAPA CONTATO & ENDEREÇO */}
                  {/* ========================================================= */}
                  {companyStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="border-b border-[hsl(var(--border))] pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          Contato & Endereço Corporativo
                        </h3>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                          E-mail Corporativo Oficial *
                        </label>
                        <input
                          type="email"
                          value={companyEmail}
                          onChange={(e) => setCompanyEmail(e.target.value)}
                          placeholder="contato@empresa.com.br"
                          className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                          Telefone / WhatsApp Comercial *
                        </label>
                        <input
                          type="text"
                          value={companyPhone}
                          onChange={(e) => setCompanyPhone(formatPhone(e.target.value))}
                          placeholder="(99) 99999-9999"
                          maxLength={15}
                          className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          required
                        />
                      </div>

                      <div className="pt-2 border-t border-[hsl(var(--border))] space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-brand-500" />
                          Endereço da Empresa
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">CEP</label>
                            <input
                              type="text"
                              value={addressZip}
                              onChange={(e) => setAddressZip(formatCep(e.target.value))}
                              placeholder="00000-000"
                              maxLength={9}
                              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-xs font-mono text-[hsl(var(--foreground))]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">Logradouro / Rua</label>
                            <input
                              type="text"
                              value={addressStreet}
                              onChange={(e) => setAddressStreet(e.target.value)}
                              placeholder="Av. JK"
                              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">Número</label>
                            <input
                              type="text"
                              value={addressNumber}
                              onChange={(e) => setAddressNumber(e.target.value)}
                              placeholder="123"
                              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">Complemento</label>
                            <input
                              type="text"
                              value={addressComplement}
                              onChange={(e) => setAddressComplement(e.target.value)}
                              placeholder="Sala 101"
                              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">Bairro</label>
                            <input
                              type="text"
                              value={addressNeighborhood}
                              onChange={(e) => setAddressNeighborhood(e.target.value)}
                              placeholder="Centro"
                              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">Cidade</label>
                            <input
                              type="text"
                              value={addressCity}
                              onChange={(e) => setAddressCity(e.target.value)}
                              placeholder="Palmas"
                              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-xs text-[hsl(var(--foreground))]"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">UF</label>
                            <input
                              type="text"
                              value={addressState}
                              onChange={(e) => setAddressState(e.target.value)}
                              placeholder="TO"
                              maxLength={2}
                              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-xs uppercase text-[hsl(var(--foreground))]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* ETAPA DADOS DO GESTOR: 1° ETAPA DADOS PESSOAIS */}
                  {/* ========================================================= */}
                  {companyStep === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="border-b border-[hsl(var(--border))] pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          Etapa Dados do Gestor — Dados Pessoais
                        </h3>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                          Nome Completo do Gestor *
                        </label>
                        <input
                          type="text"
                          value={adminFullName}
                          onChange={(e) => setAdminFullName(e.target.value)}
                          placeholder="Nome do Gestor Responsável"
                          className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                          E-mail de Acesso do Gestor (Autenticação) *
                        </label>
                        <input
                          type="email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="gestor@empresa.com.br"
                          className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                          Telefone / WhatsApp do Gestor
                        </label>
                        <input
                          type="text"
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(formatPhone(e.target.value))}
                          placeholder="(00) 90000-0000"
                          maxLength={15}
                          className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                        />
                      </div>

                      <div className="pt-2 border-t border-[hsl(var(--border))] space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Senha do Gestor *
                          </label>
                          <div className="relative">
                            <input
                              type={showAdminPassword ? 'text' : 'password'}
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 pr-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowAdminPassword(!showAdminPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors p-1"
                            >
                              {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">
                            Mínimo 8 caracteres (com maiúscula, minúscula, número e símbolo).
                          </p>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Confirmação de Senha do Gestor *
                          </label>
                          <div className="relative">
                            <input
                              type={showAdminConfirmPassword ? 'text' : 'password'}
                              value={adminConfirmPassword}
                              onChange={(e) => setAdminConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 pr-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowAdminConfirmPassword(!showAdminConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors p-1"
                            >
                              {showAdminConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* REVISÃO DOS DADOS & ID GERADO AUTOMATICAMENTE */}
                  {/* ========================================================= */}
                  {companyStep === 4 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="border-b border-[hsl(var(--border))] pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          Revisão dos Dados & ID Gerado
                        </h3>
                      </div>

                      {/* BANNER DO ID GERADO AUTOMATICAMENTE */}
                      <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4 flex items-center justify-between shadow-xs">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))]">ID Gerado Automaticamente</p>
                          <p className="font-mono text-2xl font-black text-brand-600 dark:text-brand-400">#{generatedToken}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyToken}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:brightness-110 transition-all shadow-xs cursor-pointer"
                        >
                          {copiedToken ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedToken ? 'Copiado!' : 'Copiar ID'}</span>
                        </button>
                      </div>

                      {/* QUADRO DE REVISÃO GERAL */}
                      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4 space-y-3 text-xs">
                        <div>
                          <h4 className="font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-1.5 mb-2">Dados da Empresa</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-[hsl(var(--muted-foreground))]">Razão Social: <span className="font-semibold text-[hsl(var(--foreground))]">{companyName}</span></p>
                            <p className="text-[hsl(var(--muted-foreground))]">Fantasia: <span className="font-semibold text-[hsl(var(--foreground))]">{companyTradeName || 'Não informado'}</span></p>
                            <p className="text-[hsl(var(--muted-foreground))]">CNPJ: <span className="font-mono text-[hsl(var(--foreground))]">{formatCnpj(companyCnpj)}</span></p>
                            <p className="text-[hsl(var(--muted-foreground))]">Plano: <span className="font-bold uppercase text-brand-600 dark:text-brand-400">{companyPlan}</span></p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[hsl(var(--border))]">
                          <h4 className="font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-1.5 mb-2">Contato & Endereço</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-[hsl(var(--muted-foreground))]">E-mail: <span className="font-semibold text-[hsl(var(--foreground))]">{companyEmail}</span></p>
                            <p className="text-[hsl(var(--muted-foreground))]">Telefone: <span className="font-semibold text-[hsl(var(--foreground))]">{companyPhone}</span></p>
                            <p className="col-span-2 text-[hsl(var(--muted-foreground))]">Localidade: <span className="text-[hsl(var(--foreground))]">{addressCity ? `${addressCity} / ${addressState}` : 'Não informada'}</span></p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[hsl(var(--border))]">
                          <h4 className="font-bold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-1.5 mb-2">Dados do Gestor</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-[hsl(var(--muted-foreground))]">Nome: <span className="font-bold text-[hsl(var(--foreground))]">{adminFullName}</span></p>
                            <p className="text-[hsl(var(--muted-foreground))]">E-mail Gestor: <span className="font-semibold text-[hsl(var(--foreground))]">{adminEmail || companyEmail}</span></p>
                          </div>
                        </div>
                      </div>

                      {/* TERMOS LGPD */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[hsl(var(--foreground))] select-none">
                          <input
                            type="checkbox"
                            checked={acceptedCompanyTerms}
                            onChange={(e) => setAcceptedCompanyTerms(e.target.checked)}
                            className="mt-0.5 rounded border-[hsl(var(--input))] text-brand-500 focus:ring-brand-500 h-4 w-4 cursor-pointer"
                            required
                          />
                          <span>
                            Concordo em registrar a empresa e aceito os{' '}
                            <span className="font-semibold text-brand-500 hover:underline">Termos de Serviço</span>{' '}
                            e a{' '}
                            <span className="font-semibold text-brand-500 hover:underline">
                              Política de Privacidade LGPD
                            </span>
                            .
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* ETAPA 5: CONFIRMAÇÃO DE E-MAIL */}
                  {/* ========================================================= */}
                  {companyStep === 5 && (
                    <div className="space-y-5 animate-fade-in text-center py-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 ring-4 ring-emerald-500/10 shadow-lg">
                        <MailCheck className="h-8 w-8 text-emerald-500" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">Confirmação de E-mail enviada!</h3>
                        <p className="mt-1.5 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed max-w-sm mx-auto">
                          Enviamos um e-mail de confirmação para <strong className="text-[hsl(var(--foreground))]">{companyEmail || adminEmail}</strong>. 
                          Sua solicitação de empresa foi cadastrada com o <strong>ID #{generatedToken}</strong> e aguarda liberação no Painel Administrativo.
                        </p>
                      </div>

                      {/* TOKEN DISPLAY */}
                      <div className="p-4 rounded-2xl border border-brand-500/30 bg-brand-500/10 flex items-center justify-between">
                        <div className="text-left">
                          <p className="text-[10px] font-bold uppercase text-[hsl(var(--muted-foreground))]">Seu ID Exclusivo</p>
                          <p className="font-mono text-xl font-black text-brand-600 dark:text-brand-400">#{generatedToken}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyToken}
                          className="px-3 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
                        >
                          {copiedToken ? 'Copiado!' : 'Copiar ID'}
                        </button>
                      </div>

                      <div className="pt-3 border-t border-[hsl(var(--border))]">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('colaborador')
                            setEmail(adminEmail || companyEmail)
                            setCompanyStepStarted(false)
                            setCompanyStep(1)
                          }}
                          className="w-full gradient-brand py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/20 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Ir para Login do Colaborador</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* BOTÕES DE NAVEGAÇÃO ENTRE ETAPAS (1 A 4) */}
                  {/* ========================================================= */}
                  {companyStep < 5 && (
                    <div className="mt-8 flex items-center justify-between gap-3 border-t border-[hsl(var(--border))] pt-5">
                      {companyStep > 1 ? (
                        <button
                          type="button"
                          onClick={handleBackCompanyStep}
                          disabled={isSubmittingCompany}
                          className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Voltar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCompanyStepStarted(false)}
                          className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                      )}

                      {companyStep < 4 ? (
                        <button
                          type="button"
                          onClick={handleNextCompanyStep}
                          className="gradient-brand px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <span>Avançar</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmittingCompany}
                          className="gradient-brand px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 rounded-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingCompany ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Enviando...</span>
                            </>
                          ) : (
                            <>
                              <span>Concluir Cadastro</span>
                              <CheckCircle2 className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
