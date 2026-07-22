import { motion } from 'framer-motion'
import {
  UserPlus,
  KeyRound,
  FileCheck2,
  MailCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
} as const

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 16, stiffness: 100 } },
} as const

interface HowItWorksSectionProps {
  isDark: boolean
}

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Dados Pessoais',
    desc: 'Preencha suas informações básicas: nome, e-mail e crie sua senha segura de acesso ao portal.',
  },
  {
    step: '02',
    icon: KeyRound,
    title: 'Código de 4 Dígitos',
    desc: 'Vincule-se à sua empresa informando o código exclusivo de 4 dígitos fornecido pelo escritório contábil.',
  },
  {
    step: '03',
    icon: FileCheck2,
    title: 'Aceite dos Termos',
    desc: 'Revise e aceite os Termos de Uso e a Política de Privacidade em conformidade com a LGPD.',
  },
  {
    step: '04',
    icon: MailCheck,
    title: 'Validação de E-mail',
    desc: 'Confirme seu e-mail através do link de verificação enviado à sua caixa de entrada. Pronto!',
  },
]

export function HowItWorksSection({ isDark }: HowItWorksSectionProps) {
  return (
    <motion.section
      id="como-funciona"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative",
        isDark ? "bg-[#0b1329]/40 border-cyan-950/40" : "bg-slate-100/50 border-slate-200/60"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Onboarding Simples</span>
          <h2 className={cn("font-heading text-3xl sm:text-4xl font-extrabold", isDark ? "text-white" : "text-slate-900")}>
            Cadastro em 4 etapas
          </h2>
          <p className={cn("max-w-xl mx-auto text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Sem burocracia ou complexidade técnica. Conecte sua empresa ao escritório contábil em minutos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
          {/* Connector line (desktop only) */}
          <div className={cn(
            "hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px",
            isDark ? "bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" : "bg-gradient-to-r from-transparent via-slate-300 to-transparent"
          )} />

          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              variants={scaleUp}
              className={cn(
                "relative rounded-2xl border p-7 text-left shadow-lg transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 group overflow-hidden",
                isDark
                  ? "bg-[#050b14]/75 border-cyan-500/5 hover:border-cyan-500/20 shadow-cyan-950/20 hover:shadow-cyan-500/5"
                  : "bg-white border-slate-200/85 hover:border-[#0d6084]/20 shadow-md shadow-slate-200/20 hover:shadow-[#0d6084]/5"
              )}
            >
              {/* Background step number */}
              <div className={cn(
                "absolute -top-3 right-5 text-[3.2rem] font-serif font-black leading-none select-none transition-all duration-500 group-hover:scale-115 group-hover:translate-y-1",
                isDark ? "text-cyan-900/12 group-hover:text-cyan-400/8" : "text-slate-300/20 group-hover:text-[#0d6084]/8"
              )}>
                {s.step}
              </div>

              {/* Step icon with number */}
              <div className="relative z-10 flex items-center gap-3 mb-5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                  isDark
                    ? "bg-cyan-950/40 border-cyan-500/20 text-cyan-400"
                    : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                )}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em]",
                  isDark ? "text-cyan-500/60" : "text-[#0d6084]/40"
                )}>
                  Etapa {s.step}
                </span>
              </div>

              <h4 className={cn(
                "font-heading text-lg font-bold transition-colors duration-300 group-hover:text-cyan-500",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {s.title}
              </h4>
              <p className={cn(
                "text-sm leading-relaxed mt-2 transition-colors duration-300",
                isDark ? "text-slate-400 group-hover:text-slate-300" : "text-slate-600 group-hover:text-slate-800"
              )}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
