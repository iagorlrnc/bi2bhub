import { useState, useEffect, useRef } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { getClientSubdomainUrl } from '@/utils/subdomain'

// ===== SEÇÕES DA LANDING PAGE BI2B =====
import { Bi2BHeroSection } from './sections/Bi2BHeroSection'
import { Bi2BProblemSection } from './sections/Bi2BProblemSection'
import { Bi2BGuideSection } from './sections/Bi2BGuideSection'
import { Bi2BPlanSection } from './sections/Bi2BPlanSection'
import { Bi2BObjectionSection } from './sections/Bi2BObjectionSection'
import { Bi2BCasesSection } from './sections/Bi2BCasesSection'
import { Bi2BReviewsSection } from './sections/Bi2BReviewsSection'
import { Bi2BPartnersSection } from './sections/Bi2BPartnersSection'
import { Bi2BPricingSection } from './sections/Bi2BPricingSection'
import { Bi2BStakesSection } from './sections/Bi2BStakesSection'
import { Bi2BTransformSection } from './sections/Bi2BTransformSection'
import { Bi2BLocationSection } from './sections/Bi2BLocationSection'
import { Bi2BPortalSection } from './sections/Bi2BPortalSection'
import { Bi2BFinalCtaSection } from './sections/Bi2BFinalCtaSection'
import { Bi2BFaqSection } from './sections/Bi2BFaqSection'
import { Bi2BFooterSection } from './sections/Bi2BFooterSection'

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll reveal observer & sticky CTA observer
  useEffect(() => {
    // 1. Scroll listener for header background and sticky CTA
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
      setShowStickyCta(scrollY > 480)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // 2. IntersectionObserver for reveal elements
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealElements = document.querySelectorAll('.bi2b-reveal')

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      revealElements.forEach((el) => el.classList.add('in'))
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -4% 0px' }
      )

      revealElements.forEach((el) => observer.observe(el))

      return () => {
        window.removeEventListener('scroll', handleScroll)
        observer.disconnect()
      }
    }

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
    <div ref={containerRef} className="bi2b-landing min-h-screen bg-[#FAFAFA] text-[#0C1E28]">
      {/* ===== HEADER / NAVBAR ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? 'bg-[#083A50]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-3'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="bi2b-wrap flex items-center justify-between">
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
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Início
            </button>
            <button
              onClick={() => scrollTo('#cases')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Casos Reais
            </button>
            <button
              onClick={() => scrollTo('#parceiros')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Parceiros
            </button>
            <button
              onClick={() => scrollTo('#planos')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Planos
            </button>
            <button
              onClick={() => scrollTo('#portal')}
              className="text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Portal</span>
            </button>
            <button
              onClick={() => scrollTo('#faq')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Dúvidas
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClientLogin}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white border border-white/20 hover:border-white/40 rounded-full px-3.5 py-2 transition-all cursor-pointer hover:bg-white/5"
              title="Acessar Área do Cliente"
            >
              <span>Portal do Cliente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href="#agendar"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#agendar')
              }}
              className="bi2b-btn bi2b-btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 font-semibold shadow-md"
            >
              <span>Agendar diagnóstico</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#083A50] border-b border-white/10 px-6 py-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollTo('#topo')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Início
              </button>
              <button
                onClick={() => scrollTo('#cases')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Casos Reais
              </button>
              <button
                onClick={() => scrollTo('#parceiros')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Parceiros
              </button>
              <button
                onClick={() => scrollTo('#planos')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Planos
              </button>
              <button
                onClick={() => scrollTo('#portal')}
                className="text-left text-base font-semibold text-white hover:text-cyan-300 py-2 flex items-center gap-2"
              >
                <span>Portal do Cliente</span>
              </button>
              <button
                onClick={() => scrollTo('#faq')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Dúvidas
              </button>
              <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleClientLogin()
                  }}
                  className="w-full text-center text-sm font-semibold text-white border border-white/30 rounded-full py-2.5 hover:bg-white/10"
                >
                  Acessar Área do Cliente
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== LANDING PAGE SECTIONS ===== */}
      <main>
        {/* 1. Hero Section */}
        <Bi2BHeroSection
          onScheduleClick={() => scrollTo('#agendar')}
          onPlansClick={() => scrollTo('#planos')}
        />

        {/* 2. O Problema */}
        <Bi2BProblemSection />

        {/* 3. Guia & Equipe */}
        <Bi2BGuideSection />

        {/* 4. Como Funciona (Plano) */}
        <Bi2BPlanSection />

        {/* 5. Quebra de Objeção */}
        <Bi2BObjectionSection />

        {/* 6. Casos Reais */}
        <Bi2BCasesSection />

        {/* 7. Avaliações */}
        <Bi2BReviewsSection />

        {/* 8. Parceiros & Integrações */}
        <Bi2BPartnersSection />

        {/* 9. Planos & Preços */}
        <Bi2BPricingSection onScheduleClick={() => scrollTo('#agendar')} />

        {/* 10. O Que Está em Jogo (Stakes) */}
        <Bi2BStakesSection />

        {/* 11. A Virada (Transformação) */}
        <Bi2BTransformSection />

        {/* 12. Localização / Onde Estamos */}
        <Bi2BLocationSection />

        {/* 13. Conheça o Portal do Cliente (NOVA SEÇÃO DE DESTAQUE) */}
        <Bi2BPortalSection />

        {/* 14. CTA Final */}
        <Bi2BFinalCtaSection />

        {/* 15. Perguntas Frequentes (FAQ) */}
        <Bi2BFaqSection />
      </main>

      {/* 16. Rodapé */}
      <Bi2BFooterSection />

      {/* ===== STICKY CTA NO MOBILE (Desliza após rolar a página) ===== */}
      <div
        id="stickyCta"
        className={`bi2b-sticky-cta ${showStickyCta ? 'show' : ''}`}
      >
        <span className="font-heading font-semibold text-xs sm:text-sm text-[#0C1E28]">
          Diagnóstico gratuito Bi2B
        </span>
        <a
          href="#agendar"
          onClick={(e) => {
            e.preventDefault()
            scrollTo('#agendar')
          }}
          className="bi2b-btn bi2b-btn-primary text-xs py-2 px-3.5 whitespace-nowrap"
        >
          <span>Agendar</span>
          <span className="bi2b-arrow text-sm">→</span>
        </a>
      </div>
    </div>
  )
}
