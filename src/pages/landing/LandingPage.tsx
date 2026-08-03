import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants'
import {
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import logoPng from '@/assets/logo.png'
import logoAzulPng from '@/assets/logoazul.png'

// ===== SECTIONS DA CONSULTORIA =====
import { HeroSection } from './sections/HeroSection'
import { PortalOriginalAboutSection } from './sections/PortalOriginalAboutSection'
import { ServicesSection } from './sections/ServicesSection'
import { CompanyAboutSection } from './sections/CompanyAboutSection'
import { TeamSection } from './sections/TeamSection'
import { PortalTeaserSection } from './sections/PortalTeaserSection'
import { FaqSection } from './sections/FaqSection'
import { ContactSection } from './sections/ContactSection'
import { FooterSection } from './sections/FooterSection'

import { getClientSubdomainUrl } from '@/utils/subdomain'

export function LandingPage() {
  const navigate = useNavigate()
  const { resolvedTheme, toggleTheme } = useTheme()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Soluções', href: '#servicos' },
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Equipe', href: '#equipe' },
    { label: 'Portal do Cliente', href: '#portal-teaser' },
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

  const handleKnowPortal = () => {
    navigate(ROUTES.PORTAL_INFO)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isDark = resolvedTheme === 'dark'
  const currentLogo = isDark ? logoPng : logoAzulPng

  return (
    <div
      className={cn(
        "min-h-screen font-sans relative overflow-x-hidden",
        isDark ? "bg-[#040914] text-slate-100 selection:bg-cyan-500 selection:text-slate-950" : "bg-slate-50 text-slate-900 selection:bg-[#0d6084]/20 selection:text-slate-900"
      )}
    >
      
      {/* Background Glows (Bi2B Consultoria Identity) */}
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

      {/* ===== HEADER FLUTUANTE ESTÁTICO DADOS DE SCROLL ===== */}
      <header
        className={cn(
          "fixed left-1/2 -translate-x-1/2 z-[60] w-full max-w-6xl top-3 px-4 transition-all duration-500",
          isScrolled
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div 
          className={cn(
            "mx-auto rounded-full px-5 py-2.5 flex items-center justify-between border shadow-lg backdrop-blur-xl",
            isScrolled
              ? (isDark 
                  ? "bg-[#040914]/95 border-white/15 shadow-cyan-950/40" 
                  : "bg-white/95 border-slate-200/90 shadow-slate-200/50")
              : (isDark 
                  ? "bg-[#040914]/80 border-white/10" 
                  : "bg-white/90 border-slate-200/70")
          )}
        >
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            <img src={currentLogo} alt={APP_NAME} className="h-8 w-auto object-contain" />
          </div>

          {/* Navigation Links Estáticos */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={cn(
                  "font-medium text-[13px] xl:text-sm cursor-pointer px-3.5 py-1.5 rounded-full",
                  isDark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-[#0d6084] hover:bg-slate-100"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={cn(
                "rounded-full p-2 cursor-pointer border border-white/10",
                isDark ? "text-slate-300 bg-white/5 hover:bg-white/10 hover:text-cyan-300" : "text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-[#0d6084]"
              )}
              title="Alternar Tema"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={handleClientLogin}
              className={cn(
                "hidden xl:inline-flex items-center text-xs font-semibold px-4 py-2 rounded-full cursor-pointer",
                isDark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-[#0d6084]"
              )}
            >
              Entrar
            </button>

            <button
              onClick={handleKnowPortal}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] border border-cyan-400/30 text-white font-semibold text-xs xl:text-sm h-10 px-5 shadow-lg shadow-[#0d6084]/25 cursor-pointer"
            >
              <span>Portal do Cliente</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Hamburger Mobile */}
            <div className="flex items-center gap-2 lg:hidden">
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
        </div>

        {/* Menu Mobile Estático */}
        {mobileMenu && (
          <div
            className={cn(
              "absolute left-4 right-4 top-16 rounded-2xl border p-6 backdrop-blur-2xl shadow-2xl flex flex-col gap-4 lg:hidden",
              isDark ? "border-white/15 bg-[#040914]/98 text-slate-100 shadow-cyan-950/40" : "border-slate-200 bg-white/98 text-slate-800"
            )}
          >
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={cn(
                  "block w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest cursor-pointer",
                  isDark ? "text-slate-300 hover:text-cyan-300" : "text-slate-700 hover:text-[#0d6084]"
                )}
              >
                {item.label}
              </button>
            ))}
            <div className={cn("h-px my-2", isDark ? "bg-white/10" : "bg-slate-200")} />
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setMobileMenu(false); handleKnowPortal() }}
                className="w-full rounded-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] border border-cyan-400/30 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md cursor-pointer"
              >
                Conheça o Portal do Cliente
              </button>
              <button
                onClick={() => { setMobileMenu(false); handleClientLogin() }}
                className="w-full rounded-full bg-slate-100 dark:bg-white/10 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white cursor-pointer"
              >
                Entrar no Portal (Login)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ===== SEÇÕES DA LANDING PAGE 100% ESTÁTICAS ===== */}
      <HeroSection isDark={isDark} />
      <PortalOriginalAboutSection isDark={isDark} />
      <ServicesSection isDark={isDark} />
      <CompanyAboutSection isDark={isDark} />
      <TeamSection isDark={isDark} />
      <FaqSection isDark={isDark} />
      <ContactSection isDark={isDark} />
      <PortalTeaserSection isDark={isDark} />
      <FooterSection isDark={isDark} />
    </div>
  )
}
