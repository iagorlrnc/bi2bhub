import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { getClientSubdomainUrl } from '@/utils/subdomain'
import {
  FolderOpen,
  Receipt,
  BarChart3,
  MessageSquareCheck,
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ExternalLink,
  Layers,
  Zap,
} from 'lucide-react'

import portalImg from '@/assets/portal.png'
import portal2Img from '@/assets/portal2.png'
import portal3Img from '@/assets/portal3.png'

export function Bi2BPortalSection() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  const handleGoToPortalInfo = () => {
    navigate(ROUTES.PORTAL_INFO)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDirectLogin = () => {
    window.location.href = getClientSubdomainUrl('/')
  }

  const features = [
    {
      id: 'guias',
      title: 'Central de Guias & Impostos',
      subtitle: 'DAS, ISS, FGTS e Tributos em 1-clique',
      desc: 'Baixe guias de recolhimento antes do vencimento com alertas automáticos, código de barras e envio de comprovantes em segundos.',
      icon: Receipt,
      image: portal2Img,
      badge: 'Zero Atrasos',
      highlights: [
        'Alertas inteligentes antes da data de vencimento',
        'Comprovantes anexados direto na guia',
        'Histórico fiscal consolidado de todos os meses',
      ],
    },
    {
      id: 'drive',
      title: 'Bi2B Drive Cloud de Documentos',
      subtitle: 'Seus arquivos organizados 24 horas por dia',
      desc: 'Contratos sociais, certidões negativas (CNDs), balancetes e folhas de pagamento salvos com segurança máxima e busca instantânea.',
      icon: FolderOpen,
      image: portal3Img,
      badge: 'Criptografia 256-bit',
      highlights: [
        'Separação por pastas (Fiscal, Contábil, RH, Societário)',
        'Pesquisa rápida por nome, tag e categoria',
        'Upload com arrastar e soltar e controle de versões',
      ],
    },
    {
      id: 'financeiro',
      title: 'Dashboards Financeiros em Tempo Real',
      subtitle: 'Visão de Faturamento, Custos e DRE',
      desc: 'Painéis vivos que consolidam o faturamento da empresa, evolução de despesas e margens para você tomar decisões embasadas.',
      icon: BarChart3,
      image: portalImg,
      badge: 'Inteligência Financeira',
      highlights: [
        'Indicadores de faturamento e margem bruta/líquida',
        'Gráficos de fluxo de caixa e despesas por centro de custo',
        'Exportação de balancetes e resumos gerenciais',
      ],
    },
    {
      id: 'chamados',
      title: 'Suporte por Chamados CRC',
      subtitle: 'Canal Direto com Seu Contador Especialista',
      desc: 'Abra solicitações estruturadas com histórico rastreável, nível de prioridade e tempo de resposta ágil em até 2 horas úteis.',
      icon: MessageSquareCheck,
      image: portalImg,
      badge: 'SLA de 2 Horas',
      highlights: [
        'Histórico completo de conversas e orientações',
        'Anexo de comprovantes e documentos no chamado',
        'Notificação por e-mail e painel a cada resposta',
      ],
    },
    {
      id: 'tarefas',
      title: 'Calendário & Tarefas Mensais',
      subtitle: 'Rotina Fiscal sem Esquecimentos',
      desc: 'Checklist interativo de envio de XMLs de entrada/saída, extratos bancários e movimentações para fechamento contábil pontual.',
      icon: CalendarCheck,
      image: portal2Img,
      badge: 'Rotina 100% Pontual',
      highlights: [
        'Cronograma transparente de obrigações da sua empresa',
        'Status visual (Pendente, Em Análise, Concluído)',
        'Evita multas fiscais e atrasos em fechamentos',
      ],
    },
  ]

  const currentFeature = features[activeTab]
  const CurrentIcon = currentFeature.icon

  return (
    <section id="portal" className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div 
        className="absolute -right-32 top-1/4 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(11,79,108,0.12), transparent 70%)' }}
      />
      <div 
        className="absolute -left-32 bottom-1/4 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.1), transparent 70%)' }}
      />

      <div className="bi2b-wrap relative z-10">
        {/* Header da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B4F6C]/10 border border-[#0B4F6C]/20 text-[#0B4F6C] font-mono text-[0.72rem] font-semibold tracking-widest uppercase mb-3.5">
            <Zap className="w-3.5 h-3.5 text-[#FF0000]" />
            <span>Tecnologia &amp; Plataforma Digital</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0C1E28] mb-3.5 leading-tight font-heading">
            Tudo o que sua empresa precisa,{' '}
            <span className="text-[#0B4F6C]">em um só portal</span>.
          </h2>

          <p className="bi2b-lead text-base sm:text-lg text-[#59707B] max-w-[54ch] mx-auto">
            Além da consultoria estratégica mensal, cada cliente Bi2B tem acesso a uma plataforma corporativa completa para gerenciar guias, documentos e finanças.
          </p>
        </div>

        {/* Feature Tabs Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 bi2b-reveal">
          {features.map((feature, idx) => {
            const TabIcon = feature.icon
            const isActive = activeTab === idx
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-heading text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B4F6C] text-white shadow-md shadow-[#0B4F6C]/20 scale-[1.02]'
                    : 'bg-white text-[#59707B] border border-[#0B4F6C]/15 hover:border-[#0B4F6C]/40 hover:text-[#0B4F6C]'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0B4F6C]'}`} />
                <span>{feature.title.split(' ')[0]} {feature.title.split(' ')[1] || ''}</span>
              </button>
            )
          })}
        </div>

        {/* Main Interactive Showcase Card */}
        <div className="bg-white border border-[#0B4F6C]/15 rounded-[22px] p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_-25px_rgba(11,79,108,0.25)] bi2b-reveal">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Feature Details */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#0B4F6C] text-white shadow-md">
                  <CurrentIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-mono text-[0.7rem] font-bold text-[#FF0000] uppercase tracking-wider block">
                    {currentFeature.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0C1E28] font-heading">
                    {currentFeature.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#59707B] leading-relaxed">
                {currentFeature.desc}
              </p>

              {/* Highlights Check List */}
              <div className="space-y-2.5 pt-2">
                {currentFeature.highlights.map((item, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0B4F6C] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#0C1E28] font-medium leading-normal">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Security and SLA Note */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#59707B]">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Conforme LGPD &amp; Criptografia
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#0B4F6C] bg-[#0B4F6C]/5 border border-[#0B4F6C]/15 px-2.5 py-1 rounded-md">
                  <Lock className="w-3.5 h-3.5" />
                  Acesso Restrito &amp; Perfis
                </span>
              </div>
            </div>

            {/* Right Column: Dynamic Screen Preview */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#0B4F6C]/20 shadow-xl group">
                <img
                  src={currentFeature.image}
                  alt={currentFeature.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                
                {/* Floating Overlay Badge on the Image */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#083A50]/90 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center justify-between text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[0.72rem] tracking-wider uppercase font-semibold">
                      {currentFeature.title}
                    </span>
                  </div>
                  <span className="font-mono text-[0.66rem] text-[#AEC3CE] border border-white/20 px-2 py-0.5 rounded">
                    MÓDULO INTEGRADO
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4">
                {features.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveTab(dotIdx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeTab === dotIdx
                        ? 'w-8 bg-[#0B4F6C]'
                        : 'w-2 bg-[#0B4F6C]/20 hover:bg-[#0B4F6C]/40'
                    }`}
                    aria-label={`Ver funcionalidade ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Strip: "Conheça o Portal" & "Área do Cliente" */}
          <div className="mt-10 pt-8 border-t border-[#0B4F6C]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#59707B] text-center sm:text-left">
              <Layers className="w-4 h-4 text-[#0B4F6C] shrink-0" />
              <span>Explore todas as telas, guias fiscais e módulos operacionais em detalhes.</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={handleGoToPortalInfo}
                className="bi2b-btn bi2b-btn-primary text-xs sm:text-sm py-3 px-6 cursor-pointer"
                title="Conheça todos os detalhes do Portal do Cliente"
              >
                <span>Conheça o Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDirectLogin}
                className="bi2b-btn bi2b-btn-ghost text-xs sm:text-sm py-3 px-5 cursor-pointer"
                title="Acessar login do Portal"
              >
                <span>Acessar Área do Cliente</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
