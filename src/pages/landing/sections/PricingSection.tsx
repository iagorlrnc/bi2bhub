import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getClientSubdomainUrl } from '@/utils/subdomain'
import {
  CheckCircle2,
  ArrowRight,
  PhoneCall,
} from 'lucide-react'

interface PricingSectionProps {
  isDark?: boolean
}

const plans = [
  {
    name: 'Plano Essencial',
    desc: 'Ideal para micro e pequenas empresas que buscam conformidade fiscal e atendimento contábil ágil.',
    monthly: '299',
    yearly: '224',
    users: 'Até 5 usuários no portal',
    features: [
      'Contabilidade completa para Simples Nacional',
      'Emissão e envio de DAS e tributos',
      'Bi2B Drive Cloud (10GB de armazenamento)',
      'Suporte por chamados com contador CRC',
    ],
    pop: false,
    cta: 'Começar Agora',
    isSpecialist: false,
  },
  {
    name: 'Plano Pro',
    desc: 'Para empresas em expansão que exigem inteligência financeira, BPO e relatórios de DRE.',
    monthly: '599',
    yearly: '449',
    users: 'Usuários ilimitados no portal',
    features: [
      'Tudo do Plano Essencial',
      'BPO Financeiro (conciliação diária)',
      'Planejamento tributário trimestral',
      'Relatórios gerenciais de DRE mensal',
      'Atendimento telefônico direto',
    ],
    pop: true,
    cta: 'Escolher Plano Pro',
    isSpecialist: false,
  },
  {
    name: 'Plano Corporativo',
    desc: 'Solução sob medida com consultoria tributária avançada e auditoria contábil dedicada.',
    monthly: 'Sob Consulta',
    yearly: 'Sob Consulta',
    users: 'Usuários & filiais ilimitadas',
    features: [
      'Atendimento dedicado exclusivo',
      'Contabilidade Lucro Real / Presumido',
      'Auditoria fiscal contínua',
      'Integrações customizadas de ERP',
      'Contador sênior dedicado',
    ],
    pop: false,
    cta: 'Falar com Especialista',
    isSpecialist: true,
  },
]

export function PricingSection({ isDark }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <section id="planos" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[#0d6084] dark:text-cyan-300 font-extrabold text-xs uppercase tracking-widest">
            Investimento Transparente
          </div>

          <h2
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-sans',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Planos Sob Medida para o{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              Crescimento da Sua Empresa
            </span>
          </h2>

          <p className={cn('text-base sm:text-lg leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
            Escolha o plano ideal com acesso total ao Portal do Cliente Bi2B.
          </p>
        </div>

        {/* Billing Period Toggle */}
        <div className="flex items-center justify-center">
          <div
            className={cn(
              'p-1.5 rounded-full border flex items-center gap-1 backdrop-blur-md',
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
            )}
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                'px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer',
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white shadow-md'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Mensal
            </button>

            <button
              onClick={() => setBillingPeriod('yearly')}
              className={cn(
                'px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer',
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white shadow-md'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span>Anual</span>
              <span className="bg-cyan-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full">
                -25% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Grid de Cards dos Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={cn(
                'rounded-3xl border text-left p-8 flex flex-col justify-between relative backdrop-blur-xl shadow-xl',
                p.pop
                  ? isDark
                    ? 'bg-gradient-to-b from-[#08152b] via-[#040d1c] to-[#030814] border-2 border-cyan-400 shadow-cyan-950/40'
                    : 'bg-white border-2 border-[#0d6084] shadow-2xl'
                  : isDark
                  ? 'bg-[#040914] border-white/10'
                  : 'bg-white border-slate-200'
              )}
            >
              {p.pop && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md border border-cyan-400/40">
                    Mais Recomendado
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                    {p.name}
                  </h3>
                </div>

                <p className={cn('text-xs leading-relaxed mb-6 min-h-[36px]', isDark ? 'text-slate-300' : 'text-slate-600')}>
                  {p.desc}
                </p>

                {/* Preço ou Sob Consulta */}
                <div className="flex items-baseline gap-1 mb-6 border-b pb-6 border-slate-200 dark:border-white/10">
                  {p.isSpecialist ? (
                    <div className="py-1">
                      <span className={cn('text-2xl font-black', isDark ? 'text-white' : 'text-slate-900')}>
                        Sob Consulta
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className={cn('text-sm font-semibold', isDark ? 'text-slate-400' : 'text-slate-500')}>R$</span>
                      <span className={cn('text-4xl font-extrabold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                        {billingPeriod === 'monthly' ? p.monthly : p.yearly}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/ mês</span>
                    </>
                  )}
                </div>

                {/* Benefícios */}
                <ul className="space-y-3.5 text-xs mb-8">
                  <li className="flex items-center gap-2.5 font-bold text-cyan-400">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    {p.users}
                  </li>
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 leading-snug">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de Ação */}
              <button
                onClick={() => {
                  if (p.isSpecialist) {
                    const el = document.querySelector('#contato')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    window.location.href = getClientSubdomainUrl('/auth/register')
                  }
                }}
                className={cn(
                  'w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer border shadow-md',
                  p.pop
                    ? 'bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white border-cyan-400/40'
                    : isDark
                    ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-[#0d6084] hover:text-white'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-[#0d6084] hover:text-white'
                )}
              >
                {p.isSpecialist ? (
                  <>
                    <PhoneCall className="w-4 h-4 text-cyan-400" />
                    {p.cta}
                  </>
                ) : (
                  <>
                    {p.cta}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
