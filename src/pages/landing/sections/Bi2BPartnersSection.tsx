import maxdataLogo from '@/assets/maxdata-logo.png'
import { Database, CheckCircle2 } from 'lucide-react'

export function Bi2BPartnersSection() {
  const popularErps = [
    'Totvs',
    'Sankhya',
    'Linx',
    'Omie',
    'Bling',
    'Senior',
    'Alterdata',
    'ContaAzul',
  ]

  return (
    <section id="parceiros" className="bi2b-section bi2b-on-light text-center border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <span className="bi2b-eyebrow bi2b-reveal mx-auto mb-3">Parceiros e integrações</span>
        <h2 className="text-2xl sm:text-3xl md:text-[2.1rem] font-bold text-[#0C1E28] mb-2.5 font-heading">
          Conectamos com o sistema que você já usa.
        </h2>
        <p className="bi2b-lead bi2b-reveal text-base sm:text-lg text-[#59707B] max-w-[56ch] mx-auto mb-10">
          A Bi2B lê os dados direto do seu sistema de gestão — sem retrabalho, sem redigitar nada e sem necessidade de trocar de ERP.
        </p>

        {/* Featured Partner + General Compatibility Grid */}
        <div className="max-w-4xl mx-auto space-y-6 bi2b-reveal">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* MaxData Special Partner */}
            <div className="bg-white border-2 border-[#0B4F6C]/30 rounded-[18px] p-6 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-sm hover:border-[#0B4F6C] transition-all">
              <img
                src={maxdataLogo}
                alt="Logo do MaxData Software de Gestão"
                className="max-h-12 w-auto object-contain"
              />
              <div className="text-center sm:text-left">
                <span className="inline-flex items-center gap-1 text-[0.7rem] font-mono font-bold uppercase text-[#0B4F6C] bg-[#0B4F6C]/10 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 text-[#0B4F6C]" />
                  Integração Direta
                </span>
                <p className="text-xs text-[#59707B] mt-1 font-medium">
                  Implantação ultra-rápida e sincronização nativa de dados.
                </p>
              </div>
            </div>

            {/* Universal Compatibility */}
            <div className="bg-white border border-[#0B4F6C]/15 rounded-[18px] p-6 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#0B4F6C]/10 text-[#0B4F6C] flex items-center justify-center shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div className="text-center sm:text-left">
                <span className="inline-flex items-center gap-1 text-[0.7rem] font-mono font-bold uppercase text-[#0C1E28] bg-slate-100 px-2 py-0.5 rounded">
                  Qualquer ERP de Mercado
                </span>
                <p className="text-xs text-[#59707B] mt-1 font-medium">
                  Compatível via API, banco de dados ou exportação de relatórios.
                </p>
              </div>
            </div>
          </div>

          {/* ERP Pills Marquee / List */}
          <div className="bg-white border border-[#0B4F6C]/10 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-2.5">
            <span className="font-mono text-xs text-[#59707B] mr-2">ERPs homologados:</span>
            {popularErps.map((erp, idx) => (
              <span
                key={idx}
                className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#0B4F6C]/15 text-[#0C1E28]"
              >
                {erp}
              </span>
            ))}
            <span className="font-mono text-xs text-[#0B4F6C] font-semibold px-3 py-1 rounded-full bg-[#0B4F6C]/5 border border-dashed border-[#0B4F6C]/30">
              + Qualquer outro sistema
            </span>
          </div>
        </div>

        <p className="mt-6 font-mono text-[0.82rem] text-[#0B4F6C] font-semibold bi2b-reveal">
          // Usa MaxData? Nossa equipe configura a conexão nos primeiros 2 dias de atendimento.
        </p>
      </div>
    </section>
  )
}
