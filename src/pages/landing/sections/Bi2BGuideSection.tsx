import teamImg from '@/assets/team-bi2b.jpg'
import { ShieldCheck, Award, Users2 } from 'lucide-react'

export function Bi2BGuideSection() {
  const credentials = [
    { icon: ShieldCheck, text: 'Contadores Registrados no CRC-TO' },
    { icon: Award, text: '+15 anos de atuação no comércio regional' },
    { icon: Users2, text: 'Reunião estratégica mensal com os sócios' },
  ]

  return (
    <section className="bi2b-section bi2b-on-light">
      <div className="bi2b-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column Text */}
          <div>
            <span className="bi2b-eyebrow bi2b-reveal mb-3">Quem caminha com você</span>
            <h2 className="text-2xl sm:text-3xl md:text-[2.2rem] font-bold text-[#0C1E28] max-w-[22ch] mt-3.5 mb-5 leading-tight font-heading">
              Você não precisa virar especialista em finanças para saber se o seu negócio dá lucro.
            </h2>
            
            <p className="bi2b-lead bi2b-reveal text-base sm:text-lg max-w-[58ch] mb-4 text-[#59707B] leading-relaxed">
              Essa é a nossa parte. A Bi2B é uma consultoria de inteligência financeira formada por contadores registrados no CRC, que traduz os dados do seu comércio em{' '}
              <strong className="text-[#0B4F6C] font-bold">decisões práticas</strong> — não em pilhas de relatórios para você decifrar sozinho.
            </p>
            
            <p className="bi2b-lead bi2b-reveal text-base sm:text-lg max-w-[58ch] mb-6 text-[#59707B] leading-relaxed">
              Nosso compromisso: não instalamos um painel para depois desaparecer. Sentamos com você{' '}
              <strong className="text-[#0B4F6C] font-bold">todo mês</strong>, com os números na tela e o plano de ação pronto.
            </p>

            {/* Credential Badges */}
            <div className="space-y-2.5 pt-2 bi2b-reveal">
              {credentials.map((cred, idx) => {
                const Icon = cred.icon
                return (
                  <div key={idx} className="flex items-center gap-3 text-sm text-[#0C1E28] font-medium">
                    <div className="w-7 h-7 rounded-full bg-[#0B4F6C]/10 text-[#0B4F6C] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{cred.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column Photo */}
          <div className="bi2b-reveal relative">
            <figure className="relative z-10">
              <img
                src={teamImg}
                alt="Sócios-fundadores da Bi2B Consultoria"
                className="w-full rounded-[22px] aspect-[4/5] object-cover shadow-[0_30px_60px_-30px_rgba(11,79,108,0.5)] border border-[#0B4F6C]/15"
              />
              
              {/* Floating Verified Badge */}
              <div className="absolute -bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-[#0B4F6C]/20 p-3.5 rounded-xl shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="font-heading font-bold text-xs text-[#0C1E28] block">
                      Sócios-fundadores da Bi2B
                    </span>
                    <span className="font-mono text-[0.66rem] text-[#59707B]">
                      Palmas/TO · Atendimento Presencial &amp; Digital
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[0.68rem] bg-[#0B4F6C] text-white px-2.5 py-1 rounded-md font-bold">
                  CRC-TO
                </span>
              </div>

              {/* Decorative Frame */}
              <span
                className="absolute -right-3 -top-3 w-[64%] h-[64%] border-2 border-[#0B4F6C]/30 rounded-[22px] -z-10 pointer-events-none hidden sm:block"
                aria-hidden="true"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
