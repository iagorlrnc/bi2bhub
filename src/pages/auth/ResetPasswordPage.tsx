import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/constants/routes'
import { APP_NAME, STRONG_PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from '@/constants'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import logoPng from '@/assets/logo.png'

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se existe um hash de recuperação/acesso na URL
    const hash = window.location.hash
    if (!hash && !window.location.search.includes('code=')) {
      toast.error('Link de redefinição inválido ou expirado.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      toast.error(PASSWORD_REQUIREMENTS_MESSAGE)
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error

      // Revogar sessões ativas em todos os outros dispositivos após alteração de senha
      await supabase.auth.signOut({ scope: 'global' })

      setIsSuccess(true)
      toast.success('Sua senha foi redefinida com sucesso!')
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('Erro na redefinição de senha:', err)
      }
      toast.error(err.message || 'Erro ao redefinir sua senha.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex flex-col items-center">
        <img src={logoPng} alt={APP_NAME} className="h-12 w-auto object-contain mb-3" />
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Redefinição de Senha
        </p>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-xl shadow-black/5">
        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Senha Alterada!</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
              Sua senha foi atualizada com segurança. Clique no botão abaixo para acessar sua conta.
            </p>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="mt-4 w-full rounded-lg gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:brightness-110"
            >
              Ir para o Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
              Crie uma nova senha forte para a sua conta.
            </p>

            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 pr-10 text-sm text-[hsl(var(--foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                Confirmar Nova Senha
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </span>
              ) : (
                'Salvar Nova Senha'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
