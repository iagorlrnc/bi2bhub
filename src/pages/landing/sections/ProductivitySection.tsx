import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, CartesianGrid } from 'recharts'
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  FileText,
  Headphones,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
} from 'lucide-react'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
} as const

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
} as const

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
} as const

// Dados alinhados aos módulos reais do painel do cliente
const chartData = [
  { name: 'Guias', manual: 8, bi2b: 1, label: 'Guias e Impostos' },
  { name: 'Documentos', manual: 6, bi2b: 0.5, label: 'Drive de Documentos' },
  { name: 'Tarefas', manual: 5, bi2b: 0.3, label: 'Tarefas Mensais' },
  { name: 'Chamados', manual: 4, bi2b: 0.5, label: 'Chamados e Suporte' },
  { name: 'Equipe', manual: 3, bi2b: 0.2, label: 'Gestão de Equipe' },
]

// Dados inéditos para o Gráfico Pizza: Composição de redução de erros, multas e custos operacionais
const pieData = [
  { name: 'Multas & Juros Evitados', value: 38, impact: 'Alertas automáticos de prazos', colorDark: '#38bdf8', colorLight: '#0284c7' }, // Azul Cyan
  { name: 'Prevenção de Erros Fiscais', value: 26, impact: 'Varredura e validação contábil', colorDark: '#34d399', colorLight: '#059669' }, // Verde Esmeralda
  { name: 'Eliminação de Envio Físico', value: 21, impact: 'Documentos 100% digitais na nuvem', colorDark: '#fbbf24', colorLight: '#d97706' }, // Âmbar / Dourado
  { name: 'Redução de Horas Extras', value: 15, impact: 'Autoatendimento centralizado', colorDark: '#a855f7', colorLight: '#7e22ce' }, // Roxo / Violeta
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
  isDark: boolean
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
  payload?: Array<{ payload: { name: string; value: number; color?: string; subtitle?: string; impact?: string } }>
}

