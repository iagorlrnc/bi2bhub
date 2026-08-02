import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
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
    category: 'Acesso & Documentos',
    question: 'Como minha empresa acessa os impostos e documentos mensais?',
    answer: 'Sua empresa recebe avisos sempre que um novo documento estiver disponível. Basta acessar a plataforma a qualquer momento para visualizar, baixar e guardar tudo de forma organizada, sem precisar procurar em trocas de e-mail.'
  },
  {
    category: 'Segurança & Privacidade',
    question: 'Nossos dados e documentos ficam seguros na plataforma?',
    answer: 'Sim, a segurança é prioridade. Cada empresa conta com um ambiente exclusivo e protegido por senha, garantindo privacidade total e que apenas pessoas autorizadas da sua equipe tenham acesso aos arquivos.'
  },
  {
    category: 'Atendimento & Dúvidas',
    question: 'Como funciona o suporte para tirar dúvidas e fazer solicitações?',
    answer: 'Você pode enviar mensagens e pedidos diretamente pela plataforma, separados pelo assunto desejado. Todo o histórico de conversas e arquivos enviados fica salvo para acompanhamento fácil e respostas rápidas.'
  },
  {
    category: 'Equipe & Acessos',
    question: 'Posso cadastrar outras pessoas da minha empresa para usar a plataforma?',
    answer: 'Sim. O responsável pela conta pode convidar membros da sua equipe e definir exatamente o que cada pessoa pode visualizar e utilizar dentro do sistema.'
  },
  {
    category: 'Uso & Planos',
    question: 'Como faço para começar a usar a plataforma no meu negócio?',
    answer: 'É muito simples. Você pode fazer seu cadastro em poucos minutos pelo próprio site ou entrar em contato com nosso time para tirar dúvidas e escolher o plano ideal para a sua empresa.'
  }
]

export function FaqSection({ isDark }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Injetar dados estruturados Schema.org FAQPage dinamicamente para SEO & GEO
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Seção FAQ */}
        <div className="text-center space-y-4 mb-16">
          <div className={cn(
            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border",
            isDark ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-[#0d6084]/10 border-[#0d6084]/20 text-[#0d6084]"
          )}>
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Perguntas Frequentes (FAQ)</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Tire Suas Dúvidas Sobre o <span className="bg-gradient-to-r from-cyan-400 to-[#0d6084] bg-clip-text text-transparent">BI2B Hub</span>
          </h2>
          <p className={cn("max-w-2xl mx-auto text-base sm:text-lg leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
            Respostas simples e diretas sobre como a plataforma facilita o dia a dia da sua empresa.
          </p>
        </div>

        {/* Lista de Acordeões Accordion */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isDark
                    ? isOpen ? "bg-white/[0.06] border-cyan-500/40 shadow-lg shadow-cyan-950/20" : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    : isOpen ? "bg-slate-50 border-[#0d6084]/40 shadow-md shadow-slate-200" : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer font-bold text-base sm:text-lg transition-colors"
                >
                  <span className={cn(isOpen && (isDark ? "text-cyan-300" : "text-[#0d6084]"))}>
                    {item.question}
                  </span>
                  <div className={cn(
                    "p-2 rounded-full border transition-transform duration-300 flex-shrink-0",
                    isOpen ? "rotate-180 bg-cyan-500/20 border-cyan-500/40 text-cyan-400" : "bg-transparent border-white/10 text-slate-400"
                  )}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className={cn(
                        "px-6 pb-6 text-sm sm:text-base leading-relaxed border-t pt-4",
                        isDark ? "text-slate-300 border-white/5" : "text-slate-600 border-slate-200"
                      )}>
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
