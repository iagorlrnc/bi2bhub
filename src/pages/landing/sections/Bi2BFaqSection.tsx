import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

export function Bi2BFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FaqItem[] = [
    {
      question: 'Preciso entender de finanças ou análise de dados para ser cliente?',
      answer:
        'Não. Essa é exatamente a nossa função. Nossa equipe de contadores registrados traduz os números complexos em orientações práticas e claras para você tomar decisões de compras, preços e estoque.',
    },
    {
      question: 'Já tenho um escritório de contabilidade há anos. Preciso cancelar?',
      answer:
        'Não! Você pode manter o seu contador atual sem nenhum conflito. A Bi2B entra como o seu braço de Inteligência Financeira e Gestão. Caso no futuro você queira unificar a contabilidade conosco, também temos planos completos.',
    },
    {
      question: 'Como funciona o Portal do Cliente Bi2B?',
      answer:
        'Cada cliente tem acesso a uma plataforma digital segura onde ficam centralizados todos os impostos (DAS, ISS, FGTS), arquivos no Drive Cloud, chamados diretos com seu contador e os dashboards de faturamento em tempo real.',
    },
    {
      question: 'A Bi2B atende qual perfil de empresa?',
      answer:
        'Somos especializados em comércios, distribuidoras e varejos com controle de estoque físico — autopeças, materiais de construção, mercados, lojas de departamentos e vestuário.',
    },
    {
      question: 'O diagnóstico financeiro inicial tem custo ou compromisso?',
      answer:
        'Não. O diagnóstico inicial é 100% gratuito e serve para demonstrar, na prática com seus dados reais, onde existem oportunidades de ganho ou sangria de caixa. A decisão de contratar é sempre sua.',
    },
    {
      question: 'Qual é o tempo de resposta para dúvidas e suporte?',
      answer:
        'Nosso SLA padrão garante resposta a solicitações e chamados em até 2 horas úteis. Você fala diretamente com especialistas contábeis e financeiros, sem atendentes robóticos.',
    },
  ]

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="bi2b-eyebrow bi2b-reveal mx-auto mb-3">Tire suas dúvidas</span>
          <h2 className="text-2xl sm:text-3xl md:text-[2.2rem] font-bold text-[#0C1E28] mb-3 leading-tight font-heading bi2b-reveal">
            Perguntas frequentes
          </h2>
          <p className="text-base sm:text-lg text-[#59707B] bi2b-reveal">
            Tudo o que você precisa saber sobre a consultoria e o Portal do Cliente Bi2B.
          </p>
        </div>

        <div className="max-w-[780px] mx-auto space-y-3 bi2b-reveal">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#0B4F6C]/40 shadow-md shadow-[#0B4F6C]/5'
                    : 'border-[#0B4F6C]/15 hover:border-[#0B4F6C]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 font-heading font-semibold text-base sm:text-lg text-[#0C1E28] cursor-pointer hover:text-[#0B4F6C] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.question}</span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen ? 'bg-[#0B4F6C] text-white' : 'bg-[#0B4F6C]/10 text-[#0B4F6C]'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-[#59707B] text-sm sm:text-base leading-relaxed border-t border-[#0B4F6C]/10 pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
