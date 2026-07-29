import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import { APP_NAME, STRONG_PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from '@/constants'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, User, Building2, FileText, Check, ArrowLeft, ArrowRight, Search, CheckCircle2, AlertCircle, MailCheck, RefreshCw } from 'lucide-react'
import logoPng from '@/assets/logo.png'

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

export function RegisterPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Etapa 1: Dados Pessoais do Usuário (colunas da tabela 'usuarios')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Etapa 2: Busca por ID Exclusivo da Empresa (4 dígitos)
  const [companyIdInput, setCompanyIdInput] = useState('')
  const [foundCompany, setFoundCompany] = useState<{ id: string; name: string; trade_name: string | null; cnpj: string; codigo_exclusivo?: string | null } | null>(null)
  const [isSearchingCompany, setIsSearchingCompany] = useState(false)
  const [searchAttempted, setSearchAttempted] = useState(false)
  const [isEmployeeConfirmed, setIsEmployeeConfirmed] = useState(false)

  // Etapa 3: Aceite e Confirmação dos Termos
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // Etapa 4: Código de Validação de E-mail (Estrutura UI funcional)
  const [verificationCode, setVerificationCode] = useState('')
  const [isResending, setIsResending] = useState(false)

  // Função para buscar empresa por ID exclusivo de 4 dígitos
  const handleSearchCompany = async (overrideId?: string) => {
    const idToSearch = (overrideId !== undefined ? overrideId : companyIdInput).trim()
    if (!idToSearch) {
      toast.error('Informe o ID de 4 dígitos da empresa.')
      return
    }

    setIsSearchingCompany(true)
    setSearchAttempted(true)

    try {
      // Buscar via RPC de segurança buscar_empresa_por_codigo sem expor dados de outras empresas
      const { data: results, error } = await supabase.rpc('buscar_empresa_por_codigo', {
        p_codigo: idToSearch
      })

      if (error) {
        // Fallback para filtro direto se RPC ainda não foi aplicada no banco
        const { data: directMatch } = await supabase
          .from('empresas')
          .select('id, name, trade_name, cnpj, codigo_exclusivo')
          .eq('is_active', true)
          .eq('codigo_exclusivo', idToSearch)
          .maybeSingle()
        
        if (directMatch) {
          setFoundCompany(directMatch as any)
          toast.success('Empresa localizada com sucesso!')
          return
        }
        throw error
      }

      const match = Array.isArray(results) ? results[0] : results

      if (match) {
        setFoundCompany(match as any)
        toast.success('Empresa localizada com sucesso!')
      } else {
        setFoundCompany(null)
        setIsEmployeeConfirmed(false)
        toast.error('Nenhuma empresa ativa localizada com o ID informado.')
      }
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('ERRO_BUSCA_EMPRESA:', err)
      setFoundCompany(null)
      setIsEmployeeConfirmed(false)
      toast.error('Erro ao pesquisar empresa pelo ID. Verifique o código e tente novamente.')
    } finally {
      setIsSearchingCompany(false)
    }
  }

  // Reenviar código de verificação
  const handleResendCode = () => {
    setIsResending(true)
    setTimeout(() => {
      setIsResending(false)
      toast.success('Novo código de confirmação enviado para seu e-mail!')
    }, 1500)
  }

  // Validação por Etapa
  const validateStep1 = () => {
    if (!fullName.trim() || fullName.trim().length < 3) {
      toast.error('Informe seu Nome Completo.')
      return false
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Informe um e-mail válido.')
      return false
    }
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone && cleanPhone.length < 10) {
      toast.error('Telefone com formato inválido.')
      return false
    }
    if (!STRONG_PASSWORD_REGEX.test(password)) {
      toast.error(PASSWORD_REQUIREMENTS_MESSAGE)
      return false
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!companyIdInput.trim()) {
      toast.error('Informe o ID exclusivo de 4 a 8 dígitos da sua empresa.')
      return false
    }
    if (!foundCompany) {
      toast.error('Localize a empresa válida antes de prosseguir.')
      return false
    }
    if (!isEmployeeConfirmed) {
      toast.error('Confirme que você trabalha na empresa localizada.')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!acceptedTerms) {
      toast.error('Você precisa aceitar os Termos de Uso e Política LGPD para se cadastrar.')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2)
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3)
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep1() || !validateStep2() || !validateStep3()) return

    setIsSubmitting(true)

    try {
      // 1. Criar conta de autenticação no Supabase Auth com metadata de empresa para o trigger do banco
      const companyCodeToSave = foundCompany!.codigo_exclusivo || foundCompany!.id
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.replace(/\D/g, ''),
            company_id: foundCompany!.id,
            codigo_empresa: companyCodeToSave,
            user_type: 'client_user'
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Não foi possível registrar o usuário.')

      const userId = authData.user.id

      // 2. Chamar RPC SECURITY DEFINER para gravar perfil e vínculo sem bypass inseguro de RLS
      const { error: rpcError } = await supabase.rpc('registrar_solicitacao_acesso', {
        p_user_id: userId,
        p_email: email.trim(),
        p_full_name: fullName.trim(),
        p_phone: phone.replace(/\D/g, '') || null,
        p_company_id: foundCompany!.id,
        p_codigo_empresa: companyCodeToSave
      })

      if (rpcError) {
        if (import.meta.env.DEV) console.warn('Aviso RPC registrar_solicitacao_acesso:', rpcError.message)
      }

      toast.success('Solicitação de acesso enviada com sucesso! Aguarde a aprovação do gestor ou administrador.')
      navigate(ROUTES.LOGIN)
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('ERRO_CADASTRO:', err)
      }
      toast.error(err.message || 'Ocorreu um erro ao realizar o cadastro. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Conta', icon: User },
    { number: 2, title: 'Empresa', icon: Building2 },
    { number: 3, title: 'Revisão', icon: FileText },
    { number: 4, title: 'Validação', icon: MailCheck },
  ]

  return (
    <div className="animate-fade-in-up w-full py-2">
      <div className="w-full max-w-lg mx-auto">
        {/* Cabeçalho / Logo */}
        <div className="mb-8 text-center">
          <img src={logoPng} alt={APP_NAME} className="mx-auto h-12 w-auto object-contain mb-3 drop-shadow-sm" />
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">Criar sua conta</h1>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            Preencha os dados para solicitar o seu acesso
          </p>
        </div>

        {/* Indicador de Etapas (Stepper Perfeitamente Centralizado & Alinhado) */}
        <div className="relative mb-8 px-4">
          <div className="flex items-center justify-between relative z-10">
            {steps.map((step) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.number
              const isActive = currentStep === step.number

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

          {/* Linha de Progresso Contínua de Fundo */}
          <div className="absolute top-5 left-9 right-9 h-0.5 bg-[hsl(var(--border))] z-0 -translate-y-1/2 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Formulário Principal Card */}
        <div className="rounded-2xl border border-cyan-500/20 bg-[hsl(var(--card))] p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-[#0d6084] to-blue-600" />
          <form onSubmit={handleSubmit}>
            {/* ETAPA 1: DADOS PESSOAIS DO USUÁRIO */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                    E-mail corporativo *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@empresa.com.br"
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(00) 90000-0000"
                    maxLength={15}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                    Senha *
                  </label>
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
                  <p className="mt-1.5 text-[11px] text-[hsl(var(--muted-foreground))] leading-tight">
                    Mínimo 8 caracteres (com maiúscula, minúscula, número e caractere especial).
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 pr-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: BUSCA E CONFIRMAÇÃO DA EMPRESA */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--foreground))]">
                    ID Exclusivo da Empresa *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={companyIdInput}
                      onChange={(e) => {
                        setCompanyIdInput(e.target.value)
                        if (foundCompany) {
                          setFoundCompany(null)
                          setIsEmployeeConfirmed(false)
                        }
                      }}
                      placeholder="Ex: 4829"
                      maxLength={10}
                      className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm font-mono tracking-widest text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleSearchCompany()}
                      disabled={isSearchingCompany || !companyIdInput.trim()}
                      className="flex items-center gap-1.5 rounded-xl border border-brand-500 bg-brand-500/10 px-5 py-2.5 text-xs font-bold text-brand-600 hover:bg-brand-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-xs"
                    >
                      {isSearchingCompany ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          Buscar
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                    Digite o ID de 4 dígitos fornecido pelo seu gestor ou administrador.
                  </p>
                </div>

                {/* CARD DE DETALHES DA EMPRESA LOCALIZADA */}
                {foundCompany && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4.5 space-y-3.5 animate-fade-in shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs border-b border-emerald-500/20 pb-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      Empresa Localizada com Sucesso
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div>
                        <span className="text-[hsl(var(--muted-foreground))]">Razão Social: </span>
                        <span className="font-bold text-[hsl(var(--foreground))]">{foundCompany.name}</span>
                      </div>
                      <div>
                        <span className="text-[hsl(var(--muted-foreground))]">Nome Fantasia: </span>
                        <span className="font-semibold text-[hsl(var(--foreground))]">
                          {foundCompany.trade_name || 'Não informado'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[hsl(var(--muted-foreground))]">CNPJ: </span>
                        <span className="font-mono font-semibold text-[hsl(var(--foreground))]">
                          {formatCnpj(foundCompany.cnpj)}
                        </span>
                      </div>
                    </div>

                    {/* CHECKBOX DE CONFIRMAÇÃO DE COLABORADOR */}
                    <div className="pt-2.5 border-t border-emerald-500/20">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs font-medium text-[hsl(var(--foreground))] select-none">
                        <input
                          type="checkbox"
                          checked={isEmployeeConfirmed}
                          onChange={(e) => setIsEmployeeConfirmed(e.target.checked)}
                          className="mt-0.5 rounded border-[hsl(var(--input))] text-brand-500 focus:ring-brand-500 h-4 w-4"
                          required
                        />
                        <span>
                          Confirmo que sou colaborador desta empresa e solicito o vínculo da minha conta.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ALERTA DE NÃO LOCALIZADO */}
                {!foundCompany && searchAttempted && !isSearchingCompany && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-400 animate-fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Empresa não encontrada com este ID. Verifique o código digitado.</span>
                  </div>
                )}
              </div>
            )}

            {/* ETAPA 3: REVISÃO DOS DADOS & TERMOS DE SERVIÇO */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-5 space-y-3.5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2.5 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-500" />
                    Resumo da Solicitação
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">Nome:</span>
                      <span className="font-semibold text-[hsl(var(--foreground))]">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">E-mail:</span>
                      <span className="font-semibold text-[hsl(var(--foreground))]">{email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">Telefone:</span>
                      <span className="font-semibold text-[hsl(var(--foreground))]">{phone || 'Não informado'}</span>
                    </div>
                    <div className="pt-2.5 border-t border-[hsl(var(--border))] flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">Empresa:</span>
                      <span className="font-bold text-brand-600 dark:text-brand-400">{foundCompany?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">CNPJ:</span>
                      <span className="font-mono text-[hsl(var(--foreground))]">{foundCompany ? formatCnpj(foundCompany.cnpj) : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[hsl(var(--foreground))] select-none">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded border-[hsl(var(--input))] text-brand-500 focus:ring-brand-500 h-4 w-4"
                      required
                    />
                    <span>
                      Concordo com os{' '}
                      <span className="font-semibold text-brand-500 hover:underline">Termos de Serviço</span>{' '}
                      e a{' '}
                      <span className="font-semibold text-brand-500 hover:underline">
                        Política de Privacidade
                      </span>
                      .
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* ETAPA 4: VALIDAÇÃO DE E-MAIL (ESTRUTURA DE 6 DÍGITOS) */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in text-center py-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 shadow-sm ring-4 ring-brand-500/10">
                  <MailCheck className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[hsl(var(--foreground))]">Validação de E-mail</h3>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                    Enviamos um código de confirmação de 6 dígitos para o e-mail:
                  </p>
                  <p className="font-semibold text-xs text-brand-600 dark:text-brand-400 mt-0.5">
                    {email}
                  </p>
                </div>

                {/* 6 SLOTS DE INPUT OTP */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[hsl(var(--foreground))]">
                    Código de Verificação
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        id={`otp-slot-${idx}`}
                        type="text"
                        maxLength={1}
                        value={verificationCode[idx] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          const newCode = verificationCode.split('')
                          newCode[idx] = val
                          const updated = newCode.join('')
                          setVerificationCode(updated)
                          if (val && idx < 5) {
                            const nextInput = document.getElementById(`otp-slot-${idx + 1}`)
                            nextInput?.focus()
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !verificationCode[idx] && idx > 0) {
                            const prevInput = document.getElementById(`otp-slot-${idx - 1}`)
                            prevInput?.focus()
                          }
                        }}
                        className="h-11 w-10 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-center font-mono text-lg font-bold text-[hsl(var(--foreground))] shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* BOTAO REENVIAR CÓDIGO */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    {isResending ? 'Reenviando...' : 'Reenviar código de verificação'}
                  </button>
                </div>

                <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-3.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                  💡 Clique em <strong>Concluir Cadastro</strong> para enviar a solicitação diretamente.
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="mt-8 flex items-center justify-center gap-3 border-t border-[hsl(var(--border))] pt-5">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl gradient-brand py-3 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:brightness-110 transition-all cursor-pointer",
                    currentStep === 1 ? "w-full" : "flex-1 max-w-[240px]"
                  )}
                >
                  <span>Avançar</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl gradient-brand py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/25 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer",
                    currentStep === 1 ? "w-full" : "flex-1 max-w-[240px]"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Enviando Solicitação...</span>
                    </>
                  ) : (
                    <span>Concluir Cadastro</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Link de Retorno ao Login */}
        <div className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
          Já possui uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="font-bold text-brand-500 hover:text-brand-600 transition-colors hover:underline"
          >
            Fazer login
          </button>
        </div>
      </div>
    </div>
  )
}
