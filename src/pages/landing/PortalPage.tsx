import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

// ===== SECTIONS ATUAIS E RESTAURADAS DO COMMIT b9cd7ac =====
import { PortalHeroSection } from './sections/PortalHeroSection'
import { PortalOriginalHeroSection } from './sections/PortalOriginalHeroSection'
import { PortalOriginalTeaserSection } from './sections/PortalOriginalTeaserSection'
import { HowItWorksSection } from './sections/HowItWorksSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { PortalOriginalServicesSection } from './sections/PortalOriginalServicesSection'
import { PortalOriginalAboutSection } from './sections/PortalOriginalAboutSection'
import { PortalOriginalTeamSection } from './sections/PortalOriginalTeamSection'
import { ProductivitySection } from './sections/ProductivitySection'
import { PricingSection } from './sections/PricingSection'
import { FaqSection } from './sections/FaqSection'
import { ContactSection } from './sections/ContactSection'
import { FooterSection } from './sections/FooterSection'

export function PortalPage() {
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <div
      className={cn(
        'min-h-screen font-sans relative overflow-x-hidden pt-12',
        isDark
          ? 'bg-[#040914] text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
          : 'bg-slate-50 text-slate-900 selection:bg-[#0d6084]/20 selection:text-slate-900'
      )}
    >
      {/* Background Glows Estáticos */}
      <div
        className={cn(
          'hidden md:block absolute top-0 left-1/4 h-[750px] w-[750px] -translate-x-1/2 rounded-full blur-[150px] -z-10 pointer-events-none',
          isDark ? 'bg-[#0d6084]/25' : 'bg-[#0d6084]/8'
        )}
      />
      <div
        className={cn(
          'hidden md:block absolute top-[25%] right-1/4 h-[650px] w-[650px] rounded-full blur-[140px] -z-10 pointer-events-none',
          isDark ? 'bg-cyan-500/15' : 'bg-cyan-400/12'
        )}
      />

      {/* Top Banner FIXO no topo ao rolar a página */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] w-full py-2.5 px-4 text-center border-b flex items-center justify-center gap-3 text-xs font-semibold backdrop-blur-xl shadow-md transition-colors',
          isDark
            ? 'bg-[#040914]/95 border-cyan-500/20 text-cyan-300 shadow-cyan-950/40'
            : 'bg-white/95 border-cyan-200 text-[#0d6084] shadow-slate-200/60'
        )}
      >
        <span>Você está visualizando a página informativa do <strong>Portal do Cliente Bi2B</strong></span>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="inline-flex items-center gap-1.5 underline hover:no-underline font-extrabold cursor-pointer ml-2 px-3 py-1 rounded-full bg-[#0d6084] text-white shadow-sm hover:bg-[#0f6f99] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para Bi2B Consultoria
        </button>
      </div>

      {/* ===== SEÇÕES DO PORTAL DO CLIENTE (INCLUINDO AS SEÇÕES RESTAURADAS DO COMMIT b9cd7ac) ===== */}
      <PortalHeroSection isDark={isDark} />
      <PortalOriginalHeroSection isDark={isDark} />
      <PortalOriginalTeaserSection isDark={isDark} />
      <HowItWorksSection isDark={isDark} />
      <FeaturesSection isDark={isDark} />
      <PortalOriginalServicesSection isDark={isDark} />
      <PortalOriginalAboutSection isDark={isDark} />
      <PortalOriginalTeamSection isDark={isDark} />
      <ProductivitySection isDark={isDark} />
      <PricingSection isDark={isDark} />
      <FaqSection isDark={isDark} />
      <ContactSection isDark={isDark} />
      <FooterSection isDark={isDark} />
    </div>
  )
}
