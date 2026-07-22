import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, CartesianGrid } from 'recharts'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
} as const

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
} as const

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
} as const

interface ProductivitySectionProps {
  isDark: boolean
}

// Dados alinhados aos módulos reais do painel do cliente
const chartData = [
  { name: 'Impostos', manual: 8, bi2b: 1, label: 'Impostos e Guias' },
  { name: 'Obrigações', manual: 6, bi2b: 0.5, label: 'Obrigações Mensais' },
  { name: 'Documentos', manual: 5, bi2b: 0.3, label: 'Drive de Documentos' },
  { name: 'Chamados', manual: 4, bi2b: 0.5, label: 'Chamados e Suporte' },
  { name: 'Equipe', manual: 3, bi2b: 0.2, label: 'Gestão de Equipe' },
]

// Tabela comparativa baseada nos módulos reais
const comparisonRows = [
  {
    module: 'Impostos e Guias',
    manual: 'Conferir DAS, ISS e FGTS manualmente + envio de comprovantes por e-mail',
    bi2b: 'Guias listadas com status e upload de comprovante direto no painel',
    highlight: true,
  },
  {
    module: 'Obrigações Mensais',
    manual: 'Planilhas com prazos, XML entrada/saída e extratos enviados por WhatsApp',
    bi2b: 'Categorias organizadas (Fiscal, Contábil, Trabalhista) com upload por mês',
    highlight: false,
  },
  {
    module: 'Drive de Documentos',
    manual: 'Pastas locais, Google Drive sem padrão, arquivos perdidos',
    bi2b: 'DriveHub com pastas, categorias, busca por tag e drag-and-drop',
    highlight: false,
  },
  {
    module: 'Chamados e Suporte',
    manual: 'WhatsApp pessoal, e-mails sem rastreio, sem histórico',
    bi2b: 'ConnectHub com chamados rastreáveis, prioridade e avaliação',
    highlight: false,
  },
  {
    module: 'Gestão de Equipe',
    manual: 'Sem controle de quem acessa o que — tudo no e-mail do dono',
    bi2b: 'Convites, permissões modulares e controle Master por colaborador',
    highlight: false,
  },
]

