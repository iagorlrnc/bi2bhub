import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
} as const

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

interface ContactSectionProps {
  isDark: boolean
}

export function ContactSection({ isDark }: ContactSectionProps) {
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadCnpj, setLeadCnpj] = useState('')
  const [websiteHoneypot, setWebsiteHoneypot] = useState('')

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (websiteHoneypot) {
      toast.success('Demonstração solicitada! Em breve entraremos em contato via WhatsApp.')
      setWebsiteHoneypot('')
      return
    }
    if (!leadName || !leadEmail || !leadPhone) {
      toast.error('Preencha os campos obrigatórios!')
      return
    }
    toast.success('Demonstração solicitada! Entraremos em contato via WhatsApp em minutos.')
    setLeadName('')
    setLeadEmail('')
    setLeadPhone('')
    setLeadCnpj('')
  }

  return (
    <motion.section
      id="contato"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 relative overflow-hidden",
        isDark ? "bg-[#040914]/40" : "bg-slate-100/50"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Texto Informativo */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 text-left space-y-6">
            <span className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(13,96,132,0.2)]",
              isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]"
            )}>
              Atendimento Imediato
            </span>
            <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              Solicite uma demonstração da plataforma
            </h2>
            <p className={cn("text-sm sm:text-base leading-relaxed", isDark ? "text-slate-300/90" : "text-slate-600")}>
              Descubra em primeira mão como o ecossistema do Portal Bi2B agiliza o fluxo de notas fiscais, certidões federais e atendimento contábil.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-inner",
                    isDark ? "bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border-cyan-400/30 text-cyan-200 shadow-[0_6px_20px_rgba(13,96,132,0.3)]" : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}
                >
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contato Comercial</p>
                  <p className={cn("text-base font-bold", isDark ? "text-white" : "text-slate-800")}>(11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-inner",
                    isDark ? "bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border-cyan-400/30 text-cyan-200 shadow-[0_6px_20px_rgba(13,96,132,0.3)]" : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">E-mail Corporativo</p>
                  <p className={cn("text-base font-bold", isDark ? "text-white" : "text-slate-800")}>comercial@bi2b.com.br</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card do Formulário */}
          <motion.div variants={scaleIn} className="lg:col-span-7">
            <div
              className={cn(
                "rounded-3xl border p-8 sm:p-10 shadow-2xl backdrop-blur-2xl max-w-xl mx-auto transition-all duration-300",
                isDark
                  ? "bg-[#040914]/80 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-cyan-950/20"
                  : "bg-white border-slate-200/80 shadow-2xl shadow-slate-200/50"
              )}
            >
              <form onSubmit={handleLeadSubmit} className="space-y-5">
                {/* Honeypot protection */}
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

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="text-left">
                    <label htmlFor="lead-name" className={cn("block text-[11px] font-bold uppercase tracking-wider mb-2", isDark ? "text-slate-300" : "text-slate-700")}>Nome Completo *</label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      placeholder="Ex: Alice Silva"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3.5 text-xs placeholder:text-slate-500 focus:outline-none transition-all duration-300",
                        isDark
                          ? "border-white/10 bg-[#040914]/90 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0d6084]"
                      )}
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="lead-email" className={cn("block text-[11px] font-bold uppercase tracking-wider mb-2", isDark ? "text-slate-300" : "text-slate-700")}>E-mail Corporativo *</label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      placeholder="alice@empresa.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3.5 text-xs placeholder:text-slate-500 focus:outline-none transition-all duration-300",
                        isDark
                          ? "border-white/10 bg-[#040914]/90 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0d6084]"
                      )}
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="text-left">
                    <label htmlFor="lead-phone" className={cn("block text-[11px] font-bold uppercase tracking-wider mb-2", isDark ? "text-slate-300" : "text-slate-700")}>WhatsApp / Celular *</label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3.5 text-xs placeholder:text-slate-500 focus:outline-none transition-all duration-300",
                        isDark
                          ? "border-white/10 bg-[#040914]/90 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0d6084]"
                      )}
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="lead-cnpj" className={cn("block text-[11px] font-bold uppercase tracking-wider mb-2", isDark ? "text-slate-300" : "text-slate-700")}>CNPJ da Empresa</label>
                    <input
                      id="lead-cnpj"
                      type="text"
                      placeholder="00.000.000/0001-00"
                      value={leadCnpj}
                      onChange={(e) => setLeadCnpj(e.target.value)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3.5 text-xs placeholder:text-slate-500 focus:outline-none transition-all duration-300",
                        isDark
                          ? "border-white/10 bg-[#040914]/90 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0d6084]"
                      )}
                    />
                  </div>
                </div>

                <div className="pt-2 text-left space-y-4">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] py-4 text-xs font-bold uppercase tracking-wider text-white border border-cyan-400/30 shadow-[0_8px_25px_rgba(13,96,132,0.4)] hover:shadow-[0_12px_35px_rgba(13,96,132,0.55)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    Solicitar Demonstração Gratuita
                  </button>
                  {/* LGPD seal */}
                  <div className="flex items-center justify-center gap-2">
                    <ShieldCheck className={cn("h-4 w-4", isDark ? "text-cyan-400" : "text-[#0d6084]")} />
                    <span className={cn("text-[10px] font-medium uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                      Seus dados estão protegidos pela LGPD (Lei nº 13.709/2018)
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  )
}
