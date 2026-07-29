import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Sparkles, ArrowRight, PhoneCall } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getClientSubdomainUrl } from '@/utils/subdomain'

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
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 18, stiffness: 100 } },
} as const

interface PricingSectionProps {
  isDark: boolean
}

const plans = [
  {
    name: 'Básico',
    desc: 'Ideal para empresas em crescimento que precisam das soluções essenciais do portal contábil.',
    monthly: '119',
    yearly: '99',
    users: '1 Gestor + 1 Colaborador',
    cta: 'Começar Teste Grátis',
    isSpecialist: false,
    features: [
      'Guias Bi2B: Acesso e download de DAS, ISS e FGTS',
      'Bi2B Drive: 5GB de armazenamento para documentos',
      'Tarefas Bi2B: Envio de comprovantes e extratos mensais',
      'Bi2B Chamados: Atendimento padrão para dúvidas fiscais',
      'Equipe: Solicitação e gestão inicial de colaboradores',
    ],
  },
  {
    name: 'Pró',
    desc: 'Recomendado para empresas que buscam automação e controle completo das rotinas.',
    monthly: '199',
    yearly: '159',
    users: 'Até 5 Colaboradores',
    cta: 'Começar Teste Grátis',
    isSpecialist: false,
    features: [
      'Guias Bi2B: Download em lote e controle de vencimentos',
      'Bi2B Drive: 20GB categorizado (Fiscal, Contábil, RH e Societário)',
      'Tarefas Bi2B: Envio de notas fiscais XML e acompanhamento em tempo real',
      'Bi2B Chamados: Suporte prioritário com histórico completo de tickets',
      'Equipe: Controle de permissões e perfis de acesso customizados',
    ],
    pop: true,
  },
  {
    name: 'Plus',
    desc: 'Para holdings, grupos empresariais e operações com demandas avançadas e customizadas.',
    monthly: 'Sob Consulta',
    yearly: 'Sob Consulta',
    users: 'Usuários Ilimitados',
    cta: 'Fale com um Especialista',
    isSpecialist: true,
    features: [
      'Guias Bi2B & Tarefas: Automação completa e envios sem limite',
      'Bi2B Drive: 100GB em nuvem com criptografia e pastas ilimitadas',
      'Equipe & Segurança: Controle avançado de acessos por setor',
      'Bi2B AI Fiscal (Exclusivo): Inteligência Artificial para análise preditiva tributária',
      'Bi2B Connect API (Exclusivo): Integração automática com ERPs contábeis',
      'Bi2B Audit (Exclusivo): Painel de auditoria contábil e conformidade fiscal',
      'Suporte VIP: Gerente de conta dedicado e atendimento personalizado',
    ],
  },
]

export function PricingSection({ isDark }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <motion.section
      id="planos"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative overflow-visible",
        isDark ? "bg-[#040914]/60 border-white/10" : "bg-slate-100/50 border-slate-200"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8 overflow-visible">
        
        {/* Header da Seção */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-md",
            isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]"
          )}>
            Planos e Pacotes de Atuação
          </span>
          <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance", isDark ? "text-white" : "text-slate-900")}>
            Escolha o pacote ideal para sua empresa
          </h2>
          <p className={cn("max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-balance", isDark ? "text-slate-300/90" : "text-slate-600")}>
            Modelos de contratação flexíveis e sem amarras contratuais.
          </p>
        </motion.div>

        {/* Toggle de Faturamento */}
        <motion.div
          variants={fadeInUp}
          className={cn(
            "inline-flex items-center gap-1.5 p-1.5 rounded-full relative z-10 shadow-lg backdrop-blur-xl border",
            isDark ? "bg-[#040914]/90 border-white/10" : "bg-white border-slate-200"
          )}
        >
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={cn(
              "relative rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300",
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
            Mensal
          </button>
          
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={cn(
              "relative rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-300",
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
              "text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-normal relative z-10 transition-all duration-300 shadow-sm",
              billingPeriod === 'yearly'
                ? "bg-cyan-400 text-[#030a16]"
                : (isDark ? "bg-cyan-500/10 text-cyan-300 border border-cyan-400/30" : "bg-cyan-50 text-[#0d6084] border border-cyan-200")
            )}>
              Economize 25%
            </span>
          </button>
        </motion.div>

        {/* Grid de Cards dos Planos */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-8 pb-4 relative z-10 items-stretch overflow-visible">
          {plans.map((p, idx) => (
            <motion.div
              key={idx}
              variants={scaleUp}
              className={cn(
                "rounded-3xl border text-left p-8 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-2 group overflow-visible backdrop-blur-2xl shadow-xl",
                p.pop
                  ? (isDark
                      ? "bg-gradient-to-b from-[#08152b] via-[#040d1c] to-[#030814] border-2 border-cyan-400 shadow-[0_0_40px_rgba(13,96,132,0.4)]"
                      : "bg-white border-2 border-[#0d6084] shadow-2xl shadow-cyan-500/15")
                  : (isDark
                      ? "bg-[#040914]/80 border-white/10 hover:border-cyan-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-md shadow-slate-200/40")
              )}
            >
              {p.pop && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white text-[10px] font-extrabold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-[0_8px_25px_rgba(13,96,132,0.5)] border border-cyan-400/40">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0 animate-pulse" />
                    Mais Recomendado
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className={cn("font-sans text-xl font-bold transition-colors duration-300 group-hover:text-cyan-400", isDark ? "text-white" : "text-slate-900")}>
                    {p.name}
                  </h3>
                </div>

                <p className={cn("text-xs leading-relaxed mb-6 min-h-[36px]", isDark ? "text-slate-300/80" : "text-slate-500")}>
                  {p.desc}
                </p>
                
                {/* Preço ou CTA Sob Consulta */}
                <div className={cn("flex items-baseline gap-1 mb-6 border-b pb-6 transition-colors duration-500", isDark ? "border-white/10" : "border-slate-200")}>
                  {p.isSpecialist ? (
                    <div className="py-1">
                      <span className={cn("text-2xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                        Sob Consulta
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className={cn("text-sm font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>R$</span>
                      <div className="overflow-hidden min-w-[75px] inline-flex justify-start">
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
                      <span className="text-xs text-slate-400 font-medium">/ mês</span>
                    </>
                  )}
                </div>

                {/* Benefícios */}
                <ul className={cn("space-y-3.5 text-xs mb-8", isDark ? "text-slate-300" : "text-slate-600")}>
                  <li className="flex items-center gap-2.5 font-bold text-cyan-400">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    {p.users}
                  </li>
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 leading-snug">
                      <CheckCircle2 className={cn("w-4 h-4 shrink-0", p.pop ? "text-cyan-400" : "text-cyan-500/80")} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de Ação */}
              <button
                onClick={() => {
                  if (p.isSpecialist) {
                    const el = document.querySelector('#contato')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    window.location.href = getClientSubdomainUrl('/auth/register')
                  }
                }}
                className={cn(
                  "w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer relative z-10 shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2",
                  p.pop
                    ? "bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white hover:from-[#0f6f99] hover:to-[#0c5874] border border-cyan-400/40 shadow-[0_8px_25px_rgba(13,96,132,0.4)]"
                    : (isDark
                        ? "border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:border-white/30"
                        : "border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700")
                )}
              >
                {p.isSpecialist ? (
                  <>
                    <PhoneCall className="w-4 h-4 text-cyan-400" />
                    {p.cta}
                  </>
                ) : (
                  <>
                    {p.cta}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.section>
  )
}