export function ProductivitySection({ isDark }: ProductivitySectionProps) {
  return (
    <motion.section
      id="produtividade"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative",
        isDark ? "border-cyan-950/40" : "border-slate-200"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Coluna esquerda: texto + gráfico */}
          <motion.div variants={slideInLeft} className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Eficiência Operacional</span>
            <h3 className={cn("font-heading text-3xl sm:text-4xl font-extrabold leading-tight", isDark ? "text-white" : "text-slate-900")}>
              Recupere o tempo gasto em rotinas manuais
            </h3>
            <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
              Empresários gastam, em média, dezenas de horas por mês conferindo guias de impostos, enviando documentos por e-mail e acompanhando certidões. O Portal Bi2B automatiza cada um desses processos.
            </p>
            <div className={cn(
              "flex items-center gap-4 border rounded-2xl p-4 transition-all duration-300 hover:border-cyan-500/20",
              isDark ? "bg-cyan-950/20 border-cyan-500/5 shadow-cyan-950/30" : "bg-cyan-50 border-cyan-100 shadow-slate-200/20"
            )}>
              <div className="text-4xl font-black text-cyan-500 tracking-tight leading-none animate-pulse">-90%</div>
              <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-600")}>
                Redução de tempo em processos entre empresa e contabilidade usando os módulos do portal.
              </p>
            </div>

            {/* Recharts — Horas semanais por módulo real */}
            <div className={cn(
              "rounded-2xl border p-5",
              isDark ? "bg-[#08101d]/60 border-cyan-500/10" : "bg-white border-slate-200 shadow-sm"
            )}>
              <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-4", isDark ? "text-slate-500" : "text-slate-400")}>
                Horas semanais por módulo — Manual vs Portal Bi2B
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barCategoryGap="18%" barGap={2}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? 'rgba(126,231,255,0.05)' : 'rgba(0,0,0,0.05)'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: isDark ? '#475569' : '#cbd5e1', fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}h`}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#08101d' : '#ffffff',
                      border: isDark ? '1px solid rgba(126,231,255,0.15)' : '1px solid #e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: isDark ? '#e2e8f0' : '#334155',
                      boxShadow: '0 8px 25px -5px rgba(0,0,0,0.15)',
                    }}
                    formatter={(value, name) => [
                      `${value}h/semana`,
                      name === 'manual' ? 'Processo Manual' : 'Portal Bi2B'
                    ]}
                    labelFormatter={(label) => {
                      const item = chartData.find(d => d.name === label)
                      return item?.label || label
                    }}
                  />
                  <Bar dataKey="manual" radius={[4, 4, 0, 0]} name="manual">
                    {chartData.map((_, index) => (
                      <Cell key={`cell-manual-${index}`} fill={isDark ? 'rgba(100,116,139,0.35)' : 'rgba(148,163,184,0.45)'} />
                    ))}
                  </Bar>
                  <Bar dataKey="bi2b" radius={[4, 4, 0, 0]} name="bi2b">
                    {chartData.map((_, index) => (
                      <Cell key={`cell-bi2b-${index}`} fill="#0d6084" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-5 mt-3 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(126,231,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-2.5 h-2.5 rounded-sm", isDark ? "bg-slate-600/35" : "bg-slate-400/45")} />
                  <span className={cn("text-[9px] font-semibold", isDark ? "text-slate-500" : "text-slate-400")}>Processo Manual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#0d6084]" />
                  <span className={cn("text-[9px] font-semibold", isDark ? "text-slate-500" : "text-slate-400")}>Portal Bi2B</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coluna direita: tabela comparativa */}
          <motion.div variants={slideInRight} className="lg:col-span-7">
            <div
              className={cn(
                "rounded-2xl border p-6 sm:p-8 backdrop-blur-md shadow-2xl text-left transition-all duration-500 hover:border-cyan-500/20",
                isDark
                  ? "bg-[#08101d]/60 border-cyan-500/10 shadow-cyan-950/30"
                  : "bg-white border-slate-200 shadow-2xl shadow-slate-200/55"
              )}
            >
              <div className="mb-6">
                <h4 className={cn("font-heading text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                  Comparativo por Módulo
                </h4>
                <p className={cn("text-[11px] mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                  Como cada funcionalidade do portal substitui processos manuais no dia a dia da sua empresa.
                </p>
              </div>

              <table className="w-full text-xs">
                <thead>
                  <tr className={cn("border-b font-bold text-[10px] uppercase tracking-wider", isDark ? "border-cyan-950 text-slate-400" : "border-slate-200 text-slate-500")}>
                    <th className="pb-3 text-left w-[28%]">Módulo do Portal</th>
                    <th className="pb-3 text-left w-[36%]">Sem o Portal</th>
                    <th className="pb-3 text-left w-[36%] text-cyan-500 font-bold">Com o Portal Bi2B</th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y", isDark ? "divide-cyan-950/30" : "divide-slate-200/80")}>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className={cn("group transition-all duration-300", isDark ? "hover:bg-cyan-950/20" : "hover:bg-slate-100/50")}>
                      <td className={cn(
                        "py-4 font-bold pr-3 transition-colors duration-300",
                        row.highlight ? "text-cyan-500" : (isDark ? "text-white" : "text-slate-800"),
                        "group-hover:text-cyan-500"
                      )}>
                        {row.module}
                      </td>
                      <td className={cn("py-4 pr-3 leading-relaxed transition-colors duration-300", isDark ? "text-slate-500" : "text-slate-400")}>
                        {row.manual}
                      </td>
                      <td className="py-4 text-emerald-500 font-semibold leading-relaxed group-hover:text-emerald-400 transition-colors duration-300">
                        {row.bi2b}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resumo de tempo */}
              <div className={cn(
                "mt-6 pt-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
                isDark ? "border-cyan-950/30" : "border-slate-200"
              )}>
                <div>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>
                    Tempo total semanal estimado
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className={cn("text-xl font-black", isDark ? "text-slate-500 line-through decoration-slate-700" : "text-slate-400 line-through decoration-slate-300")}>26h</p>
                    <p className={cn("text-[9px] font-semibold uppercase", isDark ? "text-slate-600" : "text-slate-400")}>Manual</p>
                  </div>
                  <div className={cn("text-[10px] font-bold", isDark ? "text-slate-600" : "text-slate-300")}>→</div>
                  <div className="text-center">
                    <p className="text-xl font-black text-cyan-500">2.5h</p>
                    <p className={cn("text-[9px] font-semibold uppercase", isDark ? "text-slate-600" : "text-slate-400")}>Portal Bi2B</p>
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
