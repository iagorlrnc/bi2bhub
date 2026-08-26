import { useState } from 'react'
import { ChevronDown, ShieldCheck, Layers, Headphones, Rocket } from 'lucide-react'

export function Bi2BCategorizedFaqSection() {
  const [activeCategory, setActiveCategory] = useState<string>('implantacao')
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(0)

  const categories = [
    { id: 'implantacao', label: 'Primeiros Passos & Setup', icon: Rocket },
    { id: 'seguranca', label: 'Segurança & LGPD', icon: ShieldCheck },
    { id: 'multitenant', label: 'Módulos & Multi-Tenant', icon: Layers },
    { id: 'suporte', label: 'Suporte & Atendimento', icon: Headphones },
  ]

  const faqs: Record<string, Array<{ q: string; a: string }>> = {
    implantacao: [
      {
        q: 'Quanto tempo leva para implantar a plataforma Bi2b no meu escritório?',
        a: 'A implantação inicial leva em média de 48 horas a 7 dias úteis. Nossa equipe técnica auxilia na personalização da marca white-label, importação da lista de clientes em lote e treinamento da equipe de operadores.',
      },
      {
        q: 'Meus clientes precisam instalar algum aplicativo pesado?',
        a: 'Não. O portal Bi2b é 100% web, responsivo e baseado em nuvem. Seus clientes acessam diretamente pelo navegador no computador ou no celular através do endereço personalizado com o domínio do seu escritório.',
      },
      {
        q: 'Como é feita a importação da minha carteira de clientes atual?',
        a: 'Disponibilizamos modelos de importação em planilha (.CSV / Excel) e conectores com os principais softwares contábeis do mercado para carregar centenas de CNPJs e usuários em poucos minutos.',
      },
    ],
    seguranca: [
      {
        q: 'Como funciona o isolamento dos dados dos meus clientes (Multi-Tenant)?',
        a: 'Cada empresa cliente possui um tenant estritamente isolado por chaves criptográficas e políticas de segurança em nível de banco de dados (Row Level Security). Um cliente jamais terá acesso ou visibilidade sobre arquivos ou dados de outra empresa.',
      },
      {
        q: 'A plataforma Bi2b está em conformidade com a LGPD?',
        a: 'Sim, 100% em conformidade. Todos os logs de acesso, downloads de documentos e ações de operadores são registrados de forma imutável para fins de auditoria, além de backups diários e criptografia AES-256.',
      },
    ],
    multitenant: [
      {
        q: 'Posso personalizar o portal com a minha própria identidade visual?',
        a: 'Com certeza! No plano White-Label, você define o logotipo, cores predominantes, favicons e endereço personalizado (ex.: portal.seuescritorio.com.br). Toda a experiência é focada na valorização da sua marca.',
      },
      {
        q: 'O que acontece quando uma nova guia fiscal é disponibilizada?',
        a: 'O robô de notificações do Bi2b envia automaticamente um aviso para o e-mail cadastrado dos responsáveis financeiros da empresa cliente com o link direto e o código de barras para pagamento rápido.',
      },
    ],
    suporte: [
      {
        q: 'Como funciona o canal de chamados e suporte CRC?',
        a: 'A plataforma conta com um módulo de chamados estruturado. O cliente seleciona a categoria da dúvida (Fiscal, DP, Contábil, Societário), anexa arquivos e recebe um número de protocolo com SLA monitorado pelo gestor.',
      },
      {
        q: 'Existe limite de armazenamento de documentos no Bi2B Drive Cloud?',
        a: 'Os planos corporativos contam com franquias generosas e flexíveis de armazenamento na nuvem com alta redundância, garantindo a guarda dos últimos 5 anos de obrigações fiscais sem custos abusivos.',
      },
    ],
  }

  const currentFaqs = faqs[activeCategory] || []

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#FAFAFA] text-[#0C1E28] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#083A50]/10 text-[#083A50] font-bold text-xs uppercase tracking-widest mb-4">
            Perguntas Frequentes
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#083A50] tracking-tight font-heading leading-tight mb-6">
            Dúvidas frequentes sobre a{' '}
            <span className="text-cyan-600 underline decoration-cyan-400 decoration-4">
              plataforma Bi2b
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Selecione uma categoria abaixo para encontrar respostas rápidas sobre tecnologia, segurança e implantação.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isSelected = activeCategory === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setOpenItemIndex(0)
                }}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-sm text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#083A50] text-cyan-300 shadow-sm ring-1 ring-[#083A50]/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {currentFaqs.map((faq, idx) => {
            const isOpen = openItemIndex === idx

            return (
              <div
                key={idx}
                className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm transition-all duration-200 hover:border-slate-300"
              >
                <button
                  onClick={() => setOpenItemIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-[#083A50] font-heading">
                    {faq.q}
                  </span>
                  <span
                    className={`p-1.5 rounded-sm bg-slate-100 text-slate-600 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#083A50] text-cyan-300' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.a}
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
