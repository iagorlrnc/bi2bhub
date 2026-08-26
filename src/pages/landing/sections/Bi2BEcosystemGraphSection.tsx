import { useState } from 'react'
import {
  Layers,
  Building2,
  Users,
  Globe2,
  Database,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Zap,
} from 'lucide-react'

interface NodeItem {
  id: string
  title: string
  subtitle: string
  category: string
  icon: any
  status: string
  color: string
  details: {
    description: string
    features: string[]
    metric: string
  }
}

export function Bi2BEcosystemGraphSection() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('escritorio')

  const nodes: NodeItem[] = [
    {
      id: 'escritorio',
      title: 'Escritório Contábil (Admin / Gestor)',
      subtitle: 'Painel Master de Operações',
      category: 'HUB OPERACIONAL',
      icon: Building2,
      status: 'Conectado • 100% Sincronizado',
      color: 'cyan',
      details: {
        description:
          'Controle unificado de todos os clientes contábeis em uma única tela. Atribuição de carteiras por operador, monitoramento de prazos e relatórios gerenciais.',
        features: [
          'Gestão de dezenas a centenas de clientes em abas isoladas',
          'Distribuição de tarefas entre analistas fiscais, contábeis e de DP',
          'Auditoria completa de logs de acesso e downloads',
        ],
        metric: 'Economia de 15h/semana por gestor',
      },
    },
    {
      id: 'cliente',
      title: 'Portal do Cliente PJ (White-Label)',
      subtitle: 'Ambiente Personalizado',
      category: 'EXPERIÊNCIA DO CLIENTE',
      icon: Users,
      status: 'Ativo',
      color: 'emerald',
      details: {
        description:
          'Seu cliente acessa uma plataforma com o logotipo e identidade do seu escritório para baixar guias fiscais, consultar relatórios e enviar comprovantes.',
        features: [
          'Central de Guias com código de barras e avisos de vencimento',
          'Envio direto de extratos bancários e notas fiscais',
          'Abertura de chamados estruturados com protocolo CRC',
        ],
        metric: '-70% chamados repetitivos no WhatsApp',
      },
    },
    {
      id: 'sefaz',
      title: 'SEFAZ, RFB & Prefeituras',
      subtitle: 'Órgãos Reguladores Fiscais',
      category: 'CONEXÃO FISCAL',
      icon: Globe2,
      status: 'Monitoramento Contínuo',
      color: 'blue',
      details: {
        description:
          'Varredura e sincronização contínua de certidões negativas (CNDs), extratos fiscais e obrigações tributárias do Simples Nacional, Lucro Presumido e Real.',
        features: [
          'Alertas prévios de irregularidades fiscais e pendências',
          'Histórico de guias quitadas e parcelamentos',
          'Auditoria de conformidade com o cronograma da Receita Federal',
        ],
        metric: 'Zero perda de prazos tributários',
      },
    },
    {
      id: 'erps',
      title: 'ERPs Contábeis & Bancos',
      subtitle: 'Domínio, Omie, ContaAzul, Totvs',
      category: 'INTEGRAÇÃO DE DADOS',
      icon: Database,
      status: 'APIs & Webhooks Ativos',
      color: 'indigo',
      details: {
        description:
          'Conexão nativa e importação facilitada de lançamentos, extratos OFX/PDF e balancetes gerados nos principais softwares contábeis do mercado.',
        features: [
          'Importação em lote de clientes e dados cadastrais',
          'Sincronização de relatórios em PDF para o Drive do cliente',
          'Eliminação de digitação manual duplicada',
        ],
        metric: 'Importação de 500 clientes em minutos',
      },
    },
    {
      id: 'drive',
      title: 'Bi2B Drive Cloud Criptografado',
      subtitle: 'Guarda Segura de Arquivos',
      category: 'SEGURANÇA & ARMAZENAMENTO',
      icon: ShieldCheck,
      status: 'Criptografia AES-256',
      color: 'teal',
      details: {
        description:
          'Repositório corporativo seguro na nuvem para contratos sociais, alterações societárias, procurações e balanços patrimoniais com busca inteligente por tags.',
        features: [
          'Pastas categorizadas automaticamente por exercício fiscal',
          'Controle de versionamento de arquivos sem sobrescrita acidental',
          'Backups diários com alta redundância geográfica',
        ],
        metric: '100% em conformidade com a LGPD',
      },
    },
    {
      id: 'bi',
      title: 'Inteligência Financeira & DRE',
      subtitle: 'Módulo de Consultoria B2B',
      category: 'VALOR AGREGADO',
      icon: TrendingUp,
      status: 'Dashboards em Tempo Real',
      color: 'amber',
      details: {
        description:
          'Transforme números frios em consultoria de negócios. Entregue aos clientes gráficos visuais de faturamento, evolução de despesas e margem operacional.',
        features: [
          'Demonstração do Resultado do Exercício (DRE) visual e interativa',
          'Comparativos de faturamento mês a mês e ano a ano',
          'Exportação de relatórios executivos para reuniões de conselho',
        ],
        metric: '+140% de retenção de clientes consultivos',
      },
    },
  ]

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0]

  return (
    <section id="ecossistema" className="py-24 sm:py-32 bg-[#041a24] text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold text-xs uppercase tracking-widest mb-4">
            Grafo Interativo do Ecossistema
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight mb-6">
            A infraestrutura que conecta{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-[#38bdf8] to-white bg-clip-text text-transparent">
              todos os elos da sua contabilidade
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#C5D7E0] leading-relaxed">
            Clique nos nós do grafo para entender como a plataforma Bi2b integra seu escritório, seus clientes, os órgãos fiscais e os sistemas em uma malha contínua.
          </p>
        </div>

        {/* Interactive Graph Visualizer & Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Top: Interactive Nodes Selector Matrix */}
          <div className="lg:col-span-7 space-y-3">
            {/* Center Hub Indicator */}
            <div className="p-3.5 rounded-md bg-gradient-to-r from-[#083A50] to-[#0a4d6b] border border-cyan-400/40 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-sm bg-cyan-400 text-[#083A50] font-black">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                    NÓ CENTRAL DE PROCESSAMENTO
                  </span>
                  <span className="text-base font-bold text-white font-heading">
                    Painel Bi2B
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-300 font-mono bg-emerald-500/20 px-2.5 py-0.5 rounded-sm border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ATIVO
              </span>
            </div>

            {/* Connected Nodes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nodes.map((node) => {
                const Icon = node.icon
                const isSelected = selectedNodeId === node.id

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-md border text-left transition-all duration-300 cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#083A50] border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/30 scale-[1.01]'
                        : 'bg-[#062433]/80 border-white/10 hover:bg-[#083042] hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`p-2 rounded-sm shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-cyan-400 text-[#083A50]'
                          : 'bg-white/10 text-cyan-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300/80">
                          {node.category}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white font-heading truncate mt-0.5">
                        {node.title}
                      </h4>
                      <p className="text-xs text-slate-300 truncate">
                        {node.subtitle}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right / Bottom: Live Node Inspector Panel */}
          <div className="lg:col-span-5">
            <div className="rounded-md p-1 bg-gradient-to-b from-cyan-400/30 via-white/10 to-transparent shadow-xl">
              <div className="rounded-sm bg-[#062433] p-5 sm:p-6 border border-white/10 space-y-5">
                {/* Inspector Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-sm bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      <activeNode.icon className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-300 tracking-wider uppercase block">
                        DETALHES DO NÓ
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white font-heading leading-tight">
                        {activeNode.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Node Status Strip */}
                <div className="p-2.5 rounded-sm bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono">Status da Conexão:</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    {activeNode.status}
                  </span>
                </div>

                {/* Node Description */}
                <p className="text-xs sm:text-sm text-[#C5D7E0] leading-relaxed">
                  {activeNode.details.description}
                </p>

                {/* Feature Bullets */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    Capacidades Principais:
                  </span>
                  {activeNode.details.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-200 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Impact Metric Banner */}
                <div className="p-3 rounded-sm bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Ganho Operacional:
                    </span>
                  </div>
                  <span className="text-xs font-bold text-cyan-300 font-mono">
                    {activeNode.details.metric}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
