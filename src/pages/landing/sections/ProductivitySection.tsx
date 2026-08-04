import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  Clock,
  ShieldCheck,
  FileText,
  Headphones,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
} from 'lucide-react'

// Dados alinhados aos módulos reais do painel do cliente
const chartData = [
  { name: 'Guias', manual: 8, bi2b: 1, label: 'Guias e Impostos' },
  { name: 'Documentos', manual: 6, bi2b: 0.5, label: 'Drive de Documentos' },
  { name: 'Tarefas', manual: 5, bi2b: 0.3, label: 'Tarefas Mensais' },
  { name: 'Chamados', manual: 4, bi2b: 0.5, label: 'Chamados e Suporte' },
  { name: 'Equipe', manual: 3, bi2b: 0.2, label: 'Gestão de Equipe' },
]

// Dados para o Gráfico Pizza: Composição de redução de erros, multas e custos operacionais
const pieData = [
  { name: 'Multas & Juros Evitados', value: 38, impact: 'Alertas automáticos de prazos', colorDark: '#38bdf8', colorLight: '#0284c7' },
  { name: 'Prevenção de Erros Fiscais', value: 26, impact: 'Varredura e validação contábil', colorDark: '#34d399', colorLight: '#059669' },
  { name: 'Eliminação de Envio Físico', value: 21, impact: 'Documentos 100% digitais na nuvem', colorDark: '#fbbf24', colorLight: '#d97706' },
  { name: 'Redução de Horas Extras', value: 15, impact: 'Autoatendimento centralizado', colorDark: '#a855f7', colorLight: '#7e22ce' },
]

// Tabela comparativa baseada nos módulos reais
const comparisonRows = [
  {
    module: 'Impostos e Guias',
    manual: 'Conferir DAS, ISS e FGTS manualmente + envio de comprovantes por e-mail',
    bi2b: 'Guias listadas com status e upload de comprovante direto no painel',
    saved: '-87.5%',
    hoursManual: '8h',
    hoursBi2b: '1h',
    highlight: true,
  },
  {
    module: 'Tarefas Mensais',
    manual: 'Planilhas com prazos, XML entrada/saída e extratos enviados por WhatsApp',
    bi2b: 'Categorias organizadas (Fiscal, Contábil, Trabalhista) com upload por mês',
    saved: '-91.6%',
    hoursManual: '6h',
    hoursBi2b: '0.5h',
    highlight: false,
  },
  {
    module: 'Drive de Documentos',
    manual: 'Pastas locais, Google Drive sem padrão, arquivos perdidos',
    bi2b: 'Bi2B Drive com pastas, categorias, busca por tag e drag-and-drop',
    saved: '-94.0%',
    hoursManual: '5h',
    hoursBi2b: '0.3h',
    highlight: false,
  },
  {
    module: 'Chamados e Suporte',
    manual: 'WhatsApp pessoal, e-mails sem rastreio, sem histórico',
    bi2b: 'Bi2B Chamados com chamados rastreáveis, prioridade e avaliação',
    saved: '-87.5%',
    hoursManual: '4h',
    hoursBi2b: '0.5h',
    highlight: false,
  },
  {
    module: 'Gestão de Equipe',
    manual: 'Sem controle de quem acessa o que — tudo no e-mail do dono',
    bi2b: 'Convites, permissões modulares e controle de Gestor por colaborador',
    saved: '-93.3%',
    hoursManual: '3h',
    hoursBi2b: '0.2h',
    highlight: false,
  },
]

interface ProductivitySectionProps {
  isDark?: boolean
}

interface BarTooltipPayloadItem {
  name?: string
  value?: number
  color?: string
}

interface CustomBarTooltipProps {
  active?: boolean
  payload?: BarTooltipPayloadItem[]
  label?: string
}

interface CustomPieTooltipProps {
  active?: boolean
  payload?: Array<{ payload: { name: string; value: number; color?: string; impact?: string } }>
}

