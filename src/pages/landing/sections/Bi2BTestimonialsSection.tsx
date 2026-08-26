import { Quote, Star } from 'lucide-react'

export function Bi2BTestimonialsSection() {
  const testimonials = [
    {
      quote:
        'A Bi2B mudou a dinâmica da nossa empresa contábil. Nossos clientes não mandam mais mensagem no WhatsApp pedindo segunda via de DAS ou holerite: eles entram no portal com o nosso logo e baixam tudo na hora. Nossa equipe ganhou fôlego para fazer consultoria.',
      author: 'Dr. Marcelo Siqueira',
      role: 'Sócio-Fundador',
      office: 'Siqueira & Associados Contabilidade',
      location: 'São Paulo / SP',
      stats: '340 clientes no portal',
    },
    {
      quote:
        'O isolamento multi-tenant e os robôs de lembretes reduziram a inadimplência fiscal a praticamente zero. Além disso, a segurança da informação nos deu tranquilidade total perante a LGPD e nos contratos com grandes clientes.',
      author: 'Dra. Fernanda Vasconcelos',
      role: 'Diretora de Operações',
      office: 'Prisma Contabilidade & BPO',
      location: 'Belo Horizonte / MG',
      stats: '99.8% guias no prazo',
    },
    {
      quote:
        'Conseguimos dobrar nossa carteira de empresas nos últimos 12 meses sem precisar contratar mais dois analistas fiscais. O retorno financeiro e a percepção de valor dos nossos clientes foram imediatos.',
      author: 'Rodrigo Antunes, CRC',
      role: 'Contador Responsável',
      office: 'Vértice Soluções Fiscais',
      location: 'Curitiba / PR',
      stats: '+140% carteira expandida',
    },
  ]

  return (
    <section id="depoimentos" className="py-24 sm:py-32 bg-[#FAFAFA] text-[#0C1E28] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#083A50]/10 text-[#083A50] font-bold text-xs uppercase tracking-widest mb-4">
            Depoimentos de Parceiros
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#083A50] tracking-tight font-heading leading-tight mb-6">
            O que dizem os contadores que{' '}
            <span className="text-cyan-600 underline decoration-cyan-400 decoration-4">
              utilizam a Bi2b diariamente
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A opinião de quem vivencia os desafios reais de gerenciar carteiras de clientes e prazos fiscais exigentes.
          </p>
        </div>

        {/* Testimonials 3-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md border border-slate-200 shadow-md hover:shadow-lg hover:border-cyan-500/50 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-5 font-normal italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Strip */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#083A50] font-heading">
                    {t.author}
                  </h3>
                  <div className="text-[11px] text-slate-500">{t.role}</div>
                  <div className="text-[10px] font-mono text-cyan-700 font-semibold mt-0.5">
                    {t.office}
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-cyan-50 text-cyan-800 border border-cyan-200">
                  {t.stats}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
