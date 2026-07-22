import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { toast } from 'sonner'
import logoPng from '@/assets/logo.png'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Informe seu e-mail cadastrado.')
      return
    }

    setIsSubmitting(true)
    try {
      const redirectTo = `${window.location.origin}${ROUTES.RESET_PASSWORD}`
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) throw error

      setIsSent(true)
      toast.success('E-mail de recuperação enviado com sucesso!')
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('Erro no envio de e-mail de recuperação:', err)
      }
      toast.error(err.message || 'Erro ao enviar e-mail de recuperação.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex flex-col items-center">
        <img src={logoPng} alt={APP_NAME} className="h-12 w-auto object-contain mb-3" />
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Recuperação de Acesso
        </p>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-xl shadow-black/5">
        {isSent ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <MailCheck className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Verifique seu E-mail</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
              Enviamos as instruções de redefinição de senha para <span className="font-semibold text-[hsl(var(--foreground))]">{email}</span>. Clique no link recebido para cadastrar uma nova senha.
            </p>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg border border-[hsl(var(--border))] py-2.5 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
              Digite seu e-mail abaixo. Se houver uma conta associada, enviaremos um link seguro para você redefinir sua senha.
            </p>

            <div>
              <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                E-mail Cadastrado
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
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
                  Enviando...
                </span>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar para o Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
