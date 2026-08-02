import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { ROUTES } from '@/constants/routes'
import heroImg from '@/assets/heroimg.jpg'
import logoImg from '@/assets/logo.png'
import logoAzulImg from '@/assets/logoazul.png'
import { ArrowRight, ShieldCheck, Award } from 'lucide-react'

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
  isDark?: boolean
}

export function HeroSection({ isDark }: HeroSectionProps) {
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()
  const isDarkTheme = isDark ?? (resolvedTheme === 'dark')
  const currentLogo = isDarkTheme ? logoImg : logoAzulImg

  const scrollToServices = () => {
    const el = document.querySelector('#servicos')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKnowPortal = () => {
    navigate(ROUTES.PORTAL_INFO)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen min-h-[100dvh] flex flex-col justify-center items-center py-16 px-4 sm:px-6 md:px-8 overflow-hidden transition-colors duration-300">
      {/* Background Photo */}
      <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
        <img 
          src={heroImg} 
          alt="Bi2B Consultoria Background" 
          className="w-full h-full object-cover opacity-25 dark:opacity-20 transition-opacity duration-500 scale-105"
        />
        <div 
          className={cn(
            "absolute inset-0 transition-colors duration-300",
            isDarkTheme 
              ? "bg-gradient-to-b from-[#040914]/80 via-[#040914]/90 to-[#040914]" 
              : "bg-gradient-to-b from-slate-50/70 via-slate-50/85 to-slate-50"
          )} 
        />
      </div>

      {/* Dynamic Background Light Accents */}
      <div 
        className={cn(
          "hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[160px] pointer-events-none -z-10 transition-colors duration-300",
          isDarkTheme 
            ? "bg-gradient-to-tr from-cyan-500/15 via-[#0d6084]/20 to-transparent dark:from-cyan-500/15 dark:via-[#0d6084]/20" 
            : "bg-gradient-to-tr from-[#0d6084]/10 via-cyan-400/15 to-transparent dark:from-cyan-500/15 dark:via-[#0d6084]/20"
        )} 
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center my-auto w-full">
        
        {/* Main Content Area */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center justify-center text-center gap-6 max-w-4xl w-full"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0d6084]/30 bg-[#0d6084]/10 text-[#0d6084] dark:text-cyan-300 font-bold text-xs uppercase tracking-widest">
            <Award className="w-4 h-4 text-cyan-400" />
            Bi2B Consultoria Contábil & Estratégica
          </motion.div>

          {/* Logo Display */}
          <motion.div variants={fadeInUp} className="flex items-center justify-center mb-1">
            <img 
              src={currentLogo} 
              alt="Logo Bi2B Consultoria" 
              className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-[0_10px_25px_rgba(13,96,132,0.4)] hover:scale-105 transition-transform duration-300" 
            />
          </motion.div>

          {/* Direct Benefit Headline */}
          <motion.h1
            variants={fadeInUp}
            className={cn(
              "text-[2.4rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[4.8rem] font-extrabold leading-[1.08] tracking-tight font-sans text-balance transition-colors duration-300",
              isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white"
            )}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              Inteligência Contábil 
            </span> para o crescimento do seu negócio
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className={cn(
              "text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl font-normal text-balance transition-colors duration-300",
              isDarkTheme ? "text-slate-300/90 dark:text-slate-300/90" : "text-slate-600 dark:text-slate-300/90"
            )}
          >
            Soluções completas em contabilidade consultiva, planejamento tributário, BPO financeiro e Departamento Pessoal com atendimento humano proativo e especialistas CRC dedicados.
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={fadeInUp} className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={scrollToServices}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] border border-cyan-400/30 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_10px_35px_rgba(13,96,132,0.4)] hover:shadow-[0_15px_45px_rgba(13,96,132,0.6)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Nossas Soluções
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleKnowPortal}
              className={cn(
                "w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-full border transition-all duration-300 cursor-pointer shadow-sm",
                isDarkTheme 
                  ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20" 
                  : "bg-cyan-50 border-cyan-300 text-[#0d6084] hover:bg-cyan-100"
              )}
            >
              Conheça o Portal do Cliente
            </button>
          </motion.div>

          {/* Micro trust indicators */}
          <motion.div variants={fadeInUp} className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Contadores Registrados CRC
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              +500 Empresas Atendidas
            </span>
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}
