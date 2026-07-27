import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants'
import {
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import logoPng from '@/assets/logo.png'

// ===== SECTIONS =====
import { HeroSection } from './sections/HeroSection'
import { HowItWorksSection } from './sections/HowItWorksSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { ProductivitySection } from './sections/ProductivitySection'
import { PricingSection } from './sections/PricingSection'
import { FaqSection } from './sections/FaqSection'
import { ContactSection } from './sections/ContactSection'
import { FooterSection } from './sections/FooterSection'

import { getClientSubdomainUrl } from '@/utils/subdomain'

export function LandingPage() {
  const navigate = useNavigate()
  const { resolvedTheme, toggleTheme } = useTheme()
  const [mobileMenu, setMobileMenu] = useState(false)

  const { scrollYProgress } = useScroll()
  const headerBg = useTransform(scrollYProgress, [0, 0.05], [0, 1])
  const [headerOpacity, setHeaderOpacity] = useState(0)

  useEffect(() => {
    const unsubscribe = headerBg.on('change', (v: number) => setHeaderOpacity(v))
    return unsubscribe
  }, [headerBg])

  const navItems = [
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Soluções', href: '#solucoes' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Planos', href: '#planos' },
    { label: 'FAQ', href: '#faq' },
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

  return (
    <div
      className={cn(
        "min-h-screen font-sans relative overflow-x-hidden theme-transition-sync",
        isDark ? "bg-[#040914] text-slate-100 selection:bg-cyan-500 selection:text-slate-950" : "bg-slate-50 text-slate-900 selection:bg-[#0d6084]/20 selection:text-slate-900"
      )}
    >
      
      {/* Background Glows (Bi2B Consultoria Identity) - Otimizado para Mobile */}
      <div 
        className={cn(
          "hidden md:block absolute top-0 left-1/4 h-[750px] w-[750px] -translate-x-1/2 rounded-full blur-[150px] -z-10 pointer-events-none",
          isDark ? "bg-[#0d6084]/25" : "bg-[#0d6084]/8"
        )} 
      />
      <div 
        className={cn(
          "hidden md:block absolute top-[18%] right-1/4 h-[650px] w-[650px] rounded-full blur-[140px] -z-10 pointer-events-none",
          isDark ? "bg-[#0a4a62]/30" : "bg-[#38bdf8]/12"
        )} 
      />
      <div 
        className={cn(
          "hidden md:block absolute bottom-[20%] left-1/3 h-[850px] w-[850px] rounded-full blur-[170px] -z-10 pointer-events-none",
          isDark ? "bg-[#0d6084]/20" : "bg-[#0d6084]/8"
        )} 
      />
      
      {/* Grid Pattern Background Overlay */}
      <div 
        className={cn(
          "absolute inset-0 grid-pattern pointer-events-none",
          isDark ? "opacity-30" : "opacity-20"
        )} 
      />

      {/* ===== HEADER / NAVBAR ===== */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8"
        style={{
          transform: 'translateZ(0)'
        }}
      >
        <div 
          className={cn(
            "mx-auto max-w-7xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 border backdrop-blur-xl",
            headerOpacity > 0.1
              ? (isDark 
                  ? "bg-[#040914]/85 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] shadow-cyan-950/20" 
                  : "bg-white/90 border-slate-200/80 shadow-lg shadow-slate-200/40")
              : (isDark
                  ? "bg-[#040914]/40 border-white/5"
                  : "bg-white/40 border-slate-200/40")
          )}
        >
          <div className="flex items-center cursor-pointer transition-transform hover:scale-105" onClick={() => navigate(ROUTES.HOME)}>
            <img src={logoPng} alt={APP_NAME} className="h-8 w-auto object-contain" />
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={cn(
                  "font-bold text-[11px] uppercase tracking-[0.18em] cursor-pointer px-4 py-1.5 rounded-full transition-all duration-300",
                  isDark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-[#0d6084] hover:bg-slate-200/60"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={cn(
                "rounded-full p-2 cursor-pointer transition-all duration-300 border border-white/10 hover:scale-110",
                isDark ? "text-slate-300 bg-white/5 hover:bg-white/10 hover:text-cyan-300" : "text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-[#0d6084]"
              )}
              title="Alternar Tema"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={handleClientLogin}
              className="hidden lg:inline-flex items-center justify-center bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] border border-cyan-400/30 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-[0_8px_25px_rgba(13,96,132,0.35)] hover:shadow-[0_12px_35px_rgba(13,96,132,0.5)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Entrar
            </button>
          </div>

          {/* Hamburger Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setMobileMenu(!mobileMenu)}
              className={cn(
                "p-2 rounded-full border border-white/10 cursor-pointer",
                isDark ? "text-slate-300 bg-white/5" : "text-slate-700 bg-slate-100"
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
                "absolute left-4 right-4 top-20 rounded-2xl border p-6 backdrop-blur-2xl shadow-2xl flex flex-col gap-4 lg:hidden",
                isDark ? "border-white/15 bg-[#040914]/95 text-slate-100 shadow-cyan-950/30" : "border-slate-200 bg-white/95 text-slate-800"
              )}
            >
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={cn(
                    "block w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors",
                    isDark ? "text-slate-300 hover:text-cyan-300" : "text-slate-700 hover:text-[#0d6084]"
                  )}
                >
                  {item.label}
                </button>
              ))}
              <div className={cn("h-px my-2", isDark ? "bg-white/10" : "bg-slate-200")} />
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setMobileMenu(false); handleClientLogin() }}
                  className="w-full rounded-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] border border-cyan-400/30 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-[0_8px_25px_rgba(13,96,132,0.35)] cursor-pointer"
                >
                  Entrar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===== PAGE SECTIONS (Ordem Proposta: Hero → Prova Social → Como Funciona → Soluções/Ecossistema → Resultados → Depoimentos → Planos → FAQ → CTA Final → Footer) ===== */}
      <HeroSection isDark={isDark} />
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

