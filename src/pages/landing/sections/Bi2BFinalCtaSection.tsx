import { MessageCircle, Mail } from 'lucide-react'

export function Bi2BFinalCtaSection() {
  const whatsappUrl =
    'https://wa.me/5563999999999?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20diagn%C3%B3stico%20gratuito%20com%20a%20Bi2B'

  return (
    <section
      id="agendar"
      className="bi2b-section text-center border-t border-[#0B4F6C]/10 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--bi2b-paper), #EEF5F8)',
      }}
    >
      <div className="bi2b-wrap relative z-10">
        <div className="max-w-3xl mx-auto">
          <span className="bi2b-eyebrow bi2b-reveal mx-auto mb-3">Comece agora</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0C1E28] mb-4 leading-tight font-heading">
            Pare de decidir no escuro.
          </h2>
          <p className="bi2b-lead bi2b-reveal text-base sm:text-xl text-[#59707B] max-w-[46ch] mx-auto mb-8">
            Agende um diagnóstico gratuito e veja, com seus dados reais, onde o seu comércio pode estancar perdas e faturar mais.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bi2b-reveal">
            <a
              className="bi2b-btn bi2b-btn-primary text-sm sm:text-base py-4 px-8 shadow-lg shadow-[#0B4F6C]/25 group w-full sm:w-auto"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>Agendar Diagnóstico Gratuito</span>
              <span className="bi2b-arrow text-xl">→</span>
            </a>
          </div>

          <div className="mt-5 bi2b-resp-note justify-center bi2b-reveal">
            <span className="bi2b-pulse" />
            <span>Atendimento humano · Retorno em até 2 horas úteis</span>
          </div>

          <div className="mt-8 pt-6 border-t border-[#0B4F6C]/10 flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm font-mono text-[#59707B] bi2b-reveal">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0B4F6C] hover:underline font-semibold flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Direto
            </a>
            <span>·</span>
            <a
              href="mailto:contato@bi2b.com.br"
              className="text-[#0B4F6C] hover:underline font-semibold flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              contato@bi2b.com.br
            </a>
            <span>·</span>
            <span>Palmas/TO</span>
          </div>
        </div>
      </div>
    </section>
  )
}
