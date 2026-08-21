import { CheckCircle2, TrendingUp, DollarSign, PackageCheck } from 'lucide-react'

export function Bi2BCasesSection() {
  const cases = [
    {
      segment: 'Distribuidora de Peças Automotivas',
      city: 'Palmas/TO',
      tag: 'Giro de Estoque',
      metric1: { val: '+34%', label: 'lucro líquido' },
      metric2: { val: 'R$ 142.000', label: 'estoque destravado' },
      description:
        'Identificação de 38 itens sem giro há mais de 120 dias e compras alinhadas estritamente à curva ABC de vendas reais.',
      icon: PackageCheck,
    },
    {
      segment: 'Supermercado & Varejo',
      city: 'Araguaína/TO',
      tag: 'Margem & Preço',
      metric1: { val: '+21%', label: 'margem bruta' },
      metric2: { val: '-18%', label: 'custo operacional' },
      description:
        'Correção de precificação em itens de alto volume que eram vendidos com margem negativa sem o dono perceber.',
      icon: TrendingUp,
    },
    {
      segment: 'Materiais de Construção',
      city: 'Palmas/TO',
      tag: 'Fluxo de Caixa',
      metric1: { val: 'R$ 215.000', label: 'caixa recuperado' },
      metric2: { val: '60 dias', label: 'previsibilidade' },
      description:
        'Implantação de fluxo projetado com antecedência e eliminação de antecipações caras de recebíveis.',
      icon: DollarSign,
    },
  ]

  return (
    <section id="cases" className="bi2b-section bi2b-on-primary relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(80% 50% at 50% 0%, rgba(255,255,255,0.06), transparent 70%)',
        }}
      />

      <div className="bi2b-wrap relative z-10">
        <div className="text-left md:text-center max-w-3xl md:mx-auto mb-11">
          <span className="bi2b-eyebrow bi2b-reveal mb-3">Casos reais</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 mb-3 leading-tight font-heading">
            Não é teoria. É resultado no comércio real.
          </h2>
          <p className="bi2b-lead bi2b-reveal text-base sm:text-lg text-[#AEC3CE] max-w-[52ch] md:mx-auto">
            Resultados mensurados em empresas que saíram do achismo e passaram a decidir com números na tela.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c, idx) => {
            const Icon = c.icon
            return (
              <div
                key={idx}
                className="bg-[#0A465F] border border-white/15 rounded-[18px] p-6 sm:p-7 bi2b-reveal flex flex-col justify-between hover:border-white/30 transition-all hover:-translate-y-1 shadow-lg shadow-[#083A50]/40"
              >
                <div>
                  {/* Segment & City Header */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <span className="font-mono text-[0.72rem] text-[#AEC3CE] tracking-wider uppercase block font-semibold">
                        {c.city}
                      </span>
                      <h3 className="text-white font-bold text-base sm:text-lg font-heading leading-tight mt-0.5">
                        {c.segment}
                      </h3>
                    </div>
                    <span className="shrink-0 p-2 rounded-lg bg-white/10 text-white">
                      <Icon className="w-4 h-4 text-[#AEC3CE]" />
                    </span>
                  </div>

                  {/* Metrics Block */}
                  <div className="grid grid-cols-2 gap-3 py-4 my-2 border-y border-white/10">
                    <div>
                      <div className="font-mono font-bold text-2xl sm:text-3xl text-white leading-none tracking-tight">
                        {c.metric1.val}
                      </div>
                      <small className="font-mono text-[0.72rem] text-[#AEC3CE] uppercase tracking-wider block mt-1">
                        {c.metric1.label}
                      </small>
                    </div>

                    <div>
                      <div className="font-mono font-bold text-2xl sm:text-3xl text-white leading-none tracking-tight">
                        {c.metric2.val}
                      </div>
                      <small className="font-mono text-[0.72rem] text-[#AEC3CE] uppercase tracking-wider block mt-1">
                        {c.metric2.label}
                      </small>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#D4E1E7] text-sm leading-relaxed mt-3">
                    {c.description}
                  </p>
                </div>

                {/* Footer Tag */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-[#AEC3CE]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider">
                    Foco: {c.tag}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <span className="font-mono text-[0.74rem] text-[#AEC3CE] tracking-wider">
            // Métricas validadas através dos relatórios gerenciais e fechamentos contábeis mensais
          </span>
        </div>
      </div>
    </section>
  )
}
