import { useState } from 'react'
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

interface Bi2BPricingSectionProps {
  onScheduleClick?: () => void
}

export function Bi2BPricingSection({
  onScheduleClick,
}: Bi2BPricingSectionProps) {
  // mode: 'sem' (sem contador / mantendo contador atual) | 'com' (com contador)
  const [mode, setMode] = useState<'sem' | 'com'>('sem')

  const plans = [
    {
      name: 'Essencial',
      badgeSubtitle: 'ENXERGUE SEU CAIXA',
      priceSem: 'R$ 1.200',
      priceCom: 'R$ 2.100',
      description:
        'Para quem quer saber, com antecedência, quando o dinheiro vai faltar e se preparar antes do aperto.',
      isPopular: false,
      features: [
        'Painel vivo de fluxo de caixa diário e projetado',
        'Previsão de contas a pagar e receber',
        'Relatório mensal de diagnóstico de caixa',
        'Acesso ao Portal do Cliente Bi2B',
        'Suporte por e-mail e WhatsApp',
      ],
    },
    {
      name: 'Gestão',
      badgeSubtitle: 'CRESÇA COM MARGEM',
      priceSem: 'R$ 2.000',
      priceCom: 'R$ 2.900',
      description:
        'Tudo do Essencial + giro de estoque e margem. Compre só o necessário, gire o que está parado e corrija o preço.',
      isPopular: true,
      popularBadge: 'O mais escolhido',
      features: [
        'Tudo do Plano Essencial',
        'Análise de giro e dias de estoque parado',
        'Cálculo de margem real por produto e categoria',
        'Identificação de produtos com margem negativa',
        'Reunião estratégica mensal presencial ou online',
        'SLA prioritário de atendimento em 2h úteis',
      ],
    },
    {
      name: 'Estratégico',
      badgeSubtitle: 'DECIDA À FRENTE DA REFORMA',
      priceSem: 'R$ 3.500',
      priceCom: 'R$ 4.400',
      description:
        'Tudo do Gestão + planejamento tributário na Reforma: de quem comprar, para quem vender e o impacto no caixa.',
      isPopular: false,
      features: [
        'Tudo do Plano Gestão',
        'Planejamento tributário para a Reforma Tributária',
        'Simulações de impacto de compras interestaduais',
        'DRE gerencial comparativo trimestral e anual',
        'Reunião estratégica quinzenal com contadores sócios',
        'Canal VIP direto com a diretoria Bi2B',
      ],
    },
  ]

  return (
    <section id="planos" className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <div className="text-center mb-6">
          <span className="bi2b-eyebrow bi2b-reveal mx-auto mb-2.5">Planos</span>
          <h2 className="text-2xl sm:text-3xl md:text-[2.4rem] font-bold text-[#0C1E28] mb-2 leading-tight font-heading">
            Escolha o nível de clareza que o seu momento pede.
          </h2>
          <p className="bi2b-lead bi2b-reveal text-base sm:text-lg text-[#59707B] max-w-[46ch] mx-auto mb-8">
            Todos os planos são recorrentes, modulares e crescem junto com o seu comércio.
          </p>
        </div>

        {/* Toggle de Preços */}
        <div className="text-center mb-12 bi2b-reveal">
          <div
            className="inline-flex bg-white border border-[#0B4F6C]/15 rounded-full p-1.5 gap-1 shadow-sm"
            role="group"
            aria-label="Mostrar planos com ou sem contabilidade"
          >
            <button
              type="button"
              onClick={() => setMode('sem')}
              className={`font-heading font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-full transition-all duration-200 cursor-pointer ${
                mode === 'sem'
                  ? 'bg-[#0B4F6C] text-white shadow-sm'
                  : 'bg-transparent text-[#59707B] hover:text-[#0B4F6C]'
              }`}
              aria-pressed={mode === 'sem'}
            >
              Sem contador (Inteligência Financeira)
            </button>
            <button
              type="button"
              onClick={() => setMode('com')}
              className={`font-heading font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-full transition-all duration-200 cursor-pointer ${
                mode === 'com'
                  ? 'bg-[#0B4F6C] text-white shadow-sm'
                  : 'bg-transparent text-[#59707B] hover:text-[#0B4F6C]'
              }`}
              aria-pressed={mode === 'com'}
            >
              Com contador (Tudo Incluso)
            </button>
          </div>

          <div className="mt-3 font-mono text-[0.74rem] text-[#59707B]">
            {mode === 'com'
              ? '✓ Contabilidade completa registrada no CRC + inteligência financeira mensal'
              : '✓ Mantendo o seu contador atual · agregamos a inteligência e os painéis de decisão'}
          </div>
        </div>

        {/* Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, idx) => {
            const isFeatured = plan.isPopular
            return (
              <div
                key={idx}
                className={`bg-white rounded-[18px] p-7 sm:p-8 flex flex-col justify-between bi2b-reveal transition-all duration-300 ${
                  isFeatured
                    ? 'border-2 border-[#0B4F6C] shadow-[0_24px_60px_-25px_rgba(11,79,108,0.45)] relative md:-translate-y-2'
                    : 'border border-[#0B4F6C]/15 shadow-sm hover:shadow-md hover:border-[#0B4F6C]/30'
                }`}
              >
                {/* Popular Pill */}
                {isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0B4F6C] text-white font-mono text-[0.66rem] font-bold tracking-wider py-1.5 px-3.5 rounded-full uppercase whitespace-nowrap shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#FF0000]" />
                    <span>{plan.popularBadge}</span>
                  </span>
                )}

                <div>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#0C1E28]">
                    {plan.name}
                  </h3>
                  
                  <div className="font-mono text-[0.74rem] text-[#0B4F6C] font-semibold tracking-wider my-2 uppercase">
                    {plan.badgeSubtitle}
                  </div>

                  {/* Price */}
                  <div className="my-4 flex items-baseline gap-1.5 flex-wrap">
                    <small className="font-mono text-[0.72rem] text-[#59707B] tracking-wider">
                      a partir de
                    </small>
                    <strong className="font-mono text-3xl sm:text-4xl font-bold text-[#0B4F6C]">
                      {mode === 'sem' ? plan.priceSem : plan.priceCom}
                    </strong>
                    <span className="text-[#59707B] text-sm font-medium">/mês</span>
                  </div>

                  <div className="font-mono text-[0.72rem] text-[#59707B] mb-5 pb-3 border-b border-[#0B4F6C]/10">
                    + implantação e conexão de dados (sob medida)
                  </div>

                  <p className="text-[#59707B] text-sm leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#0B4F6C] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#0C1E28] leading-tight">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Button */}
                <a
                  href="#agendar"
                  onClick={(e) => {
                    if (onScheduleClick) {
                      e.preventDefault()
                      onScheduleClick()
                    }
                  }}
                  className={`w-full py-3.5 px-4 rounded-full font-heading font-bold text-xs sm:text-sm tracking-wide text-center flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFeatured
                      ? 'bg-[#0B4F6C] text-white hover:bg-[#083A50] shadow-md shadow-[#0B4F6C]/20'
                      : 'bg-[#FAFAFA] border border-[#0B4F6C]/20 text-[#0B4F6C] hover:bg-[#0B4F6C] hover:text-white'
                  }`}
                >
                  <span>Agendar Diagnóstico</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 bg-white border border-[#0B4F6C]/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto text-center sm:text-left bi2b-reveal shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <div className="font-heading font-bold text-sm text-[#0C1E28]">
                Sem fidelidade abusiva ou burocracia
              </div>
              <div className="text-xs text-[#59707B]">
                Você permanece na Bi2B pelos resultados que vê todo mês, não por contrato travado.
              </div>
            </div>
          </div>
          <a
            href="#agendar"
            onClick={(e) => {
              if (onScheduleClick) {
                e.preventDefault()
                onScheduleClick()
              }
            }}
            className="text-xs font-heading font-bold text-[#0B4F6C] hover:underline whitespace-nowrap"
          >
            Tirar dúvidas sobre os planos →
          </a>
        </div>
      </div>
    </section>
  )
}
