import { Clock, ShieldCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { getClientSubdomainUrl } from '@/utils/subdomain'

export function Bi2BPortalProductivitySection() {
  const comparisonRows = [
    {
      module: 'Central de Impostos & Guias',
      manual: 'Procurar DAS e ISS perdidos em e-mails e anexar comprovantes manualmente.',
      bi2b: 'Todas as guias em 1-clique com alertas prévios e comprovante salvo na guia.',
      saved: '-87.5% tempo',
      highlight: true,
    },
    {
      module: 'Bi2B Drive de Documentos',
      manual: 'Arquivos dispersos em pastas locais ou links expirados do Google Drive.',
      bi2b: 'Nuvem criptografada com CNDs, contratos e balancetes organizados 24h.',
      saved: '-94.0% tempo',
      highlight: false,
    },
    {
      module: 'Tarefas & Rotina Mensal',
      manual: 'Esquecimento de envio de XMLs e extratos bancários gerando multas fiscais.',
      bi2b: 'Checklist com status em tempo real e fechamento contábil sempre pontual.',
      saved: '-91.6% tempo',
      highlight: false,
    },
    {
      module: 'Chamados & Suporte CRC',
      manual: 'Mensagens soltas no WhatsApp sem histórico ou número de protocolo.',
      bi2b: 'Atendimento estruturado por contadores registrados com SLA de até 2 horas.',
      saved: '-85.0% tempo',
      highlight: true,
    },
  ]

  const handleDirectLogin = () => {
    window.location.href = getClientSubdomainUrl('/')
  }

  return (
    <section id="produtividade" className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bi2b-eyebrow bi2b-reveal in mx-auto mb-3.5">
            Eficiência &amp; Produtividade
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0C1E28] mb-3.5 leading-tight font-heading bi2b-reveal in">
            Menos tempo com burocracia,{' '}
            <span className="text-[#0B4F6C]">mais foco no seu negócio</span>.
          </h2>
          <p className="bi2b-lead text-base sm:text-lg text-[#59707B] max-w-[52ch] mx-auto bi2b-reveal in">
            Veja como a automação de rotinas contábeis e fiscais do Portal Bi2B transforma a operação da sua empresa.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 bi2b-reveal in">
          <div className="bg-white border border-[#0B4F6C]/15 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left">
            <span className="font-mono text-[0.72rem] text-[#59707B] uppercase tracking-wider block mb-2">
              Economia de Tempo
            </span>
            <div className="bi2b-readout text-3xl sm:text-4xl font-bold text-[#0B4F6C] mb-1">
              87.5%
            </div>
            <p className="text-xs sm:text-sm text-[#59707B] mt-2">
              Redução no tempo gasto buscando guias, certidões e comprovantes.
            </p>
          </div>

          <div className="bg-white border border-[#0B4F6C]/15 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left">
            <span className="font-mono text-[0.72rem] text-[#59707B] uppercase tracking-wider block mb-2">
              Segurança Fiscal
            </span>
            <div className="bi2b-readout text-3xl sm:text-4xl font-bold text-emerald-600 mb-1">
              Zero Multas
            </div>
            <p className="text-xs sm:text-sm text-[#59707B] mt-2">
              Alertas automáticos antes do vencimento evitam juros e penalidades.
            </p>
          </div>

          <div className="bg-white border border-[#0B4F6C]/15 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left">
            <span className="font-mono text-[0.72rem] text-[#59707B] uppercase tracking-wider block mb-2">
              Disponibilidade
            </span>
            <div className="bi2b-readout text-3xl sm:text-4xl font-bold text-[#0B4F6C] mb-1">
              24h / 7d
            </div>
            <p className="text-xs sm:text-sm text-[#59707B] mt-2">
              Acesso instantâneo a CNDs, contratos e folhas de pagamento na nuvem.
            </p>
          </div>

          <div className="bg-white border border-[#0B4F6C]/15 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left">
            <span className="font-mono text-[0.72rem] text-[#59707B] uppercase tracking-wider block mb-2">
              Agilidade de Suporte
            </span>
            <div className="bi2b-readout text-3xl sm:text-4xl font-bold text-[#FF4B3E] mb-1">
              &lt; 2 Horas
            </div>
            <p className="text-xs sm:text-sm text-[#59707B] mt-2">
              Tempo médio de resposta com contadores e especialistas registrados.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-[#0B4F6C]/15 rounded-[22px] overflow-hidden shadow-lg bi2b-reveal in">
          <div className="bg-[#083A50] text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[0.7rem] text-[#AEC3CE] tracking-wider uppercase block">
                Comparativo de Produtividade
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-heading">
                Processo Manual vs. Portal do Cliente Bi2B
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ganho de até 23.5 horas / mês</span>
            </div>
          </div>

          <div className="divide-y divide-[#0B4F6C]/10">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-5 sm:p-6 items-center text-left ${
                  row.highlight ? 'bg-[#0B4F6C]/[0.02]' : ''
                }`}
              >
                <div className="md:col-span-3">
                  <span className="font-heading font-bold text-sm sm:text-base text-[#0C1E28] block">
                    {row.module}
                  </span>
                  <span className="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block mt-1">
                    {row.saved}
                  </span>
                </div>

                <div className="md:col-span-4 flex items-start gap-2.5 text-xs sm:text-sm text-[#59707B]">
                  <XCircle className="w-4 h-4 text-[#FF4B3E] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#0C1E28] block sm:inline">Manual:</strong> {row.manual}
                  </span>
                </div>

                <div className="md:col-span-5 flex items-start gap-2.5 text-xs sm:text-sm text-[#0C1E28] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#0B4F6C] block sm:inline">Com Bi2B:</strong> {row.bi2b}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FAFAFA] border-t border-[#0B4F6C]/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#59707B]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Conformidade rigorosa com prazos tributários e rotinas contábeis.</span>
            </div>

            <button
              type="button"
              onClick={handleDirectLogin}
              className="bi2b-btn bi2b-btn-primary text-xs sm:text-sm py-2.5 px-5 cursor-pointer"
            >
              <span>Acessar o Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
