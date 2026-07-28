import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { APP_NAME, STRONG_PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from '@/constants'
import { supabase } from '@/lib/supabase'
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
  Sparkles, 
  KeyRound,  
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

  // Etapa 1: Dados da Empresa
  const [companyName, setCompanyName] = useState('')
  const [companyTradeName, setCompanyTradeName] = useState('')
  const [companyCnpj, setCompanyCnpj] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')

  // Etapa 2: Administrador Master
  const [adminFullName, setAdminFullName] = useState('')
  const [adminRole, setAdminRole] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('')
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [showAdminConfirmPassword, setShowAdminConfirmPassword] = useState(false)

  // Etapa 3: Aceite de Termos
  const [acceptedCompanyTerms, setAcceptedCompanyTerms] = useState(false)

  // Etapa 4: Token Gerado
  const [generatedToken] = useState(() => Math.floor(1000 + Math.random() * 9000).toString())

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
    if (!companyEmail.trim() || !companyEmail.includes('@')) {
      toast.error('Informe um e-mail corporativo válido.')
      return false
    }
    const cleanPhone = companyPhone.replace(/\D/g, '')
    if (cleanPhone && cleanPhone.length < 10) {
      toast.error('Informe um telefone corporativo válido.')
      return false
    }
    return true
  }

  const validateCompanyStep2 = () => {
    if (!adminFullName.trim() || adminFullName.trim().length < 3) {
      toast.error('Informe o nome do Administrador Responsável.')
      return false
    }
    if (!STRONG_PASSWORD_REGEX.test(adminPassword)) {
      toast.error(PASSWORD_REQUIREMENTS_MESSAGE)
      return false
    }
    if (adminPassword !== adminConfirmPassword) {
      toast.error('As senhas não coincidem.')
      return false
    }
    return true
  }

  const validateCompanyStep3 = () => {
    if (!acceptedCompanyTerms) {
      toast.error('Você precisa aceitar os Termos de Serviço e Política LGPD.')
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

  // Envio Final do Cadastro da Empresa (Gravação Direta no Supabase)
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCompanyStep1() || !validateCompanyStep2() || !validateCompanyStep3()) return

    setIsSubmittingCompany(true)
    try {
      // Inserir a empresa no Supabase com status inativo (is_active: false) para aprovação do Administrador
      const { error: dbErr } = await (supabase as any).from('empresas').insert({
        name: companyName.trim(),
        trade_name: companyTradeName.trim() || companyName.trim(),
        cnpj: companyCnpj.replace(/\D/g, ''),
        email: companyEmail.trim(),
        phone: companyPhone.replace(/\D/g, '') || null,
        admin_name: adminFullName.trim(),
        admin_role: adminRole.trim() || 'Administrador Master',
        codigo_exclusivo: generatedToken,
        is_active: false
      })

      if (dbErr) {
        throw dbErr
      }

      toast.success(`Solicitação de cadastro da empresa "${companyName}" enviada ao Painel Administrativo! Chave de Acesso: ${generatedToken}`)
      
      // Redireciona/Alterna para login de colaborador com e-mail preenchido
      setActiveTab('colaborador')
      setEmail(companyEmail.trim())
      setCompanyStepStarted(false)
      setCompanyStep(1)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('ERRO_CADASTRO_EMPRESA_SUPABASE:', err)
      toast.error(err.message || 'Ocorreu um erro ao enviar a solicitação para o Supabase.')
    } finally {
      setIsSubmittingCompany(false)
    }
  }

  const companySteps = [
    { number: 1, title: 'Empresa', icon: Building2 },
    { number: 2, title: 'Admin', icon: UserCheck },
    { number: 3, title: 'Termos', icon: FileText },
    { number: 4, title: 'Chave', icon: KeyRound },
  ]

  return (
    <div className="animate-fade-in-up my-6 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
      <div className="w-full max-w-lg mx-auto">
        
        {/* Logotipo da Aplicação */}
        <div className="mb-6 text-center">
          <img src={currentLogo} alt={APP_NAME} className="mx-auto h-12 w-auto object-contain mb-3 drop-shadow-sm" />
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">Portal Bi2B</h1>
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
        {/* ABA 1: COLABORADOR (LOGIN) */}
        {/* ========================================================= */}
        {activeTab === 'colaborador' && (
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8 shadow-2xl shadow-black/5 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 text-xs font-semibold tracking-wide border border-brand-500/20 shadow-xs mb-5">
              <UserCheck className="h-3.5 w-3.5" />
              <span>LOGIN COLABORADOR</span>
            </div>

            <form onSubmit={handleSubmitLogin} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                  Email do Colaborador *
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colaborador@empresa.com.br"
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                  Senha *
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 pr-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    autoComplete="current-password"
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
                className="w-full rounded-xl gradient-brand px-4 py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando no Portal...
                  </span>
                ) : (
                  <>
                    <span>Entrar no Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('cliente@bi2b.com.br')
                    setPassword('123456')
                  }}
                  className="text-xs text-brand-500 hover:text-brand-600 font-medium hover:underline transition-all"
                >
                  Preencher dados de teste (cliente@bi2b.com.br / 123456)
                </button>
              </div>

              <div className="pt-3 border-t border-[hsl(var(--border))] text-center text-xs text-[hsl(var(--muted-foreground))]">
                Ainda não possui um acesso?{' '}
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="font-bold text-brand-500 hover:text-brand-600 transition-colors hover:underline"
                >
                  Solicitar acesso
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 2: EMPRESA (ALERTA E CADASTRO EM ETAPAS) */}
        {/* ========================================================= */}
        {activeTab === 'empresa' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* TELA INICIAL: ALERTA DE CRIAÇÃO DO ACESSO DA EMPRESA */}
            {!companyStepStarted ? (
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8 shadow-2xl space-y-6">
                
                {/* ALERTA DE BOAS-VINDAS CORPORATIVO */}
                <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 text-brand-500" />
                    <span>Cadastro da Empresa</span>
                  </div>
                  <p className="text-xs text-[hsl(var(--foreground))] leading-relaxed">
                    Para cadastrar a sua empresa ou escritório e disponibilizar o portal exclusivo para seus colaboradores, siga as etapas a seguir.
                  </p>
                </div>

                {/* CHECKLIST DE VANTAGENS */}
                <div className="space-y-3 text-xs text-[hsl(var(--muted-foreground))] pt-1">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>Geração automática de <strong>Token Exclusivo de 4 dígitos</strong> para vínculo</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>Configuração de administradores e permissões modulares</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>Ambiente seguro e 100% em conformidade com as regras da LGPD</span>
                  </div>
                </div>

                {/* BOTÃO PROSSEGUIR */}
                <button
                  type="button"
                  onClick={() => setCompanyStepStarted(true)}
                  className="w-full rounded-xl gradient-brand px-5 py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Prosseguir com Cadastro da Empresa</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              /* TELA SECUNDÁRIA: CADASTRO DA EMPRESA EM ETAPAS (WIZARD) */
              <div>
                
                {/* INDICADOR DE ETAPAS DA EMPRESA */}
                <div className="relative mb-6 px-4">
                  <div className="flex items-center justify-between relative z-10">
                    {companySteps.map((step) => {
                      const Icon = step.icon
                      const isCompleted = companyStep > step.number
                      const isActive = companyStep === step.number

                      return (
                        <div key={step.number} className="flex flex-col items-center gap-1.5">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/20'
                                : isActive
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-500/20 scale-110'
                                : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))]'
                            }`}
                          >
                            {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                          </div>
                          <span
                            className={`text-[11px] font-medium tracking-tight text-center ${
                              isActive || isCompleted
                                ? 'text-[hsl(var(--foreground))] font-semibold'
                                : 'text-[hsl(var(--muted-foreground))]'
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Linha de Progresso */}
                  <div className="absolute top-5 left-9 right-9 h-0.5 bg-[hsl(var(--border))] z-0 -translate-y-1/2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                      style={{
                        width: `${((companyStep - 1) / (companySteps.length - 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* FORMULÁRIO EM ETAPAS DA EMPRESA */}
                <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8 shadow-2xl">
                  <form onSubmit={handleCompanySubmit}>
                    
                    {/* ETAPA 1: DADOS DA EMPRESA */}
                    {companyStep === 1 && (
                      <div className="space-y-4 animate-fade-in">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Razão Social *
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Bi2B Soluções Contábeis LTDA"
                            className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Nome Fantasia
                          </label>
                          <input
                            type="text"
                            value={companyTradeName}
                            onChange={(e) => setCompanyTradeName(e.target.value)}
                            placeholder="Bi2B Consultoria"
                            className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            CNPJ da Empresa *
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

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
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
                          <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Telefone / WhatsApp Comercial
                          </label>
                          <input
                            type="text"
                            value={companyPhone}
                            onChange={(e) => setCompanyPhone(formatPhone(e.target.value))}
                            placeholder="(00) 90000-0000"
                            maxLength={15}
                            className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* ETAPA 2: ADMINISTRADOR MASTER */}
                    {companyStep === 2 && (
                      <div className="space-y-4 animate-fade-in">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Nome Completo do Responsável *
                          </label>
                          <input
                            type="text"
                            value={adminFullName}
                            onChange={(e) => setAdminFullName(e.target.value)}
                            placeholder="Nome do administrador da conta"
                            className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Cargo / Função na Empresa
                          </label>
                          <input
                            type="text"
                            value={adminRole}
                            onChange={(e) => setAdminRole(e.target.value)}
                            placeholder="Ex: Diretor, Gestor Contábil"
                            className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Senha Master da Conta *
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
                          <p className="mt-1.5 text-[11px] text-[hsl(var(--muted-foreground))] leading-tight">
                            Mínimo 8 caracteres (com maiúscula, minúscula, número e símbolo).
                          </p>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                            Confirmar Senha Master *
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
                    )}

                    {/* ETAPA 3: REVISÃO & TERMOS */}
                    {companyStep === 3 && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-5 space-y-3.5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2.5 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-brand-500" />
                            Resumo do Cadastro da Empresa
                          </h3>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-[hsl(var(--muted-foreground))]">Razão Social:</span>
                              <span className="font-semibold text-[hsl(var(--foreground))]">{companyName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[hsl(var(--muted-foreground))]">CNPJ:</span>
                              <span className="font-mono text-[hsl(var(--foreground))]">{formatCnpj(companyCnpj)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[hsl(var(--muted-foreground))]">E-mail:</span>
                              <span className="font-semibold text-[hsl(var(--foreground))]">{companyEmail}</span>
                            </div>
                            <div className="pt-2.5 border-t border-[hsl(var(--border))] flex justify-between">
                              <span className="text-[hsl(var(--muted-foreground))]">Responsável:</span>
                              <span className="font-bold text-brand-600 dark:text-brand-400">{adminFullName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[hsl(var(--foreground))] select-none">
                            <input
                              type="checkbox"
                              checked={acceptedCompanyTerms}
                              onChange={(e) => setAcceptedCompanyTerms(e.target.checked)}
                              className="mt-0.5 rounded border-[hsl(var(--input))] text-brand-500 focus:ring-brand-500 h-4 w-4"
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

                    {/* ETAPA 4: CHAVE DE ACESSO GERADA */}
                    {companyStep === 4 && (
                      <div className="space-y-5 animate-fade-in text-center py-2">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-sm ring-4 ring-emerald-500/10">
                          <Sparkles className="h-7 w-7 text-emerald-500" />
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-[hsl(var(--foreground))]">Chave de Conexão Gerada!</h3>
                          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                            Utilize o código abaixo para que seus colaboradores e clientes se vinculem à sua empresa:
                          </p>
                        </div>

                        {/* EXIBIÇÃO DO TOKEN DE 4 DÍGITOS */}
                        <div className="flex justify-center gap-3 py-2">
                          {generatedToken.split('').map((char, i) => (
                            <div key={i} className="w-12 h-14 rounded-2xl border-2 border-brand-500/40 bg-brand-500/10 flex items-center justify-center font-mono text-2xl font-black text-brand-600 dark:text-brand-400 shadow-md">
                              {char}
                            </div>
                          ))}
                        </div>

                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-700 dark:text-emerald-300">
                          💡 Guarde este Token! Ele será solicitado na etapa de vínculo do cadastro de novos usuários.
                        </div>
                      </div>
                    )}

                    {/* BOTÕES DE NAVEGAÇÃO ENTRE ETAPAS */}
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
                          className="flex items-center gap-2 rounded-xl gradient-brand px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:brightness-110 transition-all ml-auto cursor-pointer"
                        >
                          Avançar
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmittingCompany}
                          className="flex items-center gap-2 rounded-xl gradient-brand px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-500/25 hover:brightness-110 transition-all ml-auto disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmittingCompany ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Cadastrando Empresa...
                            </>
                          ) : (
                            'Concluir Cadastro da Empresa'
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rodapé da Página */}
        <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
          © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
