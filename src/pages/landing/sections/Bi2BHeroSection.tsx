import { useState, useEffect } from 'react'

interface Bi2BHeroSectionProps {
  onScheduleClick?: () => void
  onPlansClick?: () => void
}

export function Bi2BHeroSection({
  onScheduleClick,
  onPlansClick,
}: Bi2BHeroSectionProps) {
  const [activeScan, setActiveScan] = useState(0)

  const scanDemos = [
    {
      id: 'SCAN 01',
      title: 'Diagnóstico de Estoque & Margem',
      badge: 'VAREJO DE AUTOPEÇAS',
      items: [
        {
          label: 'Estoque parado > 90 dias',
          sub: 'DINHEIRO PRESO NA PRATELEIRA',
          value: 'R$ 47.200',
          alert: true,
        },
        {
          label: 'Itens com margem negativa',
          sub: 'PREJUÍZO OCULTO POR VENDA',
          value: '12 itens',
          alert: true,
        },
        {
          label: 'Potencial recuperável / mês',
          sub: 'APÓS AJUSTE DE PREÇO E GIRO',
          value: '+R$ 14.800',
          alert: false,
        },
      ],
    },
    {
      id: 'SCAN 02',
      title: 'Previsibilidade de Fluxo & Caixa',
      badge: 'MATERIAL DE CONSTRUÇÃO',
      items: [
        {
          label: 'Incompatibilidade prazos D+30',
          sub: 'FALTA DE CAIXA PREVISTA EM 18 DIAS',
          value: 'R$ 38.500',
          alert: true,
        },
        {
          label: 'Taxa média de antecipação',
          sub: 'JUROS EVITÁVEIS POR MÊS',
          value: 'R$ 5.400',
          alert: true,
        },
        {
          label: 'Economia com fluxo projetado',
          sub: 'CAIXA PRESERVADO',
          value: '+R$ 64.800/ano',
          alert: false,
        },
      ],
    },
  ]

  // Auto cycle scan demo every 6s for dynamic live feel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScan((prev) => (prev === 0 ? 1 : 0))
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  const currentScan = scanDemos[activeScan]

  return (
    <section
      id="topo"
      className="relative overflow-hidden bi2b-on-primary"
      style={{
        background: 'linear-gradient(165deg, var(--bi2b-primary-900), var(--bi2b-primary) 60%, #0C5978)',
        paddingTop: 'clamp(24px, 3.5vw, 44px)',
        paddingBottom: 'clamp(50px, 7vw, 84px)',
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(90% 70% at 82% 6%, rgba(255,255,255,0.07), transparent 65%)',
        }}
      />

      <div className="bi2b-wrap relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 lg:gap-16 items-center pt-6 md:pt-10">
          {/* Left Column Content */}
          <div className="bi2b-reveal in text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-[0.7rem] uppercase tracking-wider font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF0000] shadow-[0_0_8px_1px_rgba(255,0,0,0.8)]" />
              <span>Inteligência Financeira para o Comércio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-[1.12] mb-5 tracking-tight font-heading">
              Seu comércio fatura bem. Mas você sabe,{' '}
              <span className="text-white border-b-4 border-[#FF0000] pb-0.5 inline-block">
                com números na mão
              </span>
              , se está dando lucro real?
            </h1>

            <p className="bi2b-lead text-[#AEC3CE] text-base sm:text-lg lg:text-xl leading-relaxed max-w-[42ch] mb-8">
              A Bi2B é o cérebro financeiro e contábil que o seu comércio precisa. Mostramos onde está sangrando seu caixa e sua margem para você parar de decidir no escuro.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-5">
              <a
                href="#agendar"
                onClick={(e) => {
                  if (onScheduleClick) {
                    e.preventDefault()
                    onScheduleClick()
                  }
                }}
                className="bi2b-btn bi2b-btn-primary group text-xs sm:text-sm py-3.5 px-6 shadow-lg shadow-[#083A50]/50"
              >
                <span>Agendar Diagnóstico Gratuito</span>
                <span className="bi2b-arrow text-lg leading-none">→</span>
              </a>

              <a
                href="#planos"
                onClick={(e) => {
                  if (onPlansClick) {
                    e.preventDefault()
                    onPlansClick()
                  }
                }}
                className="bi2b-btn bi2b-btn-ghost text-xs sm:text-sm py-3.5 px-5"
              >
                Ver os planos
              </a>
            </div>

            <div className="bi2b-resp-note text-[#AEC3CE] flex items-center gap-2">
              <span className="bi2b-pulse" />
              <span>Respondemos em até 2 horas úteis · Atendimento no Tocantins</span>
            </div>
          </div>

          {/* Right Column Interactive Scanner Panel */}
          <div className="bi2b-panel bi2b-reveal rounded-2xl shadow-2xl" aria-hidden="true">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="bi2b-eyebrow text-white before:bg-white/60 text-[0.7rem]">
                  Raio-X Financeiro
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveScan(0)}
                  className={`font-mono text-[0.66rem] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    activeScan === 0
                      ? 'bg-white text-[#083A50] border-white font-bold'
                      : 'text-[#AEC3CE] border-white/20 hover:border-white/40'
                  }`}
                >
                  DEMO 01
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScan(1)}
                  className={`font-mono text-[0.66rem] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    activeScan === 1
                      ? 'bg-white text-[#083A50] border-white font-bold'
                      : 'text-[#AEC3CE] border-white/20 hover:border-white/40'
                  }`}
                >
                  DEMO 02
                </button>
              </div>
            </div>

            <div className="text-left mb-2">
              <span className="font-mono text-[0.64rem] text-[#AEC3CE] uppercase tracking-wider block">
                SEGMENTO: {currentScan.badge}
              </span>
              <span className="text-xs font-bold text-white">
                {currentScan.title}
              </span>
            </div>

            <div className="space-y-0 divide-y divide-white/15">
              {currentScan.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3">
                  <div className="text-left">
                    <span className="block text-[0.88rem] text-[#DCE8EE] font-medium leading-tight">
                      {item.label}
                    </span>
                    <small className="font-mono text-[0.64rem] text-[#AEC3CE] tracking-wider uppercase block mt-0.5">
                      {item.sub}
                    </small>
                  </div>
                  <div
                    className={`bi2b-readout text-lg sm:text-xl font-bold ${
                      item.alert
                        ? 'text-[#FF4B3E] drop-shadow-[0_0_12px_rgba(255,0,0,0.35)]'
                        : 'text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]'
                    }`}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[0.66rem] text-[#AEC3CE]">
              <span>// Simulação interativa baseada em dados reais</span>
              <span className="text-emerald-300 font-bold">● ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
