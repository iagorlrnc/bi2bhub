import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  FolderOpen,
  Receipt,
  MessageSquareCheck,
  BarChart3,
  CheckCircle2,
  Download,
  Plus,
  Search,
  FileText,
} from 'lucide-react'

interface FeaturesSectionProps {
  isDark?: boolean
}

interface DriveFile {
  id: string
  name: string
  size: string
  cat: 'Contábil' | 'Fiscal' | 'RH'
}

export function FeaturesSection({ isDark }: FeaturesSectionProps) {
  const [activeTab, setActiveTab] = useState<'drive' | 'guias' | 'chamados' | 'relatorios'>('drive')
  const [driveSearch, setDriveSearch] = useState('')
  const [driveCategory, setDriveCategory] = useState<string>('Todas')
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([
    { id: '1', name: 'Balanço Patrimonial 2025.pdf', size: '2.4 MB', cat: 'Contábil' },
    { id: '2', name: 'Contrato Social Alterado.pdf', size: '1.8 MB', cat: 'Contábil' },
    { id: '3', name: 'Folha Pagamento Julho.xlsx', size: '950 KB', cat: 'RH' },
    { id: '4', name: 'Certidão Negativa Federal.pdf', size: '420 KB', cat: 'Fiscal' },
  ])
  const [uploadSimulatedCount, setUploadSimulatedCount] = useState(0)

  const handleSimulateUpload = () => {
    if (uploadSimulatedCount >= 3) return
    const newCount = uploadSimulatedCount + 1
    setUploadSimulatedCount(newCount)
    const newFile: DriveFile = {
      id: Date.now().toString(),
      name: `Comprovante_Simulado_${newCount}.pdf`,
      size: '1.2 MB',
      cat: 'Fiscal',
    }
    setDriveFiles((prev) => [newFile, ...prev])
  }

  const filteredDriveFiles = driveFiles.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(driveSearch.toLowerCase())
    const matchesCat = driveCategory === 'Todas' || f.cat === driveCategory
    return matchesSearch && matchesCat
  })

  const tabs = [
    { id: 'drive', label: 'Bi2B Drive Cloud', icon: FolderOpen },
    { id: 'guias', label: 'Central de Guias Fiscais', icon: Receipt },
    { id: 'chamados', label: 'Suporte por Chamados CRC', icon: MessageSquareCheck },
    { id: 'relatorios', label: 'Balancetes & DRE', icon: BarChart3 },
  ]

  return (
    <section id="ecossistema-funcionalidades" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header da Seção */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[#0d6084] dark:text-cyan-300 font-extrabold text-xs uppercase tracking-widest">
            Ecossistema de Funcionalidades
          </div>

          <h2
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-sans',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Uma Plataforma Completa para{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              Gerenciar Sua Contabilidade
            </span>
          </h2>

          <p className={cn('text-base sm:text-lg leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
            Explore os módulos interativos do Portal do Cliente Bi2B desenvolvidos para simplificar sua rotina corporativa.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider cursor-pointer border',
                  isActive
                    ? 'bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white border-cyan-400/40 shadow-md'
                    : isDark
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-cyan-300' : 'text-cyan-500')} />
                <span>{tab.label}</span>
              </button>
            )}
          )}
        </div>

        {/* Tab Content Display */}
        <div
          className={cn(
            'rounded-3xl p-6 sm:p-10 border shadow-2xl backdrop-blur-xl',
            isDark ? 'bg-[#060e20] border-white/10' : 'bg-white border-slate-200'
          )}
        >
          {/* TAB 1: Bi2B Drive */}
          {activeTab === 'drive' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 space-y-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0d6084] to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <FolderOpen className="h-6 w-6 text-cyan-300" />
                </div>
                <h3 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                  Bi2B Drive Cloud
                </h3>
                <p className={cn('text-sm leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
                  Armazenamento organizado por categorias (Contábil, Fiscal, Societário, RH) com busca inteligente e upload digital.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Busca instantânea por nome ou categoria
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Organização em pastas 100% digitais
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Upload rápido e download seguro em nuvem
                  </li>
                </ul>
              </div>

              {/* Demo Drive Interativo */}
              <div className="md:col-span-7">
                <div className={cn('rounded-2xl border p-5 shadow-xl text-left font-mono space-y-3', isDark ? 'bg-[#040914] border-white/10' : 'bg-slate-50 border-slate-200')}>
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-white/10">
                    <span className={cn('font-bold text-xs', isDark ? 'text-white' : 'text-slate-900')}>
                      Arquivos no Bi2B Drive
                    </span>
                    <button
                      onClick={handleSimulateUpload}
                      disabled={uploadSimulatedCount >= 3}
                      className={cn(
                        'text-[10px] px-3 py-1 rounded font-bold flex items-center gap-1.5 border cursor-pointer',
                        uploadSimulatedCount >= 3
                          ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                          : 'bg-[#0d6084] text-white border-cyan-400/40 hover:bg-[#0b5474]'
                      )}
                    >
                      <Plus className="w-3 h-3" /> Simular Upload
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[140px]">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar arquivo..."
                        value={driveSearch}
                        onChange={(e) => setDriveSearch(e.target.value)}
                        className={cn('w-full border rounded-lg pl-8 pr-2 py-1 text-xs focus:outline-none', isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900')}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      {['Todas', 'Contábil', 'Fiscal', 'RH'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setDriveCategory(cat)}
                          className={cn(
                            'px-2.5 py-1 rounded border font-bold cursor-pointer',
                            driveCategory === cat
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                              : isDark
                              ? 'bg-slate-900 border-white/10 text-slate-400'
                              : 'bg-white border-slate-200 text-slate-600'
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {filteredDriveFiles.map((f) => (
                      <div
                        key={f.id}
                        className={cn(
                          'flex items-center justify-between border rounded-xl p-3 text-xs',
                          isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                          <div className="truncate">
                            <div className="font-bold truncate text-xs">{f.name}</div>
                            <div className="text-[10px] text-slate-400">{f.size} • {f.cat}</div>
                          </div>
                        </div>
                        <span className="text-cyan-400 font-bold text-[10px] flex items-center gap-1 cursor-pointer hover:underline">
                          <Download className="w-3 h-3" /> Baixar
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Central de Guias Fiscais */}
          {activeTab === 'guias' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 space-y-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0d6084] to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <Receipt className="h-6 w-6 text-cyan-300" />
                </div>
                <h3 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                  Central de Guias & Impostos
                </h3>
                <p className={cn('text-sm leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
                  Acompanhe impostos a vencer com avisos automáticos, baixe o código de barras e confirme comprovantes em segundos.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    DAS Simples Nacional, ISS, FGTS e INSS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Alertas preventivos para evitar multas de mora
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Histórico completo de impostos pagos
                  </li>
                </ul>
              </div>

              <div className="md:col-span-7">
                <div className={cn('rounded-2xl border p-5 shadow-xl text-left space-y-3 font-mono', isDark ? 'bg-[#040914] border-white/10' : 'bg-slate-50 border-slate-200')}>
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-white/10">
                    <span className={cn('font-bold text-xs', isDark ? 'text-white' : 'text-slate-900')}>
                      Guias Fiscais do Mês Ativo
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      3 Guias Disponíveis
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: 'DAS - Simples Nacional', val: 'R$ 4.250,00', status: 'Disponível', date: 'Vence em 20/08' },
                      { name: 'FGTS Digital', val: 'R$ 1.840,00', status: 'Disponível', date: 'Vence em 15/08' },
                      { name: 'INSS Patronal / Folha', val: 'R$ 3.100,00', status: 'Pago', date: 'Pago em 05/08' },
                    ].map((g, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'p-3 rounded-xl border flex items-center justify-between text-xs',
                          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                        )}
                      >
                        <div>
                          <div className="font-bold text-xs">{g.name}</div>
                          <div className="text-[10px] text-slate-400">{g.val} • {g.date}</div>
                        </div>
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2.5 py-1 rounded border',
                            g.status === 'Pago'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                          )}
                        >
                          {g.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Chamados CRC */}
          {activeTab === 'chamados' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 space-y-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0d6084] to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <MessageSquareCheck className="h-6 w-6 text-cyan-300" />
                </div>
                <h3 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                  Suporte Direto via Chamados
                </h3>
                <p className={cn('text-sm leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
                  Abra solicitações por categoria (Fiscal, DP, Financeiro, Societário) e acompanhe as respostas de contadores seniores.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Atendimento categorizado com contador atribuído
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Histórico auditável de todas as solicitações
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Prazos claros de resposta com notificações
                  </li>
                </ul>
              </div>

              <div className="md:col-span-7">
                <div className={cn('rounded-2xl border p-5 shadow-xl text-left space-y-3 font-mono', isDark ? 'bg-[#040914] border-white/10' : 'bg-slate-50 border-slate-200')}>
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-white/10">
                    <span className={cn('font-bold text-xs', isDark ? 'text-white' : 'text-slate-900')}>
                      Chamados de Suporte Ativos
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      Resposta Média: 15 min
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { title: 'Dúvida emissão de NF-e de Serviço', cat: 'Fiscal', status: 'Em Atendimento', resp: 'Contador Carlos E.' },
                      { title: 'Inclusão de novo dependente no eSocial', cat: 'RH / DP', status: 'Concluído', resp: 'Contadora Fernanda C.' },
                      { title: 'Solicitação de CND Estadual Atualizada', cat: 'Societário', status: 'Concluído', resp: 'Contadora Mariana O.' },
                    ].map((c, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'p-3 rounded-xl border flex items-center justify-between text-xs',
                          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                        )}
                      >
                        <div>
                          <div className="font-bold text-xs">{c.title}</div>
                          <div className="text-[10px] text-slate-400">{c.cat} • Responsável: {c.resp}</div>
                        </div>
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2.5 py-1 rounded border',
                            c.status === 'Concluído'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          )}
                        >
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Balancetes & DRE */}
          {activeTab === 'relatorios' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 space-y-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0d6084] to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <BarChart3 className="h-6 w-6 text-cyan-300" />
                </div>
                <h3 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                  Balancetes & DRE Gerencial
                </h3>
                <p className={cn('text-sm leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-600')}>
                  Demonstrativos contábeis mensais validados pelo contador responsável para acompanhamento executivo.
                </p>
                <ul className="space-y-2.5 text-xs font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Apuração de faturamento bruto e lucro líquido
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Balancete patrimonial assinado digitalmente
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Indicadores financeiros para tomada de decisão
                  </li>
                </ul>
              </div>

              <div className="md:col-span-7">
                <div className={cn('rounded-2xl border p-5 shadow-xl text-left space-y-3 font-mono', isDark ? 'bg-[#040914] border-white/10' : 'bg-slate-50 border-slate-200')}>
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-white/10">
                    <span className={cn('font-bold text-xs', isDark ? 'text-white' : 'text-slate-900')}>
                      DRE Gerencial Consolidado (Q3)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      Status: Validado CRC
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between text-xs">
                      <span>Faturamento Bruto Mensal:</span>
                      <span className="font-bold text-cyan-300">R$ 148.500,00</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between text-xs">
                      <span>Impostos Sobre Faturamento:</span>
                      <span className="font-bold text-rose-400">- R$ 11.880,00 (8%)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between text-xs">
                      <span>Margem Operacional Líquida:</span>
                      <span className="font-bold text-emerald-400">R$ 42.600,00 (28,6%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
