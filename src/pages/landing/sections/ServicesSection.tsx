import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  FileText,
  TrendingUp,
  Calculator,
  Users,
  Building2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

interface ServicesSectionProps {
  isDark?: boolean
}

const services = [
  {
    icon: Calculator,
    title: 'Contabilidade Consultiva',
    description:
      'Indo além do cumprimento de obrigações fiscais. Entregamos balancetes gerenciais e relatórios contábeis para tomada de decisão estratégica.',
    benefits: ['Balanços e demonstrações financeiras', 'Análise de indicadores de desempenho (KPIs)', 'Conformidade legal e normas contábeis'],
    badge: 'Estratégia & Dados',
    gradient: 'from-[#0d6084] to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'BPO Financeiro completo',
    description:
      'Terceirize a gestão de contas a pagar, receber, emissão de notas e conciliação bancária. Foco total no core business do seu negócio.',
    benefits: ['Conciliação bancária diária', 'Gestão de fluxo de caixa e relatórios', 'Emissão de NFs e cobrança eficiente'],
    badge: 'Eficiência Operacional',
    gradient: 'from-blue-600 to-cyan-400',
  },
  {
    icon: FileText,
    title: 'Planejamento Tributário',
    description:
      'Estudo aprofundado dos regimes Simples Nacional, Lucro Presumido e Lucro Real para redução legal da carga de impostos da sua empresa.',
    benefits: ['Revisão e recuperação de tributos', 'Enquadramento fiscal otimizado', 'Mitigação de riscos e autuações'],
    badge: 'Economia Real',
    gradient: 'from-[#0a4a62] to-[#0d6084]',
  },
  {
    icon: Users,
    title: 'Gestão de Pessoal (DP)',
    description:
      'Cuidamos de toda a rotina trabalhista e eSocial, desde admissões, folha de pagamento até rescisões e gestão de benefícios.',
    benefits: ['Cálculo e gestão de folha de pagamento', 'Transmissão completa do eSocial', 'Assessoria em acordos e leis trabalhistas'],
    badge: 'Conformidade Trabalhista',
    gradient: 'from-cyan-600 to-blue-500',
  },
  {
    icon: Building2,
    title: 'Societário & Abertura',
    description:
      'Abertura rápida de empresas, alterações contratuais, migração de MEI para ME, transformação societária e regularização de alvarás.',
    benefits: ['Agilidade na abertura de novos CNPJs', 'Elaboração de acordos de sócios', 'Regularizações de certidões (CNDs)'],
    badge: 'Estruturação Legal',
    gradient: 'from-sky-600 to-[#0d6084]',
  },
  {
    icon: BarChart3,
    title: 'Consultoria Financeira',
    description:
      'Assessoria especializada para diagnóstico financeiro, estruturação de capital de giro, planejamento orçamentário e valuation.',
    benefits: ['Modelagem financeira personalizada', 'Diagnóstico de viabilidade econômica', 'Acompanhamento mensal com especialistas'],
    badge: 'Crescimento Seguro',
    gradient: 'from-cyan-500 to-teal-400',
  },
]

export function ServicesSection({ isDark }: ServicesSectionProps) {
  const scrollToContact = () => {
    const contactEl = document.querySelector('#contato')
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="servicos" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decor */}
      <div
        className={cn(
          'absolute top-1/3 left-0 w-96 h-96 rounded-full blur-[140px] pointer-events-none -z-10',
          isDark ? 'bg-[#0d6084]/15' : 'bg-[#0d6084]/5'
        )}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0d6084]/30 bg-[#0d6084]/10 text-[#0d6084] dark:text-cyan-300 font-semibold text-xs uppercase tracking-widest mb-4"
          >
            Nossas Soluções Contábeis & Estratégicas
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Gestão Contábil que gera{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              valor e segurança
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              'mt-4 text-base sm:text-lg leading-relaxed',
              isDark ? 'text-slate-300' : 'text-slate-600'
            )}
          >
            Oferecemos uma assessoria contábil moderna, proativa e focada na evolução contínua da sua empresa.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  'group relative rounded-3xl p-8 transition-all duration-300 border flex flex-col justify-between hover:-translate-y-1.5',
                  isDark
                    ? 'bg-[#060e20]/80 border-white/10 hover:border-cyan-500/40 hover:shadow-[0_20px_50px_rgba(13,96,132,0.25)]'
                    : 'bg-white border-slate-200/90 shadow-lg shadow-slate-200/50 hover:border-[#0d6084]/40 hover:shadow-xl hover:shadow-cyan-900/10'
                )}
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br transition-transform group-hover:scale-110 duration-300',
                        service.gradient
                      )}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border',
                        isDark
                          ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
                          : 'bg-[#0d6084]/10 border-[#0d6084]/20 text-[#0d6084]'
                      )}
                    >
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={cn(
                      'text-xl font-bold mb-3 transition-colors group-hover:text-[#0d6084] dark:group-hover:text-cyan-300',
                      isDark ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    {service.title}
                  </h3>

                  <p
                    className={cn(
                      'text-sm leading-relaxed mb-6',
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    )}
                  >
                    {service.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2.5 mb-6">
                    {service.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer Button */}
                <button
                  onClick={scrollToContact}
                  className={cn(
                    'mt-4 w-full inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all duration-300 border cursor-pointer',
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-[#0d6084] hover:border-cyan-400 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-[#0d6084] hover:border-[#0d6084] hover:text-white'
                  )}
                >
                  Falar com Especialista
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
