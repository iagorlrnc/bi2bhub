import { ArrowRight, CheckCircle2, Play, Shield, Users, Layers, Activity } from 'lucide-react'
import { CountUpNumber } from '../components/CountUpNumber'

interface Bi2BHeroSectionProps {
  onScheduleClick?: () => void
  onHowItWorksClick?: () => void
}

export function Bi2BHeroSection({ onScheduleClick, onHowItWorksClick }: Bi2BHeroSectionProps) {
  const metrics = [
    {
      value: 150,
      prefix: '+',
      suffix: '',
      label: 'Escritórios Conectados',
      subtext: 'em mais de 18 estados',
    },
    {
      value: 45000,
      prefix: '+',
      suffix: '',
      label: 'Empresas Gerenciadas',
      subtext: 'com portal exclusivo',
    },
    {
      value: 99.9,
      prefix: '',
      suffix: '%',
      decimals: 1,
      label: 'Uptime & Confiabilidade',
      subtext: 'disponibilidade 24/7',
    },
    {
      value: 3800000,
      prefix: '+',
      suffix: '',
      label: 'Documentos & Guias',
      subtext: 'processados na nuvem',
    },
  ]

  const benefits = [
    'Ambiente multi-tenant com isolamento total de dados',
    'Automação de guias fiscais e alertas de vencimento',
    'Portal white-label com a marca do seu escritório',
  ]

  return (
    <section
      id="topo"
      className="relative min-h-[92vh] pt-32 sm:pt-36 md:pt-44 pb-20 sm:pb-28 overflow-hidden bg-[#083A50] text-white flex flex-col justify-between"
    >
      {/* Background Tech Gradients & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radial Center Glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#0ea5e9]/20 via-[#0d6084]/15 to-transparent rounded-full blur-3xl opacity-80" />
        
        {/* Lateral Glow Accents */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-48 w-96 h-96 bg-[#0284c7]/15 rounded-full blur-3xl" />

        {/* Subtle Geometric Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-400/25 bg-cyan-500/10 backdrop-blur-md text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide mb-6 sm:mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>PLATAFORMA SAAS MULTI-TENANT PARA ESCRITÓRIOS DE CONTABILIDADE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold text-white tracking-tight leading-[1.12] font-heading mb-6 sm:mb-8">
            A infraestrutura digital definitiva para{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-[#38bdf8] to-white bg-clip-text text-transparent">
              escritórios contábeis escalarem
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#C5D7E0] leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 font-normal">
            Centralize dezenas de clientes em um único portal white-label inteligente, elimine o caos do WhatsApp e entregue guias fiscais com pontualidade cirúrgica.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-10 sm:mb-12">
            <button
              onClick={onScheduleClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-gradient-to-r from-cyan-400 to-[#0284c7] hover:from-cyan-300 hover:to-cyan-500 text-[#083A50] font-bold text-base shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/30 hover:scale-[1.01] transition-all cursor-pointer"
            >
              <span>Agendar demonstração gratuita</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onHowItWorksClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-semibold text-base backdrop-blur-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-300 fill-cyan-300" />
              <span>Saiba como funciona</span>
            </button>
          </div>

          {/* 3 Key Benefits Bullets */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 pb-6 text-xs sm:text-sm text-[#AEC3CE]">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-medium text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Interactive SaaS UI Showcase Mockup */}
        <div className="mt-8 sm:mt-12 relative max-w-5xl mx-auto">
          {/* Glowing Border Wrap */}
          <div className="relative rounded-md p-1 bg-gradient-to-b from-cyan-500/30 via-white/10 to-transparent shadow-xl shadow-black/50 backdrop-blur-sm">
            <div className="rounded-sm bg-[#062837]/90 border border-white/10 overflow-hidden">
              {/* Window Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#041d29] border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                  <span className="ml-3 text-xs font-mono text-cyan-300/70 hidden sm:inline">
                    hub.bi2b.com.br/painel-gestao
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    STATUS: OPERACIONAL (99.9%)
                  </span>
                </div>
              </div>

              {/* Mockup Body: Multi-Tenant Dashboard View */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 bg-gradient-to-br from-[#062837] via-[#073244] to-[#041d29]">
                {/* Left Mini Sidebar */}
                <div className="hidden md:block md:col-span-3 space-y-2 border-r border-white/10 pr-4">
                  <div className="p-2.5 rounded-md bg-cyan-500/15 border border-cyan-400/20 text-cyan-200 text-xs font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Painel Multi-Tenant
                    </span>
                    <span className="text-[10px] bg-cyan-400 text-[#083A50] font-bold px-1.5 rounded-sm">
                      ADMIN
                    </span>
                  </div>
                  <div className="p-2.5 rounded-md text-slate-300/80 text-xs hover:bg-white/5 flex items-center gap-2 transition-colors">
                    <Users className="w-4 h-4 text-slate-400" />
                    Carteira de Clientes (148)
                  </div>
                  <div className="p-2.5 rounded-md text-slate-300/80 text-xs hover:bg-white/5 flex items-center gap-2 transition-colors">
                    <Activity className="w-4 h-4 text-slate-400" />
                    Central de Guias Fiscais
                  </div>
                  <div className="p-2.5 rounded-md text-slate-300/80 text-xs hover:bg-white/5 flex items-center gap-2 transition-colors">
                    <Shield className="w-4 h-4 text-slate-400" />
                    Auditoria & Conformidade
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="bg-[#031721] p-3 rounded-md border border-white/5 space-y-1.5">
                      <div className="text-[11px] text-slate-400 font-medium">Capacidade da Conta</div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full w-[42%]" />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>42% utilizado</span>
                        <span className="text-cyan-300 font-bold">148 / 350 CNPJs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Main Preview: Active Tenant Overview */}
                <div className="md:col-span-9 space-y-4">
                  {/* Top Stats Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-md bg-white/5 border border-white/10">
                      <div className="text-[11px] text-slate-300">Guias Enviadas (Mês)</div>
                      <div className="text-lg sm:text-xl font-bold text-white mt-0.5">1.240</div>
                      <div className="text-[10px] text-emerald-400 font-medium">99.4% no prazo</div>
                    </div>
                    <div className="p-3 rounded-md bg-white/5 border border-white/10">
                      <div className="text-[11px] text-slate-300">Chamados Abertos</div>
                      <div className="text-lg sm:text-xl font-bold text-white mt-0.5">12</div>
                      <div className="text-[10px] text-cyan-300 font-medium">SLA médio: 42min</div>
                    </div>
                    <div className="p-3 rounded-md bg-white/5 border border-white/10">
                      <div className="text-[11px] text-slate-300">Docs em Nuvem</div>
                      <div className="text-lg sm:text-xl font-bold text-white mt-0.5">48.6 GB</div>
                      <div className="text-[10px] text-slate-400 font-medium">AES-256 cripto</div>
                    </div>
                    <div className="p-3 rounded-md bg-white/5 border border-white/10">
                      <div className="text-[11px] text-slate-300">Acessos dos Clientes</div>
                      <div className="text-lg sm:text-xl font-bold text-white mt-0.5">4.890</div>
                      <div className="text-[10px] text-emerald-400 font-medium">+18% esta semana</div>
                    </div>
                  </div>

                  {/* Real-time client status table mockup */}
                  <div className="rounded-md bg-[#031721]/80 border border-white/10 p-3 sm:p-4 overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white tracking-wide">
                        Monitoramento de Clientes Ativos (Live Feed)
                      </span>
                      <span className="text-[11px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-sm border border-cyan-500/20">
                        Atualizado em tempo real
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="font-semibold text-white">Alpha Logística & Transportes</span>
                          <span className="text-slate-400 text-[11px] hidden sm:inline">CNPJ: 14.892.301/0001-90</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 text-[11px] font-medium">DAS & ISS Baixados</span>
                          <span className="text-[11px] text-slate-400 hidden sm:inline">Há 4 min</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="font-semibold text-white">Vértice Distribuidora de Peças</span>
                          <span className="text-slate-400 text-[11px] hidden sm:inline">CNPJ: 28.114.770/0001-44</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-cyan-300 text-[11px] font-medium">XMLs de Entrada Sincronizados</span>
                          <span className="text-[11px] text-slate-400 hidden sm:inline">Há 12 min</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="font-semibold text-white">Studio Design & Marketing</span>
                          <span className="text-slate-400 text-[11px] hidden sm:inline">CNPJ: 36.902.115/0001-02</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-300 text-[11px] font-medium">1 Chamado CRC em Aberto</span>
                          <span className="text-[11px] text-slate-400 hidden sm:inline">Há 25 min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Count-Up Counters Section */}
        <div className="mt-14 sm:mt-18 pt-10 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {metrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight flex items-center justify-center">
                  <CountUpNumber
                    end={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    decimals={metric.decimals || 0}
                    className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent"
                  />
                </div>
                <div className="text-xs sm:text-sm font-bold text-white/90 uppercase tracking-wider">
                  {metric.label}
                </div>
                <div className="text-[11px] sm:text-xs text-[#AEC3CE]">
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
