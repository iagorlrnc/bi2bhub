import { motion } from 'framer-motion'
import {
  UserPlus,
  KeyRound,
  FileCheck2,
  MailCheck,
  CheckCircle2,
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 18, stiffness: 120 } },
} as const

interface HowItWorksSectionProps {
  isDark: boolean
}

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Cadastro & Perfil',
    subtitle: 'Criação de Conta',
    desc: 'Preencha suas informações corporativas básicas: nome, e-mail e defina a senha Master de acesso seguro.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-cyan-400">Criar Conta Master</span>
          <span className="text-[8px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Etapa 1/4</span>
        </div>
        <div className="space-y-1.5 text-slate-400">
          <div className={cn("p-1.5 rounded border text-[9px]", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
            <span className="text-slate-500">Empresa:</span> Tech Solution LTDA
          </div>
          <div className={cn("p-1.5 rounded border text-[9px]", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
            <span className="text-slate-500">E-mail:</span> contato@tech.com.br
          </div>
        </div>
      </div>
    )
  },
  {
    step: '02',
    icon: KeyRound,
    title: 'Vínculo do Token',
    subtitle: 'Código de 4 Dígitos',
    desc: 'Conecte sua empresa ao escritório contábil informando o código exclusivo enviado pela Bi2B.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-emerald-400">Chave de Conexão</span>
          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">VINCULADO</span>
        </div>
        <div className="flex justify-center gap-2 py-1">
          {['8', '4', '1', '9'].map((digit, i) => (
            <div key={i} className={cn("w-7 h-8 rounded border flex items-center justify-center font-bold text-xs shadow-inner", isDark ? "bg-cyan-950/60 border-cyan-500/30 text-cyan-300" : "bg-cyan-50 border-cyan-300 text-[#0d6084]")}>
              {digit}
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    step: '03',
    icon: FileCheck2,
    title: 'Aceite & Termos LGPD',
    subtitle: 'Conformidade Legal',
    desc: 'Revise os Termos de Uso e Política de Privacidade garantindo 100% de conformidade com a LGPD.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-cyan-400">Proteção LGPD</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="space-y-1 text-[8px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Criptografia de ponta a ponta
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Isolamento de dados via PostgreSQL RLS
          </div>
        </div>
      </div>
    )
  },
  {
    step: '04',
    icon: MailCheck,
    title: 'Painel Liberado',
    subtitle: 'Acesso Imediato',
    desc: 'Confirme seu e-mail e comece a consultar impostos, certidões e enviar arquivos sem complicação.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-cyan-400">Portal Ativado</span>
          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold animate-pulse">ONLINE</span>
        </div>
        <div className="flex items-center justify-between text-[9px] pt-1">
          <span className={cn(isDark ? "text-slate-300" : "text-slate-700")}>Guias Bi2B</span>
          <span className="text-emerald-400 font-bold">100% Sincronizado</span>
        </div>
      </div>
    )
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
        "py-28 border-b relative overflow-hidden",
        isDark ? "bg-[#040914]/60 border-white/10" : "bg-slate-100/60 border-slate-200/80"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção */}
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-md",
            isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]"
          )}>
            Fluxo Sequencial Simples
          </span>
          <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance", isDark ? "text-white" : "text-slate-900")}>
            Como funciona a entrega em 4 etapas
          </h2>
          <p className={cn("max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-balance", isDark ? "text-slate-300/90" : "text-slate-600")}>
            Conecte a operação da sua empresa ao portal contábil sem burocracia técnica.
          </p>
        </motion.div>

        {/* Grid em Etapas Numeradas — Fingu Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              variants={scaleUp}
              className={cn(
                "relative rounded-3xl border p-6 text-left shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between backdrop-blur-2xl overflow-hidden",
                isDark
                  ? "bg-[#040914]/80 border-white/10 hover:border-cyan-400/40 shadow-[0_12px_35px_rgba(0,0,0,0.4)]"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-lg shadow-slate-200/30"
              )}
            >
              {/* Giant Step Number Background — Fingu Style */}
              <div className={cn(
                "absolute -top-3 right-4 text-[4.5rem] font-sans font-black leading-none select-none transition-all duration-500 group-hover:scale-110 pointer-events-none",
                isDark ? "text-white/[0.04] group-hover:text-cyan-400/10" : "text-slate-200/60 group-hover:text-[#0d6084]/15"
              )}>
                {s.step}
              </div>

              <div>
                {/* Step Top Badge & Icon */}
                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-md",
                    isDark
                      ? "bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border-cyan-400/40 text-cyan-200 shadow-cyan-950/40"
                      : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}>
                    <s.icon className="h-5 w-5" />
                  </div>

                  <span className={cn(
                    "text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full border",
                    isDark ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300" : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}>
                    Passo {s.step}
                  </span>
                </div>

                <h3 className={cn(
                  "font-sans text-lg font-bold transition-colors duration-300 group-hover:text-cyan-400 mb-1",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  {s.title}
                </h3>
                
                <p className={cn(
                  "text-xs font-semibold mb-3",
                  isDark ? "text-cyan-400" : "text-[#0d6084]"
                )}>
                  {s.subtitle}
                </p>

                <p className={cn(
                  "text-xs leading-relaxed mb-6 transition-colors duration-300",
                  isDark ? "text-slate-300/90" : "text-slate-600"
                )}>
                  {s.desc}
                </p>
              </div>

              {/* Mini-mockup Ilustrativo da Etapa */}
              <div className="relative z-10 pt-2">
                {s.mockup(isDark)}
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </motion.section>
  )
}

