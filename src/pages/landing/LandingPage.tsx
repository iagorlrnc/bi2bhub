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
import { MarqueeSection } from './sections/MarqueeSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { SecuritySection } from './sections/SecuritySection'
import { HowItWorksSection } from './sections/HowItWorksSection'
import { ProductivitySection } from './sections/ProductivitySection'
import { PricingSection } from './sections/PricingSection'
import { FaqSection } from './sections/FaqSection'
import { ContactSection } from './sections/ContactSection'
import { FooterSection } from './sections/FooterSection'

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
    { label: 'Funcionalidades', href: '#funcionalidades' },
    { label: 'Segurança', href: '#seguranca' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Produtividade', href: '#produtividade' },
    { label: 'Planos', href: '#planos' },
    { label: 'FAQ', href: '#faq' },
  ]

  const scrollTo = (id: string) => {
    setMobileMenu(false)
    const el = document.querySelector(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <div
      className={cn(
        "min-h-screen font-sans relative overflow-x-hidden theme-transition-sync",
        isDark ? "bg-[#050b14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950" : "bg-slate-50 text-slate-900 selection:bg-[#0d6084]/20 selection:text-slate-900"
      )}
    >
      
      {/* Background Glows (Bi2B Identity) */}
      <div 
        className={cn(
          "absolute top-0 left-1/4 h-[700px] w-[700px] -translate-x-1/2 rounded-full blur-[140px] -z-10 pointer-events-none",
          isDark ? "bg-[#0d6084]/15" : "bg-[#0d6084]/5"
        )} 
      />
      <div 
        className={cn(
          "absolute top-[18%] right-1/4 h-[600px] w-[600px] rounded-full blur-[130px] -z-10 pointer-events-none",
          isDark ? "bg-[#0d6084]/20" : "bg-[#38bdf8]/10"
        )} 
      />
      <div 
        className={cn(
          "absolute bottom-[20%] left-1/3 h-[800px] w-[800px] rounded-full blur-[160px] -z-10 pointer-events-none",
          isDark ? "bg-[#0a4a62]/10" : "bg-[#0d6084]/5"
        )} 
      />
      
      {/* Dot Grid Background Overlay */}
      <div 
        className={cn(
          "absolute inset-0 grid-pattern pointer-events-none",
          isDark ? "opacity-40" : "opacity-25"
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
            "mx-auto max-w-7xl rounded-full px-6 py-3 flex items-center justify-between border",
            headerOpacity > 0.3
              ? (isDark 
                  ? "bg-[#050b14]/85 border-cyan-500/15 backdrop-blur-md shadow-lg shadow-cyan-950/20" 
                  : "bg-white/90 border-slate-200 backdrop-blur-md shadow-lg shadow-slate-200/40")
              : "bg-transparent border-transparent"
          )}
        >
          <div className="flex items-center cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            <img src={logoPng} alt={APP_NAME} className="h-8 w-auto object-contain" />
          </div>

          <nav className="hidden lg:flex items-center gap-5">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={cn(
                  "font-semibold text-xs uppercase tracking-wider cursor-pointer nav-link-hover py-1 transition-colors duration-200",
                  isDark ? "text-slate-300 hover:text-cyan-400" : "text-slate-600 hover:text-[#0d6084]"
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
                "rounded-full p-2 cursor-pointer transition-all duration-300 hover:scale-110",
                isDark ? "text-slate-400 hover:bg-slate-800/50 hover:text-cyan-400" : "text-slate-500 hover:bg-slate-200 hover:text-[#0d6084]"
              )}
              title="Alternar Tema"
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className={cn(
                "hidden lg:block px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95",
                isDark ? "text-slate-300 hover:text-cyan-400" : "text-slate-600 hover:text-[#0d6084]"
              )}
            >
              Entrar
            </button>
            <button
              onClick={() => navigate(ROUTES.REGISTER)}
              className="hidden lg:block bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:brightness-110 border border-cyan-500/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg shadow-cyan-950/40 hover-elevate active-elevate-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Teste Grátis!
            </button>
          </div>

          {/* Hamburger Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setMobileMenu(!mobileMenu)}
              className={cn(
                "p-2 cursor-pointer",
                isDark ? "text-slate-300 hover:text-cyan-400" : "text-slate-700 hover:text-[#0d6084]"
              )}
            >
              {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                "absolute left-4 right-4 top-20 rounded-2xl border p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-4 lg:hidden",
                isDark ? "border-cyan-500/10 bg-[#050b14]/95" : "border-slate-200 bg-white/95 text-slate-800"
              )}
            >
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={cn(
                    "block w-full py-2.5 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer",
                    isDark ? "text-slate-300 hover:text-cyan-400" : "text-slate-700 hover:text-[#0d6084]"
                  )}
                >
                  {item.label}
                </button>
              ))}
              <div className={cn("h-px my-2", isDark ? "bg-slate-800/60" : "bg-slate-200")} />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setMobileMenu(false); navigate(ROUTES.LOGIN) }}
                  className={cn(
                    "w-full rounded-full py-3 text-center text-xs font-bold uppercase tracking-wider cursor-pointer border",
                    isDark ? "border-slate-700 text-slate-300" : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  )}
                >
                  Entrar
                </button>
                <button
                  onClick={() => { setMobileMenu(false); navigate(ROUTES.REGISTER) }}
                  className="w-full rounded-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] border border-cyan-500/20 py-3 text-center text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                >
                  Criar Conta
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===== PAGE SECTIONS ===== */}
      <HeroSection isDark={isDark} />
      <MarqueeSection isDark={isDark} />
      <FeaturesSection isDark={isDark} />
      <SecuritySection isDark={isDark} />
      <HowItWorksSection isDark={isDark} />
      <ProductivitySection isDark={isDark} />
      <PricingSection isDark={isDark} />
      <FaqSection isDark={isDark} />
      <ContactSection isDark={isDark} />
      <FooterSection isDark={isDark} />
    </div>
  )
}
