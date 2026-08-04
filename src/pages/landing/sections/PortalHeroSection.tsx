import { cn } from '@/lib/utils'
import { getClientSubdomainUrl } from '@/utils/subdomain'
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

interface PortalHeroSectionProps {
  isDark?: boolean
}

export function PortalHeroSection({ isDark }: PortalHeroSectionProps) {
  const handleAccessPortal = () => {
    window.location.href = getClientSubdomainUrl('/')
  }

  const scrollToContact = () => {
    const el = document.querySelector('#contato')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center my-auto w-full">
        {/* Top Badge Estático */}
        <div
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[#0d6084] dark:text-cyan-300 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest shadow-sm mb-4 sm:mb-6"
        >
          Guia Exclusivo da Plataforma Bi2B
        </div>

        {/* Title Estático */}
        <h1
          className={cn(
            'text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight font-sans text-balance max-w-4xl',
            isDark ? 'text-white' : 'text-slate-900'
          )}
        >
          Tudo Sobre o{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
            Painel do Cliente Bi2B
          </span>
        </h1>

        {/* Subtitle Estático */}
        <p
          className={cn(
            'mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-4xl font-normal text-balance',
            isDark ? 'text-slate-300' : 'text-slate-600'
          )}
        >
          Conheça em detalhes como nossa plataforma centraliza seus impostos, balancetes, cadastro de colaboradores e solicitações contábeis de forma simples, segura e 100% digital.
        </p>

        {/* Action Buttons Estáticos */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={handleAccessPortal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] border border-cyan-400/30 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-md cursor-pointer"
          >
            <Lock className="w-4 h-4 text-cyan-300" />
            Entrar no Painel do Cliente
          </button>

          <button
            onClick={scrollToContact}
            className={cn(
              'w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border cursor-pointer shadow-sm',
              isDark
                ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20'
                : 'bg-cyan-50 border-cyan-300 text-[#0d6084] hover:bg-cyan-100'
            )}
          >
            <span>Dúvidas Sobre o Painel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Badges Estáticos */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Ambiente Seguro
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            Conformidade LGPD
          </span>
        </div>
      </div>
    </section>
  )
}
