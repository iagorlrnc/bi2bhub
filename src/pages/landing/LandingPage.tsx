import { useState, useEffect, useRef } from 'react'
import { Menu, X, Lock } from 'lucide-react'
import { getClientSubdomainUrl } from '@/utils/subdomain'

// ===== SEÇÕES DA LANDING PAGE BI2B (BASEADAS NO MODELO E IDENTIDADE BI2B) =====
import { Bi2BHeroSection } from './sections/Bi2BHeroSection'
import { Bi2BTrustMarqueeSection } from './sections/Bi2BTrustMarqueeSection'
import { Bi2BProblemSection } from './sections/Bi2BProblemSection'
import { Bi2BGuideSection } from './sections/Bi2BGuideSection'
import { Bi2BPlanSection } from './sections/Bi2BPlanSection'
import { Bi2BObjectionSection } from './sections/Bi2BObjectionSection'
import { Bi2BCasesSection } from './sections/Bi2BCasesSection'
import { Bi2BReviewsSection } from './sections/Bi2BReviewsSection'
import { Bi2BPricingSection } from './sections/Bi2BPricingSection'
import { Bi2BPartnersSection } from './sections/Bi2BPartnersSection'
import { Bi2BStakesSection } from './sections/Bi2BStakesSection'
import { Bi2BTransformSection } from './sections/Bi2BTransformSection'
import { Bi2BLocationSection } from './sections/Bi2BLocationSection'
import { Bi2BFaqSection } from './sections/Bi2BFaqSection'
import { Bi2BFinalCtaSection } from './sections/Bi2BFinalCtaSection'
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
        <div className="wrap flex items-center justify-between">
          {/* Brand Logo with Glowing Red Dot */}
          <a
            href="#topo"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#topo')
            }}
            className="brand font-heading font-bold text-2xl text-white flex items-center gap-2 tracking-tight group"
          >
            <span className="dot w-2.5 h-2.5 rounded-full bg-[#FF0000] shadow-[0_0_12px_2px_rgba(255,0,0,0.8)] group-hover:scale-110 transition-transform" />
            <span>Bi2B</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            <button
              onClick={() => scrollTo('#topo')}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-heading"
            >
              Início
            </button>
            <button
              onClick={() => scrollTo('#vilao')}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-heading"
            >
              O vilão
            </button>
            <button
              onClick={() => scrollTo('#guia')}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-heading"
            >
              Quem somos
            </button>
            <button
              onClick={() => scrollTo('#como-funciona')}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-heading"
            >
              Como funciona
            </button>
            <button
              onClick={() => scrollTo('#cases')}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-heading"
            >
              Cases
            </button>
            <button
              onClick={() => scrollTo('#avaliacoes')}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-heading"
            >
              Avaliações
            </button>
            <button
              onClick={() => scrollTo('#planos')}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-heading"
            >
              Planos
            </button>
            <button
              onClick={() => scrollTo('#faq')}
              className="text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider font-heading"
            >
              FAQ
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClientLogin}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-white border border-white/20 hover:border-white/40 rounded-full px-4 py-2 transition-all cursor-pointer hover:bg-white/5 backdrop-blur-sm font-heading"
              title="Acessar Área do Cliente"
            >
              <Lock className="w-3.5 h-3.5 text-[#FF0000]" />
              <span>Portal do Cliente</span>
            </button>

            <a
              href="#agendar"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#agendar')
              }}
              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm py-2 px-5 font-bold rounded-full bg-white text-[#0B4F6C] hover:bg-[#FAFAFA] shadow-md transition-all cursor-pointer font-heading"
            >
              <span>Agendar diagnóstico</span>
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
            <div className="flex flex-col gap-4 text-sm font-semibold text-white/90 font-heading">
              <button
                onClick={() => scrollTo('#topo')}
                className="text-left py-2 hover:text-white"
              >
                Início
              </button>
              <button
                onClick={() => scrollTo('#vilao')}
                className="text-left py-2 hover:text-white"
              >
                O vilão
              </button>
              <button
                onClick={() => scrollTo('#guia')}
                className="text-left py-2 hover:text-white"
              >
                Quem somos
              </button>
              <button
                onClick={() => scrollTo('#como-funciona')}
                className="text-left py-2 hover:text-white"
              >
                Como funciona
              </button>
              <button
                onClick={() => scrollTo('#cases')}
                className="text-left py-2 hover:text-white"
              >
                Casos Reais
              </button>
              <button
                onClick={() => scrollTo('#avaliacoes')}
                className="text-left py-2 hover:text-white"
              >
                Avaliações
              </button>
              <button
                onClick={() => scrollTo('#planos')}
                className="text-left py-2 hover:text-white"
              >
                Planos
              </button>
              <button
                onClick={() => scrollTo('#faq')}
                className="text-left py-2 hover:text-white"
              >
                Dúvidas Frequentes
              </button>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleClientLogin()
                  }}
                  className="w-full text-center text-sm font-bold text-white border border-white/20 rounded-full py-2.5 hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#FF0000]" />
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
          onHowItWorksClick={() => scrollTo('#planos')}
        />

        {/* 2. Faixa de Logos de Confiança */}
        <Bi2BTrustMarqueeSection />

        {/* 3. Seção "O Vilão é o Achismo" */}
        <div id="vilao">
          <Bi2BProblemSection />
        </div>

        {/* 4. Seção "Quem Caminha com Você" */}
        <div id="guia">
          <Bi2BGuideSection />
        </div>

        {/* 5. Seção "Como Funciona / 3 Passos" */}
        <div id="como-funciona">
          <Bi2BPlanSection />
        </div>

        {/* 6. Seção de Objeção / Contador Atual */}
        <Bi2BObjectionSection />

        {/* 7. Seção "Cases Reais" */}
        <div id="cases">
          <Bi2BCasesSection />
        </div>

        {/* 8. Seção "Avaliações" */}
        <div id="avaliacoes">
          <Bi2BReviewsSection />
        </div>

        {/* 9. Seção "Planos & Preços" */}
        <div id="planos">
          <Bi2BPricingSection onScheduleClick={() => scrollTo('#agendar')} />
        </div>

        {/* 10. Seção "Parceiros & Integrações" */}
        <div id="parceiros">
          <Bi2BPartnersSection />
        </div>

        {/* 11. Seção "Stakes / Risco de Inação" */}
        <Bi2BStakesSection />

        {/* 12. Seção "Transformação" */}
        <Bi2BTransformSection />

        {/* 13. Seção de Localização em Palmas */}
        <div id="localizacao">
          <Bi2BLocationSection />
        </div>

        {/* 14. Seção de FAQ */}
        <div id="faq">
          <Bi2BFaqSection />
        </div>

        {/* 15. CTA Final */}
        <div id="agendar">
          <Bi2BFinalCtaSection />
        </div>
      </main>

      {/* ===== RODAPÉ ===== */}
      <Bi2BFooterSection />

      {/* ===== STICKY CTA NO MOBILE ===== */}
      <div
        className={`sticky-cta ${
          showStickyCta ? 'show' : ''
        }`}
      >
        <div className="flex flex-col">
          <span className="lbl">
            Diagnóstico Bi2B
          </span>
          <span className="font-mono text-[0.72rem] text-[#59707B]">
            Gratuito · Palmas/TO
          </span>
        </div>

        <button
          onClick={() => scrollTo('#agendar')}
          className="btn btn-primary text-xs py-2.5 px-4 cursor-pointer"
        >
          Agendar agora
        </button>
      </div>
    </div>
  )
}