export function ProductivitySection({ isDark }: ProductivitySectionProps) {
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null)

  const CustomBarTooltip = ({ active, payload, label }: CustomBarTooltipProps) => {
    if (active && payload && payload.length) {
      const item = chartData.find((d) => d.name === label)
      return (
        <div
          className={cn(
            "rounded-xl border p-3 text-xs shadow-2xl backdrop-blur-md transition-colors duration-200 min-w-[170px]",
            isDark
              ? "bg-[#040914]/95 border-cyan-400/30 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              : "bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/60"
          )}
        >
          <p className={cn("font-bold text-xs mb-2 pb-1.5 border-b tracking-wide", isDark ? "text-white border-white/10" : "text-slate-900 border-slate-100")}>
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
                    <span className={cn("font-medium text-xs", isDark ? "text-slate-200 font-semibold" : "text-slate-700")}>
                      {isManual ? 'Processo Manual' : 'Portal Bi2B'}
                    </span>
                  </div>
                  <span className={cn("font-bold text-xs ml-2", isDark ? (isManual ? "text-slate-300" : "text-cyan-300") : (isManual ? "text-slate-600" : "text-[#0d6084]"))}>
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
            "rounded-xl border p-3 text-xs shadow-2xl backdrop-blur-md transition-colors duration-200 max-w-[220px]",
            isDark
              ? "bg-[#040914]/95 border-cyan-400/30 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              : "bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/60"
          )}
        >
          <p className={cn("font-bold text-xs mb-1", isDark ? "text-white" : "text-slate-900")}>
            {data.name}
          </p>
          <p className={cn("text-xs font-semibold mb-1", isDark ? "text-cyan-300" : "text-[#0d6084]")}>
            Redução: <span className={cn("font-bold", isDark ? "text-white" : "text-slate-800")}>{data.value}%</span>
          </p>
          {data.impact && (
            <p className={cn("text-[11px] leading-relaxed pt-1.5 border-t mt-1", isDark ? "text-slate-200 border-white/10 font-normal" : "text-slate-600 border-slate-100")}>
              {data.impact}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <motion.section
      id="resultados"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative overflow-hidden transition-colors duration-300",
        isDark ? "bg-[#040914]/60 border-white/10" : "bg-slate-100/60 border-slate-200"
      )}
    >
      {/* Glows sutis de fundo */}
      <div
        className={cn(
          "hidden lg:block absolute top-1/3 left-0 w-96 h-96 rounded-full blur-[140px] pointer-events-none -z-10",
          isDark ? "bg-cyan-500/10" : "bg-cyan-500/5"
        )}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção de Resultados */}
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-sm transition-all duration-300",
            isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/10 text-[#0d6084]"
          )}>
            <TrendingUp className={cn("w-3.5 h-3.5", isDark ? "text-cyan-400" : "text-[#0d6084]")} />
            Métricas de Impacto Operacional
          </span>
          <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
            Resultados comprovados em números
          </h2>
          <p className={cn("max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-balance transition-colors duration-300", isDark ? "text-slate-300/90" : "text-slate-600")}>
            Veja como a automação de processos contábeis gera ganhos tangíveis de tempo e redução drástica de erros operacionais.
          </p>
        </motion.div>

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
            <motion.div
              key={idx}
              variants={fadeInUp}
              className={cn(
                "rounded-3xl border p-6 text-left backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between",
                isDark 
                  ? "bg-[#040914]/80 border-white/10 hover:border-cyan-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)]" 
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-md shadow-slate-200/40"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none transition-colors duration-300",
                    isDark ? item.darkColor : item.lightColor
                  )}>
                    {item.stat}
                  </span>
                  <item.icon className={cn(
                    "w-6 h-6 shrink-0 opacity-80 transition-colors duration-300",
                    isDark ? item.darkColor : item.lightColor
                  )} />
                </div>
                <h3 className={cn("font-bold text-sm sm:text-base mt-2 transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
                  {item.title}
                </h3>
              </div>
              <p className={cn("text-xs leading-relaxed mt-2 pt-2 border-t transition-colors duration-300", isDark ? "text-slate-400 border-white/10" : "text-slate-500 border-slate-100")}>
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Gráfico Recharts + Tabela Comparativa */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Coluna esquerda: gráfico de colunas + gráfico pizza */}
          <motion.div variants={slideInLeft} className="lg:col-span-5 text-left flex flex-col gap-6">
            
            {/* 1. Gráfico de Colunas */}
            <div className={cn(
              "rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl shadow-xl flex flex-col justify-between transition-all duration-300",
              isDark ? "bg-[#040914]/85 border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)]" : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
            )}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={cn("font-bold text-base sm:text-lg transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
                      Horas Semanais por Módulo
                    </h3>
                    <p className={cn("text-xs transition-colors duration-300", isDark ? "text-slate-400" : "text-slate-500")}>
                      Manual vs Portal Bi2B
                    </p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    isDark ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300" : "bg-[#0d6084]/10 border-[#0d6084]/20 text-[#0d6084]"
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
                      <Tooltip
                        content={<CustomBarTooltip />}
                        cursor={
                          isDark
                            ? { fill: 'rgba(18, 26, 61, 0.75)', rx: 8, ry: 8 }
                            : { fill: 'rgba(0, 0, 0, 0.04)', rx: 8, ry: 8 }
                        }
                      />
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

              <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t transition-colors duration-300" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-sm", isDark ? "bg-slate-500/50" : "bg-slate-400")} />
                  <span className={cn("text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>Processo Manual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-sm", isDark ? "bg-[#38bdf8]" : "bg-[#0d6084]")} />
                  <span className={cn("text-xs font-bold", isDark ? "text-cyan-300" : "text-[#0d6084]")}>Portal Bi2B</span>
                </div>
              </div>
            </div>

            {/* 2. Gráfico Pizza (Abaixo do gráfico de colunas) */}
            <div className={cn(
              "rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl shadow-xl transition-all duration-300",
              isDark ? "bg-[#040914]/85 border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)]" : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
            )}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className={cn("font-bold text-base sm:text-lg transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
                    Origem da Redução de Custos & Riscos
                  </h3>
                  <p className={cn("text-xs transition-colors duration-300", isDark ? "text-slate-400" : "text-slate-500")}>
                    Composição dos ganhos e prevenção de erros
                  </p>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  isDark ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300" : "bg-[#0d6084]/10 border-[#0d6084]/20 text-[#0d6084]"
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

              {/* Legenda Customizada em Grid para o PieChart */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t text-[11px] transition-colors duration-300" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 min-w-0">
                    <div 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                      style={{ backgroundColor: isDark ? item.colorDark : item.colorLight }} 
                    />
                    <span className={cn("truncate font-medium text-[11px]", isDark ? "text-slate-300" : "text-slate-700")}>
                      {item.name} <span className="font-bold ml-0.5" style={{ color: isDark ? item.colorDark : item.colorLight }}>({item.value}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Coluna direita: tabela comparativa */}
          <motion.div variants={slideInRight} className="lg:col-span-7 flex flex-col">
            <div
              className={cn(
                "rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-left transition-all duration-300 flex-1 flex flex-col justify-between",
                isDark
                  ? "bg-[#040914]/85 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-cyan-950/20 hover:border-cyan-400/30"
                  : "bg-white border-slate-200 shadow-xl shadow-slate-200/60 hover:border-slate-300"
              )}
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className={cn("font-sans text-xl font-extrabold tracking-tight transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
                      Comparativo de Produtividade por Módulo
                    </h3>
                  </div>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm transition-all duration-300",
                    isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  )}>
                    Economia Média de ~90%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[550px]">
                    <thead>
                      <tr className={cn("border-b font-extrabold text-[11px] uppercase tracking-wider transition-colors duration-300", isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-600")}>
                        <th className="pb-3 text-left w-[26%]">Módulo</th>
                        <th className="pb-3 text-left w-[36%]">
                          <div className="flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span className={isDark ? "text-slate-200 font-bold" : "text-slate-800 font-bold"}>Sem o Portal</span>
                          </div>
                        </th>
                        <th className="pb-3 text-left w-[38%]">
                          <div className="flex items-center gap-1.5">
                            <Zap className={cn("w-3.5 h-3.5 shrink-0", isDark ? "text-cyan-400" : "text-[#0d6084]")} />
                            <span className={cn("font-extrabold", isDark ? "text-cyan-300" : "text-[#0d6084]")}>Com o Portal Bi2B</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className={cn("divide-y transition-colors duration-300", isDark ? "divide-white/5" : "divide-slate-200/80")}>
                      {comparisonRows.map((row, idx) => (
                        <tr key={idx} className={cn(
                          "group transition-all duration-200",
                          isDark 
                            ? "hover:bg-cyan-950/30" 
                            : "hover:bg-slate-100/80"
                        )}>
                          {/* Módulo */}
                          <td className="py-4 pr-3 align-top">
                            <div className={cn(
                              "font-bold text-sm transition-colors duration-200",
                              row.highlight 
                                ? (isDark ? "text-cyan-300 group-hover:text-cyan-200" : "text-[#0d6084] group-hover:text-[#0a4a62]") 
                                : (isDark ? "text-slate-100 group-hover:text-white" : "text-slate-900 group-hover:text-black")
                            )}>
                              {row.module}
                            </div>
                          </td>

                          {/* Processo Manual */}
                          <td className="py-4 pr-3 align-top">
                            <div className={cn(
                              "text-xs leading-relaxed mb-2 transition-colors duration-200 font-normal",
                              isDark ? "text-slate-300 group-hover:text-slate-100" : "text-slate-600 group-hover:text-slate-900"
                            )}>
                              {row.manual}
                            </div>
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors duration-200",
                              isDark ? "bg-rose-950/60 text-rose-200 border-rose-700/50 shadow-sm" : "bg-rose-100 text-rose-900 border-rose-200 font-bold"
                            )}>
                              <Clock className="w-2.5 h-2.5 opacity-90" />
                              {row.hoursManual}/semana
                            </span>
                          </td>

                          {/* Portal Bi2B */}
                          <td className="py-4 align-top">
                            <div className={cn(
                              "text-xs font-semibold leading-relaxed mb-2 transition-colors duration-200",
                              isDark ? "text-white group-hover:text-cyan-100" : "text-slate-900 group-hover:text-[#0d6084]"
                            )}>
                              {row.bi2b}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors duration-200 shadow-sm",
                                isDark 
                                  ? "bg-cyan-950/80 text-cyan-200 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                                  : "bg-cyan-100 text-[#0d6084] border-[#0d6084]/40 font-bold"
                              )}>
                                <CheckCircle2 className={cn("w-3 h-3", isDark ? "text-cyan-400" : "text-[#0d6084]")} />
                                {row.hoursBi2b}/semana
                              </span>
                              <span className={cn(
                                "inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border transition-colors duration-200",
                                isDark 
                                  ? "bg-emerald-950/80 text-emerald-200 border-emerald-400/40" 
                                  : "bg-emerald-100 text-emerald-900 border-emerald-300"
                              )}>
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
              <div className={cn(
                "mt-6 pt-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors duration-300",
                isDark ? "border-white/10 bg-white/[0.02] -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl" : "border-slate-200 bg-slate-50/80 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl"
              )}>
                <div>
                  <p className={cn("text-xs font-bold uppercase tracking-wider transition-colors duration-300", isDark ? "text-slate-300" : "text-slate-700")}>
                    Tempo Total Semanal Estimado
                  </p>
                  <p className={cn("text-xs mt-0.5 transition-colors duration-300", isDark ? "text-slate-400" : "text-slate-500")}>
                    Substitua 26 horas de trabalho manual por apenas 2.5h no portal.
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
                  {/* Manual Total */}
                  <div className="text-center">
                    <p className={cn("text-xl sm:text-2xl font-black line-through decoration-rose-500/70 decoration-2 transition-colors duration-300", isDark ? "text-slate-500" : "text-slate-400")}>
                      26h
                    </p>
                    <p className={cn("text-[10px] font-bold uppercase tracking-wider transition-colors duration-300", isDark ? "text-slate-400" : "text-slate-500")}>
                      Manual
                    </p>
                  </div>

                  <ArrowRight className={cn("w-4 h-4 shrink-0", isDark ? "text-slate-500" : "text-slate-400")} />

                  {/* Bi2B Total */}
                  <div className="text-center">
                    <p className={cn(
                      "text-xl sm:text-2xl font-black tracking-tight transition-colors duration-300",
                      isDark ? "text-cyan-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]" : "text-[#0d6084]"
                    )}>
                      2.5h
                    </p>
                    <p className={cn("text-[10px] font-bold uppercase tracking-wider transition-colors duration-300", isDark ? "text-cyan-400" : "text-[#0d6084]")}>
                      Portal Bi2B
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  )
}

