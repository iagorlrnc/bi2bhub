import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ROUTES } from '@/constants/routes'
import { CheckCircle2 } from 'lucide-react'
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

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 16, stiffness: 100 } },
} as const

interface PricingSectionProps {
  isDark: boolean
}

const plans = [
  {
    name: 'Básico',
    desc: 'Para empresas individuais em crescimento contábil.',
    monthly: '197',
    yearly: '145',
    users: '1 Usuário Master',
    features: ['XML Fiscal Automático', 'MonitorHub (CND Federal)', 'DriveHub de 5GB', 'Suporte Comercial padrão'],
  },
  {
    name: 'Pró',
    desc: 'Recomendado para times que buscam controle fiscal total.',
    monthly: '247',
    yearly: '185',
    users: 'Até 5 Usuários Compartilhados',
    features: ['XML Fiscal Automático (Lote)', 'MonitorHub Completo (Todas CNDs)', 'DriveHub de 20GB', 'ConnectHub (Suporte Prioritário)', 'TaskHub (Gestão de Impostos)', 'Insights IA integrados'],
    pop: true,
  },
  {
    name: 'Plus',
    desc: 'Indicado para holdings e médias empresas integradas.',
    monthly: '497',
    yearly: '370',
    users: 'Acessos Ilimitados',
    features: ['Módulos Fiscais e XML sem limite', 'MonitorHub Avançado + API', 'DriveHub de 100GB', 'Suporte Técnico Dedicado 24h', 'TaskHub + Relatórios Mensais', 'Payload logs e LGPD Completa'],
  },
]

export function PricingSection({ isDark }: PricingSectionProps) {
  const navigate = useNavigate()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <motion.section
      id="planos"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative",
        isDark ? "border-cyan-950/40" : "border-slate-200"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <motion.div variants={fadeInUp} className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Flexibilidade Financeira</span>
          <h2 className={cn("font-heading text-3xl sm:text-4xl font-extrabold", isDark ? "text-white" : "text-slate-900")}>
            Nossos Planos e Preços
          </h2>
          <p className={cn("max-w-xl mx-auto text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Escolha a escala de usuários do portal ideal para o tamanho da sua operação. Ative sem amarras.
          </p>
        </motion.div>

        {/* Toggle de Faturamento */}
        <motion.div
          variants={fadeInUp}
          className={cn("inline-flex items-center gap-1.5 p-1 rounded-full relative z-10", isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200 shadow-sm")}
        >
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={cn(
              "relative rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300",
              billingPeriod === 'monthly'
                ? "text-white"
                : (isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800")
            )}
          >
            {billingPeriod === 'monthly' && (
              <motion.span
                layoutId="billingTogglePill"
                className="absolute inset-0 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] rounded-full -z-10 shadow-md"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            Faturamento Mensal
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={cn(
              "relative rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all duration-300",
              billingPeriod === 'yearly'
                ? "text-white"
                : (isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800")
            )}
          >
            {billingPeriod === 'yearly' && (
              <motion.span
                layoutId="billingTogglePill"
                className="absolute inset-0 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] rounded-full -z-10 shadow-md"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">Anual</span>
            <span className={cn(
              "text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-normal relative z-10 transition-all duration-350",
              billingPeriod === 'yearly'
                ? "bg-cyan-500 text-[#050b14]"
                : (isDark ? "bg-slate-800 text-cyan-400" : "bg-cyan-50 text-[#0d6084]")
            )}>
              Economize 25%
            </span>
          </button>
        </motion.div>

        {/* Grid de Cards dos Planos */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-6">
          {plans.map((p, idx) => (
            <motion.div
              key={idx}
              variants={scaleUp}
              className={cn(
                "rounded-3xl border text-left p-8 flex flex-col justify-between relative transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 group",
                p.pop
                  ? (isDark
                      ? "bg-gradient-to-b from-[#08152b] to-[#050d1a] border-cyan-500 shadow-2xl shadow-cyan-950/45 hover:border-cyan-400 gradient-border-animated"
                      : "bg-white border-cyan-500 shadow-xl shadow-slate-200/50 border-2 hover:border-cyan-600 gradient-border-animated")
                  : (isDark
                      ? "bg-[#08101d]/50 border-slate-800 shadow-lg hover:border-cyan-500/20"
                      : "bg-white border-slate-200 hover:border-[#0d6084]/20 shadow-md shadow-slate-200/10")
              )}
            >
              {p.pop && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-500 text-[#050b14] text-[9px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full shadow-lg border border-cyan-400 animate-pulse z-10">
                  Recomendado
                </span>
              )}
              <div>
                <h4 className={cn("font-heading text-lg font-bold transition-colors duration-300 group-hover:text-cyan-500", isDark ? "text-white" : "text-slate-900")}>{p.name}</h4>
                <p className={cn("text-xs leading-normal mb-6 min-h-[36px]", isDark ? "text-slate-400" : "text-slate-500")}>{p.desc}</p>
                
                {/* Preço */}
                <div className={cn("flex items-baseline gap-1 mb-6 border-b pb-6 transition-colors duration-500", isDark ? "border-slate-800" : "border-slate-200")}>
                  <span className={cn("text-sm font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>R$</span>
                  <div className="overflow-hidden min-w-[70px] inline-flex justify-start">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={billingPeriod === 'monthly' ? p.monthly : p.yearly}
                        initial={{ y: -15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 15, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={cn("text-4xl font-extrabold tracking-tight leading-none inline-block", isDark ? "text-white" : "text-slate-900")}
                      >
                        {billingPeriod === 'monthly' ? p.monthly : p.yearly}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">/ mês</span>
                </div>

                {/* Benefícios */}
                <ul className={cn("space-y-3.5 text-xs mb-8", isDark ? "text-slate-300" : "text-slate-600")}>
                  <li className="flex items-center gap-2.5 font-bold text-cyan-500">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    {p.users}
                  </li>
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(ROUTES.REGISTER)}
                className={cn(
                  "w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative z-10",
                  p.pop
                    ? "bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white border border-cyan-500/35 hover:shadow-cyan-500/20"
                    : (isDark
                        ? "border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:border-cyan-500/20"
                        : "border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:border-[#0d6084]/20")
                )}
              >
                Começar Teste Grátis
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
