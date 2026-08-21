import { CheckCircle2, ShieldCheck } from 'lucide-react'

export function Bi2BObjectionSection() {
  return (
    <section className="py-12 sm:py-16 bi2b-on-light">
      <div className="bi2b-wrap">
        <div className="bg-[#0B4F6C] text-[#EAF2F6] rounded-[22px] p-8 sm:p-12 md:p-14 relative overflow-hidden bi2b-reveal shadow-xl shadow-[#083A50]/30 border border-white/15">
          {/* Decorative radial overlay */}
          <div
            className="absolute -right-10 -top-10 w-72 h-72 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 68%)',
            }}
          />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[0.7rem] uppercase tracking-wider font-semibold mb-4 border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transição com Zero Atrito</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-heading">
              Comece{' '}
              <span className="border-b-4 border-[#FF0000] pb-0.5 inline-block">
                sem trocar o seu contador atual.
              </span>
            </h2>
            
            <p className="text-[#D4E1E7] text-base sm:text-lg leading-relaxed mb-6">
              Você não precisa mexer em nada da sua contabilidade de rotina para ter a inteligência financeira funcionando. A gente entra pela análise dos seus números. Se no futuro fizer sentido unificar a contabilidade, a decisão é 100% sua.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Sem conflito com sua contabilidade
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Integração direta com o seu ERP
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
