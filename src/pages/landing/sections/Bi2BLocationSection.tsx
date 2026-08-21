import { MapPin, Clock, Navigation, Building2 } from 'lucide-react'

export function Bi2BLocationSection() {
  return (
    <section className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-center">
          {/* Left info */}
          <div>
            <span className="bi2b-eyebrow bi2b-reveal mb-3">Onde estamos</span>
            <h2 className="text-2xl sm:text-3xl md:text-[2.2rem] font-bold text-[#0C1E28] mt-2 mb-4 leading-tight font-heading">
              Atendimento presencial em Palmas e digital em todo o Tocantins.
            </h2>
            <p className="text-[#59707B] text-base mb-6 bi2b-reveal leading-relaxed">
              Nossa sede física está localizada na capital, mas nossa estrutura tecnológica atende comércios em todas as cidades da região norte e centro-oeste.
            </p>

            <div className="space-y-3 mb-6 bi2b-reveal">
              <div className="flex items-center gap-3 text-sm text-[#0C1E28]">
                <MapPin className="w-4 h-4 text-[#0B4F6C] shrink-0" />
                <span>Palmas/TO · Tocantins · Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#0C1E28]">
                <Clock className="w-4 h-4 text-[#0B4F6C] shrink-0" />
                <span>Segunda a Sexta · 08h às 18h (Horário de Brasília)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#0C1E28]">
                <Building2 className="w-4 h-4 text-[#0B4F6C] shrink-0" />
                <span>Reuniões presenciais na sua empresa ou em nosso escritório</span>
              </div>
            </div>

            <a
              className="bi2b-btn bi2b-btn-primary bi2b-reveal text-xs sm:text-sm py-3 px-6"
              href="https://www.google.com/maps/search/?api=1&query=Palmas+TO"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="w-4 h-4" />
              <span>Como chegar / Ver no Mapa</span>
              <span className="bi2b-arrow text-base">→</span>
            </a>
          </div>

          {/* Right Map Embed / Styled Card */}
          <div className="bi2b-reveal">
            <div className="aspect-[16/11] rounded-[22px] border border-[#0B4F6C]/20 bg-gradient-to-br from-[#083A50] to-[#0B4F6C] p-7 flex flex-col justify-between text-white shadow-xl shadow-[#083A50]/20 relative overflow-hidden">
              {/* Radial glow */}
              <div
                className="absolute right-0 top-0 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(56,189,248,0.2), transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <span className="font-mono text-[0.7rem] text-[#AEC3CE] tracking-wider uppercase block font-semibold mb-1">
                  SEDE OPERACIONAL
                </span>
                <h3 className="font-heading font-bold text-2xl text-white">
                  Palmas · Tocantins
                </h3>
                <p className="text-sm text-[#DCE8EE] mt-1">
                  Hub de Consultoria Financeira &amp; Contábil
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#AEC3CE]">
                <span>✓ Atendimento Presencial</span>
                <span>✓ Atendimento Digital Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
