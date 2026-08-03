import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  TrendingUp,
  FileSpreadsheet,
  Scale,
  BarChart3,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

interface ServicesSectionProps {
  isDark?: boolean
}

const tabs = [
  {
    id: 'dashboards',
    label: 'Dashboards',
    icon: LayoutDashboard,
    subtitle: 'Acompanhe indicadores contábeis, faturamento e saúde financeira em tempo real.',
  },
  {
    id: 'fluxo',
    label: 'Fluxo de Caixa',
    icon: TrendingUp,
    subtitle: 'Previsibilidade completa de entradas e saídas para tomar decisões sem surpresas.',
  },
  {
    id: 'dre',
    label: 'DRE Gerencial',
    icon: FileSpreadsheet,
    subtitle: 'Demonstração de resultados detalhada por categoria de receita, custos e margem.',
  },
  {
    id: 'receitas-despesas',
    label: 'Receitas x Despesas',
    icon: Scale,
    subtitle: 'Compare o que entra e o que sai por categoria e descubra exatamente onde a empresa ganha e onde gasta dinheiro.',
  },
  {
    id: 'comparativos',
    label: 'Comparativos',
    icon: BarChart3,
    subtitle: 'Análise comparativa de desempenho fiscal e financeiro entre diferentes períodos.',
  },
]

