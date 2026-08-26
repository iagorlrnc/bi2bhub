import {
  FolderOpen,
  Receipt,
  MessageSquareCheck,
  BarChart3,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

export function Bi2BFeaturesGridSection() {
  const features = [
    {
      id: 'drive',
      icon: FolderOpen,
      badge: 'Armazenamento Seguro',
      title: 'Bi2B Drive Cloud de Documentos',
      desc: 'Contratos sociais, certidões negativas (CNDs), balancetes e folhas organizadas por pastas fiscais com busca instantânea e criptografia AES-256.',
      highlights: ['Busca por tags e filtros', 'Controle de versões', 'Upload em lote'],
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'guias',
      icon: Receipt,
      badge: 'Zero Inadimplência',
      title: 'Central de Guias & Impostos Fiscais',
      desc: 'Disponibilize guias de DAS, FGTS, ISS e DARF com código de barras, notificações automáticas de vencimento e anexo de comprovantes em 1-clique.',
      highlights: ['Alertas por e-mail e push', 'Comprovantes centralizados', 'Histórico anual de quitação'],
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'chamados',
      icon: MessageSquareCheck,
      badge: 'SLA Garantido',
      title: 'Suporte por Chamados com Validação CRC',
      desc: 'Elimine conversas soltas no WhatsApp. Canal estruturado de solicitações com níveis de prioridade, SLA de resposta e histórico 100% auditável.',
      highlights: ['Rastreamento por protocolo', 'Anexo de arquivos no chamado', 'Pesquisa de satisfação NPS'],
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'bi',
      icon: BarChart3,
      badge: 'Consultoria Estratégica',
      title: 'Dashboards Financeiros & DRE em Tempo Real',
      desc: 'Painéis visuais com faturamento, despesas operacionais, fluxo de caixa e margens para transformar seu escritório em um conselheiro de negócios.',
      highlights: ['Gráficos de receitas x despesas', 'Exportação de relatórios gerenciais', 'Indicadores de saúde fiscal'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'calendario',
      icon: CalendarCheck,
      badge: 'Controle de Prazos',
      title: 'Calendário de Fechamento & Obrigações',
      desc: 'Checklist interativo de envio de XMLs de compras/vendas, extratos bancários e folha para um fechamento contábil e fiscal sem estresse.',
      highlights: ['Linha do tempo de obrigações', 'Status em tempo real por cliente', 'Lembretes automáticos'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'governanca',
      icon: ShieldCheck,
      badge: 'Conformidade Total',
      title: 'Governança & Isolamento Multi-Tenant',
      desc: 'Bases de dados estritamente segregadas por cliente, logs detalhados de auditoria de acessos e conformidade completa com a Lei Geral de Proteção de Dados.',
      highlights: ['Autenticação multifator (MFA)', 'Logs de visualização e download', '100% LGPD compliant'],
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    },
  ]

  return (
    <section id="funcionalidades" className="py-24 sm:py-32 bg-[#083A50] text-white relative overflow-hidden">
      {/* Glow Elements */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-80 h-80 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold text-xs uppercase tracking-widest mb-4">
            Módulos & Funcionalidades
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight mb-6">
            Tudo o que seu escritório precisa para{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-[#38bdf8] to-white bg-clip-text text-transparent">
              operar com alta performance
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#C5D7E0] leading-relaxed">
            Uma suíte integrada de soluções desenhada sob medida para as rotinas fiscais, contábeis e de atendimento dos escritórios mais exigentes do país.
          </p>
        </div>

        {/* Feature Cards Grid with Images & Hover Zoom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="group relative rounded-md bg-[#062837]/90 border border-white/10 hover:border-cyan-400/50 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/20 flex flex-col justify-between"
              >
                {/* Image Header with Gradient Overlay */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 group-hover:brightness-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062837] via-[#062837]/60 to-transparent" />

                  {/* Top Bar with Icon and Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="p-2 rounded-sm bg-[#083A50]/90 backdrop-blur-md border border-cyan-400/30 text-cyan-300 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm border bg-[#062837]/90 backdrop-blur-md border-cyan-400/40 text-cyan-200 font-mono uppercase tracking-wider shadow-sm">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading mb-2 group-hover:text-cyan-200 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#AEC3CE] leading-relaxed mb-5 font-normal">
                      {item.desc}
                    </p>
                  </div>

                  {/* Highlights List */}
                  <div className="pt-3.5 border-t border-white/10 space-y-1.5">
                    {item.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
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
