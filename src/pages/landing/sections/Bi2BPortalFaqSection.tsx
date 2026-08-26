import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

export function Bi2BPortalFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs: FaqItem[] = [
    {
      question: 'O acesso ao Portal do Cliente tem custo adicional?',
      answer:
        'Não. O Portal do Cliente Bi2B está 100% incluso em todos os planos da Bi2B Consultoria, sem taxas extras de licença, manutenção ou limite de downloads de guias e documentos.',
    },
    {
      question: 'Quantos usuários da minha empresa podem ter acesso?',
      answer:
        'Você pode cadastrar múltiplos operadores (como equipe financeira, departamento de compras e sócios) e configurar as permissões de acesso de cada um de acordo com as necessidades da sua empresa.',
    },
    {
      question: 'Como sou notificado quando uma nova guia de imposto for emitida?',
      answer:
        'Você recebe um alerta automático por e-mail no momento da emissão, além de visualizar avisos destacados e com cronômetro de vencimento diretamente no painel principal do portal.',
    },
    {
      question: 'Posso acessar o Portal Bi2B através do celular?',
      answer:
        'Sim! A interface do portal é totalmente responsiva e foi otimizada para smartphones e tablets, permitindo consultar certidões, autorizar pagamentos e enviar comprovantes de onde você estiver.',
    },
    {
      question: 'Como funciona o envio de documentos para o fechamento mensal?',
      answer:
        'Basta acessar o módulo de Tarefas Mensais e arrastar os arquivos correspondentes (extratos bancários, XMLs e comprovantes). O sistema registra a entrega imediatamente e notifica seu contador.',
    },
    {
      question: 'E se eu tiver dúvidas sobre um cálculo ou imposto?',
      answer:
        'Você pode abrir um chamado direto pelo módulo de Atendimento CRC no portal. Nosso time de contadores registrados responde em até 2 horas úteis com orientações claras.',
    },
  ]

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="bi2b-eyebrow bi2b-reveal in mx-auto mb-3">Tire suas dúvidas</span>
          <h2 className="text-2xl sm:text-3xl md:text-[2.2rem] font-bold text-[#0C1E28] mb-3 leading-tight font-heading bi2b-reveal in">
            Dúvidas frequentes sobre o Portal
          </h2>
          <p className="text-base sm:text-lg text-[#59707B] bi2b-reveal in">
            Tudo o que você precisa saber sobre o acesso, guias, segurança e rotinas da plataforma.
          </p>
        </div>

        <div className="max-w-[780px] mx-auto space-y-3 bi2b-reveal in">
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
