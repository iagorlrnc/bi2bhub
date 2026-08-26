import { ArrowRight, CheckCircle2, Lock } from 'lucide-react'
import { getClientSubdomainUrl } from '@/utils/subdomain'

interface Bi2BFullWidthCtaSectionProps {
  onScheduleClick?: () => void
}

export function Bi2BFullWidthCtaSection({ onScheduleClick }: Bi2BFullWidthCtaSectionProps) {
  const handleClientLogin = () => {
    window.location.href = getClientSubdomainUrl('/')
  }

  return (
    <section id="agendar" className="py-20 sm:py-28 bg-[#041a24] text-white relative overflow-hidden">
      {/* Background Gradients & Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-r from-cyan-500/20 via-[#0d6084]/20 to-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-md p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#083A50] via-[#062837] to-[#041a24] border border-white/15 shadow-xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold text-xs uppercase tracking-widest">
              Transforme a Gestão do Seu Escritório
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight">
              Pronto para elevar seu escritório contábil ao{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-[#38bdf8] to-white bg-clip-text text-transparent">
                próximo nível?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#C5D7E0] leading-relaxed">
              Agende uma demonstração ao vivo com nossos especialistas e veja na prática como centralizar sua carteira de clientes, automatizar guias e garantir segurança total.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onScheduleClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-gradient-to-r from-cyan-400 to-[#0284c7] hover:from-cyan-300 hover:to-cyan-500 text-[#083A50] font-bold text-base shadow-lg shadow-cyan-500/25 hover:scale-[1.01] transition-all cursor-pointer"
              >
                <span>Agendar demonstração gratuita</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleClientLogin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-semibold text-base backdrop-blur-md transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 text-cyan-300" />
                <span>Acessar Portal do Cliente</span>
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm text-[#AEC3CE]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sem necessidade de cartão de crédito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Onboarding guiado personalizado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% em conformidade com a LGPD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
