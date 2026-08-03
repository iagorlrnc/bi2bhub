import { cn } from '@/lib/utils'
import { Building2, UserPlus, ShieldCheck, } from 'lucide-react'

interface HowItWorksSectionProps {
  isDark?: boolean
}

const steps = [
  {
    number: '01',
    title: 'Cadastro e Vínculo da Empresa (CNPJ)',
    description: 'Sua empresa é cadastrada e vinculada à sua conta no painel. Se você possui mais de uma empresa (matriz e filiais ou diferentes CNPJs), todas ficam acessíveis no mesmo perfil com troca simples de empresa.',
    icon: Building2,
    badge: 'Multi-Empresas',
  },
  {
    number: '02',
    title: 'Cadastro de Usuários e Permissões',
    description: 'Como gestor, você pode convidar colaboradores da sua equipe financeira ou administrativa e definir exatamente o que cada pessoa pode visualizar (apenas impostos, relatórios DRE ou chamados).',
    icon: UserPlus,
    badge: 'Gestão de Acessos',
  },
  {
    number: '03',
    title: 'Uso Diário & Suporte com Contador',
    description: 'Acesse guias de impostos com avisos de vencimento, consulte balancetes gerenciais e abra chamados com respostas rápidas do seu contador responsável pelo CRC.',
    icon: ShieldCheck,
    badge: 'Rotina Sem Burocracia',
  },
]

export function HowItWorksSection({ isDark }: HowItWorksSectionProps) {
  return (
    <section id="como-funciona" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[#0d6084] dark:text-cyan-300 font-extrabold text-xs uppercase tracking-widest">
            Onboarding & Estrutura
          </div>

          <h2
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-sans',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Como Funciona o Cadastro de{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              Empresas e Usuários
            </span>
          </h2>

          <p
            className={cn(
              'text-base sm:text-lg leading-relaxed font-normal',
              isDark ? 'text-slate-300' : 'text-slate-600'
            )}
          >
            Entenda o processo simples de entrada no painel e como organizar sua equipe com níveis de segurança individualizados.
          </p>
        </div>

        {/* Steps Grid Estático */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={cn(
                  'rounded-3xl p-8 border flex flex-col justify-between text-left relative',
                  isDark
                    ? 'bg-[#060e20] border-white/10'
                    : 'bg-white border-slate-200 shadow-md'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black bg-gradient-to-r from-[#0d6084] to-cyan-400 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d6084] to-[#0a4a62] flex items-center justify-center text-white shadow-md">
                      <Icon className="w-6 h-6 text-cyan-300" />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
                    {step.badge}
                  </span>

                  <h3 className={cn('text-xl font-bold mb-3', isDark ? 'text-white' : 'text-slate-900')}>
                    {step.title}
                  </h3>

                  <p className={cn('text-sm leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
