import { useState, useEffect } from 'react'
import {
  Layers,
  Bot,
  Globe2,
  Zap,
  CheckCircle2,
} from 'lucide-react'

export function Bi2BWhatWeDoSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)
  const words = ['Simples', 'Seguro', 'Escalável', 'Automatizado', 'Inteligente']

  // Rotating words interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [words.length])

  const features = [
    {
      id: 'portal-whitelabel',
      badge: 'EXPERIÊNCIA DO CLIENTE',
      title: 'Portal White-Label Exclusivo para Seus Clientes PJ',
      description:
        'Diga adeus ao caos do WhatsApp e e-mails perdidos. Seus clientes acessam um ambiente com o seu logotipo e domínio, onde encontram guias, solicitam serviços e enviam documentos em segundos.',
      highlights: [
        'Totalmente personalizado com a identidade do seu escritório',
        'Autoatendimento 24/7 para emissão de guias e certidões',
        'Controle de múltiplos usuários por empresa cliente',
      ],
      icon: Globe2,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      preview: {
        title: 'Portal do Cliente - Visão Geral',
        tag: 'Ambiente White-label',
        metric: '70% menos mensagens no WhatsApp',
        items: [
          { label: 'DAS & Impostos do Mês', status: 'Disponível para Download', color: 'emerald' },
          { label: 'Folha & Holerites', status: 'Sincronizado', color: 'cyan' },
          { label: 'Upload de Extratos Bancários', status: 'Pendente pelo Cliente', color: 'amber' },
        ],
      },
    },
    {
      id: 'robo-fiscal',
      badge: 'AUTOMAÇÃO INTELIGENTE',
      title: 'Robô Fiscal & Notificações de Vencimento',
      description:
        'Automação ativa de rotinas repetitivas: disparo automático de lembretes antes do vencimento do DAS, FGTS e ISS, validação de comprovantes e prevenção de multas.',
      highlights: [
        'Alertas inteligentes 5 dias, 2 dias e no dia do vencimento',
        'Leitura e cruzamento automático de comprovantes de pagamento',
        'Redução drástica de inadimplência e juros fiscais',
      ],
      icon: Bot,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      preview: {
        title: 'Central de Automação & Robôs Fiscais',
        tag: 'Disparos Ativos',
        metric: '99.8% de pontualidade na entrega',
        items: [
          { label: 'Varredura de DAS Simples Nacional', status: '100% Notificados', color: 'emerald' },
          { label: 'Alertas de CNDs a vencer', status: '3 empresas alertadas', color: 'cyan' },
          { label: 'Cobrança de XMLs Fiscais', status: 'Em andamento', color: 'emerald' },
        ],
      },
    },
    {
      id: 'gestao-multitenant',
      badge: 'CONTROLE DO GESTOR',
      title: 'Painel Multi-Tenant Centralizado para a Sua Equipe',
      description:
        'Gerencie 50, 200 ou 1.000 clientes contábeis em uma interface única. Distribua carteiras de clientes entre seus operadores, monitore prazos fiscais e audite todas as interações com segurança.',
      highlights: [
        'Visão panorâmica da saúde fiscal de toda a carteira',
        'Níveis granulares de permissão por colaborador contábil',
        'Histórico unificado com logs de auditoria e conformidade LGPD',
      ],
      icon: Layers,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      preview: {
        title: 'Painel Central do Gestor Contábil',
        tag: 'Multi-Tenant Master',
        metric: 'Escalabilidade sem inchar equipe',
        items: [
          { label: 'Carteira Operador 01 (Fiscal)', status: '45 Clientes • 100% em dia', color: 'emerald' },
          { label: 'Carteira Operador 02 (DP/Folha)', status: '38 Clientes • 2 pendências', color: 'amber' },
          { label: 'Relatório Geral de Produtividade', status: 'Gerado automaticamente', color: 'cyan' },
        ],
      },
    },
  ]

  return (
    <section id="o-que-fazemos" className="py-24 sm:py-32 bg-[#FAFAFA] text-[#0C1E28] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#083A50]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Rotating Words */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#083A50]/10 text-[#083A50] font-bold text-xs uppercase tracking-widest mb-4">
            O que fazemos
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#083A50] tracking-tight font-heading leading-tight mb-6">
            O Hub de Gestão Contábil que é{' '}
            <span className="inline-block min-w-[220px] text-cyan-600 transition-all duration-300 font-black underline decoration-cyan-400 decoration-4">
              {words[currentWordIndex]}
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
            Eliminamos a barreira entre o escritório de contabilidade e seus clientes. Criamos uma infraestrutura onde dados fiscais, documentos e chamados fluem de maneira automatizada e à prova de falhas.
          </p>
        </div>

        {/* Pinned / Sticky Scroll Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Scrolling Feature Stories */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              const isCurrent = activeFeatureIndex === idx

              return (
                <div
                  key={feature.id}
                  onMouseEnter={() => setActiveFeatureIndex(idx)}
                  className={`p-6 sm:p-7 rounded-md border transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-white border-[#083A50]/30 shadow-lg shadow-[#083A50]/10 ring-1 ring-[#083A50]/10 scale-[1.01]'
                      : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`p-2 rounded-sm transition-colors ${
                        isCurrent
                          ? 'bg-[#083A50] text-cyan-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-bold tracking-wider uppercase text-cyan-700 font-mono">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#083A50] font-heading mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    {feature.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Sticky Showcase Card with Visual Illustration */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="rounded-md p-1 bg-gradient-to-br from-[#083A50] to-[#052635] shadow-xl text-white overflow-hidden">
              {/* Header Image Strip */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900 rounded-t-sm">
                <img
                  src={features[activeFeatureIndex].image}
                  alt={features[activeFeatureIndex].preview.title}
                  className="w-full h-full object-cover object-center transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041a24] via-[#041a24]/60 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-sm bg-[#083A50]/90 backdrop-blur-md text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
                    {features[activeFeatureIndex].preview.tag}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold backdrop-blur-md">
                    Live Demo
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <h4 className="text-lg font-bold text-white font-heading">
                    {features[activeFeatureIndex].preview.title}
                  </h4>
                </div>
              </div>

              {/* Showcase Body */}
              <div className="bg-[#041a24] p-5 sm:p-6 rounded-b-sm border-t border-white/10 space-y-4">
                {/* Highlight Metric Banner */}
                <div className="p-3 rounded-md bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      Impacto Mensurado:
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-cyan-300">
                    {features[activeFeatureIndex].preview.metric}
                  </span>
                </div>

                {/* Simulated Live Action Items */}
                <div className="space-y-2">
                  {features[activeFeatureIndex].preview.items.map((item, itIdx) => (
                    <div
                      key={itIdx}
                      className="p-2.5 rounded-md bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <span className="text-xs font-medium text-slate-200">
                        {item.label}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm ${
                          item.color === 'emerald'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.color === 'cyan'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer of Showcase */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>CRIPTOGRAFIA END-TO-END</span>
                  <span className="text-emerald-400 font-bold">100% SEGURO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
