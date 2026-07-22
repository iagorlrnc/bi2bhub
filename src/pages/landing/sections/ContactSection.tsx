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
        "py-28 relative",
        isDark ? "bg-[#0b1329]/40" : "bg-slate-100/50"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Texto Informativo */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Atendimento Imediato</span>
            <h2 className={cn("font-heading text-3xl sm:text-4xl font-extrabold leading-tight", isDark ? "text-white" : "text-slate-900")}>
              Solicite uma demonstração da plataforma
            </h2>
            <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
              Descubra em primeira mão como o ecossistema do Portal Bi2B agiliza o fluxo de notas fiscais, certidões federais e atendimento contábil.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                    isDark ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}
                >
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Contato Comercial</p>
                  <p className={cn("text-sm font-semibold", isDark ? "text-slate-200" : "text-slate-700")}>(11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                    isDark ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">E-mail Corporativo</p>
                  <p className={cn("text-sm font-semibold", isDark ? "text-slate-200" : "text-slate-700")}>comercial@bi2b.com.br</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card do Formulário */}
          <motion.div variants={scaleIn} className="lg:col-span-7">
            <div
              className={cn(
                "rounded-3xl border p-8 shadow-2xl backdrop-blur-md max-w-xl mx-auto",
                isDark
                  ? "bg-[#08101d]/90 glass-bi2b bi2b-border-glow border-cyan-500/10 shadow-cyan-950/30"
                  : "bg-white border-slate-200/80 shadow-2xl shadow-slate-200/50"
              )}
            >
              <form onSubmit={handleLeadSubmit} className="space-y-4">
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="text-left">
                    <label htmlFor="lead-name" className={cn("block text-[10px] font-bold uppercase tracking-wider mb-1.5", isDark ? "text-slate-400" : "text-slate-600")}>Nome Completo *</label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      placeholder="Ex: Alice Silva"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-xs placeholder:text-slate-500 focus:outline-none transition-all font-mono input-glow-focus",
                        isDark
                          ? "border-slate-800 bg-[#050b14]/90 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"
                      )}
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="lead-email" className={cn("block text-[10px] font-bold uppercase tracking-wider mb-1.5", isDark ? "text-slate-400" : "text-slate-600")}>E-mail Corporativo *</label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      placeholder="alice@empresa.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-xs placeholder:text-slate-500 focus:outline-none transition-all font-mono input-glow-focus",
                        isDark
                          ? "border-slate-800 bg-[#050b14]/90 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"
                      )}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="text-left">
                    <label htmlFor="lead-phone" className={cn("block text-[10px] font-bold uppercase tracking-wider mb-1.5", isDark ? "text-slate-400" : "text-slate-600")}>WhatsApp / Celular *</label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-xs placeholder:text-slate-500 focus:outline-none transition-all font-mono input-glow-focus",
                        isDark
                          ? "border-slate-800 bg-[#050b14]/90 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"
                      )}
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="lead-cnpj" className={cn("block text-[10px] font-bold uppercase tracking-wider mb-1.5", isDark ? "text-slate-400" : "text-slate-600")}>CNPJ da Empresa</label>
                    <input
                      id="lead-cnpj"
                      type="text"
                      placeholder="00.000.000/0001-00"
                      value={leadCnpj}
                      onChange={(e) => setLeadCnpj(e.target.value)}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-xs focus:outline-none transition-all input-glow-focus",
                        isDark
                          ? "border-slate-800 bg-[#050b14]/90 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"
                      )}
                    />
                  </div>
                </div>

                <div className="pt-2 text-left space-y-3">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] py-4 text-xs font-bold uppercase tracking-wider text-white border border-cyan-500/20 shadow-lg hover:brightness-110 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer hover:shadow-cyan-500/10"
                  >
                    <Send className="h-4 w-4" />
                    Solicitar Demonstração Gratuita
                  </button>
                  {/* LGPD seal */}
                  <div className="flex items-center justify-center gap-1.5">
                    <ShieldCheck className={cn("h-3 w-3", isDark ? "text-cyan-500/60" : "text-slate-400")} />
                    <span className={cn("text-[9px] font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
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
