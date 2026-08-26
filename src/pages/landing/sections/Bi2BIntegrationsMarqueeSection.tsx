import { Database, Link2 } from 'lucide-react'

export function Bi2BIntegrationsMarqueeSection() {
  const integrations = [
    { name: 'Domínio Sistemas (Thomson Reuters)', cat: 'ERP Contábil' },
    { name: 'Omie ERP', cat: 'Gestão Financeira' },
    { name: 'ContaAzul', cat: 'Gestão & BPO' },
    { name: 'Alterdata Software', cat: 'Contábil & DP' },
    { name: 'Totvs Protheus', cat: 'ERP Corporativo' },
    { name: 'Nuvem Fiscal', cat: 'Emissão de DF-e' },
    { name: 'Questor Sistemas', cat: 'Contabilidade & Fiscal' },
    { name: 'PlugNotas / TecnoSpeed', cat: 'API de Notas Fiscais' },
    { name: 'Fortes Tecnologia', cat: 'Automação Contábil' },
    { name: 'Senior Sistemas', cat: 'Gestão & Folha' },
  ]

  return (
    <section id="parceiros" className="py-14 bg-[#05222f] border-y border-white/10 text-white overflow-hidden relative">
      {/* Side Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-[#05222f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-[#05222f] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
          <Link2 className="w-3.5 h-3.5" />
          Conectividade Total
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
          Integração nativa com os principais sistemas e ERPs contábeis do país
        </h3>
      </div>

      {/* Marquee Track */}
      <div className="flex w-full overflow-hidden select-none">
        <div className="flex shrink-0 animate-marquee items-center gap-5 sm:gap-8 py-2">
          {integrations.concat(integrations).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-5 py-3 rounded-md bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors backdrop-blur-sm"
            >
              <div className="p-2 rounded-sm bg-cyan-500/10 text-cyan-300">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
                  {item.name}
                </div>
                <div className="text-[10px] font-mono text-cyan-300 uppercase">
                  {item.cat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
