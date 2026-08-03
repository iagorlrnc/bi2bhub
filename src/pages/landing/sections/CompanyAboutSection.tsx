import { cn } from '@/lib/utils'
import { ShieldCheck, HeartHandshake, Award, CheckCircle } from 'lucide-react'

interface CompanyAboutSectionProps {
  isDark?: boolean
}

export function CompanyAboutSection({ isDark }: CompanyAboutSectionProps) {
  return (
    <section id="sobre" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Main Grid: Story + Pillars Estáticos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0d6084]/30 bg-[#0d6084]/10 text-[#0d6084] dark:text-cyan-300 font-extrabold text-xs uppercase tracking-widest">
              Sobre o atendimento
            </div>

            <h2
              className={cn(
                'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-sans leading-[1.15]',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Atendimento Humano e Proativo com{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
                Total Segurança
              </span>
            </h2>

            <p
              className={cn(
                'text-base sm:text-lg leading-relaxed font-normal',
                isDark ? 'text-slate-300' : 'text-slate-600'
              )}
            >
              A <strong>Bi2B Consultoria Contábil</strong> é guiada pelo compromisso de proximidade e transparência com o empresário. Entendemos os desafios da gestão de negócios e oferecemos assessoria constante para que você durma tranquilo.
            </p>

            <p
              className={cn(
                'text-base leading-relaxed',
                isDark ? 'text-slate-400' : 'text-slate-600'
              )}
            >
              Nossa equipe de contadores e consultores qualificados acompanha os tributos, folhas de pagamento e movimentações da sua empresa, identificando oportunidades legais de economia fiscal.
            </p>

            {/* Checklist Legível */}
            <div className="pt-2 space-y-3">
              {[
                'Equipe experiente com registro ativo no CRC',
                'Comunicação simples e atendimento direto por telefone e WhatsApp',
                'Contabilidade digital organizada para facilitar seu dia a dia',
                'Orientação fiscal constante antes que os impostos vençam',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                  <span className={cn('text-sm sm:text-base font-medium', isDark ? 'text-slate-200' : 'text-slate-800')}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3 Strategic Pillars Estáticos */}
          <div className="lg:col-span-6 space-y-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Conformidade Fiscal Absoluta',
                desc: 'Rigoroso controle contábil para garantir que sua empresa opere 100% regularizada perante a Receita Federal.',
              },
              {
                icon: HeartHandshake,
                title: 'Respostas Diretas sem Robôs',
                desc: 'Você fala com o contador responsável pela sua conta. Dúvidas resolvidas de forma rápida e clara.',
              },
              {
                icon: Award,
                title: 'Planejamento e Redução de Custo',
                desc: 'Revisão periódica do regime tributário para pagar apenas os impostos estritamente necessários pela lei.',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className={cn(
                    'p-6 rounded-2xl border flex items-start gap-4',
                    isDark
                      ? 'bg-[#060e20] border-white/10'
                      : 'bg-white border-slate-200 shadow-sm'
                  )}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d6084] to-[#0a4a62] flex items-center justify-center text-white shrink-0 shadow-md">
                    <Icon className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        'text-lg font-bold mb-1',
                        isDark ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      className={cn(
                        'text-sm leading-relaxed',
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      )}
                    >
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
