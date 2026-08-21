import { Star, ShieldCheck, Quote } from 'lucide-react'

export function Bi2BReviewsSection() {
  const reviews = [
    {
      author: 'Carlos Eduardo M.',
      role: 'Sócio-Diretor',
      company: 'Auto Peças & Distribuidora',
      location: 'Palmas/TO',
      initials: 'CE',
      text: 'A gente faturava quase 400 mil por mês mas no fim do dia o caixa sempre apertava. A Bi2B mostrou que 30% do nosso capital estava apodrecendo em prateleira sem giro. Em 4 meses mudamos o jogo.',
    },
    {
      author: 'Renata Vasconcelos',
      role: 'Proprietária',
      company: 'Rede de Confecções & Varejo',
      location: 'Araguaína/TO',
      initials: 'RV',
      text: 'Ter a reunião mensal com o contador olhando os números do meu próprio sistema é o maior diferencial. Eles não me mandam planilha confusa, me dizem onde cortar e onde investir com segurança.',
    },
    {
      author: 'Marcos Silveira',
      role: 'Diretor Financeiro',
      company: 'Comércio de Materiais Elétricos',
      location: 'Palmas/TO',
      initials: 'MS',
      text: 'A consultoria combinada com o portal digital facilitou tudo. Agora acompanho impostos e DRE num clique e chego nas reuniões de compras sabendo exatamente qual o limite do caixa.',
    },
  ]

  return (
    <section className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <div className="text-center mb-12">
          <span className="bi2b-eyebrow bi2b-reveal mx-auto mb-2.5">
            O que dizem os clientes
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[2.3rem] font-bold text-[#0C1E28] mb-2 leading-tight font-heading">
            Avaliações de quem já tem o controle na mão.
          </h2>
          <p className="bi2b-lead bi2b-reveal text-base sm:text-lg text-[#59707B] max-w-[50ch] mx-auto">
            Empresários e gestores do comércio que transformaram sua gestão financeira com a Bi2B.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#0B4F6C]/15 rounded-[18px] p-6 sm:p-7 bi2b-reveal shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars Header + Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#FF0000]" aria-label="5 estrelas">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF0000] text-[#FF0000]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#0B4F6C]/20" />
                </div>

                {/* Review Text */}
                <p className="text-[#0C1E28] text-[0.94rem] leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[#0B4F6C]/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B4F6C] text-white flex items-center justify-center font-heading font-bold text-xs shrink-0 shadow-sm">
                  {rev.initials}
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-heading font-bold text-sm text-[#0C1E28] truncate">
                    {rev.author}
                  </div>
                  <div className="font-mono text-[0.72rem] text-[#59707B] truncate">
                    {rev.role} · {rev.company}
                  </div>
                  <div className="font-mono text-[0.68rem] text-[#0B4F6C] font-semibold">
                    {rev.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono text-[#59707B] bi2b-reveal">
          <ShieldCheck className="w-4 h-4 text-[#0B4F6C]" />
          <span>Depoimentos reais de clientes com contrato ativo em Palmas e região</span>
        </div>
      </div>
    </section>
  )
}
