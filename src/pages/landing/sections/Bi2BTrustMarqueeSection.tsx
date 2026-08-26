import { Building2, ShieldCheck, Award } from 'lucide-react'

export function Bi2BTrustMarqueeSection() {
  const partners = [
    { name: 'Rede Contábil Tocantins', tag: 'Palmas / TO', icon: Building2 },
    { name: 'Distribuidora Araguaia Peças', tag: 'Araguaína / TO', icon: ShieldCheck },
    { name: 'Norte Materiais & Ferramentas', tag: 'Gurupi / TO', icon: Award },
    { name: 'Tocantins Auto Center', tag: 'Palmas / TO', icon: Building2 },
    { name: 'Centro-Oeste Atacado & Varejo', tag: 'Paraíso do TO', icon: ShieldCheck },
    { name: 'Capital Elétrica & Hidráulica', tag: 'Palmas / TO', icon: Award },
    { name: 'Mega Peças & Serviços', tag: 'Porto Nacional / TO', icon: Building2 },
    { name: 'Super Varejo Tocantins', tag: 'Palmas / TO', icon: ShieldCheck },
  ]

  return (
    <section className="py-8 bg-[#083A50] border-y border-white/10 overflow-hidden relative">
      {/* Subtle Side Fade Overlays for Infinite Loop */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#083A50] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#083A50] to-transparent z-10 pointer-events-none" />

      <div className="wrap text-center mb-4">
        <p className="text-xs font-semibold tracking-widest text-[#AEC3CE] uppercase font-mono">
          Inteligência financeira aplicada em comércios e distribuidoras no Tocantins
        </p>
      </div>

      {/* Marquee Track */}
      <div className="flex w-full overflow-hidden select-none">
        <div className="flex shrink-0 animate-marquee items-center gap-4 sm:gap-6 py-1">
          {partners.concat(partners).map((partner, index) => {
            const Icon = partner.icon
            return (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#0A465F] border border-white/10 transition-colors"
              >
                <span className="p-1.5 rounded-full bg-white/10 text-white">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <div className="text-left">
                  <div className="text-xs font-bold text-white tracking-tight whitespace-nowrap font-heading">
                    {partner.name}
                  </div>
                  <div className="text-[9px] text-[#AEC3CE] font-mono uppercase">
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

