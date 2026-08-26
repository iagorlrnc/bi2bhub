import { CountUpNumber } from '../components/CountUpNumber'

interface Bi2BHeroSectionProps {
  onScheduleClick?: () => void
  onHowItWorksClick?: () => void
}

export function Bi2BHeroSection({ onScheduleClick, onHowItWorksClick }: Bi2BHeroSectionProps) {
  const metrics = [
    {
      value: 142,
      prefix: 'R$ ',
      suffix: ' mil',
      label: 'Caixa Médio Recuperado',
      subtext: 'em estoques parados identificados',
    },
    {
      value: 6.2,
      prefix: '+',
      suffix: ' p.p.',
      decimals: 1,
      label: 'Aumento de Margem',
      subtext: 'após cortes de itens deficitários',
    },
    {
      value: 100,
      prefix: '',
      suffix: '%',
      label: 'Contadores Registrados',
      subtext: 'equipe técnica certificada CRC',
    },
    {
      value: 2,
      prefix: '< ',
      suffix: ' horas',
      label: 'Tempo de Resposta',
      subtext: 'atendimento ágil no horário comercial',
    },
  ]

  return (
    <section
      id="topo"
      className="hero on-primary relative pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#083A50] via-[#0B4F6C] to-[#0C5978] text-white"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(90% 70% at 82% 6%, rgba(255,255,255,0.06), transparent 60%)',
        }}
      />

      <div className="wrap relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pb-12 sm:pb-16">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <span className="eyebrow" style={{ color: '#AEC3CE' }}>
              Inteligência Financeira para Comércio
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.12] font-heading">
              Seu comércio fatura bem. Mas você sabe,{' '}
              <span className="hl">com números na mão</span>, se está dando lucro?
            </h1>

            <p className="lead text-[#DCE8EE] text-base sm:text-lg md:text-xl max-w-[48ch] leading-relaxed">
              A Bi2B é o cérebro financeiro que o seu comércio precisa e não tem como contratar. A gente mostra onde está sangrando seu caixa e sua margem — para você parar de decidir no escuro.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <a
                href="#agendar"
                onClick={(e) => {
                  e.preventDefault()
                  onScheduleClick?.()
                }}
                className="btn btn-primary bg-white text-[#0B4F6C] hover:bg-[#FAFAFA] text-sm sm:text-base font-semibold"
              >
                <span>Agende seu diagnóstico gratuito</span>
                <span className="arrow">→</span>
              </a>

              <a
                href="#planos"
                onClick={(e) => {
                  e.preventDefault()
                  onHowItWorksClick?.()
                }}
                className="btn btn-ghost text-sm sm:text-base font-semibold"
              >
                <span>Ver os planos</span>
              </a>
            </div>

            {/* Response Note with Pulsing Red Dot */}
            <div className="pt-2">
              <span className="resp-note">
                <span className="pulse" />
                <span>Respondemos em até 2 horas úteis</span>
              </span>
            </div>
          </div>

          {/* Right Column: Raio-X Financeiro Scanner Panel */}
          <div className="lg:col-span-5">
            <div className="panel relative overflow-hidden">
              <div className="panel-head">
                <span className="eyebrow text-white">
                  Raio-X Financeiro
                </span>
                <span className="panel-tag">SCAN 01</span>
              </div>

              <div className="space-y-1">
                <div className="row">
                  <div className="row-label">
                    <span>Estoque parado &gt; 90 dias</span>
                    <small>DINHEIRO PRESO NA PRATELEIRA</small>
                  </div>
                  <div className="fig risk readout">R$ 47.200</div>
                </div>

                <div className="row">
                  <div className="row-label">
                    <span>Itens vendidos abaixo do custo</span>
                    <small>PREJUÍZO INVISÍVEL</small>
                  </div>
                  <div className="fig risk readout">12 itens</div>
                </div>

                <div className="row">
                  <div className="row-label">
                    <span>Potencial recuperável / mês</span>
                    <small>APÓS AJUSTES</small>
                  </div>
                  <div className="fig pos readout">R$ 12.400</div>
                </div>
              </div>

              <div className="panel-foot">leitura ilustrativa · exemplo real</div>
            </div>
          </div>
        </div>

        {/* Counters Strip */}
        <div className="pt-10 border-t border-white/15">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {metrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white font-mono tracking-tight flex items-center justify-center">
                  <CountUpNumber
                    end={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    decimals={metric.decimals || 0}
                  />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white font-heading">
                  {metric.label}
                </div>
                <div className="text-[11px] sm:text-xs text-[#AEC3CE] font-mono">
                  {metric.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
