import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface FaqSectionProps {
  isDark: boolean
}

const faqData = [
  { q: 'Como funciona o Portal do Cliente?', a: 'O Portal é uma plataforma digital que conecta sua empresa e a contabilidade em tempo real. Pelo ecossistema integrado (Guias Bi2B, Monitora Bi2B, Bi2B Chamados, Tarefas Bi2B e Bi2B Drive), todos os dados, notas e certidões são gerenciados de forma automatizada.' },
  { q: 'O que são os módulos Guias Bi2B e Monitora Bi2B?', a: 'O Guias Bi2B monitora a SEFAZ em tempo real para capturar, validar e baixar notas fiscais. O Monitora Bi2B realiza varredura automática de certidões e obrigações, alertando antes que qualquer prazo expire.' },
  { q: 'Meus dados estão isolados no banco de dados?', a: 'Sim! Utilizamos arquitetura de banco de dados PostgreSQL com Row Level Security (RLS) avançado. Seus dados são totalmente isolados lógica e fisicamente de outras empresas.' },
  { q: 'Posso configurar acessos diferentes para minha equipe?', a: 'Sim. O usuário Cliente Master pode convidar colaboradores adicionais para sua empresa e definir permissões modulares de forma individualizada.' },
  { q: 'O Portal do Cliente é compatível com celulares?', a: 'Sim. Nossa interface é 100% responsiva (Mobile-First) e adaptada para funcionar perfeitamente em smartphones, tablets e computadores.' },
]

export function FaqSection({ isDark }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <motion.section
      id="faq"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative overflow-hidden",
        isDark ? "bg-[#040914]/60 border-white/10" : "bg-slate-100/50 border-slate-200"
      )}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <motion.div variants={fadeInUp} className="space-y-4">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(13,96,132,0.2)]",
            isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]"
          )}>
            Dúvidas Frequentes
          </span>
          <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight", isDark ? "text-white" : "text-slate-900")}>
            Perguntas Frequentes
          </h2>
        </motion.div>

        <div className="space-y-4 text-left">
          {faqData.map((faq, i) => {
            const isOpen = openFaq === i
            return (
              <div
                key={i}
                className={cn(
                  "rounded-3xl border overflow-hidden backdrop-blur-2xl transition-colors duration-300 shadow-xl w-full",
                  isDark 
                    ? "border-white/10 bg-[#040914]/70 hover:border-cyan-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)]" 
                    : "border-slate-200 bg-white shadow-md shadow-slate-100/50 hover:border-slate-300"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className={cn(
                    "flex w-full items-center justify-between px-7 py-5 text-left text-sm font-bold cursor-pointer transition-colors focus:outline-none select-none",
                    isDark ? "text-slate-200 hover:text-cyan-300" : "text-slate-700 hover:text-[#0d6084]"
                  )}
                >
                  <span className="pr-4 leading-snug">{faq.q}</span>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform duration-300", isOpen ? "rotate-180 text-cyan-400" : "text-slate-400")} />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.04,0.62,0.23,0.98)] overflow-hidden",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className={cn("px-7 pb-6 pt-3 border-t", isDark ? "border-white/10" : "border-slate-100")}>
                      <p className={cn("text-xs sm:text-sm leading-relaxed", isDark ? "text-slate-300/90" : "text-slate-600")}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
