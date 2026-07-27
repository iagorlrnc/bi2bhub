import { motion } from 'framer-motion'
import {
  Star,
  Quote,
  Building2,
  MapPin,
  Sparkles,
} from 'lucide-react'
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

interface TestimonialsSectionProps {
  isDark: boolean
}

const testimonials = [
  {
    name: 'Roberto Dutra',
    role: 'Diretor Financeiro',
    company: 'Vanguarda Tech',
    city: 'São Paulo, SP',
    initials: 'RD',
    text: 'A integração do Guias Bi2B transformou nossa rotina contábil. Economizamos dezenas de horas mensais que antes eram gastas baixando notas manualmente da SEFAZ.',
    rating: 5,
  },
  {
    name: 'Karina de Souza',
    role: 'Sócia-Administradora',
    company: 'Clínica Saúde Prime',
    city: 'Curitiba, PR',
    initials: 'KS',
    text: 'O Monitora Bi2B é espetacular. Receber alertas de vencimento de certidões antes mesmo da contabilidade nos poupou multas caras este ano.',
    rating: 5,
  },
  {
    name: 'Leonardo Costa',
    role: 'CEO & Founder',
    company: 'Logix Logística',
    city: 'Belo Horizonte, MG',
    initials: 'LC',
    text: 'O isolamento de dados via RLS do Supabase nos deu a tranquilidade de segurança exigida por nossos investidores para migrar para a plataforma.',
    rating: 5,
  },
  {
    name: 'Mariana Mendonça',
    role: 'Head de Controladoria',
    company: 'Grupo Horizonte',
    city: 'Campinas, SP',
    initials: 'MM',
    text: 'A comunicação centralizada via Bi2B Chamados acabou com a desorganização de mensagens por WhatsApp. Tudo fica registrado de forma profissional.',
    rating: 5,
  },
]

export function TestimonialsSection({ isDark }: TestimonialsSectionProps) {
  return (
    <motion.section
      id="depoimentos"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative overflow-hidden",
        isDark ? "bg-[#040914] border-white/10" : "bg-slate-50 border-slate-200"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        {/* Header da Seção */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-md",
            isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]"
          )}>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Prova Social & Histórias de Sucesso
          </span>
          <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance", isDark ? "text-white" : "text-slate-900")}>
            O que dizem os gestores que usam a Bi2B
          </h2>
          <p className={cn("max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-balance", isDark ? "text-slate-300/90" : "text-slate-600")}>
            Empresas de diversos segmentos que simplificaram sua rotina fiscal e contábil.
          </p>
        </motion.div>

        {/* Grid de Cards de Depoimentos estilo HubStrom + Fingu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left relative">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className={cn(
                "rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 group shadow-xl relative overflow-hidden",
                isDark 
                  ? "bg-[#040914]/80 border-white/10 hover:border-cyan-400/40 shadow-[0_12px_35px_rgba(0,0,0,0.4)]" 
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-md shadow-slate-200/40"
              )}
            >
              {/* Subtle quote watermark */}
              <Quote className={cn(
                "absolute top-4 right-4 w-12 h-12 pointer-events-none transition-transform duration-500 group-hover:scale-110",
                isDark ? "text-cyan-500/10" : "text-slate-200/50"
              )} />

              <div>
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className={cn("text-xs leading-relaxed mb-6 italic relative z-10", isDark ? "text-slate-300" : "text-slate-700")}>
                  "{t.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t flex items-center gap-3 relative z-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                <div className={cn(
                  "w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border shadow-inner",
                  isDark ? "bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border-cyan-400/40 text-cyan-200" : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                )}>
                  {t.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={cn("text-xs font-bold truncate", isDark ? "text-white" : "text-slate-900")}>
                    {t.name}
                  </h3>
                  <div className={cn("text-[10px] truncate flex items-center gap-1 mt-0.5", isDark ? "text-cyan-400" : "text-[#0d6084]")}>
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span>{t.role} • {t.company}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.section>
  )
}

