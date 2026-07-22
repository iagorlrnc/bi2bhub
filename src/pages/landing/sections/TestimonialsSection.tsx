import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  ChevronLeft,
  ChevronRight,
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
} as const

interface TestimonialsSectionProps {
  isDark: boolean
}

const testimonials = [
  {
    name: 'Roberto Dutra',
    role: 'Diretor Financeiro, Vanguarda Tech',
    text: 'A integração do XMLHub transformou nossa rotina contábil. Economizamos dezenas de horas mensais que antes eram gastas baixando notas manualmente da SEFAZ.',
    rating: 5,
  },
  {
    name: 'Karina de Souza',
    role: 'Sócia-Administradora, Clínica Saúde Prime',
    text: 'O MonitorHub é espetacular. Receber alertas de vencimento de certidões antes mesmo da contabilidade ligar nos poupou multas caras este ano.',
    rating: 5,
  },
  {
    name: 'Leonardo Costa',
    role: 'CEO, Logix Logística',
    text: 'O isolamento de dados via RLS do Supabase nos deu a tranquilidade de segurança exigida por nossos investidores para migrar para a plataforma.',
    rating: 5,
  },
]

export function TestimonialsSection({ isDark }: TestimonialsSectionProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const nextTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-play every 6 seconds
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000)
    return () => clearInterval(interval)
  }, [nextTestimonial])

  return (
    <motion.section
      id="depoimentos"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative",
        isDark ? "bg-[#0b1329]/40 border-cyan-950/40" : "bg-slate-100/50 border-slate-200/60"
      )}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <motion.div variants={fadeInUp} className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Casos de Sucesso</span>
          <h2 className={cn("font-heading text-3xl sm:text-4xl font-extrabold", isDark ? "text-white" : "text-slate-900")}>
            Histórias de Sucesso
          </h2>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="min-h-[220px] flex items-center justify-center relative px-12 md:px-16"
        >
          {/* Arrow Left */}
          <button
            onClick={prevTestimonial}
            className={cn(
              "absolute left-0 p-2.5 rounded-full border transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer hidden md:flex items-center justify-center shadow-md",
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-cyan-950/20"
                : "bg-white border-slate-200 text-slate-500 hover:text-[#0d6084] hover:border-slate-300 hover:shadow-slate-200/50"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="flex gap-1 justify-center">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-cyan-500 text-cyan-500" />
                ))}
              </div>
              
              <p className={cn("text-lg md:text-xl leading-relaxed italic max-w-2xl mx-auto font-medium", isDark ? "text-slate-200" : "text-slate-800")}>
                "{testimonials[activeTestimonial].text}"
              </p>

              <div className="flex flex-col items-center">
                <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>{testimonials[activeTestimonial].name}</span>
                <span className="text-[10px] text-cyan-500 uppercase tracking-wider mt-1">{testimonials[activeTestimonial].role}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrow Right */}
          <button
            onClick={nextTestimonial}
            className={cn(
              "absolute right-0 p-2.5 rounded-full border transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer hidden md:flex items-center justify-center shadow-md",
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-cyan-950/20"
                : "bg-white border-slate-200 text-slate-500 hover:text-[#0d6084] hover:border-slate-300 hover:shadow-slate-200/50"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Carousel dots */}
        <div className="flex items-center justify-center gap-3 pt-4">
          {testimonials.map((_, i) => {
            const isActive = activeTestimonial === i
            return (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={cn(
                  "relative cursor-pointer transition-all duration-500 h-2 rounded-full",
                  isActive ? "w-6 bg-cyan-500" : "w-2 bg-slate-400/40 hover:bg-slate-400"
                )}
              />
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
