import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { ROUTES } from '@/constants/routes'
import logoImg from '@/assets/logo.png'
import logoAzulImg from '@/assets/logoazul.png'
import {
  ArrowRight,
} from 'lucide-react'

interface HeroSectionProps {
  isDark?: boolean
}

export function HeroSection({ isDark }: HeroSectionProps) {
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()
  const isDarkTheme = isDark ?? (resolvedTheme === 'dark')
  const currentLogo = isDarkTheme ? logoImg : logoAzulImg

  const scrollToContact = () => {
    const el = document.querySelector('#contato')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKnowPortal = () => {
    navigate(ROUTES.PORTAL_INFO)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden font-sans">
      {/* Background Accent radial gradient Estático */}
      <div 
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10",
          isDarkTheme 
            ? "bg-[radial-gradient(80%_60%_at_50%_40%,rgba(13,96,132,0.35)_0%,rgba(4,9,20,0)_100%)]" 
            : "bg-[radial-gradient(80%_60%_at_50%_40%,rgba(13,96,132,0.12)_0%,rgba(248,250,252,0)_100%)]"
        )} 
      />

      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center my-auto w-full">
        {/* Logo */}
        <div className="mb-4">
          <img
            src={currentLogo}
            alt="Bi2B Consultoria"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-[0_8px_20px_rgba(13,96,132,0.35)]"
          />
        </div>

        {/* Main Headline Estática */}
        <h1
          className={cn(
            "mt-2 font-sans text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-balance max-w-4xl",
            isDarkTheme ? "text-white" : "text-slate-900"
          )}
        >
          Seu financeiro e impostos no{' '}
          <span className="font-sans font-black tracking-tight bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
            automático
          </span>
        </h1>

        {/* Subtitle Estático */}
        <p
          className={cn(
            "mt-6 max-w-xl text-balance text-base md:text-lg leading-relaxed font-normal",
            isDarkTheme ? "text-slate-300" : "text-slate-600"
          )}
        >
          A Bi2B Consultoria cuida das suas obrigações fiscais, folha de pagamento e gestão financeira. Você foca apenas em fazer seu negócio crescer.
        </p>

        {/* Action Buttons Estáticos */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={scrollToContact}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] border border-cyan-400/30 text-white font-semibold shadow-lg shadow-[#0d6084]/25 h-[52px] px-8 text-base cursor-pointer"
          >
            <span>Falar com Especialista</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleKnowPortal}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full font-semibold h-[52px] px-8 text-base cursor-pointer border shadow-sm",
              isDarkTheme 
                ? "bg-cyan-950/50 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20" 
                : "bg-white border-slate-300 text-[#0d6084] hover:bg-slate-100"
            )}
          >
            <span>Conheça o Portal do Cliente</span>
          </button>
        </div>
      </div>
    </section>
  )
}
