import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { getClientSubdomainUrl } from '@/utils/subdomain'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  FileText,
  Lock,
} from 'lucide-react'
import logoImg from '@/assets/logo.png'
import logoAzulImg from '@/assets/logoazul.png'

interface PortalOriginalHeroSectionProps {
  isDark?: boolean
}

export function PortalOriginalHeroSection({ isDark }: PortalOriginalHeroSectionProps) {
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()
  const isDarkTheme = isDark ?? resolvedTheme === 'dark'
  const currentLogo = isDarkTheme ? logoImg : logoAzulImg

  const handleClientLogin = () => {
    window.location.href = getClientSubdomainUrl('/')
  }

  const scrollToFeatures = () => {
    const el = document.querySelector('#como-funciona')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 md:px-8 overflow-hidden">
      {/* Background Accent Lights */}
      <div
        className={cn(
          'absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[170px] pointer-events-none -z-10',
          isDarkTheme
            ? 'bg-gradient-to-tr from-cyan-500/20 via-[#0d6084]/25 to-transparent'
            : 'bg-gradient-to-tr from-[#0d6084]/10 via-cyan-400/20 to-transparent'
        )}
      />

      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center my-auto w-full">
        {/* Top Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold text-xs uppercase tracking-widest mb-6 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-cyan-500" />
          Tecnologia & Gestão para Clientes Bi2B
        </div>

        {/* Logo */}
        <div className="mb-4">
          <img
            src={currentLogo}
            alt="Bi2B Consultoria"
            className="h-14 sm:h-16 md:h-20 w-auto object-contain filter drop-shadow-[0_10px_25px_rgba(13,96,132,0.4)]"
          />
        </div>

        {/* Main Headline */}
        <h1
          className={cn(
            'text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.12] tracking-tight font-sans text-balance max-w-4xl',
            isDarkTheme ? 'text-white' : 'text-slate-900'
          )}
        >
          O Seu Hub Digital de{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
            Gestão Contábil e Financeira
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={cn(
            'mt-6 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl font-normal text-balance',
            isDarkTheme ? 'text-slate-300' : 'text-slate-600'
          )}
        >
          Acesse a qualquer hora suas guias de impostos, balancetes gerenciais, movimentação de tarefas, certidões e canal direto com seu contador em uma plataforma ágil e intuitiva.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleClientLogin}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] border border-cyan-400/40 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_10px_35px_rgba(13,96,132,0.4)] cursor-pointer"
          >
            <Lock className="w-4 h-4 text-cyan-300" />
            Acessar o Portal do Cliente
          </button>

          <button
            onClick={scrollToFeatures}
            className={cn(
              'w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-full border cursor-pointer',
              isDarkTheme
                ? 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10 hover:text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-[#0d6084]'
            )}
          >
            <span>Ver Como Funciona</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {[
            { icon: LayoutDashboard, label: 'Dashboards em Tempo Real' },
            { icon: FileText, label: 'Gestão de Guias e Impostos' },
            { icon: Zap, label: 'Abertura de Chamados Rápidos' },
            { icon: ShieldCheck, label: 'Segurança Criptografada SSL' },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className={cn(
                  'p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 backdrop-blur-md',
                  isDarkTheme
                    ? 'bg-white/5 border-white/10 text-slate-300'
                    : 'bg-white/80 border-slate-200 text-slate-700 shadow-sm'
                )}
              >
                <Icon className="w-4 h-4 text-cyan-500 shrink-0" />
                <span className="text-xs font-semibold">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
