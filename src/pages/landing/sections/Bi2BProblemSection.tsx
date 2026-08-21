import { AlertTriangle, TrendingDown, Clock, UserX, AlertOctagon } from 'lucide-react'

export function Bi2BProblemSection() {
  const problems = [
    {
      num: '// 01',
      icon: AlertTriangle,
      title: 'Estoque sem giro',
      text: 'Compra mercadoria que fica parada na prateleira — e falta caixa para repor o que realmente vende todo dia.',
      highlight: 'capital travado',
    },
    {
      num: '// 02',
      icon: TrendingDown,
      title: 'Margens invisíveis',
      text: 'Tem produtos de alto giro vendendo com margem muito baixa, ou negativa, sem saber onde o lucro está escorrendo.',
      highlight: 'prejuízo oculto',
    },
    {
      num: '// 03',
      icon: Clock,
      title: 'Relatórios lentos',
      text: 'Depende de relatórios demorados do sistema que só chegam semanas depois, quando a decisão já precisava ter sido tomada ontem.',
      highlight: 'atraso crítico',
    },
    {
      num: '// 04',
      icon: UserX,
      title: 'Sem braço analítico',
      text: 'Não tem, dentro da empresa, nenhum especialista focado em olhar os números friamente e dizer o próximo passo.',
      highlight: 'decisão no escuro',
    },
  ]

  return (
    <section className="bi2b-section bi2b-on-primary border-t border-white/10 relative overflow-hidden">
      <div className="bi2b-wrap relative z-10">
        <span className="bi2b-eyebrow bi2b-reveal mb-3">O vilão é o achismo</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white max-w-[22ch] mt-2 mb-4 leading-tight font-heading">
          Trabalhar muito não é o mesmo que ganhar dinheiro.
        </h2>
        <p className="bi2b-lead text-[#AEC3CE] max-w-[54ch] mb-10 text-base sm:text-lg">
          A maioria dos comércios que fatura alto no Tocantins toma as decisões mais importantes baseado apenas na intuição:
        </p>

        {/* 4 Problem Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bi2b-reveal">
          {problems.map((prob, idx) => {
            const Icon = prob.icon
            return (
              <div
                key={idx}
                className="bg-[#0A465F] border border-white/15 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-white/30 transition-all shadow-md shadow-[#083A50]/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[#FF6B5E] text-[0.8rem] tracking-widest font-semibold">
                      {prob.num}
                    </span>
                    <span className="p-2 rounded-lg bg-white/10 text-[#FF6B5E]">
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-heading mb-2">
                    {prob.title}
                  </h3>

                  <p className="text-[#E4EDF1] text-sm sm:text-base leading-relaxed">
                    {prob.text}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-[#FF6B5E] font-mono">
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                  <span className="uppercase tracking-wider">Alerta: {prob.highlight}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/15 bi2b-reveal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-base sm:text-lg text-white max-w-[54ch] leading-relaxed">
            O problema do seu comércio não é falta de esforço da equipe. É decidir baseado no achismo — e{' '}
            <b className="text-[#FF6B5E] font-semibold">o achismo custa muito caro</b>.
          </p>
          <a
            href="#agendar"
            className="bi2b-btn bi2b-btn-primary text-xs sm:text-sm py-2.5 px-5 whitespace-nowrap"
          >
            <span>Ver diagnóstico gratuito</span>
          </a>
        </div>
      </div>
    </section>
  )
}
