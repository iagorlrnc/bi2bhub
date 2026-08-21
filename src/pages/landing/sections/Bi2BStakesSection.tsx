import { XCircle } from 'lucide-react'

export function Bi2BStakesSection() {
  const risks = [
    'Faturamento crescendo na vitrine enquanto o lucro encolhe no banco',
    'Ser pego despreparado pelo novo modelo da Reforma Tributária',
    'Trabalhar 14 horas por dia sem sobrar dinheiro para retirada',
    'Descobrir rombos e sangrias quando a empresa já está endividada',
  ]

  return (
    <section className="bi2b-section bi2b-on-primary border-t border-white/10 relative overflow-hidden">
      <div className="bi2b-wrap relative z-10">
        <div className="max-w-3xl">
          <span className="bi2b-eyebrow bi2b-reveal mb-3">O que está em jogo</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 mb-5 leading-tight font-heading">
            O custo invisível de continuar decidindo no escuro.
          </h2>
          <p className="text-[#D4E1E7] text-base sm:text-lg leading-relaxed bi2b-reveal mb-8">
            A maioria dos empresários do comércio só percebe o problema quando o fluxo de caixa trava ou o banco nega crédito.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 bi2b-reveal">
            {risks.map((risk, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3"
              >
                <XCircle className="w-5 h-5 text-[#FF4B3E] shrink-0 mt-0.5" />
                <span className="text-sm text-[#E4EDF1] leading-relaxed">
                  {risk}
                </span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-[#FF0000]/10 border border-[#FF0000]/30 bi2b-reveal">
            <p className="text-white text-base sm:text-lg leading-relaxed font-medium">
              O pior dos cenários não é fechar as portas — é{' '}
              <strong className="text-[#FF6B5E] font-bold">
                fechar sem nunca ter enxergado que dava para corrigir a tempo
              </strong>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
