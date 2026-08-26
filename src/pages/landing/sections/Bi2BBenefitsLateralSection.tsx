import { useState } from 'react'
import {
  Clock,
  ShieldAlert,
  Award,
  TrendingUp,
  CheckCircle2,
  Zap,
} from 'lucide-react'

export function Bi2BBenefitsLateralSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  const benefits = [
    {
      num: '01',
      title: 'Redução de 70% no tempo com mensagens de WhatsApp',
      shortTitle: 'Atendimento Ágil',
      desc: 'Centralize guias, certidões e holerites em um portal de autoatendimento. Seus clientes deixam de pedir 2ª via por mensagem e encontram tudo em 1-clique.',
      impact: 'Economia de ~25 horas semanais por analista contábil',
      icon: Clock,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      mockupData: {
        headline: 'Portal de Autoatendimento Ativo',
        badge: 'Redução de Ruído',
        stats: [
          { label: 'Downloads via Portal', val: '840 docs/mês' },
          { label: 'Ruído no WhatsApp', val: '-72%' },
          { label: 'Tempo de Atendimento', val: '3 minutos' },
        ],
        previewText: 'Cliente "Vértice Logística" baixou DAS e Certidão Negativa sem acionar o suporte.',
      },
    },
    {
      num: '02',
      title: 'Zero perda de prazos com robôs de alertas fiscais',
      shortTitle: 'Segurança Tributária',
      desc: 'Notificações programadas antes do vencimento do DAS, FGTS e impostos estaduais. Reduza a inadimplência fiscal dos seus clientes e evite multas indesejadas.',
      impact: '99.8% de entrega e pagamento das guias dentro do prazo',
      icon: ShieldAlert,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      mockupData: {
        headline: 'Varredura & Prevenção de Multas',
        badge: 'Monitoramento Contínuo',
        stats: [
          { label: 'Guias Monitoradas', val: '1.450' },
          { label: 'Pagamento no Prazo', val: '99.8%' },
          { label: 'Multas Evitadas', val: '100%' },
        ],
        previewText: 'Disparados 14 alertas de vencimento com 48h de antecedência aos clientes.',
      },
    },
    {
      num: '03',
      title: 'Fidelização e valor percebido com Portal White-Label',
      shortTitle: 'Posicionamento Premium',
      desc: 'Seu escritório não é apenas mais um prestador de serviços contábeis: torna-se um parceiro tecnológico de referência com plataforma própria e visual sofisticado.',
      impact: 'Aumento de 85% no Net Promoter Score (NPS) dos clientes',
      icon: Award,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      mockupData: {
        headline: 'Identidade Visual & Domínio Próprio',
        badge: 'White-Label Completo',
        stats: [
          { label: 'NPS Médio dos Clientes', val: '94 / 100' },
          { label: 'Engajamento no Portal', val: '+60%' },
          { label: 'Indicações de Clientes', val: '+45%' },
        ],
        previewText: 'Acesso personalizado em app.seuescritorio.com.br com a sua logomarca.',
      },
    },
    {
      num: '04',
      title: 'Escalabilidade: dobre a carteira sem inchar a equipe',
      shortTitle: 'Escala Saudável',
      desc: 'Padronize o fluxo de recepção de documentos, conciliação e chamados. Assuma novos clientes todos os meses mantendo a mesma estrutura operacional enxuta.',
      impact: 'Aumento de 140% na capacidade de atendimento por operador',
      icon: TrendingUp,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      mockupData: {
        headline: 'Capacidade Operacional Expandida',
        badge: 'Crescimento Sustentável',
        stats: [
          { label: 'Capacidade por Operador', val: '80 empresas' },
          { label: 'Margem Operacional', val: '+38%' },
          { label: 'Custo Marginal Cliente', val: '-65%' },
        ],
        previewText: 'Escritório passou de 80 para 190 clientes sem novas contratações de urgência.',
      },
    },
  ]

  const activeBenefit = benefits[activeStepIndex]

  return (
    <section id="beneficios" className="py-24 sm:py-32 bg-[#083A50] text-white relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold text-xs uppercase tracking-widest mb-4">
            Benefícios Estratégicos
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight mb-6">
            Por que os principais escritórios{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-[#38bdf8] to-white bg-clip-text text-transparent">
              escolhem a Bi2b
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#C5D7E0] leading-relaxed">
            Uma transformação comprovada nos números do seu escritório: mais tempo livre, processos seguros e clientes encantados.
          </p>
        </div>

        {/* 2-Column Lateral Numbered List & Synced Mockup Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Numbered Items (01, 02, 03, 04) */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            {benefits.map((item, idx) => {
              const isSelected = activeStepIndex === idx
              const Icon = item.icon

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  onMouseEnter={() => setActiveStepIndex(idx)}
                  className={`p-4 sm:p-5 rounded-md border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-[#062837] border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30 scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span
                    className={`text-2xl sm:text-3xl font-black font-heading transition-colors shrink-0 ${
                      isSelected ? 'text-cyan-400' : 'text-slate-300'
                    }`}
                  >
                    {item.num}
                  </span>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-sm sm:text-base font-bold font-heading transition-colors ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span
                        className={`p-1.5 rounded-sm shrink-0 ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                    </div>

                    <p className="text-xs text-[#AEC3CE] leading-relaxed">
                      {item.desc}
                    </p>

                    {isSelected && (
                      <div className="pt-1.5 flex items-center gap-2 text-xs font-semibold text-cyan-300 font-mono animate-in fade-in duration-300">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{item.impact}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Dynamic Synced Mockup Panel with Image Header */}
          <div className="lg:col-span-6">
            <div className="rounded-md p-1 bg-gradient-to-br from-cyan-400/30 via-white/10 to-transparent shadow-xl overflow-hidden">
              {/* Image Preview Header */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900 rounded-t-sm">
                <img
                  src={activeBenefit.image}
                  alt={activeBenefit.mockupData.headline}
                  className="w-full h-full object-cover object-center transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041a24] via-[#041a24]/60 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-[#083A50]/90 backdrop-blur-md px-2.5 py-0.5 rounded-sm border border-cyan-400/30">
                    BENEFÍCIO {activeBenefit.num}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
                    {activeBenefit.mockupData.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <h4 className="text-base sm:text-lg font-bold text-white font-heading">
                    {activeBenefit.mockupData.headline}
                  </h4>
                </div>
              </div>

              {/* Body */}
              <div className="rounded-b-sm bg-[#041a24] p-5 sm:p-6 border-t border-white/10 space-y-4">
                {/* Stats 3-Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {activeBenefit.mockupData.stats.map((st, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-sm bg-white/5 border border-white/5">
                      <div className="text-[10px] text-[#AEC3CE] leading-tight">
                        {st.label}
                      </div>
                      <div className="text-sm sm:text-base font-black text-cyan-300 font-heading mt-0.5">
                        {st.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Action Simulation */}
                <div className="p-3 rounded-sm bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Atividade no Portal
                  </div>
                  <p className="text-xs text-cyan-100 font-medium leading-relaxed">
                    {activeBenefit.mockupData.previewText}
                  </p>
                </div>

                {/* Footer Assurance */}
                <div className="flex items-center justify-between text-xs text-[#AEC3CE] pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Relatório auditado</span>
                  </div>
                  <span className="font-mono text-cyan-400 text-[10px]">BI2B METRICS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
