import { Building2 } from 'lucide-react'

export function Bi2BCasesGridSection() {
  const cases = [
    {
      office: 'Alpha Contabilidade Associados',
      location: 'São Paulo / SP',
      tag: 'Crescimento de Carteira',
      headline: 'Como o escritório Alpha dobrou a base para 380 clientes sem novas contratações',
      description:
        'Antes da Bi2B, a equipe gastava mais de 4 horas diárias reemitindo guias por WhatsApp. Com o Portal White-Label, os clientes passaram a se autoatender e o escritório expandiu.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      dataSheet: {
        resultado: '+140% em novos contratos PJ',
        reducao: '-75% de mensagens repetitivas',
        prazo: '14 dias de migração',
        roi: '420% no primeiro ano',
      },
    },
    {
      office: 'Metrópole Gestão & BPO Financeiro',
      location: 'Belo Horizonte / MG',
      tag: 'Automação Fiscal',
      headline: 'Centralização de 1.200 empresas com 99.8% de guias pagas antes do vencimento',
      description:
        'A implantação do robô de notificações e do calendário de fechamento eliminou o esquecimento de guias DAS e ISS, gerando confiança absoluta entre os clientes corporativos.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      dataSheet: {
        resultado: '1.200 empresas ativas no hub',
        reducao: 'Zero juros por atraso de guia',
        prazo: '20 dias de onboarding',
        roi: '380% de retorno sobre investimento',
      },
    },
    {
      office: 'Vértice Consultoria & Auditoria',
      location: 'Curitiba / PR',
      tag: 'Segurança & LGPD',
      headline: 'Guarda segura de 45.000 documentos fiscais com conformidade e busca instantânea',
      description:
        'Substituição de pastas manuais e drives desordenados pelo Bi2B Drive Cloud com criptografia AES-256 e controle rigoroso de acessos auditáveis por cliente.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      dataSheet: {
        resultado: '100% LGPD Compliant',
        reducao: '-90% tempo para localizar CNDs',
        prazo: '7 dias de ativação',
        roi: '510% de eficiência operacional',
      },
    },
  ]

  return (
    <section id="cases" className="py-24 sm:py-32 bg-[#FAFAFA] text-[#0C1E28] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#083A50]/10 text-[#083A50] font-bold text-xs uppercase tracking-widest mb-4">
            Histórias de Sucesso
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#083A50] tracking-tight font-heading leading-tight mb-6">
            Resultados reais de escritórios que{' '}
            <span className="text-cyan-600 underline decoration-cyan-400 decoration-4">
              transformaram sua operação
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Veja como líderes e sócios contábeis superaram os gargalos operacionais e alcançaram novos patamares de lucratividade e excelência.
          </p>
        </div>

        {/* Case Cards Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {cases.map((cs, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md border border-slate-200 shadow-md hover:shadow-xl hover:border-cyan-500/50 overflow-hidden transition-all duration-500 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              {/* Image Header */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={cs.image}
                  alt={cs.office}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Badges on Top of Image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-sm bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
                    {cs.tag}
                  </span>
                  <span className="text-[11px] font-mono font-bold uppercase text-white drop-shadow flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-300" />
                    {cs.location}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <span className="text-xs font-bold text-cyan-300 font-mono">
                    {cs.office}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#083A50] font-heading mb-2.5 leading-snug group-hover:text-cyan-700 transition-colors">
                    {cs.headline}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed mb-5">
                    {cs.description}
                  </p>
                </div>

                {/* Mini Data Sheet */}
                <div className="pt-3.5 border-t border-slate-100 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Ficha de Desempenho
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-sm bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] text-slate-500">Resultado</div>
                      <div className="font-bold text-[#083A50] mt-0.5">{cs.dataSheet.resultado}</div>
                    </div>
                    <div className="p-2 rounded-sm bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] text-slate-500">Redução</div>
                      <div className="font-bold text-cyan-700 mt-0.5">{cs.dataSheet.reducao}</div>
                    </div>
                    <div className="p-2 rounded-sm bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] text-slate-500">Prazo</div>
                      <div className="font-bold text-[#083A50] mt-0.5">{cs.dataSheet.prazo}</div>
                    </div>
                    <div className="p-2 rounded-sm bg-slate-50 border border-slate-200/80">
                      <div className="text-[10px] text-slate-500">Retorno (ROI)</div>
                      <div className="font-bold text-emerald-600 mt-0.5">{cs.dataSheet.roi}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
