import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import {
  Sparkles,
  LayoutDashboard,
  FileCheck2,
  Receipt,
  MessageSquareCheck,
  ArrowRight,
  ShieldCheck,
  MonitorCheck,
} from 'lucide-react'

interface PortalOriginalTeaserSectionProps {
  isDark?: boolean
}

export function PortalOriginalTeaserSection({ isDark }: PortalOriginalTeaserSectionProps) {
  const navigate = useNavigate()

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
    <section id="portal-teaser-original" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div
          className={cn(
            'relative rounded-3xl p-8 sm:p-12 md:p-16 border shadow-2xl backdrop-blur-xl',
            isDark
              ? 'bg-gradient-to-br from-[#061329] via-[#040914] to-[#0a2342] border-cyan-500/30 shadow-cyan-950/50'
              : 'bg-gradient-to-br from-white via-cyan-50/40 to-slate-100 border-[#0d6084]/20 shadow-cyan-900/10'
          )}
        >
          {/* Top Badge */}
          <div className="absolute top-6 right-6 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 dark:text-cyan-300 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Exclusivo Clientes Bi2B
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-[#0d6084] dark:text-cyan-300 font-extrabold text-xs uppercase tracking-widest">
                <MonitorCheck className="w-4 h-4 text-cyan-400" />
                Tecnologia Exclusiva
              </div>

              <h2
                className={cn(
                  'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans leading-[1.12]',
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
                Uma plataforma digital moderna criada para dar visibilidade total à sua empresa. Acompanhe impostos, envie documentos, solicite chamados e tenha a contabilidade na palma da mão.
              </p>

              {/* Grid of 4 features */}
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
                          : 'bg-white/80 border-slate-200'
                      )}
                    >
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0d6084] to-cyan-500 text-white shrink-0 shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4
                          className={cn(
                            'text-xs font-bold mb-0.5',
                            isDark ? 'text-white' : 'text-slate-900'
                          )}
                        >
                          {item.title}
                        </h4>
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

              {/* Main Call to Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleKnowPortal}
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#0d6084] via-[#0f729d] to-cyan-500 text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-lg cursor-pointer active:scale-95 group"
                >
                  <span>Conheça o Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Acesso Seguro SSL & Criptografia 256-bit</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Preview */}
            <div className="lg:col-span-5 relative flex justify-center text-left">
              <div
                className={cn(
                  'w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 backdrop-blur-md',
                  isDark
                    ? 'bg-[#040914]/90 border-cyan-500/40 text-slate-100 shadow-cyan-950/60'
                    : 'bg-white border-slate-200 text-slate-900 shadow-xl'
                )}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                    Portal Bi2B v2.0
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0d6084]/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Imposto a Vencer</div>
                      <div className="text-sm font-black text-[#0d6084] dark:text-cyan-300">DAS Simples Nacional</div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                      Disponível
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Balancete Mensal</div>
                      <div className="text-xs font-bold">Relatório Gerencial Q3</div>
                    </div>
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                      Visualizar
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Chamado em Aberto</div>
                      <div className="text-xs font-bold">Dúvida Faturamento NF-e</div>
                    </div>
                    <span className="text-xs font-bold text-amber-500">
                      Em Atendimento
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleKnowPortal}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#0d6084] text-white text-xs font-bold uppercase tracking-wider hover:bg-cyan-600 transition-colors cursor-pointer"
                >
                  Explorar Todas as Funcionalidades
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
