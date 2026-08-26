import { SearchCheck, LayoutDashboard, CalendarRange, Zap, ArrowRight } from 'lucide-react'

export function Bi2BPlanSection() {
  const steps = [
    {
      num: '01',
      icon: SearchCheck,
      title: 'Diagnóstico Inicial',
      desc: 'Conectamos aos seus dados e, em uma única reunião objetiva, mostramos exatamente onde está vazando caixa e margem hoje.',
      badge: 'Primeira Reunião',
      isFeatured: false,
    },
    {
      num: '02',
      icon: LayoutDashboard,
      title: 'Painéis Vivos',
      desc: 'Implantamos os painéis que viram decisão imediata — fluxo de caixa, giro de estoque e margem real — sem esperar relatórios lentos.',
      badge: 'Visão em Tempo Real',
      isFeatured: false,
    },
    {
      num: '03',
      icon: CalendarRange,
      title: 'Reunião Estratégica Todo Mês',
      desc: 'Todo mês sentamos com você para ler os números juntos, antecipar compras e definir o próximo passo. Essa é a parte que ninguém mais faz.',
      badge: 'O Grande Diferencial',
      isFeatured: true,
    },
  ]

  return (
    <section className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bi2b-eyebrow bi2b-reveal mx-auto mb-3">Como funciona</span>
          <h2 className="text-2xl sm:text-3xl md:text-[2.3rem] font-bold text-[#0C1E28] mb-2 leading-tight font-heading">
            Simples de começar. Em apenas três passos.
          </h2>
          <p className="bi2b-lead bi2b-reveal text-base sm:text-lg text-[#59707B] max-w-[50ch] mx-auto">
            Sem projetos intermináveis. Você enxerga valor e oportunidades logo na primeira conversa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className={`bg-white rounded-[18px] p-7 sm:p-8 flex flex-col justify-between bi2b-reveal transition-all ${
                  step.isFeatured
                    ? 'border-2 border-[#0B4F6C] shadow-[0_20px_50px_-25px_rgba(11,79,108,0.5)] relative md:-translate-y-2'
                    : 'border border-[#0B4F6C]/15 shadow-sm hover:shadow-md hover:border-[#0B4F6C]/30'
                }`}
              >
                {step.isFeatured && (
                  <span className="absolute -top-3.5 left-6 bg-[#0B4F6C] text-white font-mono text-[0.66rem] tracking-wider py-1 px-3 rounded-md uppercase font-bold shadow-sm flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#FF0000]" />
                    <span>{step.badge}</span>
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-base font-bold text-[#0B4F6C] tracking-widest block">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#0B4F6C]/10 text-[#0B4F6C] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0C1E28] mb-2.5 font-heading">
                    {step.title}
                  </h3>

                  <p className="text-[#59707B] text-sm sm:text-[0.95rem] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {!step.isFeatured && (
                  <div className="mt-5 pt-3 border-t border-[#0B4F6C]/10 font-mono text-[0.72rem] text-[#0B4F6C] font-semibold">
                    Etapa {step.num} · {step.badge}
                  </div>
                )}
                {step.isFeatured && (
                  <div className="mt-5 pt-3 border-t border-[#0B4F6C]/10 font-mono text-[0.72rem] text-[#0B4F6C] font-bold">
                    Acompanhamento contínuo registrado no CRC
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10 bi2b-reveal">
          <a
            href="#agendar"
            className="inline-flex items-center gap-2 font-heading font-bold text-sm text-[#0B4F6C] hover:text-[#083A50] hover:underline"
          >
            <span>Quer ver como ficaria no seu comércio? Agende o diagnóstico</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
