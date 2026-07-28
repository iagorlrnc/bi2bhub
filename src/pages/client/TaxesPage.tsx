import { useState, useEffect } from 'react'
import {
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  DollarSign,
  FileCheck,
  Building2,
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { logAuditActivity } from '@/lib/audit'

interface TaxGuide {
  id: string
  name: string
  description: string
  file_path: string
  file_size: number
  created_at: string
  tags: string[]
  // Parsed properties from tags
  taxType: string
  refPeriod: string
  dueDate: string
  value: number
  status: 'pendente' | 'pago'
  receiptPath?: string
}

export function TaxesPage() {
  const { company, user } = useAuth()
  const [taxes, setTaxes] = useState<TaxGuide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  // Parse tax details from document tags
  const parseTaxFromDoc = (doc: any): TaxGuide => {
    const tags = doc.tags || []
    
    // Default values
    let taxType = 'Imposto/Guia'
    let refPeriod = 'Mensal'
    let dueDate = new Date().toISOString().split('T')[0]
    let value = 0.00
    let status: 'pendente' | 'pago' = 'pendente'
    let receiptPath: string | undefined = undefined

    // Parse tags: 'DAS', 'vencimento:YYYY-MM-DD', 'valor:123.45', 'status:pendente/pago', 'ref:MM/YYYY', 'comprovante:path'
    tags.forEach((tag: string) => {
      if (tag.startsWith('vencimento:')) {
        dueDate = tag.replace('vencimento:', '')
      } else if (tag.startsWith('valor:')) {
        value = parseFloat(tag.replace('valor:', '')) || 0
      } else if (tag.startsWith('status:')) {
        status = tag.replace('status:', '') as 'pendente' | 'pago'
      } else if (tag.startsWith('ref:')) {
        refPeriod = tag.replace('ref:', '')
      } else if (tag.startsWith('comprovante:')) {
        receiptPath = tag.replace('comprovante:', '')
      } else if (tag !== 'guia_imposto') {
        taxType = tag // DAS, FGTS, etc
      }
    })

    return {
      id: doc.id,
      name: doc.name,
      description: doc.description || '',
      file_path: doc.file_path,
      file_size: doc.file_size,
      created_at: doc.created_at,
      tags,
      taxType,
      refPeriod,
      dueDate,
      value,
      status,
      receiptPath,
    }
  }

  const fetchTaxes = async () => {
    if (!company?.id) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('documentos')
        .select('id, name, description, file_path, file_size, created_at, tags')
        .eq('company_id', company.id)
        .contains('tags', ['guia_imposto'])
        .order('created_at', { ascending: false })

      if (error) throw error

      const parsed = (data || []).map(parseTaxFromDoc)
      setTaxes(parsed)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Erro ao buscar guias de impostos:', err)
      }
      toast.error('Erro ao carregar guias de impostos.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (company?.id) {
      fetchTaxes()
    }
  }, [company?.id])

  const handleDownloadFile = async (filePath: string) => {
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
      toast.error('Erro ao baixar documento da guia. (Verifique se o arquivo físico existe no storage)')
    }
  }

  const handleUploadReceipt = async (taxId: string, taxType: string, refPeriod: string, currentTags: string[], file: File) => {
    if (!company?.id || !user?.id) return
    setUploadingId(taxId)

    try {
      const fileExt = file.name.split('.').pop()
      const cleanTax = taxType.replace(/[^a-zA-Z0-9]/g, '_')
      const cleanRef = refPeriod.replace('/', '_')
      const cleanFileName = `recibo_${cleanTax}_${cleanRef}_${Date.now()}.${fileExt}`
      const filePath = `${company.id}/comprovantes/${cleanFileName}`

      // 1. Upload no Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })
      if (uploadError) throw uploadError

      // 2. Montar novas tags com status pago e comprovante associado
      const filteredTags = (currentTags || []).filter(t => !t.startsWith('status:') && !t.startsWith('comprovante:'))
      const updatedTags = [...filteredTags, 'status:pago', `comprovante:${filePath}`]

      // 3. Atualizar estado local imediatamente para refletir no UI sem latência
      setTaxes(prevTaxes => prevTaxes.map(t => {
        if (t.id === taxId) {
          return {
            ...t,
            status: 'pago',
            receiptPath: filePath,
            tags: updatedTags
          }
        }
        return t
      }))

      // 4. Atualizar registro no banco de dados com select() para confirmar a alteração
      const { data: updatedRows, error: updateError } = await supabase
        .from('documentos')
        .update({ tags: updatedTags })
        .eq('id', taxId)
        .select()

      if (updateError) throw updateError

      logAuditActivity({
        userId: user.id,
        companyId: company.id,
        action: 'ANEXAR_COMPROVANTE_PAGAMENTO',
        entityType: 'guias_fiscais',
        entityId: taxId,
        metadata: {
          origin: 'Painel do Cliente',
          file_name: file.name,
          tax_type: taxType,
          ref_period: refPeriod,
          receipt_path: filePath
        }
      })

      if (!updatedRows || updatedRows.length === 0) {
        console.warn('Aviso: Nenhum registro foi atualizado no banco de dados. Verifique as políticas RLS no Supabase.')
      }

      toast.success('Comprovante de pagamento anexado com sucesso!')
    } catch (err: any) {
      console.error('Erro ao anexar comprovante:', err)
      toast.error('Erro ao anexar comprovante: ' + (err.message || 'Erro de permissão'))
      // Em caso de falha, re-busca os dados originais
      fetchTaxes()
    } finally {
      setUploadingId(null)
    }
  }

  // Estatísticas de Resumo
  const pendingTaxes = taxes.filter(t => t.status === 'pendente')
  const paidTaxes = taxes.filter(t => t.status === 'pago')

  const totalPendingSum = pendingTaxes.reduce((sum, t) => sum + t.value, 0)
  const totalPaidSum = paidTaxes.reduce((sum, t) => sum + t.value, 0)

  // Encontrar o próximo vencimento de guia pendente
  const getNextDueDate = () => {
    if (pendingTaxes.length === 0) return 'Nenhum'
    const sorted = [...pendingTaxes].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    return new Date(sorted[0].dueDate).toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500 mr-2" />
        <span className="text-[hsl(var(--muted-foreground))] font-medium">Carregando guia de tributos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">


      {/* Cards de Resumo */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Card 1: Impostos a Pagar */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">A pagar neste mês</span>
            <p className="text-2xl font-bold text-amber-500">
              {totalPendingSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{pendingTaxes.length} guias aguardando comprovante</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Pago */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Total Pago</span>
            <p className="text-2xl font-bold text-emerald-500">
              {totalPaidSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{paidTaxes.length} guias liquidadas</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <FileCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Próximo Vencimento */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Próximo Vencimento</span>
            <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
              {getNextDueDate()}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Evite multas e juros por atraso</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabela de Guias */}
      <div className="relative z-10 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 space-y-4 shadow-sm">
        <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Minhas Guias Tributárias</h3>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Faça o download das guias em PDF enviadas pelo contador Bi2B e envie o comprovante de quitação para comprovação fiscal.
        </p>

        {taxes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-[hsl(var(--foreground))]">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] bg-slate-50 dark:bg-slate-800/40">
                  <th className="py-3 px-4">Tributo / Guia</th>
                  <th className="py-3 px-4">Referência</th>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4">Valor (R$)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Download Guia</th>
                  <th className="py-3 px-4 text-center">Comprovante de Pagamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {taxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-[hsl(var(--muted))]/10 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-sm">
                      <div>
                        {tax.taxType}
                        <span className="block text-[10px] font-normal text-[hsl(var(--muted-foreground))]">
                          {tax.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-xs text-[hsl(var(--muted-foreground))]">{tax.refPeriod}</td>
                    <td className="py-3.5 px-4 font-semibold text-xs">
                      {new Date(tax.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sm text-[hsl(var(--foreground))]">
                      {tax.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-3.5 px-4">
                      {tax.status === 'pago' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3" />
                          Pago
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/20 px-2 py-0.5 rounded">
                          <AlertCircle className="h-3 w-3" />
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDownloadFile(tax.file_path)}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/20 dark:hover:bg-brand-950/40 text-xs font-bold text-brand-600 dark:text-brand-400 transition-colors"
                        title="Baixar PDF da Guia"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Baixar Guia
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {uploadingId === tax.id ? (
                        <div className="inline-flex items-center justify-center gap-1.5 text-xs text-brand-500 font-semibold py-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      ) : tax.receiptPath ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleDownloadFile(tax.receiptPath!)}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors"
                            title="Ver ou baixar recibo anexado"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Ver Recibo
                          </button>
                          <label
                            className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 cursor-pointer transition-colors"
                            title="Reenviar / Substituir Comprovante"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleUploadReceipt(tax.id, tax.taxType, tax.refPeriod, tax.tags, file)
                                }
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-dashed border-slate-300 hover:border-brand-500 hover:text-brand-500 text-xs font-bold text-[hsl(var(--muted-foreground))] cursor-pointer transition-colors">
                          <Upload className="h-3.5 w-3.5" />
                          Anexar Comprovante
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleUploadReceipt(tax.id, tax.taxType, tax.refPeriod, tax.tags, file)
                              }
                            }}
                          />
                        </label>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--card))]/50">
            <Building2 className="h-10 w-10 text-[hsl(var(--muted-foreground))] mb-2" />
            <h4 className="font-heading font-semibold text-[hsl(var(--foreground))]">Nenhum imposto encontrado</h4>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 max-w-sm">
              Sua contabilidade ainda não postou nenhuma guia de pagamento para esta competência.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
