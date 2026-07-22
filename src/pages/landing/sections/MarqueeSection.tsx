import { Hexagon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarqueeSectionProps {
  isDark: boolean
}

const banks = ['Nubank', 'Itaú', 'Banco do Brasil', 'Bradesco', 'Santander', 'C6 Bank', 'Inter', 'Stone', 'PagBank', 'Banco Safra', 'Banco BMG', 'Sicredi', 'Sicoob']

export function MarqueeSection({ isDark }: MarqueeSectionProps) {
  return (
    <section className={cn(
      "border-t border-b py-10 relative overflow-hidden",
      isDark ? "bg-slate-950/30 border-cyan-950/40" : "bg-slate-100/50 border-slate-200/60"
    )}>
      {/* Fading Edge Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none marquee-overlay-left" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none marquee-overlay-right" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className={cn("text-center text-xs font-semibold uppercase tracking-[0.25em] mb-6", isDark ? "text-slate-500" : "text-slate-400")}>
          Conexão Direta com Bancos e Órgãos Reguladores
        </p>
        <div className="flex items-center select-none overflow-hidden relative">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {banks.map((bank, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-center gap-2 py-2 cursor-pointer font-heading font-black text-sm uppercase tracking-[0.15em] transition-colors duration-300",
                  isDark ? "text-slate-400 hover:text-cyan-400" : "text-slate-500 hover:text-[#0d6084]"
                )}
              >
                <Hexagon className="h-3.5 w-3.5 text-cyan-500" />
                {bank}
              </div>
            ))}
            {/* Duplicar para loop contínuo perfeito */}
            {banks.map((bank, index) => (
              <div 
                key={`dup-${index}`} 
                className={cn(
                  "flex items-center gap-2 py-2 cursor-pointer font-heading font-black text-sm uppercase tracking-[0.15em] transition-colors duration-300",
                  isDark ? "text-slate-400 hover:text-cyan-400" : "text-slate-500 hover:text-[#0d6084]"
                )}
              >
                <Hexagon className="h-3.5 w-3.5 text-cyan-500" />
                {bank}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
