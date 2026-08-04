import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FaqSectionProps {
  isDark: boolean
}

export interface FaqItem {
  question: string
  answer: string
  category: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Atendimento & CRC',
    question: 'Como funciona o atendimento contábil da Bi2B?',
    answer: 'Você fala direto com um contador especialista com registro ativo no CRC responsável pela sua conta. O atendimento é feito por telefone, e-mail ou WhatsApp direto, sem robôs ou respostas genéricas.'
  },
  {
    category: 'Acesso & Documentos',
    question: 'Como minha empresa acessa as guias de impostos e relatórios?',
    answer: 'Pelo Portal do Cliente Bi2B. Você e sua equipe acessam a qualquer momento para baixar guias de impostos (DAS, ISS, FGTS), balancetes gerenciais (DRE) e certidões CNDs atualizadas.'
  },
  {
    category: 'Segurança & Privacidade',
    question: 'Nossos dados e documentos ficam seguros?',
    answer: 'Sim, totalmente. A plataforma utiliza ambiente criptografado SSL 256-bit e está em estrita conformidade com a LGPD (Lei nº 13.709/2018), garantindo sigilo absoluto das suas informações financeiras.'
  },
  {
    category: 'Impostos & Planejamento',
    question: 'A Bi2B realiza planejamento tributário para reduzir meus impostos?',
    answer: 'Sim. Analisamos periodicamente o enquadramento fiscal do seu negócio (Simples Nacional, Lucro Presumido ou Lucro Real) para aplicar todas as isenções e benefícios previstos em lei.'
  },
  {
    category: 'Equipe & Permissões',
    question: 'Posso cadastrar colaboradores da minha empresa no portal?',
    answer: 'Sim. O gestor pode convidar membros da equipe financeira ou administrativa e definir exatamente quais pastas e relatórios cada pessoa pode visualizar.'
  }
]

export function FaqSection({ isDark }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'faq-json-ld'
    script.textContent = JSON.stringify(faqSchema)
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById('faq-json-ld')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <section
      id="faq"
      className={cn(
        "py-24 border-b relative overflow-hidden",
        isDark ? "bg-[#040914] border-white/10 text-slate-100" : "bg-white border-slate-200 text-slate-900"
      )}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Seção FAQ Estático */}
        <div className="text-center space-y-4 mb-16">
          <div className={cn(
            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border",
            isDark ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-[#0d6084]/10 border-[#0d6084]/20 text-[#0d6084]"
          )}>
            <span>Tire Suas Dúvidas</span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Perguntas <span className="font-sans font-black bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">Frequentes</span>
          </h2>
          <p className={cn("max-w-2xl mx-auto text-base sm:text-lg leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
            Respostas diretas e transparentes sobre nossos serviços contábeis e o Portal do Cliente.
          </p>
        </div>

        {/* Lista de Acordeões Estáticos */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={item.question}
                className={cn(
                  "rounded-2xl border overflow-hidden",
                  isDark
                    ? isOpen ? "bg-[#060e20] border-cyan-500/40 shadow-lg shadow-cyan-950/20" : "bg-[#060e20]/60 border-white/10 hover:border-white/20"
                    : isOpen ? "bg-white border-[#0d6084]/40 shadow-md shadow-slate-200" : "bg-white border-slate-200 hover:border-slate-300"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer font-bold text-base sm:text-lg"
                >
                  <span className={cn(isOpen && (isDark ? "text-cyan-300" : "text-[#0d6084]"))}>
                    {item.question}
                  </span>
                  <div className={cn(
                    "p-2 rounded-full border flex-shrink-0",
                    isOpen ? "rotate-180 bg-cyan-500/20 border-cyan-500/40 text-cyan-400" : "bg-transparent border-white/10 text-slate-400"
                  )}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className={cn(
                    "px-6 pb-6 text-sm sm:text-base leading-relaxed border-t pt-4 font-normal",
                    isDark ? "text-slate-300 border-white/5" : "text-slate-600 border-slate-200"
                  )}>
                    {item.answer}
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
