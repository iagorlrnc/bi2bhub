import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, CartesianGrid } from 'recharts'
import { TrendingUp, Clock, ShieldCheck, FileText, Headphones } from 'lucide-react'

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
    bi2b: 'Bi2B Drive com pastas, categorias, busca por tag e drag-and-drop',
    highlight: false,
  },
  {
    module: 'Chamados e Suporte',
    manual: 'WhatsApp pessoal, e-mails sem rastreio, sem histórico',
    bi2b: 'Bi2B Chamados com chamados rastreáveis, prioridade e avaliação',
    highlight: false,
  },
  {
    module: 'Gestão de Equipe',
    manual: 'Sem controle de quem acessa o que — tudo no e-mail do dono',
    bi2b: 'Convites, permissões modulares e controle Master por colaborador',
    highlight: false,
  },
]

interface ProductivitySectionProps {
  isDark: boolean
}

export function ProductivitySection({ isDark }: ProductivitySectionProps) {
  return (
    <motion.section
      id="resultados"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative overflow-hidden",
        isDark ? "bg-[#040914]/60 border-white/10" : "bg-slate-100/50 border-slate-200"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção de Resultados */}
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-md",
            isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]"
          )}>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Métricas de Impacto Operacional
          </span>
          <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance", isDark ? "text-white" : "text-slate-900")}>
            Resultados comprovados em números
          </h2>
          <p className={cn("max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-balance", isDark ? "text-slate-300/90" : "text-slate-600")}>
            Veja como a automação de processos contábeis gera ganhos tangíveis de tempo e redução drástica de erros operacionais.
          </p>
        </motion.div>

        {/* Destaques Tipográficos Grandes — Fingu Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { stat: '-90%', title: 'Tempo em Rotinas Manuais', sub: 'Economia média de 23.5 horas/semana para a sua empresa', icon: Clock, color: 'text-cyan-400' },
            { stat: 'Zero', title: 'Multas por Atrasos Fiscais', sub: 'Alertas sobre prazos e guias de impostos sempre em dia', icon: ShieldCheck, color: 'text-indigo-400' },
            { stat: '100%', title: 'Acesso Digital & Nuvem', sub: 'Guias, documentos e certidões acessíveis de qualquer lugar', icon: FileText, color: 'text-teal-400' },
            { stat: '15 min', title: 'Atendimento & Suporte Ágil', sub: 'Abertura e resposta rápida de chamados diretamente no portal', icon: Headphones, color: 'text-blue-400' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className={cn(
                "rounded-3xl border p-6 text-left backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between",
                isDark 
                  ? "bg-[#040914]/80 border-white/10 hover:border-cyan-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)]" 
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-md shadow-slate-200/30"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={cn("text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none", item.color)}>
                    {item.stat}
                  </span>
                  <item.icon className={cn("w-6 h-6 shrink-0 opacity-80", item.color)} />
                </div>
                <h3 className={cn("font-bold text-sm sm:text-base mt-2", isDark ? "text-white" : "text-slate-900")}>
                  {item.title}
                </h3>
              </div>
              <p className={cn("text-xs leading-relaxed mt-2 pt-2 border-t", isDark ? "text-slate-400 border-white/10" : "text-slate-500 border-slate-100")}>
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Gráfico Recharts + Tabela Comparativa */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Coluna esquerda: gráfico */}
          <motion.div variants={slideInLeft} className="lg:col-span-5 text-left space-y-6">
            <div className={cn(
              "rounded-3xl border p-6 backdrop-blur-2xl shadow-xl",
              isDark ? "bg-[#040914]/80 border-white/10" : "bg-white border-slate-200 shadow-sm"
            )}>
              <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                Horas semanais por módulo — Manual vs Portal Bi2B
              </p>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={chartData} barCategoryGap="18%" barGap={2}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}h`}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#040914' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: isDark ? '#e2e8f0' : '#334155',
                      boxShadow: '0 8px 25px -5px rgba(0,0,0,0.3)',
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
                      <Cell key={`cell-manual-${index}`} fill={isDark ? 'rgba(148,163,184,0.25)' : 'rgba(148,163,184,0.45)'} />
                    ))}
                  </Bar>
                  <Bar dataKey="bi2b" radius={[4, 4, 0, 0]} name="bi2b">
                    {chartData.map((_, index) => (
                      <Cell key={`cell-bi2b-${index}`} fill="#0d6084" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-5 mt-3 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-2.5 h-2.5 rounded-sm", isDark ? "bg-slate-600/50" : "bg-slate-400/45")} />
                  <span className={cn("text-[10px] font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>Processo Manual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#0d6084]" />
                  <span className={cn("text-[10px] font-semibold uppercase tracking-wider", isDark ? "text-slate-300" : "text-slate-600")}>Portal Bi2B</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coluna direita: tabela comparativa */}
          <motion.div variants={slideInRight} className="lg:col-span-7">
            <div
              className={cn(
                "rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-left transition-all duration-300 hover:border-cyan-400/30",
                isDark
                  ? "bg-[#040914]/80 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-cyan-950/20"
                  : "bg-white border-slate-200 shadow-2xl shadow-slate-200/55"
              )}
            >
              <div className="mb-6">
                <h3 className={cn("font-sans text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  Comparativo de Produtividade por Módulo
                </h3>
                <p className={cn("text-xs mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                  Como cada funcionalidade do portal substitui tarefas manuais.
                </p>
              </div>

              <table className="w-full text-xs">
                <thead>
                  <tr className={cn("border-b font-bold text-[10px] uppercase tracking-wider", isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500")}>
                    <th className="pb-3 text-left w-[28%]">Módulo do Portal</th>
                    <th className="pb-3 text-left w-[36%]">Sem o Portal</th>
                    <th className="pb-3 text-left w-[36%] text-cyan-400 font-bold">Com o Portal Bi2B</th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y", isDark ? "divide-white/5" : "divide-slate-200/80")}>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className={cn("group transition-all duration-300", isDark ? "hover:bg-white/5" : "hover:bg-slate-100/50")}>
                      <td className={cn(
                        "py-4 font-bold pr-3 transition-colors duration-300",
                        row.highlight ? "text-cyan-400" : (isDark ? "text-white" : "text-slate-800"),
                        "group-hover:text-cyan-400"
                      )}>
                        {row.module}
                      </td>
                      <td className={cn("py-4 pr-3 leading-relaxed transition-colors duration-300", isDark ? "text-slate-400" : "text-slate-500")}>
                        {row.manual}
                      </td>
                      <td className="py-4 text-emerald-400 font-semibold leading-relaxed group-hover:text-emerald-300 transition-colors duration-300">
                        {row.bi2b}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resumo de tempo */}
              <div className={cn(
                "mt-6 pt-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
                isDark ? "border-white/10" : "border-slate-200"
              )}>
                <div>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                    Tempo total semanal estimado
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className={cn("text-xl font-black", isDark ? "text-slate-500 line-through decoration-slate-600" : "text-slate-400 line-through decoration-slate-300")}>26h</p>
                    <p className={cn("text-[9px] font-bold uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>Manual</p>
                  </div>
                  <div className={cn("text-[10px] font-bold", isDark ? "text-slate-500" : "text-slate-300")}>→</div>
                  <div className="text-center">
                    <p className="text-xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(13,96,132,0.4)]">2.5h</p>
                    <p className={cn("text-[9px] font-bold uppercase tracking-wider", isDark ? "text-cyan-300" : "text-[#0d6084]")}>Portal Bi2B</p>
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

