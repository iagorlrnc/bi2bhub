import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ShieldCheck, Award, Zap, HeartHandshake, CheckCircle } from 'lucide-react'

interface CompanyAboutSectionProps {
  isDark?: boolean
}

const stats = [
  { value: '+500', label: 'Empresas Atendidas', sub: 'Em diversos segmentos do mercado' },
  { value: '99,8%', label: 'Conformidade Fiscal', sub: 'Índice de precisão nas obrigações' },
  { value: 'R$ 15M+', label: 'Economia Tributária', sub: 'Redução legal de impostos gerada' },
  { value: '100%', label: 'Atendimento Dedicado', sub: 'Contadores especialistas prontos' },
]

const differentials = [
  {
    icon: ShieldCheck,
    title: 'Segurança & Compliance Total',
    description: 'Rigoroso controle fiscal e societário para garantir que sua empresa opere sem riscos com a Receita Federal ou órgãos estaduais.',
  },
  {
    icon: HeartHandshake,
    title: 'Atendimento Consultivo e Humano',
    description: 'Esqueça os robôs impessoais. Na Bi2B você tem um contador especialista responsável direto pelo atendimento da sua empresa.',
  },
  {
    icon: Zap,
    title: 'Tecnologia & Agilidade de Dados',
    description: 'Integramos contabilidade estratégica com portal digital exclusivo para emissão de guias, relatórios e controle em tempo real.',
  },
  {
    icon: Award,
    title: 'Planejamento Tributário Proativo',
    description: 'Analisamos continuamente o enquadramento fiscal da sua empresa para garantir a menor carga tributária possível dentro da lei.',
  },
]

export function CompanyAboutSection({ isDark }: CompanyAboutSectionProps) {
  return (
    <section id="sobre" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Light Accent */}
      <div
        className={cn(
          'absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none -z-10',
          isDark ? 'bg-cyan-500/10' : 'bg-[#0d6084]/8'
        )}
      />

      <div className="max-w-7xl mx-auto space-y-20">
        {/* Main Grid: Story + Differentials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0d6084]/30 bg-[#0d6084]/10 text-[#0d6084] dark:text-cyan-300 font-semibold text-xs uppercase tracking-widest">
              Sobre a Bi2B Consultoria
            </div>

            <h2
              className={cn(
                'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans leading-[1.15]',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Mais que contabilidade, um{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
                parceiro estratégico
              </span>{' '}
              para o seu crescimento
            </h2>

            <p
              className={cn(
                'text-base sm:text-lg leading-relaxed',
                isDark ? 'text-slate-300' : 'text-slate-600'
              )}
            >
              A <strong>Bi2B Consultoria Contábil</strong> nasceu para transformar a relação entre empresas e a contabilidade. Combinamos mais de uma década de expertise fiscal, societária e tributária com uma visão moderna de dados e tecnologia.
            </p>

            <p
              className={cn(
                'text-base leading-relaxed',
                isDark ? 'text-slate-400' : 'text-slate-600'
              )}
            >
              Nossa missão é simples: simplificar a gestão financeira e tributária dos nossos clientes, entregando números claros, previsibilidade e estratégias reais para aumento de margem e redução legal de tributos.
            </p>

            {/* Checklist */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Equipe técnica com registro CRC ativo',
                'Orientação fiscal e tributária contínua',
                'Contabilidade 100% digital e segura',
                'Relatórios gerenciais periódicos',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0" />
                  <span className={cn('text-xs sm:text-sm font-medium', isDark ? 'text-slate-200' : 'text-slate-800')}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Differentials Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {differentials.map((diff) => {
              const Icon = diff.icon
              return (
                <div
                  key={diff.title}
                  className={cn(
                    'p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:scale-[1.02]',
                    isDark
                      ? 'bg-[#060e20]/90 border-white/10 shadow-lg shadow-cyan-950/20'
                      : 'bg-white border-slate-200 shadow-md shadow-slate-200/50'
                  )}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d6084] to-cyan-500 flex items-center justify-center text-white mb-4 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3
                    className={cn(
                      'text-base font-bold mb-2',
                      isDark ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    {diff.title}
                  </h3>

                  <p
                    className={cn(
                      'text-xs leading-relaxed',
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    )}
                  >
                    {diff.description}
                  </p>
                </div>
              )
            })}
          </motion.div>
        </div>

        {/* Bottom Banner: Key Numbers & Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn(
            'rounded-3xl p-8 sm:p-12 border relative overflow-hidden',
            isDark
              ? 'bg-gradient-to-r from-[#040914] via-[#06152d] to-[#040914] border-white/10 shadow-2xl shadow-cyan-950/40'
              : 'bg-gradient-to-r from-slate-900 via-[#0d6084] to-slate-900 text-white border-slate-800 shadow-xl'
          )}
        >
          {/* Subtle Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            {stats.map((stat, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 font-normal hidden sm:block">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
