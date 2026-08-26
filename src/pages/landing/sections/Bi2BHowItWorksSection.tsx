import { Settings, UploadCloud, Cpu, Rocket, CheckCircle2 } from 'lucide-react'

export function Bi2BHowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: Settings,
      badge: 'ETAPA INICIAL',
      title: 'Onboarding & Customização White-Label',
      desc: 'Configuração da marca do seu escritório, logotipo, domínio próprio e parametrização dos módulos de atendimento.',
      duration: 'Em até 48 horas',
      details: 'Sua identidade visual 100% preservada em todas as telas.',
    },
    {
      step: '02',
      icon: UploadCloud,
      badge: 'INTEGRAÇÃO DE DADOS',
      title: 'Importação Rápida da Carteira de Clientes',
      desc: 'Importação de cadastros de clientes e empresas em lote através de planilhas ou integração com seu software contábil.',
      duration: 'Importação em minutos',
      details: 'Isolamento automático e envio de convites de acesso aos clientes.',
    },
    {
      step: '03',
      icon: Cpu,
      badge: 'AUTOMAÇÃO ATIVA',
      title: 'Parametrização de Robôs & Guias Fiscais',
      desc: 'Ativação das rotinas automáticas de notificação de DAS, ISS, CNDs e abertura de canais de chamados com SLA definido.',
      duration: 'Sem complexidade',
      details: 'Definição de permissões de acesso para analistas e operadores.',
    },
    {
      step: '04',
      icon: Rocket,
      badge: 'ESCALA COMPLETA',
      title: 'Operação e Escala em Piloto Automático',
      desc: 'Seus clientes ganham autonomia para consultar documentos e você expande a carteira sem precisar inflar os custos de equipe.',
      duration: 'Resultados contínuos',
      details: 'Redução média de 70% nas mensagens repetitivas.',
    },
  ]

  return (
    <section id="como-funciona" className="py-24 sm:py-32 bg-[#FAFAFA] text-[#0C1E28] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#083A50]/10 text-[#083A50] font-bold text-xs uppercase tracking-widest mb-4">
            Como Funciona
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#083A50] tracking-tight font-heading leading-tight mb-6">
            Da implantação à operação plena em{' '}
            <span className="text-cyan-600 underline decoration-cyan-400 decoration-4">
              4 etapas simples
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Nossa equipe de especialistas acompanha todo o processo para que seu escritório migre e colha resultados desde a primeira semana.
          </p>
        </div>

        {/* Steps Grid with Connecting Visual Path */}
        <div className="relative">
          {/* Subtle Connecting Line Background (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-cyan-400 via-[#083A50] to-cyan-500 -translate-y-12 z-0 opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-md p-5 sm:p-6 border border-slate-200 shadow-md hover:shadow-lg hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Step Number & Icon Header */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-3xl font-black font-heading text-slate-200 group-hover:text-cyan-600 transition-colors">
                        {item.step}
                      </span>
                      <span className="p-2.5 rounded-sm bg-[#083A50] text-cyan-300 group-hover:bg-cyan-500 group-hover:text-[#083A50] transition-colors shadow-sm">
                        <Icon className="w-5 h-5" />
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-sm border border-cyan-200 mb-3 inline-block">
                      {item.badge}
                    </span>

                    <h3 className="text-lg font-bold text-[#083A50] font-heading mb-3 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{item.details}</div>
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
