import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import logoPng from '@/assets/logo.png'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return Number(sessionStorage.getItem('login_failed_attempts') || 0)
  })
  const [lockoutTime, setLockoutTime] = useState<number | null>(() => {
    const stored = sessionStorage.getItem('login_lockout_until')
    return stored ? Number(stored) : null
  })

  const handleSubmit = async (e: React.FormEvent) => {
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
      toast.success('Login realizado com sucesso!')
      setFailedAttempts(0)
      setLockoutTime(null)
      sessionStorage.removeItem('login_failed_attempts')
      sessionStorage.removeItem('login_lockout_until')
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error("LOGIN_ERROR:", err)
      }
      const nextAttempts = failedAttempts + 1
      setFailedAttempts(nextAttempts)
      sessionStorage.setItem('login_failed_attempts', String(nextAttempts))

      if (nextAttempts >= 5) {
        // Multiplicador progressivo de tempo
        const multiplier = Math.pow(2, Math.min(nextAttempts - 5, 4))
        const lockDuration = 30 * 1000 * multiplier // 30s, 60s, 120s, 240s...
        const unlockAt = Date.now() + lockDuration
        setLockoutTime(unlockAt)
        sessionStorage.setItem('login_lockout_until', String(unlockAt))
        toast.error(`Número máximo de tentativas atingido. Entrada bloqueada por ${Math.ceil(lockDuration / 1000)} segundos.`)
      } else {
        toast.error('Email ou senha incorretos')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in-up">
      {/* Logotipo */}
      <div className="mb-8 flex flex-col items-center">
        <img src={logoPng} alt={APP_NAME} className="h-12 w-auto object-contain mb-3" />
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Acesse sua conta para continuar
        </p>
      </div>

      {/* Painel de Login (Card) */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-xl shadow-black/5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Email */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              autoComplete="email"
              required
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 pr-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Botão de Envio (Submit) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>

          {/* Link de Cadastro */}
          <div className="pt-2 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Ainda não possui uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate(ROUTES.REGISTER)}
              className="font-medium text-brand-500 hover:text-brand-600 transition-colors hover:underline"
            >
              Fazer cadastro
            </button>
          </div>
        </form>
      </div>

      {/* Rodapé */}
      <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
        © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
      </p>
    </div>
  )
}
