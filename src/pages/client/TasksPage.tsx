import { useState, useEffect } from 'react'
import {
  CheckSquare,
  Upload,
  RefreshCw,
  Loader2,
  FileText,
  FileCode,
  Receipt,
  TrendingUp,
  Archive,
  X,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface MonthlyCategory {
  slug: string
  label: string
  description: string
  accept: string
  category: 'fiscal' | 'contabil' | 'trabalhista' | 'societario' | 'certidao' | 'contrato' | 'relatorio' | 'outros'
}

const MONTHLY_CATEGORIES: MonthlyCategory[] = [
  {
    slug: 'xml_entrada',
    label: 'Documentos XML de Entrada',
    description: 'Arquivos XML de notas fiscais de compras recebidas (entradas).',
    accept: '.xml',
    category: 'fiscal'
  },
  {
    slug: 'nf_venda',
    label: 'Notas Fiscais de Venda',
    description: 'XMLs e PDFs de notas fiscais de saídas/serviços emitidas.',
    accept: '.xml,.pdf',
    category: 'fiscal'
  },
  {
    slug: 'extrato_ofx',
    label: 'Extrato Bancário OFX',
    description: 'Extratos de contas corporativas em formato OFX para conciliação.',
    accept: '.ofx',
    category: 'contabil'
  },
  {
    slug: 'extrato_pdf',
    label: 'Extrato Bancário PDF',
    description: 'Extrato bancário mensal consolidado de todas as contas em PDF.',
    accept: '.pdf',
    category: 'contabil'
  }
]

const getMonthList = () => {
  const months = []
  const currentDate = new Date()
  
  // Mostrar últimos 6 meses e os próximos 2
  for (let i = 6; i >= -2; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const key = `${year}-${month}`
    
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1)
    months.push({ key, label: formattedLabel })
  }
  return months
}

