import { cn } from '@/lib/utils'
import {
  Calculator,
  Building2,
  TrendingUp,
  Users,
  FileCheck2,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

interface PortalOriginalServicesSectionProps {
  isDark?: boolean
}

const services = [
  {
    icon: Calculator,
    title: 'Assessoria Contábil Especializada',
    description:
      'Gestão contábil completa, apuração de tributos, balancetes gerenciais e demonstrações financeiras alinhadas com as normas fiscais vigentes.',
    benefits: ['Balancetes e DRE mensais sem complicação', 'Cumprimento de obrigações SPED e Fiscais', 'Orientações proativas com contadores'],
    badge: 'Contabilidade',
    gradient: 'from-[#0d6084] to-[#0a4a62]',
  },
  {
    icon: FileCheck2,
    title: 'Planejamento Tributário Legal',
    description:
      'Estudo minucioso para reduzir legalmente a carga de impostos da sua empresa, recuperação de tributos e auditoria fiscal preventiva.',
    benefits: ['Revisão e recuperação de tributos', 'Enquadramento fiscal otimizado', 'Mitigação de riscos e autuações'],
    badge: 'Economia Real',
    gradient: 'from-[#0a4a62] to-[#0d6084]',
  },
  {
    icon: TrendingUp,
    title: 'BPO Financeiro (Gestão de Caixa)',
    description:
      'Terceirização da gestão financeira da sua empresa: contas a pagar/receber, emissão de notas fiscais e conciliação bancária diária.',
    benefits: ['Conciliação bancária diária e organizada', 'Emissão e controle de Notas Fiscais', 'Gestão de fluxo de caixa em tempo real'],
    badge: 'Gestão de Caixa',
    gradient: 'from-blue-600 to-[#0d6084]',
  },
  {
    icon: Users,
    title: 'Gestão de Pessoal (DP & eSocial)',
    description:
      'Cuidamos de toda a rotina trabalhista e eSocial, desde admissões, folha de pagamento até rescisões e gestão de benefícios.',
    benefits: ['Cálculo e gestão de folha de pagamento', 'Transmissão completa do eSocial', 'Assessoria em acordos e leis trabalhistas'],
    badge: 'Conformidade DP',
    gradient: 'from-cyan-600 to-blue-500',
  },
  {
    icon: Building2,
    title: 'Societário & Abertura de Empresa',
    description:
      'Abertura rápida de empresas, alterações contratuais, migração de MEI para ME, transformação societária e regularização de alvarás.',
    benefits: ['Agilidade na abertura de novos CNPJs', 'Elaboração de acordos de sócios', 'Regularização de certidões CNDs'],
    badge: 'Estruturação Legal',
    gradient: 'from-sky-600 to-[#0d6084]',
  },
  {
    icon: BarChart3,
    title: 'Consultoria Financeira & Valuation',
    description:
      'Assessoria especializada para diagnóstico financeiro, estruturação de capital de giro, planejamento orçamentário e valuation.',
    benefits: ['Modelagem financeira personalizada', 'Diagnóstico de viabilidade econômica', 'Acompanhamento mensal especializado'],
    badge: 'Crescimento Seguro',
    gradient: 'from-cyan-500 to-teal-400',
  },
]

export function PortalOriginalServicesSection({ isDark }: PortalOriginalServicesSectionProps) {
  const scrollToContact = () => {
    const contactEl = document.querySelector('#contato')
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="servicos-originais" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0d6084]/30 bg-[#0d6084]/10 text-[#0d6084] dark:text-cyan-300 font-bold text-xs uppercase tracking-widest">
            Nossas Soluções Contábeis & Estratégicas
          </div>

          <h2
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-sans',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Gestão Contábil que gera{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              valor e segurança
            </span>
          </h2>

          <p
            className={cn(
              'text-base sm:text-lg leading-relaxed',
              isDark ? 'text-slate-300' : 'text-slate-600'
            )}
          >
            Oferecemos uma assessoria contábil moderna, proativa e focada na evolução contínua da sua empresa.
          </p>
        </div>

        {/* Services Grid Estática */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className={cn(
                  'group relative rounded-3xl p-8 border flex flex-col justify-between text-left',
                  isDark
                    ? 'bg-[#060e20] border-white/10'
                    : 'bg-white border-slate-200 shadow-md shadow-slate-200/50'
                )}
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br',
                        service.gradient
                      )}
                    >
                      <Icon className="w-7 h-7 text-cyan-300" />
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
                      'text-xl font-bold mb-3',
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
                    'mt-4 w-full inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-3 rounded-xl border cursor-pointer',
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-[#0d6084] hover:border-cyan-400 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-[#0d6084] hover:border-[#0d6084] hover:text-white'
                  )}
                >
                  Falar com Especialista
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
