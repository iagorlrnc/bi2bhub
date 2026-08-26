import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { getClientSubdomainUrl } from '@/utils/subdomain'
import { Menu, X, ArrowLeft, Lock } from 'lucide-react'

// ===== SEÇÕES DO PORTAL COM ESTILO BI2B =====
import { Bi2BPortalHeroSection } from './sections/Bi2BPortalHeroSection'
import { Bi2BPortalModulesSection } from './sections/Bi2BPortalModulesSection'
import { Bi2BPortalProductivitySection } from './sections/Bi2BPortalProductivitySection'
import { Bi2BPortalStepsSection } from './sections/Bi2BPortalStepsSection'
import { Bi2BPortalSecuritySection } from './sections/Bi2BPortalSecuritySection'
import { Bi2BPortalFaqSection } from './sections/Bi2BPortalFaqSection'
import { Bi2BPortalCtaSection } from './sections/Bi2BPortalCtaSection'
import { Bi2BFooterSection } from './sections/Bi2BFooterSection'

export function PortalPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Scroll listener for header background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // 2. IntersectionObserver for reveal animations
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

  const handleBackToHome = () => {
    navigate(ROUTES.HOME)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
          <div className="flex items-center gap-3 sm:gap-4">
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

            <span className="hidden md:inline-flex font-mono text-[0.66rem] uppercase tracking-wider text-[#AEC3CE] border border-white/20 px-2 py-0.5 rounded-full">
              Portal do Cliente
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            <button
              onClick={() => scrollTo('#topo')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Início
            </button>
            <button
              onClick={() => scrollTo('#modulos')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Módulos
            </button>
            <button
              onClick={() => scrollTo('#produtividade')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Produtividade
            </button>
            <button
              onClick={() => scrollTo('#como-funciona')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollTo('#seguranca')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Segurança
            </button>
            <button
              onClick={() => scrollTo('#faq')}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Dúvidas
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleBackToHome}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white border border-white/20 hover:border-white/40 rounded-full px-3.5 py-2 transition-all cursor-pointer hover:bg-white/5"
              title="Voltar para a página principal da Bi2B Consultoria"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar à Consultoria</span>
            </button>

            <button
              onClick={handleClientLogin}
              className="bi2b-btn bi2b-btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 font-semibold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acessar Portal</span>
            </button>

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
                onClick={() => scrollTo('#modulos')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Módulos &amp; Recursos
              </button>
              <button
                onClick={() => scrollTo('#produtividade')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Produtividade &amp; Economia
              </button>
              <button
                onClick={() => scrollTo('#como-funciona')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Como Funciona o Acesso
              </button>
              <button
                onClick={() => scrollTo('#seguranca')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Segurança &amp; LGPD
              </button>
              <button
                onClick={() => scrollTo('#faq')}
                className="text-left text-base font-semibold text-white/90 hover:text-white py-2"
              >
                Dúvidas Frequentes
              </button>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleBackToHome()
                  }}
                  className="w-full text-center text-sm font-semibold text-white border border-white/30 rounded-full py-2.5 hover:bg-white/10 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar para Bi2B Consultoria</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleClientLogin()
                  }}
                  className="w-full text-center text-sm font-bold text-white bg-[#0B4F6C] rounded-full py-2.5 hover:bg-[#0d6084] flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>Entrar no Portal do Cliente</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== LANDING PAGE SECTIONS ===== */}
      <main>
        {/* 1. Hero do Portal */}
        <Bi2BPortalHeroSection onModulesClick={() => scrollTo('#modulos')} />

        {/* 2. Módulos & Recursos do Portal */}
        <Bi2BPortalModulesSection />

        {/* 3. Produtividade & Comparativo */}
        <Bi2BPortalProductivitySection />

        {/* 4. Como Funciona (4 Passos) */}
        <Bi2BPortalStepsSection />

        {/* 5. Segurança & LGPD */}
        <Bi2BPortalSecuritySection />

        {/* 6. Dúvidas Frequentes (FAQ) */}
        <Bi2BPortalFaqSection />

        {/* 7. CTA Final */}
        <Bi2BPortalCtaSection />
      </main>

      {/* 8. Rodapé Bi2B */}
      <Bi2BFooterSection />
    </div>
  )
}
