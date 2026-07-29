import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants'
import { Eye, EyeOff, Loader2, ShieldCheck, Lock } from 'lucide-react'
import { toast } from 'sonner'
import logoPng from '@/assets/logo.png'
import { getAdminSubdomainUrl } from '@/utils/subdomain'

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn, userType } = useAuth()
  const navigate = useNavigate()
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return Number(sessionStorage.getItem('admin_login_failed_attempts') || 0)
  })
  const [lockoutTime, setLockoutTime] = useState<number | null>(() => {
    const stored = sessionStorage.getItem('admin_login_lockout_until')
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

      // Verificar se o usuário possui permissão de administrador
      if (userType && userType !== 'admin') {
        toast.error('Acesso Negado: Esta área é exclusiva para a Administração.')
        return
      }

      toast.success('Autenticação administrativa realizada com sucesso!')
      setFailedAttempts(0)
      setLockoutTime(null)
      sessionStorage.removeItem('admin_login_failed_attempts')
      sessionStorage.removeItem('admin_login_lockout_until')

      const adminUrl = getAdminSubdomainUrl('/dashboard')
      if (adminUrl.startsWith('http') && window.location.hostname !== new URL(adminUrl).hostname) {
        window.location.href = adminUrl
      } else {
        navigate(ROUTES.ADMIN_DASHBOARD)
      }
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error("ADMIN_LOGIN_ERROR:", err)
      }
      const nextAttempts = failedAttempts + 1
      setFailedAttempts(nextAttempts)
      sessionStorage.setItem('admin_login_failed_attempts', String(nextAttempts))

      if (nextAttempts >= 5) {
        const multiplier = Math.pow(2, Math.min(nextAttempts - 5, 4))
        const lockDuration = 30 * 1000 * multiplier
        const unlockAt = Date.now() + lockDuration
        setLockoutTime(unlockAt)
        sessionStorage.setItem('admin_login_lockout_until', String(unlockAt))
        toast.error(`Número máximo de tentativas atingido. Entrada bloqueada por ${Math.ceil(lockDuration / 1000)} segundos.`)
      } else {
        toast.error(err.message || 'Email ou senha incorretos')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in-up">
      {/* Logotipo e Badge de Administrador */}
      <div className="mb-6 flex flex-col items-center">
        <img src={logoPng} alt={APP_NAME} className="h-12 w-auto object-contain mb-3" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-cyan-400 text-xs font-semibold tracking-wide border border-cyan-500/30 shadow-md">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>PAINEL ADMINISTRATIVO</span>
        </div>
        <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
          Acesso restrito para administradores e equipe técnica
        </p>
      </div>

      {/* Painel de Login (Card Admin) */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[hsl(var(--card))] p-8 shadow-2xl shadow-cyan-950/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-[#0d6084] to-blue-600" />
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Email */}
          <div>
            <label
              htmlFor="admin-login-email"
              className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]"
            >
              Email Administrativo
            </label>
            <input
              id="admin-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bi2b.com.br"
              className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              autoComplete="email"
              required
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label
              htmlFor="admin-login-password"
              className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]"
            >
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 pr-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
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
            className="w-full rounded-lg bg-gradient-to-r from-[#0d6084] to-[#0a4a62] border border-cyan-500/30 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-950/40 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Autenticando Admin...
              </span>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Entrar como Administrador</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Rodapé */}
      <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
        © {new Date().getFullYear()} {APP_NAME} Admin. Acesso monitorado por IP.
      </p>
    </div>
  )
}
