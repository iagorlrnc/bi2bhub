import { CheckCircle2 } from 'lucide-react'

export function Bi2BTransformSection() {
  const benefits = [
    {
      title: 'Compra certa e sem excesso',
      desc: 'Compre apenas o que tem giro comprovado na sua curva ABC.',
    },
    {
      title: 'Margem real em cada produto',
      desc: 'Elimine itens que trazem prejuízo e potencialize os mais lucrativos.',
    },
    {
      title: 'Caixa previsto a 60 dias',
      desc: 'Saiba com semanas de antecedência antes de qualquer aperto.',
    },
    {
      title: 'Estratégia na Reforma Tributária',
      desc: 'Planejamento preventivo para pagar apenas o justo por lei.',
    },
  ]

  return (
    <section className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6">
            <span className="bi2b-eyebrow bi2b-reveal mb-3">A virada</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-[#0C1E28] max-w-[20ch] mt-2 mb-5 leading-tight font-heading">
              Imagine dirigir o seu comércio com o painel ligado.
            </h2>
            <p className="text-base sm:text-lg text-[#59707B] leading-relaxed bi2b-reveal mb-6">
              Você compra certo, sabe exatamente qual produto dá lucro e qual só ocupa espaço, antecipa seu caixa e dorme tranquilo sabendo que cada decisão tem número sólido por trás.
            </p>
            <p className="text-base sm:text-lg text-[#0C1E28] font-semibold leading-relaxed bi2b-reveal">
              Deixe de ser o dono que decide na incerteza e vire{' '}
              <span className="text-[#0B4F6C] font-bold border-b-2 border-[#0B4F6C] pb-0.5">
                o dono que decide com números na mão
              </span>
              .
            </p>
          </div>

          {/* Right Benefits Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bi2b-reveal">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#0B4F6C]/15 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#0B4F6C]/10 text-[#0B4F6C] flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0B4F6C]" />
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#0C1E28] mb-1">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#59707B] leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
