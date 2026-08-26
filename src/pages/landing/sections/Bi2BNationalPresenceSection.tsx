import { useState } from 'react'
import { MapPin, Building2, Users } from 'lucide-react'

export function Bi2BNationalPresenceSection() {
  const [selectedRegion, setSelectedRegion] = useState<number>(0)

  const regions = [
    {
      name: 'Região Sudeste',
      states: 'SP, MG, RJ, ES',
      offices: '74 escritórios',
      clients: '+22.400 empresas ativas',
      highlight: 'Maior polo de contabilidade digital e BPO financeiro',
      cities: ['São Paulo', 'Belo Horizonte', 'Rio de Janeiro', 'Campinas', 'Vitória'],
    },
    {
      name: 'Região Sul',
      states: 'PR, SC, RS',
      offices: '38 escritórios',
      clients: '+11.800 empresas ativas',
      highlight: 'Forte presença em empresas de tecnologia e agronegócio',
      cities: ['Curitiba', 'Florianópolis', 'Porto Alegre', 'Maringá', 'Joinville'],
    },
    {
      name: 'Região Centro-Oeste',
      states: 'DF, GO, MT, MS',
      offices: '24 escritórios',
      clients: '+6.500 empresas ativas',
      highlight: 'Hubs contábeis para distribuidoras e serviços corporativos',
      cities: ['Brasília', 'Goiânia', 'Cuiabá', 'Campo Grande', 'Anápolis'],
    },
    {
      name: 'Região Nordeste',
      states: 'BA, PE, CE, RN, PB...',
      offices: '16 escritórios',
      clients: '+4.300 empresas ativas',
      highlight: 'Crescimento acelerado em consultorias tributárias e comércio',
      cities: ['Salvador', 'Recife', 'Fortaleza', 'Natal', 'João Pessoa'],
    },
    {
      name: 'Região Norte',
      states: 'PA, AM, TO, RO...',
      offices: '8 escritórios',
      clients: '+1.900 empresas ativas',
      highlight: 'Soluções integradas para polos industriais e logística',
      cities: ['Manaus', 'Belém', 'Palmas', 'Porto Velho'],
    },
  ]

  const active = regions[selectedRegion]

  return (
    <section className="py-24 sm:py-32 bg-[#083A50] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold text-xs uppercase tracking-widest mb-4">
            Presença Nacional
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight mb-6">
            Conectando escritórios em todas as{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-[#38bdf8] to-white bg-clip-text text-transparent">
              regiões do Brasil
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#C5D7E0] leading-relaxed">
            Nossa infraestrutura em nuvem de alta disponibilidade atende escritórios de ponta a ponta no território nacional.
          </p>
        </div>

        {/* Interactive Region Selector & Visual Stats Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Region Buttons */}
          <div className="lg:col-span-5 space-y-2.5">
            {regions.map((reg, idx) => {
              const isSelected = selectedRegion === idx

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedRegion(idx)}
                  className={`w-full text-left p-4 rounded-md border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#062837] border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400/30 scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2 rounded-sm transition-colors ${
                        isSelected ? 'bg-cyan-400 text-[#083A50]' : 'bg-white/10 text-cyan-300'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {reg.name}
                      </h4>
                      <span className="text-xs text-slate-300 font-mono">
                        {reg.states}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-300 block">
                      {reg.offices}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right: Selected Region Detailed Card */}
          <div className="lg:col-span-7">
            <div className="rounded-md p-1 bg-gradient-to-br from-cyan-400/30 via-white/10 to-transparent shadow-xl">
              <div className="rounded-sm bg-[#041a24] p-5 sm:p-7 border border-white/10 space-y-5">
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase block">
                      DADOS DA REGIÃO
                    </span>
                    <h3 className="text-xl font-bold text-white font-heading mt-0.5">
                      {active.name} ({active.states})
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    Radar Ativo
                  </span>
                </div>

                {/* 2-Column Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-sm bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-300 text-xs mb-1">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span>Escritórios Parceiros</span>
                    </div>
                    <div className="text-xl font-black text-white font-heading">
                      {active.offices}
                    </div>
                  </div>

                  <div className="p-4 rounded-sm bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-300 text-xs mb-1">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>Empresas Atendidas</span>
                    </div>
                    <div className="text-xl font-black text-cyan-300 font-heading">
                      {active.clients}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-sm bg-cyan-500/10 border border-cyan-400/20">
                  <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono mb-1">
                    Foco Estratégico na Região:
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {active.highlight}
                  </p>
                </div>

                {/* Main Cities Tags */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                    Principais Polos Atendidos:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {active.cities.map((city, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-xs px-2.5 py-0.5 rounded-sm bg-white/5 border border-white/10 text-slate-200 font-medium"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
