import { useState, useEffect, useRef } from 'react'
import { Menu, X, Lock } from 'lucide-react'
import { getClientSubdomainUrl } from '@/utils/subdomain'

// ===== SEÇÕES DA LANDING PAGE BI2B (BASEADAS NO MODELO E IDENTIDADE BI2B) =====
import { Bi2BHeroSection } from './sections/Bi2BHeroSection'
import { Bi2BTrustMarqueeSection } from './sections/Bi2BTrustMarqueeSection'
import { Bi2BWhatWeDoSection } from './sections/Bi2BWhatWeDoSection'
import { Bi2BFeaturesGridSection } from './sections/Bi2BFeaturesGridSection'
import { Bi2BCertificationsSection } from './sections/Bi2BCertificationsSection'
import { Bi2BEcosystemGraphSection } from './sections/Bi2BEcosystemGraphSection'
import { Bi2BHowItWorksSection } from './sections/Bi2BHowItWorksSection'
import { Bi2BBenefitsLateralSection } from './sections/Bi2BBenefitsLateralSection'
import { Bi2BCasesGridSection } from './sections/Bi2BCasesGridSection'
import { Bi2BBlogSection } from './sections/Bi2BBlogSection'
import { Bi2BTestimonialsSection } from './sections/Bi2BTestimonialsSection'
import { Bi2BIntegrationsMarqueeSection } from './sections/Bi2BIntegrationsMarqueeSection'
import { Bi2BCategorizedFaqSection } from './sections/Bi2BCategorizedFaqSection'
import { Bi2BNationalPresenceSection } from './sections/Bi2BNationalPresenceSection'
import { Bi2BFullWidthCtaSection } from './sections/Bi2BFullWidthCtaSection'
import { Bi2BFooterSection } from './sections/Bi2BFooterSection'

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll listener for header blur & sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 40)
      setShowStickyCta(scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleClientLogin = () => {
    window.location.href = getClientSubdomainUrl('/')
  }

  return (
    <div ref={containerRef} className="bi2b-landing min-h-screen bg-[#FAFAFA] text-[#0C1E28] font-sans">
      {/* ===== HEADER / NAVBAR FIXO COM BLUR ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? 'bg-[#083A50]/95 backdrop-blur-md border-b border-white/10 shadow-xl py-3'
            : 'bg-transparent py-4 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo with Glowing Red Dot */}
          <a
            href="#topo"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#topo')
            }}
            className="font-heading font-bold text-2xl text-white flex items-center gap-2 tracking-tight group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000] shadow-[0_0_12px_2px_rgba(255,0,0,0.8)] group-hover:scale-110 transition-transform" />
            <span>Bi2B</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            <button
              onClick={() => scrollTo('#topo')}
              className="text-xs font-semibold text-white/80 hover:text-cyan-300 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Início
            </button>
            <button
              onClick={() => scrollTo('#o-que-fazemos')}
              className="text-xs font-semibold text-white/80 hover:text-cyan-300 transition-colors cursor-pointer uppercase tracking-wider"
            >
              O que fazemos
            </button>
            <button
              onClick={() => scrollTo('#funcionalidades')}
              className="text-xs font-semibold text-white/80 hover:text-cyan-300 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Funcionalidades
            </button>
            <button
              onClick={() => scrollTo('#ecossistema')}
              className="text-xs font-semibold text-cyan-300 hover:text-white transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Ecossistema</span>
            </button>
            <button
              onClick={() => scrollTo('#como-funciona')}
              className="text-xs font-semibold text-white/80 hover:text-cyan-300 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Como funciona
            </button>
            <button
              onClick={() => scrollTo('#beneficios')}
              className="text-xs font-semibold text-white/80 hover:text-cyan-300 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Benefícios
            </button>
            <button
              onClick={() => scrollTo('#cases')}
              className="text-xs font-semibold text-white/80 hover:text-cyan-300 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Cases
            </button>
            <button
              onClick={() => scrollTo('#faq')}
              className="text-xs font-semibold text-white/80 hover:text-cyan-300 transition-colors cursor-pointer uppercase tracking-wider"
            >
              FAQ
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClientLogin}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-cyan-200 border border-white/20 hover:border-cyan-400/40 rounded-md px-3.5 py-2 transition-all cursor-pointer hover:bg-white/5 backdrop-blur-sm"
              title="Acessar Área do Cliente"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-300" />
              <span>Portal do Cliente</span>
            </button>

            <a
              href="#agendar"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#agendar')
              }}
              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm py-2 px-4 font-bold rounded-md bg-gradient-to-r from-cyan-400 to-[#0284c7] hover:from-cyan-300 hover:to-cyan-500 text-[#083A50] shadow-md shadow-cyan-500/20 hover:scale-[1.01] transition-all cursor-pointer"
            >
              <span>Agendar demonstração</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#083A50] border-b border-white/10 px-6 py-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-4 text-sm font-semibold text-white/90">
              <button
                onClick={() => scrollTo('#topo')}
                className="text-left py-2 hover:text-cyan-300"
              >
                Início
              </button>
              <button
                onClick={() => scrollTo('#o-que-fazemos')}
                className="text-left py-2 hover:text-cyan-300"
              >
                O que fazemos
              </button>
              <button
                onClick={() => scrollTo('#funcionalidades')}
                className="text-left py-2 hover:text-cyan-300"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => scrollTo('#ecossistema')}
                className="text-left py-2 text-cyan-300 font-bold flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Grafo do Ecossistema</span>
              </button>
              <button
                onClick={() => scrollTo('#como-funciona')}
                className="text-left py-2 hover:text-cyan-300"
              >
                Como funciona
              </button>
              <button
                onClick={() => scrollTo('#beneficios')}
                className="text-left py-2 hover:text-cyan-300"
              >
                Benefícios
              </button>
              <button
                onClick={() => scrollTo('#cases')}
                className="text-left py-2 hover:text-cyan-300"
              >
                Casos Reais
              </button>
              <button
                onClick={() => scrollTo('#faq')}
                className="text-left py-2 hover:text-cyan-300"
              >
                Dúvidas Frequentes
              </button>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleClientLogin()
                  }}
                  className="w-full text-center text-sm font-bold text-white border border-cyan-400/40 rounded-md py-2.5 hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-cyan-300" />
                  <span>Acessar Portal do Cliente</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== LANDING PAGE MAIN SECTIONS ===== */}
      <main>
        {/* 1. Hero Section */}
        <Bi2BHeroSection
          onScheduleClick={() => scrollTo('#agendar')}
          onHowItWorksClick={() => scrollTo('#como-funciona')}
        />

        {/* 2. Faixa de Logos "Confiado por" (Marquee) */}
        <Bi2BTrustMarqueeSection />

        {/* 3. Seção "O que fazemos" (Palavras Rotativas + Scroll Pinado) */}
        <Bi2BWhatWeDoSection />

        {/* 4. Seção "Serviços & Funcionalidades" (Grid Interativo) */}
        <Bi2BFeaturesGridSection />

        {/* 5. Seção de Confiabilidade & Certificações */}
        <Bi2BCertificationsSection />

        {/* 6. Grafo Interativo do Ecossistema Bi2b */}
        <Bi2BEcosystemGraphSection />

        {/* 7. Seção "Como Funciona / Processo" */}
        <Bi2BHowItWorksSection />

        {/* 8. Seção "Benefícios" com Numeração Lateral */}
        <Bi2BBenefitsLateralSection />

        {/* 9. Seção "Cases / Projetos Reais" */}
        <Bi2BCasesGridSection />

        {/* 10. Seção "Blog & Conteúdo" */}
        <Bi2BBlogSection />

        {/* 11. Seção de Depoimentos */}
        <Bi2BTestimonialsSection />

        {/* 12. Faixa de Parceiros & Integrações (Marquee) */}
        <Bi2BIntegrationsMarqueeSection />

        {/* 13. Seção de FAQ em Acordeão com Categorias */}
        <Bi2BCategorizedFaqSection />

        {/* 14. Seção de Mapa / Presença Nacional */}
        <Bi2BNationalPresenceSection />

        {/* 15. CTA Final de Largura Cheia */}
        <Bi2BFullWidthCtaSection onScheduleClick={() => scrollTo('#agendar')} />
      </main>

      {/* ===== RODAPÉ ===== */}
      <Bi2BFooterSection />

      {/* ===== STICKY CTA NO MOBILE (Desliza suavemente após rolar) ===== */}
      <div
        className={`fixed bottom-3 left-3 right-3 z-40 bg-[#083A50]/95 backdrop-blur-md border border-cyan-400/30 p-2.5 rounded-md shadow-xl flex items-center justify-between gap-3 transition-all duration-300 md:hidden ${
          showStickyCta
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="flex flex-col">
          <span className="font-heading font-bold text-xs text-white leading-tight">
            Demonstração Bi2B
          </span>
          <span className="text-[10px] text-cyan-300 font-mono">
            Atendimento gratuito
          </span>
        </div>

        <button
          onClick={() => scrollTo('#agendar')}
          className="px-3.5 py-1.5 rounded-sm bg-gradient-to-r from-cyan-400 to-[#0284c7] text-[#083A50] font-bold text-xs shadow-sm shrink-0 cursor-pointer"
        >
          Agendar agora
        </button>
      </div>
    </div>
  )
}
