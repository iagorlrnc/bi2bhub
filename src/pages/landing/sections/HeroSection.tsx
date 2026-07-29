import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import heroImg from '@/assets/heroimg.jpg'
import logoImg from '@/assets/logo.png'
import logoAzulImg from '@/assets/logoazul.png'

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
  const { resolvedTheme } = useTheme()
  const isDarkTheme = isDark ?? (resolvedTheme === 'dark')
  const currentLogo = isDarkTheme ? logoImg : logoAzulImg

  return (
    <section className="relative min-h-screen min-h-[100dvh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 md:px-8 overflow-hidden transition-colors duration-300">
      {/* Background Photo */}
      <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
        <img 
          src={heroImg} 
          alt="Hero Background" 
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
          {/* Logo Display */}
          <motion.div variants={fadeInUp} className="flex items-center justify-center mb-2">
            <img 
              src={currentLogo} 
              alt="Logo Bi2B" 
              className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-[0_10px_25px_rgba(13,96,132,0.4)] hover:scale-105 transition-transform duration-300" 
            />
          </motion.div>

          {/* Direct Benefit Headline */}
          <motion.h1
            variants={fadeInUp}
            className={cn(
              "text-[2.5rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[4.8rem] font-extrabold leading-[1.08] tracking-tight font-sans text-balance transition-colors duration-300",
              isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white"
            )}
          >
            {/* Conecte sua empresa à <br className="hidden sm:inline" /> */}
            <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              Inteligência 
            </span> para sua <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              gestão 
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className={cn(
              "text-base sm:text-lg md:text-xl leading-relaxed max-w-4xl font-normal text-balance transition-colors duration-300",
              isDarkTheme ? "text-slate-300/90 dark:text-slate-300/90" : "text-slate-600 dark:text-slate-300/90"
            )}
          >
            Soluções completas em consultoria, dados e gestão contábil para transformar informação em decisão e dar mais clareza ao crescimento do seu negócio.
          </motion.p>
        </motion.div>

      </div>
    </section>
  )
}


