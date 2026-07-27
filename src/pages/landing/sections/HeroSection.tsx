import { motion } from 'framer-motion'
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Star,
  Award,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getClientSubdomainUrl } from '@/utils/subdomain'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
} as const

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
} as const

interface HeroSectionProps {
  isDark: boolean
}

export function HeroSection({ isDark }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 md:px-8 md:pt-40 lg:pt-44 md:pb-24 overflow-hidden">
      {/* Dynamic Background Light Accents - Otimizado para Mobile */}
      <div 
        className={cn(
          "hidden sm:block absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[160px] pointer-events-none -z-10",
          isDark ? "bg-gradient-to-tr from-cyan-500/15 via-[#0d6084]/20 to-transparent" : "bg-gradient-to-tr from-[#0d6084]/10 via-cyan-400/15 to-transparent"
        )} 
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Main Content Area */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center gap-6 max-w-4xl"
        >
          {/* Top Pill Badge — HubStrom Style */}
          <motion.div variants={fadeInUp} className="inline-flex">
            <span
              className={cn(
                "inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105",
                isDark 
                  ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300 shadow-cyan-950/20" 
                  : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084] shadow-slate-200/50"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Plataforma SaaS de Gestão Contábil B2B</span>
              <span className={cn("w-1.5 h-1.5 rounded-full", isDark ? "bg-cyan-400" : "bg-[#0d6084]")} />
            </span>
          </motion.div>

          {/* Direct Benefit Headline — HubStrom/Fingu Style */}
          <motion.h1
            variants={fadeInUp}
            className={cn(
              "text-[2.5rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[4.8rem] font-extrabold leading-[1.08] tracking-tight font-sans text-balance",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Conecte sua empresa à <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              contabilidade em tempo real
            </span>
          </motion.h1>

          {/* Short Subheadline */}
          <motion.p
            variants={fadeInUp}
            className={cn(
              "text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-normal text-balance",
              isDark ? "text-slate-300/90" : "text-slate-600"
            )}
          >
            Impostos automatizados, varredura de certidões, documentos centralizados e atendimento em um portal inteligente feito para acelerar sua tomada de decisão.
          </motion.p>

          {/* Dual CTAs — HubStrom Style */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto"
          >
            <button
              onClick={() => { window.location.href = getClientSubdomainUrl('/auth/register') }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-bold bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] text-white rounded-full px-8 py-4 text-xs font-bold uppercase tracking-wider shadow-[0_12px_35px_rgba(13,96,132,0.45)] hover:shadow-[0_16px_45px_rgba(13,96,132,0.6)] border border-cyan-400/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] group cursor-pointer"
            >
              Começar Teste Grátis
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={() => {
                const el = document.querySelector('#solucoes')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={cn(
                "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-xs font-bold uppercase tracking-wider rounded-full border border-white/15 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 shadow-md",
                isDark
                  ? "bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/30"
                  : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
              )}
            >
              Conhecer Ecossistema
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </motion.div>

          {/* Social Proof & Trust Card — HubStrom & Fingu Style */}
          <motion.div
            variants={fadeInUp}
            className="pt-10 w-full max-w-4xl"
          >
            <div 
              className={cn(
                "rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 items-center transition-all duration-300",
                isDark 
                  ? "bg-[#040914]/70 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-cyan-950/20" 
                  : "bg-white/90 border-slate-200/90 shadow-xl shadow-slate-200/60"
              )}
            >
              {/* Item 1: Empresas Atendidas */}
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Building2 className="w-4 h-4" />
                  <span className={cn("text-xl sm:text-2xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>+500</span>
                </div>
                <span className={cn("text-[11px] font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Empresas Atendidas</span>
              </div>

              {/* Item 2: Avaliação dos Clientes */}
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className={cn("text-xl sm:text-2xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>4.9/5</span>
                </div>
                <span className={cn("text-[11px] font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Nota de Satisfação</span>
              </div>

              {/* Item 3: Retenção & Agilidade */}
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Award className="w-4 h-4" />
                  <span className={cn("text-xl sm:text-2xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>99.8%</span>
                </div>
                <span className={cn("text-[11px] font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Conformidade Fiscal</span>
              </div>

              {/* Item 4: LGPD Compliant */}
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className={cn("text-xl sm:text-2xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>100%</span>
                </div>
                <span className={cn("text-[11px] font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>LGPD & Criptografado</span>
              </div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}

