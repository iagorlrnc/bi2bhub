import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants'
import {
  Sun,
  Moon,
  Menu,
  X,
  ArrowLeft,
  Lock,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import logoPng from '@/assets/logo.png'
import logoAzulPng from '@/assets/logoazul.png'

// ===== SECTIONS DO PORTAL =====
import { PortalHeroSection } from './sections/PortalHeroSection'
import { HowItWorksSection } from './sections/HowItWorksSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { ProductivitySection } from './sections/ProductivitySection'
import { PricingSection } from './sections/PricingSection'
import { FaqSection } from './sections/FaqSection'
import { ContactSection } from './sections/ContactSection'
import { FooterSection } from './sections/FooterSection'

import { getClientSubdomainUrl } from '@/utils/subdomain'

export function PortalPage() {
  const navigate = useNavigate()
  const { resolvedTheme, toggleTheme } = useTheme()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showNavbar, setShowNavbar] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowNavbar(true)
      } else {
        setShowNavbar(false)
        setMobileMenu(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Recursos', href: '#solucoes' },
    { label: 'Produtividade', href: '#resultados' },
    { label: 'Planos', href: '#planos' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ]

  const scrollTo = (id: string) => {
    setMobileMenu(false)
    const el = document.querySelector(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleClientLogin = () => {
    window.location.href = getClientSubdomainUrl('/')
  }

  const isDark = resolvedTheme === 'dark'
  const currentLogo = isDark ? logoPng : logoAzulPng

  return (
    <div
      className={cn(
        'min-h-screen font-sans relative overflow-x-hidden theme-transition-sync',
        isDark
          ? 'bg-[#040914] text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
          : 'bg-slate-50 text-slate-900 selection:bg-[#0d6084]/20 selection:text-slate-900'
      )}
    >
      {/* Background Glows */}
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

      {/* Top Banner / Navigation back to Main Site */}
      <div
        className={cn(
          'w-full py-2.5 px-4 text-center border-b backdrop-blur-md flex items-center justify-center gap-3 text-xs font-semibold',
          isDark
            ? 'bg-cyan-950/40 border-cyan-500/20 text-cyan-300'
            : 'bg-cyan-50 border-cyan-200 text-[#0d6084]'
        )}
      >
        <span>Você está visualizando a página informativa do <strong>Portal do Cliente Bi2B</strong></span>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="inline-flex items-center gap-1 underline hover:no-underline font-bold cursor-pointer ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para Bi2B Consultoria
        </button>
      </div>

      {/* ===== HEADER / NAVBAR ===== */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: showNavbar ? 0 : -100,
          opacity: showNavbar ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-8 left-0 right-0 z-50 px-4 py-2 md:px-8',
          !showNavbar && 'pointer-events-none'
        )}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 border backdrop-blur-xl',
            isDark
              ? 'bg-[#040914]/85 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] shadow-cyan-950/20'
              : 'bg-white/90 border-slate-200/80 shadow-lg shadow-slate-200/40'
          )}
        >
          <div
            className="flex items-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate(ROUTES.HOME)}
          >
            <img src={currentLogo} alt={APP_NAME} className="h-8 w-auto object-contain" />
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={cn(
                  'font-bold text-[11px] uppercase tracking-[0.18em] cursor-pointer px-4 py-1.5 rounded-full transition-all duration-300',
                  isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#0d6084] hover:bg-slate-200/60'
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className={cn(
                'hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border transition-all',
                isDark
                  ? 'border-white/10 text-slate-300 hover:bg-white/10'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              )}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Bi2B Consultoria
            </button>

            <button
              onClick={toggleTheme}
              className={cn(
                'rounded-full p-2 cursor-pointer transition-all duration-300 border border-white/10 hover:scale-110',
                isDark
                  ? 'text-slate-300 bg-white/5 hover:bg-white/10 hover:text-cyan-300'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-[#0d6084]'
              )}
              title="Alternar Tema"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={handleClientLogin}
              className="hidden lg:inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] border border-cyan-400/30 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-[0_8px_25px_rgba(13,96,132,0.35)] hover:shadow-[0_12px_35px_rgba(13,96,132,0.5)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              Acessar Portal
            </button>
          </div>

          {/* Hamburger Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className={cn(
                'p-2 rounded-full border border-white/10 cursor-pointer',
                isDark ? 'text-slate-300 bg-white/5' : 'text-slate-700 bg-slate-100'
              )}
            >
              {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'absolute left-4 right-4 top-20 rounded-2xl border p-6 backdrop-blur-2xl shadow-2xl flex flex-col gap-4 lg:hidden',
                isDark
                  ? 'border-white/15 bg-[#040914]/95 text-slate-100 shadow-cyan-950/30'
                  : 'border-slate-200 bg-white/95 text-slate-800'
              )}
            >
              <button
                onClick={() => {
                  setMobileMenu(false)
                  navigate(ROUTES.HOME)
                }}
                className="flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider text-[#0d6084] dark:text-cyan-400"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para Bi2B Consultoria
              </button>

              <div className={cn('h-px my-1', isDark ? 'bg-white/10' : 'bg-slate-200')} />

              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={cn(
                    'block w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors',
                    isDark ? 'text-slate-300 hover:text-cyan-300' : 'text-slate-700 hover:text-[#0d6084]'
                  )}
                >
                  {item.label}
                </button>
              ))}

              <div className={cn('h-px my-2', isDark ? 'bg-white/10' : 'bg-slate-200')} />

              <button
                onClick={() => {
                  setMobileMenu(false)
                  handleClientLogin()
                }}
                className="w-full rounded-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] border border-cyan-400/30 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-[0_8px_25px_rgba(13,96,132,0.35)] cursor-pointer"
              >
                Acessar o Portal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ===== PORTAL SECTIONS ===== */}
      <PortalHeroSection isDark={isDark} />
      <HowItWorksSection isDark={isDark} />
      <FeaturesSection isDark={isDark} />
      <ProductivitySection isDark={isDark} />
      <PricingSection isDark={isDark} />
      <FaqSection isDark={isDark} />
      <ContactSection isDark={isDark} />
      <FooterSection isDark={isDark} />
    </div>
  )
}
