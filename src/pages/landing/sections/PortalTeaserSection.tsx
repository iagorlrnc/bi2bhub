import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import {
  LayoutDashboard,
  FileCheck2,
  Receipt,
  MessageSquareCheck,
  ArrowRight,
  ShieldCheck,
  MonitorCheck,
} from 'lucide-react'

import portalImg from '@/assets/portal.png'
import portal2Img from '@/assets/portal2.png'
import portal3Img from '@/assets/portal3.png'

interface PortalTeaserSectionProps {
  isDark?: boolean
}

export function PortalTeaserSection({ isDark }: PortalTeaserSectionProps) {
  const navigate = useNavigate()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const handleKnowPortal = () => {
    navigate(ROUTES.PORTAL_INFO)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const highlights = [
    {
      icon: LayoutDashboard,
      title: 'Dashboard Financeiro Integrado',
      desc: 'Indicadores, faturamento e resumo tributário em tempo real.',
    },
    {
      icon: Receipt,
      title: 'Guias e Impostos em 1-Clique',
      desc: 'Acesso rápido a DAS, ISS, FGTS e histórico fiscal sem atrasos.',
    },
    {
      icon: FileCheck2,
      title: 'Drive Cloud de Documentos',
      desc: 'Contratos, certidões CNDs e balancetes disponíveis 24 horas por dia.',
    },
    {
      icon: MessageSquareCheck,
      title: 'Chamados & Suporte Direto',
      desc: 'Canal estruturado para falar direto com seu contador especialista.',
    },
  ]

  return (
    <section id="portal-teaser" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div
          className={cn(
            'relative rounded-3xl p-8 sm:p-12 md:p-16 border shadow-xl',
            isDark
              ? 'bg-[#060e20] border-white/10'
              : 'bg-white border-slate-200'
          )}
        >
          {/* Top Badge */}
          <div className="absolute top-6 right-6 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 dark:text-cyan-300 text-xs font-extrabold uppercase tracking-widest">
            Exclusivo Clientes Bi2B
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-[#0d6084] dark:text-cyan-300 font-extrabold text-xs uppercase tracking-widest">
                <MonitorCheck className="w-4 h-4 text-cyan-400" />
                Tecnologia Exclusiva
              </div>

              <h2
                className={cn(
                  'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-sans leading-[1.12]',
                  isDark ? 'text-white' : 'text-slate-900'
                )}
              >
                Conheça o{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
                  Portal do Cliente Bi2B
                </span>
              </h2>

              <p
                className={cn(
                  'text-base sm:text-lg leading-relaxed max-w-2xl',
                  isDark ? 'text-slate-300' : 'text-slate-600'
                )}
              >
                Uma plataforma digital corporativa criada para dar visibilidade total à sua empresa. Acompanhe impostos, envie documentos, abra chamados e tenha a contabilidade na palma da mão.
              </p>

              {/* Grid de 4 recursos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {highlights.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'p-4 rounded-2xl border flex items-start gap-3.5',
                        isDark
                          ? 'bg-white/5 border-white/10'
                          : 'bg-white/90 border-slate-200'
                      )}
                    >
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0d6084] to-[#0a4a62] text-white shrink-0 shadow-md">
                        <Icon className="w-5 h-5 text-cyan-300" />
                      </div>
                      <div>
                        <h3
                          className={cn(
                            'text-xs font-bold mb-0.5',
                            isDark ? 'text-white' : 'text-slate-900'
                          )}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={cn(
                            'text-[11px] leading-tight',
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          )}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Botão de Ação "Conheça o Portal" */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleKnowPortal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] border border-cyan-400/30 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg shadow-[#0d6084]/25 cursor-pointer"
                >
                  <span>Conheça o Portal do Cliente</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Sistema Criptografado</span>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Efeito Leque de Imagens (Fanned Stack Showcase) */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center pt-4 lg:pt-0">
              <div className="relative w-full max-w-lg h-[260px] sm:h-[360px] md:h-[380px] flex items-center justify-center my-2 sm:my-4 group/fan">

                {/* Imagem 1 (Esquerda / Central de Guias - portal2.png) */}
                <div
                  onClick={() => setActiveImageIndex(1)}
                  className={cn(
                    'absolute top-2 sm:top-4 left-0 w-[76%] sm:w-[78%] rounded-xl sm:rounded-2xl border overflow-hidden cursor-pointer transition-all duration-500 ease-out transform origin-bottom-left',
                    '-rotate-3 sm:-rotate-6 -translate-x-1 sm:-translate-x-6 z-10 opacity-80 group-hover/fan:-rotate-6 sm:group-hover/fan:-rotate-12 group-hover/fan:-translate-x-4 sm:group-hover/fan:-translate-x-10 hover:!rotate-0 hover:!translate-x-0 hover:!z-30 hover:!opacity-100 hover:!scale-105',
                    activeImageIndex === 1 ? '!z-30 !rotate-0 !translate-x-0 !opacity-100 !scale-105 ring-2 ring-cyan-400' : '',
                    isDark ? 'border-white/15 bg-[#060e20]' : 'border-slate-300 bg-white'
                  )}
                >
                  <img src={portal2Img} alt="Central de Guias & Impostos" className="w-full h-auto object-cover" />
                  <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-slate-950/85 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                    Central de Guias
                  </div>
                </div>

                {/* Imagem 3 (Direita / Drive Cloud - portal3.png) */}
                <div
                  onClick={() => setActiveImageIndex(2)}
                  className={cn(
                    'absolute top-2 sm:top-4 right-0 w-[76%] sm:w-[78%] rounded-xl sm:rounded-2xl border overflow-hidden cursor-pointer transition-all duration-500 ease-out transform origin-bottom-right',
                    'rotate-3 sm:rotate-6 translate-x-1 sm:translate-x-6 z-10 opacity-80 group-hover/fan:rotate-6 sm:group-hover/fan:rotate-12 group-hover/fan:translate-x-4 sm:group-hover/fan:translate-x-10 hover:!rotate-0 hover:!translate-x-0 hover:!z-30 hover:!opacity-100 hover:!scale-105',
                    activeImageIndex === 2 ? '!z-30 !rotate-0 !translate-x-0 !opacity-100 !scale-105 ring-2 ring-cyan-400' : '',
                    isDark ? 'border-white/15 bg-[#060e20]' : 'border-slate-300 bg-white'
                  )}
                >
                  <img src={portal3Img} alt="Bi2B Drive Cloud" className="w-full h-auto object-cover" />
                  <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-slate-950/85 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                    Bi2B Drive Cloud
                  </div>
                </div>

                {/* Imagem 2 (Centro / Painel Principal - portal.png) */}
                <div
                  onClick={() => setActiveImageIndex(0)}
                  className={cn(
                    'relative w-[82%] sm:w-[82%] rounded-xl sm:rounded-2xl border overflow-hidden cursor-pointer transition-all duration-500 ease-out transform z-20 hover:!z-30 hover:!scale-105 hover:!-translate-y-2 hover:!rotate-0',
                    activeImageIndex === 0 ? '!z-30 !scale-105 ring-2 ring-cyan-400' : '',
                    isDark ? 'border-cyan-400/50 bg-[#060e20]' : 'border-[#0d6084]/40 bg-white'
                  )}
                >
                  <img src={portalImg} alt="Painel Principal do Cliente Bi2B" className="w-full h-auto object-cover" />
                  <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-slate-950/85 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold text-cyan-300 border border-cyan-400/30">
                    Finanças
                  </div>
                </div>
              </div>

              <p className={cn('text-[11px] sm:text-xs text-center font-semibold mt-2', isDark ? 'text-slate-400' : 'text-slate-500')}>
                Toque ou passe o mouse por cima das imagens para destacar cada tela do portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