export function ServicesSection({ isDark }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(3)

  const activeTab = tabs[activeIndex]

  const scrollToContact = () => {
    const contactEl = document.querySelector('#contato')
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="servicos" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Badge & Title Estáticos */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0d6084]/30 bg-[#0d6084]/10 text-[#0d6084] dark:text-cyan-300 font-bold text-xs uppercase tracking-widest"
          >
            Ecossistema de Inteligência Contábil
          </div>

          <h2
            className={cn(
              'text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-sans',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Controle total do seu negócio em{' '}
            <span className="font-sans font-black bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              uma só plataforma
            </span>
          </h2>
        </div>

        {/* Top Pill Tabs Estáticas */}
        <div className="flex justify-center mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className={cn(
            "inline-flex items-center gap-1.5 p-1.5 rounded-full border shadow-md backdrop-blur-xl",
            isDark ? "bg-[#040914]/90 border-white/10" : "bg-white border-slate-200"
          )}>
            {tabs.map((tab, idx) => {
              const Icon = tab.icon
              const isSelected = activeIndex === idx
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    'relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap',
                    isSelected
                      ? 'bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white shadow-md'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isSelected ? 'text-cyan-300' : 'text-slate-400')} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Subtitle Estático */}
        <p
          className={cn(
            'max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-12 font-normal min-h-[48px] flex items-center justify-center',
            isDark ? 'text-slate-300' : 'text-slate-600'
          )}
        >
          {activeTab.subtitle}
        </p>

        {/* ===== CAROUSEL STACK CONTAINER ESTÁTICO (MESMO TAMANHO DE CARD) ===== */}
        <div className="relative w-full max-w-[1100px] mx-auto min-h-[450px] flex items-center justify-center overflow-hidden py-4">
          <div className="relative w-full max-w-[840px] h-[410px] flex items-center justify-center">
            {tabs.map((tab, idx) => {
              let position = idx - activeIndex
              if (position < -2) position += tabs.length
              if (position > 2) position -= tabs.length

              const isCenter = position === 0
              const isLeft = position === -1
              const isRight = position === 1
              const isHidden = !isCenter && !isLeft && !isRight

              if (isHidden) return null

              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    transform: isCenter ? 'scale(1) translateX(0%)' : isLeft ? 'scale(0.88) translateX(-36%)' : 'scale(0.88) translateX(36%)',
                    zIndex: isCenter ? 30 : 10,
                    opacity: isCenter ? 1 : 0.7,
                  }}
                  className={cn(
                    'absolute w-full h-[410px] rounded-3xl border shadow-2xl overflow-hidden cursor-pointer flex flex-col justify-between',
                    isDark
                      ? 'bg-[#060e20] border-white/15 shadow-cyan-950/70'
                      : 'bg-white border-slate-200 shadow-slate-300/80',
                    !isCenter && (isDark ? 'hover:border-cyan-400/40 hover:opacity-90' : 'hover:border-[#0d6084]/40 hover:opacity-90')
                  )}
                >
                  {/* Card Top Bar */}
                  <div className="flex items-center justify-between border-b px-6 py-4 border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/5 h-[64px] shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d6084] to-[#0a4a62] flex items-center justify-center text-white shadow-md">
                        <tab.icon className="w-4 h-4 text-cyan-300" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-[#0d6084] dark:text-cyan-300 uppercase tracking-wider">
                        {tab.label} — Bi2B Analytics
                      </span>
                    </div>

                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                      Atualizado Agora
                    </span>
                  </div>

                  {/* ===== CARD BODY ESTÁTICO ===== */}
                  <div className="p-6 sm:p-7 text-left flex-1 flex flex-col justify-between overflow-hidden">
                    {tab.id === 'receitas-despesas' && (
                      <div className="h-full flex flex-col justify-between space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-xl border bg-[#040914]/90 border-emerald-500/30 text-white">
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block mb-0.5">RECEITAS</span>
                            <div className="text-base sm:text-xl font-black text-white">R$ 1.559.158,72</div>
                            <span className="text-[9px] text-slate-400">119 lançamentos no período</span>
                          </div>

                          <div className="p-3.5 rounded-xl border bg-[#040914]/90 border-rose-500/30 text-white">
                            <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 block mb-0.5">DESPESAS</span>
                            <div className="text-base sm:text-xl font-black text-white">R$ 970.274,00</div>
                            <span className="text-[9px] text-slate-400">235 lançamentos no período</span>
                          </div>

                          <div className="p-3.5 rounded-xl border bg-[#040914]/90 border-cyan-500/30 text-white">
                            <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 block mb-0.5">SALDO LÍQUIDO</span>
                            <div className="text-base sm:text-xl font-black text-emerald-400">R$ 588.884,72</div>
                            <span className="text-[9px] text-slate-400">Receitas - Despesas no período</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border bg-[#040914]/95 border-white/10 flex-1 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-2">
                            <span>Evolução Mensal Receitas x Despesas</span>
                            <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Receitas</span>
                          </div>
                          <div className="h-28 w-full bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent rounded-lg border border-emerald-500/20 relative overflow-hidden flex items-end p-2 gap-2">
                            <div className="w-full h-[60%] bg-emerald-500/40 rounded-t" />
                            <div className="w-full h-[80%] bg-emerald-500/60 rounded-t" />
                            <div className="w-full h-[75%] bg-emerald-500/50 rounded-t" />
                            <div className="w-full h-[95%] bg-emerald-500/80 rounded-t" />
                          </div>
                        </div>
                      </div>
                    )}

                    {tab.id === 'dashboards' && (
                      <div className="h-full flex flex-col justify-between space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 rounded-xl border bg-white/5 border-white/10 space-y-2">
                            <span className="text-xs font-bold text-slate-400">Faturamento Bruto Consolidado</span>
                            <div className="text-2xl sm:text-3xl font-black text-[#0d6084] dark:text-cyan-300">R$ 2.450.000,00</div>
                            <span className="text-xs text-emerald-500 font-semibold">+18.4% vs mês anterior</span>
                          </div>
                          <div className="p-5 rounded-xl border bg-white/5 border-white/10 space-y-2">
                            <span className="text-xs font-bold text-slate-400">Impostos Apurados</span>
                            <div className="text-2xl sm:text-3xl font-black text-white">R$ 142.300,00</div>
                            <span className="text-xs text-cyan-400 font-semibold">Simples Nacional Ativo</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                            <div>
                              <div className="text-xs font-bold">Auditoria Contábil Ativa</div>
                              <div className="text-[11px] text-slate-400">Validado por contador registrado CRC-SP</div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-cyan-400">100% Regular</span>
                        </div>
                      </div>
                    )}

                    {tab.id === 'fluxo' && (
                      <div className="h-full flex flex-col justify-between space-y-4">
                        <div className="p-5 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-400">Projeção de Caixa a 30 Dias</div>
                            <div className="text-2xl font-black text-emerald-400">R$ 380.500,00 Positivo</div>
                          </div>
                          <TrendingUp className="w-8 h-8 text-emerald-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
                            <span className="text-xs font-bold text-slate-400">Contas a Receber</span>
                            <div className="text-xl font-black text-white">R$ 512.000,00</div>
                          </div>
                          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
                            <span className="text-xs font-bold text-slate-400">Contas a Pagar</span>
                            <div className="text-xl font-black text-rose-400">R$ 131.500,00</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {tab.id === 'dre' && (
                      <div className="h-full flex flex-col justify-between space-y-2.5">
                        <div className="p-3.5 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between text-xs sm:text-sm font-bold">
                          <span>Receita Operacional Bruta</span>
                          <span className="text-cyan-300">R$ 1.850.000,00</span>
                        </div>
                        <div className="p-3.5 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between text-xs sm:text-sm font-bold">
                          <span>(-) Impostos sobre Vendas (DAS/ISS)</span>
                          <span className="text-rose-400">R$ -111.000,00</span>
                        </div>
                        <div className="p-3.5 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between text-xs sm:text-sm font-bold">
                          <span>(=) Lucro Operacional Líquido</span>
                          <span className="text-emerald-400">R$ 640.000,00</span>
                        </div>
                      </div>
                    )}

                    {tab.id === 'comparativos' && (
                      <div className="h-full flex flex-col justify-between space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 rounded-xl border bg-white/5 border-white/10">
                            <span className="text-xs text-slate-400 font-bold">Período A (2025)</span>
                            <div className="text-xl font-black">R$ 1.118.379,32</div>
                          </div>
                          <div className="p-5 rounded-xl border bg-white/5 border-white/10">
                            <span className="text-xs text-slate-400 font-bold">Período B (2026)</span>
                            <div className="text-xl font-black text-emerald-400">R$ 1.558.467,80</div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between text-xs">
                          <span className="font-bold">Crescimento Financeiro Líquido</span>
                          <span className="font-black text-emerald-400 text-sm">+39.3% de expansão</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Button Estático */}
        <div className="mt-8">
          <button
            onClick={scrollToContact}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0d6084] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] text-white font-bold text-xs sm:text-sm uppercase tracking-wider h-12 px-8 shadow-lg shadow-[#0d6084]/30 cursor-pointer"
          >
            <span>Falar com um Contador</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
