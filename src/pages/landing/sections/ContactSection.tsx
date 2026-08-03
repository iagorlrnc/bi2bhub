import { useState } from 'react'
import {
  Mail,
  Send,
  ShieldCheck,
  MessageCircle,
  Loader2,
  PhoneCall,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ContactSectionProps {
  isDark: boolean
}

export function ContactSection({ isDark }: ContactSectionProps) {
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadMessage, setLeadMessage] = useState('')
  const [websiteHoneypot, setWebsiteHoneypot] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (websiteHoneypot) {
      toast.success('Mensagem recebida com sucesso!')
      setWebsiteHoneypot('')
      return
    }

    if (!leadName.trim() || !leadPhone.trim()) {
      toast.error('Por favor, preencha seu Nome e Telefone/WhatsApp.')
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsSubmitting(false)

    toast.success(`Obrigado, ${leadName}! Sua mensagem foi enviada. Entraremos em contato via WhatsApp em breve.`)

    const msg = encodeURIComponent(
      `Olá! Meu nome é ${leadName} (Tel: ${leadPhone}). ${leadMessage ? `Mensagem: ${leadMessage}` : 'Gostaria de falar com um contador da Bi2B Consultoria.'}`
    )
    window.open(`https://wa.me/5599999999999?text=${msg}`, '_blank')

    setLeadName('')
    setLeadPhone('')
    setLeadMessage('')
  }

  const openDirectWhatsapp = () => {
    const defaultMsg = encodeURIComponent('Olá! Gostaria de falar com um contador da Bi2B Consultoria.')
    window.open(`https://wa.me/5599999999999?text=${defaultMsg}`, '_blank')
  }

  return (
    <section
      id="contato"
      className={cn(
        'py-20 relative overflow-hidden',
        isDark ? 'bg-[#040914]' : 'bg-slate-100/60'
      )}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0d6084]/30 bg-[#0d6084]/10 text-[#0d6084] dark:text-cyan-300 font-extrabold text-xs uppercase tracking-widest">
            Atendimento Direto & Sem Complicação
          </div>

          <h2 className={cn('text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-sans', isDark ? 'text-white' : 'text-slate-900')}>
            Fale Conosco Hoje Mesmo
          </h2>

          <p className={cn('text-base sm:text-lg leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
            Tire suas dúvidas diretamente com nossos contadores por telefone, WhatsApp ou enviando uma mensagem abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Estática */}
          <div className="lg:col-span-5 space-y-6">
            <div
              onClick={openDirectWhatsapp}
              className={cn(
                'p-6 rounded-2xl border cursor-pointer flex items-center gap-4',
                isDark ? 'bg-[#060e20] border-emerald-500/40' : 'bg-white border-emerald-500/40 shadow-sm'
              )}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">Conversar no WhatsApp</p>
                <p className={cn('text-lg font-bold mt-0.5', isDark ? 'text-white' : 'text-slate-900')}>
                  (99) 99999-9999
                </p>
                <p className="text-xs text-slate-400 font-medium">Clique para abrir o WhatsApp</p>
              </div>
            </div>

            <div className={cn(
              'p-6 rounded-2xl border flex items-center gap-4',
              isDark ? 'bg-[#060e20] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            )}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d6084] to-[#0a4a62] text-white flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Telefone Comercial</p>
                <p className={cn('text-base font-bold', isDark ? 'text-white' : 'text-slate-900')}>(99) 99999-9999</p>
              </div>
            </div>

            <div className={cn(
              'p-6 rounded-2xl border flex items-center gap-4',
              isDark ? 'bg-[#060e20] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            )}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d6084] to-[#0a4a62] text-white flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">E-mail Corporativo</p>
                <p className={cn('text-base font-bold', isDark ? 'text-white' : 'text-slate-900')}>contato@bi2b.com.br</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form Estático */}
          <div className="lg:col-span-7">
            <div
              className={cn(
                'rounded-2xl border p-8 shadow-xl',
                isDark
                  ? 'bg-[#060e20] border-white/10'
                  : 'bg-white border-slate-200'
              )}
            >
              <h3 className={cn('text-xl font-bold mb-4', isDark ? 'text-white' : 'text-slate-900')}>
                Envie uma Mensagem Direta
              </h3>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="hp_phone_web"
                    tabIndex={-1}
                    autoComplete="off"
                    value={websiteHoneypot}
                    onChange={(e) => setWebsiteHoneypot(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="lead-name" className={cn('block text-xs font-extrabold uppercase tracking-wider mb-1.5', isDark ? 'text-slate-200' : 'text-slate-700')}>
                    Seu Nome Completo *
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    required
                    placeholder="Ex: João Silva"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className={cn(
                      'w-full rounded-xl border px-4 py-3.5 text-sm font-medium focus:outline-none',
                      isDark
                        ? 'border-white/15 bg-[#040914] text-white focus:border-cyan-400'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0d6084]'
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="lead-phone" className={cn('block text-xs font-extrabold uppercase tracking-wider mb-1.5', isDark ? 'text-slate-200' : 'text-slate-700')}>
                    Seu WhatsApp / Telefone *
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    required
                    placeholder="(99) 99999-9999"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className={cn(
                      'w-full rounded-xl border px-4 py-3.5 text-sm font-medium focus:outline-none',
                      isDark
                        ? 'border-white/15 bg-[#040914] text-white focus:border-cyan-400'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0d6084]'
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="lead-msg" className={cn('block text-xs font-extrabold uppercase tracking-wider mb-1.5', isDark ? 'text-slate-200' : 'text-slate-700')}>
                    Sua Dúvida ou Mensagem (Opcional)
                  </label>
                  <textarea
                    id="lead-msg"
                    rows={3}
                    placeholder="Como podemos ajudar sua empresa?"
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    className={cn(
                      'w-full rounded-xl border px-4 py-3 text-sm font-medium focus:outline-none resize-none',
                      isDark
                        ? 'border-white/15 bg-[#040914] text-white focus:border-cyan-400'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0d6084]'
                    )}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white border border-cyan-400/30 shadow-md cursor-pointer active:scale-95 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar Mensagem ao Contador
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-3">
                    <ShieldCheck className={cn('h-4 w-4', isDark ? 'text-cyan-400' : 'text-[#0d6084]')} />
                    <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                      Seus dados estão protegidos e seguros
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