export function TasksPage() {
  const { profile, company, isLoading: authLoading } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [monthlyDocs, setMonthlyDocs] = useState<Record<string, any>>({})
  const [loadingMonthly, setLoadingMonthly] = useState(false)
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null)
  const monthList = getMonthList()

  const fetchMonthlyDocuments = async () => {
    if (!company?.id) return
    setLoadingMonthly(true)
    try {
      const { data, error } = await supabase
        .from('documentos')
        .select('*')
        .eq('company_id', company.id)
        .contains('tags', ['obrigacao_mensal', selectedMonth])

      if (error) throw error

      const docsBySlug: Record<string, any> = {}
      MONTHLY_CATEGORIES.forEach(cat => {
        const found = (data || []).find((doc: any) => doc.tags && doc.tags.includes(cat.slug))
        if (found) {
          docsBySlug[cat.slug] = found
        }
      })
      setMonthlyDocs(docsBySlug)
    } catch (err) {
      console.error('Erro ao buscar documentos mensais:', err)
      toast.error('Erro ao carregar status dos documentos mensais.')
    } finally {
      setLoadingMonthly(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (company?.id) {
      fetchMonthlyDocuments()
    }
  }, [company?.id, selectedMonth, authLoading])

  const handleUploadMonthlyDoc = async (slug: string, label: string, category: string, file: File) => {
    if (!company?.id || !profile?.id) return
    
    setUploadingSlug(slug)
    try {
      const fileExt = file.name.split('.').pop()
      const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const filePath = `${company.id}/mensal/${selectedMonth}/${slug}/${cleanFileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('documentos')
        .insert({
          company_id: company.id,
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type || `application/${fileExt}`,
          category: category as any,
          uploaded_by: profile.id,
          tags: ['obrigacao_mensal', selectedMonth, slug],
          description: `Documento mensal (${label}) de ${selectedMonth}`
        })

      if (dbError) throw dbError

      toast.success(`Documento "${file.name}" enviado com sucesso!`)
      fetchMonthlyDocuments()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao fazer upload do documento.')
    } finally {
      setUploadingSlug(null)
    }
  }

  const handleDownloadMonthlyDoc = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 60)
      if (error) throw error
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (err) {
      console.error(err)
      toast.error('Erro ao gerar link de download.')
    }
  }

  const handleDeleteMonthlyDoc = async (docId: string, filePath: string) => {
    if (!confirm('Deseja realmente excluir este documento enviado? A ação excluirá o arquivo do servidor de contabilidade.')) return
    
    try {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath])
      if (storageError) throw storageError

      const { error: dbError } = await supabase
        .from('documentos')
        .delete()
        .eq('id', docId)
      if (dbError) throw dbError

      toast.success('Documento excluído com sucesso!')
      fetchMonthlyDocuments()
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao deletar documento.')
    }
  }

  const handleRefresh = async () => {
    await fetchMonthlyDocuments()
    toast.success('Status dos documentos mensais atualizado!')
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[hsl(var(--border))] pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Obrigações Mensais</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Envio mensal de notas fiscais, extratos bancários e documentos para conciliação contábil e fiscal
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar Status
        </button>
      </div>

      {/* HUB DE OBRIGAÇÕES MENSAIS */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 space-y-6 shadow-sm relative overflow-hidden">
        {/* Background gradient element */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />

        {/* Cabeçalho do Hub */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[hsl(var(--border))] pb-4">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Documentos do Período</h2>
                {loadingMonthly && <Loader2 className="h-4 w-4 animate-spin text-brand-500" />}
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Selecione o mês para enviar a documentação obrigatória do período</p>
            </div>
          </div>
          
          {/* Seletor de Mês */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase">Mês de Referência:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--foreground))] focus:border-brand-500 focus:outline-none"
            >
              {monthList.map(m => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de Progresso de Envio */}
        {(() => {
          const totalDocs = MONTHLY_CATEGORIES.length
          const uploadedDocsCount = MONTHLY_CATEGORIES.filter(cat => !!monthlyDocs[cat.slug]).length
          const progressPercent = Math.round((uploadedDocsCount / totalDocs) * 100)
          
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[hsl(var(--muted-foreground))]">Progresso de envio do mês selecionado:</span>
                <span className="font-bold text-brand-500">{uploadedDocsCount} de {totalDocs} documentos ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800/50 h-2.5 rounded-full overflow-hidden">
                <div
                  className="gradient-brand h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )
        })()}

        {/* Grid de Cards dos Documentos */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MONTHLY_CATEGORIES.map((cat) => {
            const doc = monthlyDocs[cat.slug]
            const isUploading = uploadingSlug === cat.slug

            const getIcon = () => {
              switch (cat.slug) {
                case 'xml_entrada':
                  return <FileCode className="h-5 w-5 text-indigo-500" />
                case 'nf_venda':
                  return <Receipt className="h-5 w-5 text-emerald-500" />
                case 'extrato_ofx':
                  return <TrendingUp className="h-5 w-5 text-cyan-500" />
                case 'extrato_pdf':
                  return <FileText className="h-5 w-5 text-amber-500" />
                case 'outros_documentos':
                default:
                  return <Archive className="h-5 w-5 text-slate-500" />
              }
            }

            return (
              <div
                key={cat.slug}
                className={cn(
                  'rounded-xl border p-4 flex flex-col justify-between h-[185px] transition-all relative',
                  doc
                    ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-950/30 dark:bg-emerald-950/5'
                    : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-brand-500/30'
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      'p-2 rounded-lg shrink-0',
                      doc ? 'bg-emerald-100/60 dark:bg-emerald-950/40' : 'bg-slate-100 dark:bg-slate-800'
                    )}>
                      {getIcon()}
                    </div>
                    {doc ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100/40 px-2 py-0.5 rounded">
                        Enviado
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100/60 dark:bg-slate-800/60 px-2 py-0.5 rounded">
                        Pendente
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-[hsl(var(--foreground))] line-clamp-1">{cat.label}</h4>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-tight mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-brand-500 font-semibold py-1">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="text-[10px]">Enviando...</span>
                    </div>
                  ) : doc ? (
                    <div className="space-y-1">
                      <p className="text-[9px] text-[hsl(var(--muted-foreground))] truncate" title={doc.name}>
                        {doc.name}
                      </p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadMonthlyDoc(doc.file_path)}
                          className="flex-1 py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-[hsl(var(--foreground))] flex items-center justify-center gap-1 transition-colors"
                          title="Baixar arquivo enviado"
                        >
                          <Download className="h-3 w-3" />
                          Baixar
                        </button>
                        <button
                          onClick={() => handleDeleteMonthlyDoc(doc.id, doc.file_path)}
                          className="p-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-colors"
                          title="Excluir documento"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full py-1.5 px-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[hsl(var(--muted-foreground))] hover:text-brand-500 cursor-pointer transition-all">
                      <Upload className="h-3 w-3" />
                      Enviar Arquivo
                      <input
                        type="file"
                        accept={cat.accept !== '*' ? cat.accept : undefined}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleUploadMonthlyDoc(cat.slug, cat.label, cat.category, file)
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