export function ProductivitySection({ isDark }: ProductivitySectionProps) {
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null)

  const CustomBarTooltip = ({ active, payload, label }: CustomBarTooltipProps) => {
    if (active && payload && payload.length) {
      const item = chartData.find((d) => d.name === label)
      return (
        <div
          className={cn(
            'rounded-xl border p-3 text-xs shadow-2xl backdrop-blur-md min-w-[170px]',
            isDark
              ? 'bg-[#040914]/95 border-cyan-400/30 text-white shadow-cyan-950/80'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          )}
        >
          <p className={cn('font-bold text-xs mb-2 pb-1.5 border-b tracking-wide', isDark ? 'text-white border-white/10' : 'text-slate-900 border-slate-100')}>
            {item?.label || label}
          </p>
          <div className="space-y-1.5">
            {payload.map((entry: BarTooltipPayloadItem, index: number) => {
              const isManual = entry.name === 'manual'
              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: entry.color || (isManual ? (isDark ? 'rgba(148,163,184,0.6)' : 'rgba(100,116,139,0.5)') : (isDark ? '#38bdf8' : '#0d6084')) }}
                    />
                    <span className={cn('font-medium text-xs', isDark ? 'text-slate-200 font-semibold' : 'text-slate-700')}>
                      {isManual ? 'Processo Manual' : 'Portal Bi2B'}
                    </span>
                  </div>
                  <span className={cn('font-bold text-xs ml-2', isDark ? (isManual ? 'text-slate-300' : 'text-cyan-300') : (isManual ? 'text-slate-600' : 'text-[#0d6084]'))}>
                    {entry.value}h/semana
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }: CustomPieTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div
          className={cn(
            'rounded-xl border p-3 text-xs shadow-2xl backdrop-blur-md max-w-[220px]',
            isDark
              ? 'bg-[#040914]/95 border-cyan-400/30 text-white shadow-cyan-950/80'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          )}
        >
          <p className={cn('font-bold text-xs mb-1', isDark ? 'text-white' : 'text-slate-900')}>
            {data.name}
          </p>
          <p className={cn('text-xs font-semibold mb-1', isDark ? 'text-cyan-300' : 'text-[#0d6084]')}>
            Redução: <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-800')}>{data.value}%</span>
          </p>
          {data.impact && (
            <p className={cn('text-[11px] leading-relaxed pt-1.5 border-t mt-1', isDark ? 'text-slate-200 border-white/10 font-normal' : 'text-slate-600 border-slate-100')}>
              {data.impact}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <section
      id="resultados"
      className={cn(
        'py-28 border-b relative overflow-hidden font-sans',
        isDark ? 'bg-[#040914]/60 border-white/10' : 'bg-slate-100/60 border-slate-200'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção de Resultados */}
        <div className="text-center space-y-4 mb-16">
          <span className={cn(
            'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-sm',
            isDark ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300' : 'border-[#0d6084]/20 bg-[#0d6084]/10 text-[#0d6084]'
          )}>
            Métricas de Impacto Operacional
          </span>
          <h2 className={cn('font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance', isDark ? 'text-white' : 'text-slate-900')}>
            Resultados comprovados em números
          </h2>
          <p className={cn('max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-balance', isDark ? 'text-slate-300' : 'text-slate-600')}>
            Veja como a automação de processos contábeis gera ganhos tangíveis de tempo e redução drástica de erros operacionais.
          </p>
        </div>

        {/* Destaques Tipográficos Grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              stat: '-90%',
              title: 'Tempo em Rotinas Manuais',
              sub: 'Economia média de 23.5 horas/semana para a sua empresa',
              icon: Clock,
              darkColor: 'text-cyan-400',
              lightColor: 'text-[#0d6084]',
            },
            {
              stat: 'Zero',
              title: 'Multas por Atrasos Fiscais',
              sub: 'Alertas sobre prazos e guias de impostos sempre em dia',
              icon: ShieldCheck,
              darkColor: 'text-indigo-400',
              lightColor: 'text-indigo-700',
            },
            {
              stat: '100%',
              title: 'Acesso Digital & Nuvem',
              sub: 'Guias, documentos e certidões acessíveis de qualquer lugar',
              icon: FileText,
              darkColor: 'text-teal-400',
              lightColor: 'text-teal-700',
            },
            {
              stat: '15 min',
              title: 'Atendimento & Suporte Ágil',
              sub: 'Abertura e resposta rápida de chamados diretamente no portal',
              icon: Headphones,
              darkColor: 'text-blue-400',
              lightColor: 'text-blue-700',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'rounded-3xl border p-6 text-left backdrop-blur-2xl shadow-xl flex flex-col justify-between',
                isDark 
                  ? 'bg-[#040914]/80 border-white/10 shadow-cyan-950/20' 
                  : 'bg-white border-slate-200 shadow-md shadow-slate-200/40'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    'text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none',
                    isDark ? item.darkColor : item.lightColor
                  )}>
                    {item.stat}
                  </span>
                  <item.icon className={cn(
                    'w-6 h-6 shrink-0 opacity-80',
                    isDark ? item.darkColor : item.lightColor
                  )} />
                </div>
                <h3 className={cn('font-bold text-sm sm:text-base mt-2', isDark ? 'text-white' : 'text-slate-900')}>
                  {item.title}
                </h3>
              </div>
              <p className={cn('text-xs leading-relaxed mt-2 pt-2 border-t', isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-100')}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Gráficos Recharts (Esquerda) + Tabela Comparativa (Direita) */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Coluna Esquerda: Gráficos (Colunas + Pizza) */}
          <div className="lg:col-span-5 text-left flex flex-col gap-6">
            
            {/* 1. Gráfico de Colunas */}
            <div className={cn(
              'rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl shadow-xl flex flex-col justify-between',
              isDark ? 'bg-[#040914]/85 border-white/10' : 'bg-white border-slate-200 shadow-lg'
            )}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={cn('font-bold text-base sm:text-lg', isDark ? 'text-white' : 'text-slate-900')}>
                      Horas Semanais por Módulo
                    </h3>
                    <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                      Manual vs Portal Bi2B
                    </p>
                  </div>
                  <span className={cn(
                    'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                    isDark ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300' : 'bg-[#0d6084]/10 border-[#0d6084]/20 text-[#0d6084]'
                  )}>
                    Colunas
                  </span>
                </div>

                <div className="w-full pt-2">
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart
                      data={chartData}
                      barCategoryGap="20%"
                      barGap={4}
                      onMouseMove={(state: any) => {
                        if (state && state.activeTooltipIndex !== undefined) {
                          setActiveBarIndex(state.activeTooltipIndex)
                        }
                      }}
                      onMouseLeave={() => setActiveBarIndex(null)}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 10, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: isDark ? '#64748b' : '#64748b', fontSize: 10, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}h`}
                        width={30}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar dataKey="manual" radius={[6, 6, 0, 0]} name="manual">
                        {chartData.map((_, index) => {
                          const isHovered = index === activeBarIndex
                          const fill = isDark 
                            ? (isHovered ? 'rgba(51, 65, 85, 0.85)' : 'rgba(148,163,184,0.3)')
                            : 'rgba(100,116,139,0.35)'
                          return <Cell key={`cell-manual-${index}`} fill={fill} />
                        })}
                      </Bar>
                      <Bar dataKey="bi2b" radius={[6, 6, 0, 0]} name="bi2b">
                        {chartData.map((_, index) => {
                          const isHovered = index === activeBarIndex
                          const fill = isDark 
                            ? (isHovered ? '#0284c7' : '#38bdf8')
                            : '#0d6084'
                          return <Cell key={`cell-bi2b-${index}`} fill={fill} />
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                <div className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-sm', isDark ? 'bg-slate-500/50' : 'bg-slate-400')} />
                  <span className={cn('text-xs font-semibold', isDark ? 'text-slate-400' : 'text-slate-600')}>Processo Manual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-sm', isDark ? 'bg-[#38bdf8]' : 'bg-[#0d6084]')} />
                  <span className={cn('text-xs font-bold', isDark ? 'text-cyan-300' : 'text-[#0d6084]')}>Portal Bi2B</span>
                </div>
              </div>
            </div>

            {/* 2. Gráfico Pizza (Origem da Redução de Custos & Riscos) */}
            <div className={cn(
              'rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl shadow-xl',
              isDark ? 'bg-[#040914]/85 border-white/10' : 'bg-white border-slate-200 shadow-lg'
            )}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className={cn('font-bold text-base sm:text-lg', isDark ? 'text-white' : 'text-slate-900')}>
                    Origem da Redução de Custos & Riscos
                  </h3>
                  <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    Composição dos ganhos e prevenção de erros
                  </p>
                </div>
                <span className={cn(
                  'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                  isDark ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300' : 'bg-[#0d6084]/10 border-[#0d6084]/20 text-[#0d6084]'
                )}>
                  Pizza
                </span>
              </div>

              <div className="w-full h-[190px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-pie-${index}`} 
                          fill={isDark ? entry.colorDark : entry.colorLight} 
                          stroke={isDark ? '#040914' : '#ffffff'}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: isDark ? item.colorDark : item.colorLight }} />
                    <span className={cn('truncate font-medium', isDark ? 'text-slate-300' : 'text-slate-700')}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Coluna Direita: Tabela Comparativa de Produtividade */}
          <div className="lg:col-span-7">
            <div
              className={cn(
                'rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-left h-full flex flex-col justify-between',
                isDark
                  ? 'bg-[#040914]/80 border-white/10 shadow-cyan-950/20'
                  : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/55'
              )}
            >
              <div>
                <div className="mb-6">
                  <h3 className={cn('font-sans text-lg sm:text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                    Comparativo de Produtividade por Módulo
                  </h3>
                  <p className={cn('text-xs mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    Como cada funcionalidade do portal substitui tarefas manuais.
                  </p>
                </div>

                <div className="overflow-x-auto pb-2 scrollbar-none">
                  <table className="w-full text-xs min-w-[480px]">
                    <thead>
                      <tr className={cn('border-b font-extrabold text-[11px] uppercase tracking-wider', isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600')}>
                        <th className="pb-3 text-left w-[26%]">Módulo</th>
                        <th className="pb-3 text-left w-[36%]">
                          <div className="flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span className={isDark ? 'text-slate-200 font-bold' : 'text-slate-800 font-bold'}>Sem o Portal</span>
                          </div>
                        </th>
                        <th className="pb-3 text-left w-[38%]">
                          <div className="flex items-center gap-1.5">
                            <Zap className={cn('w-3.5 h-3.5 shrink-0', isDark ? 'text-cyan-400' : 'text-[#0d6084]')} />
                            <span className={cn('font-extrabold', isDark ? 'text-cyan-300' : 'text-[#0d6084]')}>Com o Portal Bi2B</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className={cn('divide-y', isDark ? 'divide-white/5' : 'divide-slate-200/80')}>
                      {comparisonRows.map((row, idx) => (
                        <tr key={idx} className={cn('group transition-colors', isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50')}>
                          <td className="py-3.5 pr-3 align-top">
                            <div
                              className={cn(
                                'font-bold text-xs sm:text-sm',
                                row.highlight
                                  ? isDark ? 'text-cyan-300' : 'text-[#0d6084]'
                                  : isDark ? 'text-slate-100' : 'text-slate-900'
                              )}
                            >
                              {row.module}
                            </div>
                          </td>

                          <td className="py-3.5 pr-3 align-top">
                            <div className={cn('text-xs leading-relaxed mb-1.5 font-normal', isDark ? 'text-slate-300' : 'text-slate-600')}>
                              {row.manual}
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <Clock className="w-2.5 h-2.5 opacity-90" />
                              {row.hoursManual}/semana
                            </span>
                          </td>

                          <td className="py-3.5 align-top">
                            <div className={cn('text-xs font-semibold leading-relaxed mb-1.5', isDark ? 'text-white' : 'text-slate-900')}>
                              {row.bi2b}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                {row.hoursBi2b}/semana
                              </span>
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                {row.saved}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumo de tempo economizado */}
              <div className={cn('mt-6 pt-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', isDark ? 'border-white/10' : 'border-slate-200')}>
                <div>
                  <p className={cn('text-xs font-bold uppercase tracking-wider', isDark ? 'text-slate-300' : 'text-slate-700')}>
                    Tempo Total Semanal Estimado
                  </p>
                  <p className={cn('text-xs mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    Substitua 26 horas de trabalho manual por apenas 2.5h no portal.
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-black line-through text-slate-400 decoration-rose-500 decoration-2">
                      26h
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Manual
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-black text-cyan-400">
                      2.5h
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      Portal Bi2B
                    </p>
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
