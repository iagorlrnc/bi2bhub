import { Building2, ShieldCheck, Award } from 'lucide-react'

export function Bi2BTrustMarqueeSection() {
  const partners = [
    { name: 'Rede Contábil Brasil', tag: 'Associação Nacional', icon: Building2 },
    { name: 'Valor Contábil Associados', tag: 'São Paulo / SP', icon: ShieldCheck },
    { name: 'Alpha Auditores & Consultores', tag: 'Curitiba / PR', icon: Award },
    { name: 'Metrópole Gestão Contábil', tag: 'Belo Horizonte / MG', icon: Building2 },
    { name: 'Vértice Contabilidade Estratégica', tag: 'Rio de Janeiro / RJ', icon: ShieldCheck },
    { name: 'Prisma Soluções Tributárias', tag: 'Goiânia / GO', icon: Award },
    { name: 'Nexus Assessoria Fiscal', tag: 'Florianópolis / SC', icon: Building2 },
    { name: 'Inovare Contabilidade & BPO', tag: 'Salvador / BA', icon: ShieldCheck },
  ]

  return (
    <section className="py-10 bg-[#062939] border-y border-white/10 overflow-hidden relative">
      {/* Subtle Side Fade Overlays for Infinite Loop */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#062939] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#062939] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 text-center mb-6">
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#AEC3CE] uppercase font-mono">
          Confiado por mais de 150 escritórios contábeis de alta performance em todo o Brasil
        </p>
      </div>

      {/* Marquee Track */}
      <div className="flex w-full overflow-hidden select-none">
        <div className="flex shrink-0 animate-marquee items-center gap-6 sm:gap-10 py-2">
          {partners.concat(partners).map((partner, index) => {
            const Icon = partner.icon
            return (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-2.5 rounded-md bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors backdrop-blur-sm group"
              >
                <span className="p-2 rounded-sm bg-cyan-500/10 text-cyan-300 group-hover:bg-cyan-500/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
                    {partner.name}
                  </div>
                  <div className="text-[10px] text-[#AEC3CE] font-medium font-mono uppercase">
                    {partner.tag}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
