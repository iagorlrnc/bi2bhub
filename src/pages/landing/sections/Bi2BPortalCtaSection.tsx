import { getClientSubdomainUrl } from '@/utils/subdomain'
import { Lock, MessageCircle } from 'lucide-react'

export function Bi2BPortalCtaSection() {
  const handleDirectLogin = () => {
    window.location.href = getClientSubdomainUrl('/')
  }

  const handleWhatsapp = () => {
    const msg = encodeURIComponent('Olá! Gostaria de saber mais sobre o Portal do Cliente e os planos da Bi2B Consultoria.')
    window.open(`https://wa.me/5599999999999?text=${msg}`, '_blank')
  }

  return (
    <section id="contato" className="bi2b-section bi2b-on-primary relative overflow-hidden" style={{
      background: 'linear-gradient(165deg, var(--bi2b-primary-900), var(--bi2b-primary) 60%, #0C5978)'
    }}>
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(80% 60% at 50% 50%, rgba(255,255,255,0.06), transparent 70%)',
        }}
      />

      <div className="bi2b-wrap relative z-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-mono text-[0.72rem] font-semibold tracking-widest uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FF0000] shadow-[0_0_8px_1px_rgba(255,0,0,0.8)]" />
          <span>Acesso Imediato &amp; Suporte</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-heading">
          Pronto para transformar a gestão fiscal do seu comércio?
        </h2>

        <p className="bi2b-lead text-[#AEC3CE] text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-[48ch] mx-auto">
          Acesse agora o Portal do Cliente Bi2B ou fale com nossos especialistas para entender como nossa consultoria pode proteger seu caixa e margem.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={handleDirectLogin}
            className="bi2b-btn bi2b-btn-primary py-4 px-8 text-sm sm:text-base shadow-xl shadow-[#083A50]/60 cursor-pointer font-bold"
          >
            <Lock className="w-4 h-4 text-white" />
            <span>Entrar no Portal do Cliente</span>
            <span className="bi2b-arrow text-lg leading-none">→</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsapp}
            className="bi2b-btn bi2b-btn-ghost py-4 px-6 text-sm sm:text-base cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Falar com um Consultor</span>
          </button>
        </div>

        <div className="bi2b-resp-note text-[#AEC3CE] flex items-center justify-center gap-2">
          <span className="bi2b-pulse" />
          <span>Atendimento direto por contadores registrados no Tocantins</span>
        </div>
      </div>
    </section>
  )
}
