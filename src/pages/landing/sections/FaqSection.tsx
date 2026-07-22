import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  { q: 'Como funciona o Portal do Cliente?', a: 'O Portal é uma plataforma digital que conecta sua empresa e a contabilidade em tempo real. Pelo ecossistema integrado (XMLHub, MonitorHub, ConnectHub, TaskHub e DriveHub), todos os dados, notas e certidões são gerenciados de forma automatizada.' },
  { q: 'O que são os módulos XMLHub e MonitorHub?', a: 'O XMLHub monitora a SEFAZ em tempo real para capturar, validar e baixar notas fiscais. O MonitorHub realiza varredura automática de certidões e obrigações, alertando antes que qualquer prazo expire.' },
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
        "py-28 border-b relative",
        isDark ? "border-cyan-950/40" : "border-slate-200"
      )}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <motion.div variants={fadeInUp} className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Dúvidas Frequentes</span>
          <h2 className={cn("font-heading text-3xl sm:text-4xl font-extrabold", isDark ? "text-white" : "text-slate-900")}>
            Perguntas Frequentes
          </h2>
        </motion.div>

        <div className="space-y-3 text-left">
          {faqData.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={cn(
                "rounded-2xl border overflow-hidden hover:border-cyan-500/30 transition-all duration-300",
                isDark ? "border-cyan-500/5 bg-[#08101d]/50" : "border-slate-200 bg-white shadow-md shadow-slate-100/50"
              )}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={cn(
                  "flex w-full items-center justify-between px-6 py-5 text-left text-sm font-semibold cursor-pointer",
                  isDark ? "text-slate-200 hover:text-white" : "text-slate-700 hover:text-slate-900"
                )}
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className={cn("h-4.5 w-4.5 shrink-0 transition-transform duration-300", openFaq === i ? "rotate-180 text-cyan-400" : "text-slate-500")} />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className={cn("px-6 pb-5 pt-1 border-t", isDark ? "border-slate-800/60" : "border-slate-100")}>
                      <p className={cn("text-xs leading-relaxed pt-3.5", isDark ? "text-slate-400" : "text-slate-500")}>{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
