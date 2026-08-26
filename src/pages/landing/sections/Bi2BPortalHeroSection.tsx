import { useState, useEffect } from 'react'
import { getClientSubdomainUrl } from '@/utils/subdomain'
import { Lock } from 'lucide-react'

interface Bi2BPortalHeroSectionProps {
  onModulesClick?: () => void
}

export function Bi2BPortalHeroSection({ onModulesClick }: Bi2BPortalHeroSectionProps) {
  const [activeScan, setActiveScan] = useState(0)

  const scanDemos = [
    {
      id: 'SCAN 01',
      title: 'Rotina Fiscal & Tributos',
      badge: 'CENTRAL DE GUIAS',
      items: [
        {
          label: 'Guias de Impostos do Mês',
          sub: 'DAS, ISS, FGTS DISPONÍVEIS',
          value: '4/4 Baixadas',
          alert: false,
        },
        {
          label: 'Multas e Juros Evitados',
          sub: 'ALERTAS ANTES DO VENCIMENTO',
          value: 'R$ 0,00',
          alert: false,
        },
        {
          label: 'Tempo de Resposta CRC',
          sub: 'ATENDIMENTO MÉDIO POR CHAMADO',
          value: '28 min',
          alert: false,
        },
      ],
    },
    {
      id: 'SCAN 02',
      title: 'Bi2B Drive Cloud & CNDs',
      badge: 'DOCUMENTOS 24H',
      items: [
        {
          label: 'Certidões Negativas (CNDs)',
          sub: 'FEDERAL, ESTADUAL E MUNICIPAL',
          value: '100% Regular',
          alert: false,
        },
        {
          label: 'Arquivos em Nuvem Segura',
          sub: 'CONTRATOS, FOLHAS E BALANCETES',
          value: '142 docs',
          alert: false,
        },
        {
          label: 'Economia Operacional / Mês',
          sub: 'ELIMINAÇÃO DE ENVIOS MANUAIS',
          value: '+23.5 horas',
          alert: false,
        },
      ],
    },
  ]

  // Auto cycle scan demo every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScan((prev) => (prev === 0 ? 1 : 0))
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  const currentScan = scanDemos[activeScan]

  const handleAccessPortal = () => {
    window.location.href = getClientSubdomainUrl('/')
  }

  return (
    <section
      id="topo"
      className="relative overflow-hidden bi2b-on-primary"
      style={{
        background: 'linear-gradient(165deg, var(--bi2b-primary-900), var(--bi2b-primary) 60%, #0C5978)',
        paddingTop: 'clamp(92px, 10vw, 120px)',
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
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-12 lg:gap-16 items-center pt-2 md:pt-4">
          {/* Left Column Content */}
          <div className="bi2b-reveal in text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-[0.7rem] uppercase tracking-wider font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF0000] shadow-[0_0_8px_1px_rgba(255,0,0,0.8)]" />
              <span>Tecnologia &amp; Plataforma · Portal do Cliente Bi2B</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-[1.12] mb-5 tracking-tight font-heading">
              Tudo sobre o{' '}
              <span className="text-white border-b-4 border-[#FF0000] pb-0.5 inline-block">
                Portal do Cliente
              </span>{' '}
              Bi2B.
            </h1>

            <p className="bi2b-lead text-[#AEC3CE] text-base sm:text-lg lg:text-xl leading-relaxed max-w-[44ch] mb-8">
              Centralize guias de impostos, balancetes contábeis, arquivos na nuvem e suporte com contadores especialistas em uma plataforma moderna, segura e 100% digital.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-5">
              <button
                type="button"
                onClick={handleAccessPortal}
                className="bi2b-btn bi2b-btn-primary group text-xs sm:text-sm py-3.5 px-6 shadow-lg shadow-[#083A50]/50 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>Entrar no Painel do Cliente</span>
                <span className="bi2b-arrow text-lg leading-none">→</span>
              </button>

              <a
                href="#modulos"
                onClick={(e) => {
                  if (onModulesClick) {
                    e.preventDefault()
                    onModulesClick()
                  }
                }}
                className="bi2b-btn bi2b-btn-ghost text-xs sm:text-sm py-3.5 px-5 cursor-pointer"
              >
                Ver Módulos &amp; Recursos
              </a>
            </div>

            <div className="bi2b-resp-note text-[#AEC3CE] flex items-center gap-2">
              <span className="bi2b-pulse" />
              <span>SLA de resposta contábil em até 2 horas úteis · Criptografia 256-bit &amp; LGPD</span>
            </div>
          </div>

          {/* Right Column Interactive Scanner Panel */}
          <div className="bi2b-panel bi2b-reveal rounded-2xl shadow-2xl" aria-hidden="true">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="bi2b-eyebrow text-white before:bg-white/60 text-[0.7rem]">
                  Status da Empresa
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
                MÓDULO: {currentScan.badge}
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
              <span className="text-emerald-300 font-bold">● SINCRONIZADO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
