import { useState, useEffect } from 'react'
import {
  FileSpreadsheet,
  Download,
  AlertCircle,
  Loader2,
  FileCheck,
  Building2,
  X,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { logAuditActivity } from '@/lib/audit'
import { cn } from '@/lib/utils'

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

export function AdminTaxesPage() {
  const { user } = useAuth()
  const [companies, setCompanies] = useState<any[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true)

  const [taxes, setTaxes] = useState<TaxGuide[]>([])
  const [isLoadingTaxes, setIsLoadingTaxes] = useState(false)

  // Estados para nova guia
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [taxType, setTaxType] = useState('DAS Simples Nacional')
  const [customTaxType, setCustomTaxType] = useState('')
  const [refPeriod, setRefPeriod] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Parse tags to guide properties
  const parseTaxFromDoc = (doc: any): TaxGuide => {
    const tags = doc.tags || []
    
    let taxType = 'Imposto/Guia'
    let refPeriod = 'Mensal'
    let dueDate = new Date().toISOString().split('T')[0]
    let value = 0.00
    let status: 'pendente' | 'pago' = 'pendente'
    let receiptPath: string | undefined = undefined

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
        taxType = tag
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

  // Buscar lista de empresas no mount
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('id, name')
          .eq('is_active', true)
          .order('name')
        if (error) throw error
        setCompanies(data || [])
        if (data && data.length > 0) {
          setSelectedCompanyId(data[0].id)
        }
      } catch (err) {
        console.error('Erro ao buscar empresas:', err)
        toast.error('Erro ao carregar lista de empresas.')
      } finally {
        setIsLoadingCompanies(false)
      }
    }
    fetchCompanies()
  }, [])

  const fetchTaxes = async () => {
    if (!selectedCompanyId) return
    setIsLoadingTaxes(true)
    try {
      const { data, error } = await supabase
        .from('documentos')
        .select('id, name, description, file_path, file_size, created_at, tags')
        .eq('company_id', selectedCompanyId)
        .contains('tags', ['guia_imposto'])
        .order('created_at', { ascending: false })

      if (error) throw error

      const parsed = (data || []).map(parseTaxFromDoc)
      setTaxes(parsed)
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      toast.error('Erro ao buscar guias de impostos da empresa.')
    } finally {
      setIsLoadingTaxes(false)
    }
  }

  useEffect(() => {
    if (selectedCompanyId) {
      fetchTaxes()
    } else {
      setTaxes([])
    }
  }, [selectedCompanyId])

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
      toast.error('Erro ao baixar arquivo.')
    }
  }

  const handleDeleteTax = async (taxId: string, filePath: string, receiptPath?: string) => {
    if (!confirm('Deseja realmente excluir esta guia de imposto? A ação removerá o PDF e o registro correspondente.')) return

    try {
      // Remover guia
      await supabase.storage.from('documents').remove([filePath])
      
      // Remover recibo se houver
      if (receiptPath) {
        await supabase.storage.from('documents').remove([receiptPath])
      }

      const { error: dbError } = await supabase
        .from('documentos')
        .delete()
        .eq('id', taxId)

      if (dbError) throw dbError

      toast.success('Guia tributária excluída!')
      fetchTaxes()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao excluir guia tributária.')
    }
  }

  const handleCreateTax = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCompanyId || !user?.id) return
    if (!selectedFile) {
      toast.error('Por favor, selecione o arquivo em PDF da guia.')
      return
    }

    setIsSubmitting(true)
    try {
      const finalTaxName = taxType === 'Outro' ? customTaxType : taxType
      if (!finalTaxName.trim()) {
        throw new Error('Informe o nome/tipo do tributo.')
      }

      const cleanName = finalTaxName.replace(/[^a-zA-Z0-9]/g, '_')
      const cleanRef = refPeriod.replace('/', '_')
      const cleanFileName = `guia_${cleanName}_${cleanRef}_${Date.now()}.pdf`
      const filePath = `${selectedCompanyId}/impostos/${cleanFileName}`

      // 1. Upload no Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, { cacheControl: '3600', upsert: true })
      
      if (uploadError) throw uploadError

      // Determinar categoria padrão baseada no tipo de imposto
      let docCategory = 'fiscal'
      if (finalTaxName.includes('FGTS') || finalTaxName.includes('INSS') || finalTaxName.includes('Folha')) {
        docCategory = 'trabalhista'
      }

      // 2. Inserir no banco de dados
      const { error: dbError } = await supabase
        .from('documentos')
        .insert({
          company_id: selectedCompanyId,
          name: selectedFile.name,
          description: description || `Guia de ${finalTaxName} - Ref: ${refPeriod}`,
          file_path: filePath,
          file_size: selectedFile.size,
          mime_type: selectedFile.type || 'application/pdf',
          category: docCategory as any,
          tags: ['guia_imposto', finalTaxName, `vencimento:${dueDate}`, `valor:${parseFloat(value)}`, 'status:pendente', `ref:${refPeriod}`],
          uploaded_by: user.id
        })

      if (dbError) throw dbError

      logAuditActivity({
        userId: user?.id,
        companyId: selectedCompanyId,
        action: 'PUBLICAR_GUIA_IMPOSTO',
        entityType: 'guias_fiscais',
        metadata: { tax_name: finalTaxName, ref_period: refPeriod, due_date: dueDate, value: parseFloat(value) }
      })

      toast.success('Guia de imposto publicada com sucesso!')
      setIsOpenModal(false)
      // Resetar form
      setRefPeriod('')
      setDueDate('')
      setValue('')
      setDescription('')
      setSelectedFile(null)
      fetchTaxes()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao publicar guia de imposto.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Estatísticas
  const pendingTaxes = taxes.filter(t => t.status === 'pendente')
  const paidTaxes = taxes.filter(t => t.status === 'pago')

  const totalPendingSum = pendingTaxes.reduce((sum, t) => sum + t.value, 0)
  const totalPaidSum = paidTaxes.reduce((sum, t) => sum + t.value, 0)

  if (isLoadingCompanies) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500 mr-2" />
        <span className="text-[hsl(var(--muted-foreground))]">Carregando painel de impostos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[hsl(var(--border))] pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Guias e Impostos</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Publique guias para os clientes e monitore os comprovantes de pagamento
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1 min-w-[240px]">
            <label className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Empresa Cliente</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-semibold"
            >
              <option value="">Selecione uma empresa...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCompanyId && (
            <button
              onClick={() => setIsOpenModal(true)}
              className="flex items-center gap-2 rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20"
            >
              <Plus className="h-4 w-4" />
              Publicar Guia
            </button>
          )}
        </div>
      </div>

      {selectedCompanyId ? (
        <div className="space-y-6">
          {/* Estatísticas resumidas da empresa */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">A pagar neste mês (Pendente)</span>
                <p className="text-xl font-bold text-amber-500">
                  {totalPendingSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{pendingTaxes.length} guias pendentes de liquidação</p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase">Liquidado pelo Cliente (Pago)</span>
                <p className="text-xl font-bold text-emerald-500">
                  {totalPaidSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{paidTaxes.length} guias pagas</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <FileCheck className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Listagem de Impostos publicados */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 space-y-4 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Guias Publicadas</h3>
            
            {isLoadingTaxes ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              </div>
            ) : taxes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-[hsl(var(--foreground))]">
                  <thead>
                    <tr className="border-b border-[hsl(var(--border))] text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] bg-slate-50 dark:bg-slate-800/40">
                      <th className="py-3 px-4">Tributo / Guia</th>
                      <th className="py-3 px-4">Referência</th>
                      <th className="py-3 px-4">Vencimento</th>
                      <th className="py-3 px-4">Valor</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Guia (PDF)</th>
                      <th className="py-3 px-4 text-center">Comprovante</th>
                      <th className="py-3 px-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[hsl(var(--border))]">
                    {taxes.map((tax) => (
                      <tr key={tax.id} className="hover:bg-[hsl(var(--muted))]/10 transition-colors">
                        <td className="py-3 px-4 font-semibold text-sm">
                          <div>
                            {tax.taxType}
                            <span className="block text-[10px] font-normal text-[hsl(var(--muted-foreground))]">
                              {tax.description}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-[hsl(var(--muted-foreground))]">{tax.refPeriod}</td>
                        <td className="py-3 px-4 text-xs font-semibold">
                          {new Date(tax.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4 font-bold text-sm">
                          {tax.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="py-3 px-4">
                          {tax.status === 'pago' ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                              Pago
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/20 px-2 py-0.5 rounded">
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDownloadFile(tax.file_path)}
                            className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/20 dark:hover:bg-brand-950/40 text-xs font-bold text-brand-600 dark:text-brand-400 transition-colors"
                            title="Baixar Guia (PDF)"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Ver Guia (PDF)
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {tax.receiptPath ? (
                            <button
                              onClick={() => handleDownloadFile(tax.receiptPath!)}
                              className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors"
                              title="Baixar Comprovante de Pagamento"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Baixar Comprovante
                            </button>
                          ) : (
                            <span className="text-xs text-[hsl(var(--muted-foreground))] italic">
                              Não enviado
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteTax(tax.id, tax.file_path, tax.receiptPath)}
                            className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            title="Remover imposto publicado"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-[hsl(var(--muted-foreground))] italic py-4">Nenhum imposto cadastrado para esta empresa neste período.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--card))]/50">
          <Building2 className="h-12 w-12 text-[hsl(var(--muted-foreground))] mb-3 animate-bounce" />
          <h3 className="font-heading font-semibold text-[hsl(var(--foreground))]">Nenhuma empresa selecionada</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 max-w-md">
            Selecione uma empresa cliente no painel superior para gerenciar e publicar guias de recolhimento tributário.
          </p>
        </div>
      )}

      {/* Modal de Publicação de Nova Guia */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4 mb-4">
              <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Publicar Guia Tributária</h3>
              <button
                onClick={() => setIsOpenModal(false)}
                className="rounded-lg p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTax} className="space-y-4">
              {/* Seleção de Tributo */}
              <div className={cn("grid gap-4", taxType === 'Outro' ? "sm:grid-cols-2" : "grid-cols-1")}>
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Tributo / Guia</label>
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-semibold"
                  >
                    <option value="DAS Simples Nacional">DAS Simples Nacional</option>
                    <option value="FGTS Digital">FGTS Digital</option>
                    <option value="DARF INSS Patronal">DARF INSS Patronal</option>
                    <option value="ISSQN Municipal">ISSQN Municipal</option>
                    <option value="ICMS Declarado">ICMS Declarado</option>
                    <option value="Outro">Outro Imposto / Taxa</option>
                  </select>
                </div>

                {taxType === 'Outro' && (
                  <div>
                    <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Nome do Tributo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: PIS/COFINS, Taxa de Licença"
                      value={customTaxType}
                      onChange={(e) => setCustomTaxType(e.target.value)}
                      className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}
              </div>

              {/* Referência, Vencimento e Valor em 3 colunas perfeitamente alinhadas */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Referência</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 06/2026"
                    value={refPeriod}
                    onChange={(e) => setRefPeriod(e.target.value)}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Vencimento</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500 font-semibold text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Instruções de pagamento ou detalhes do tributo"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Anexo da Guia */}
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Anexo da Guia (PDF)</label>
                <div className="rounded-xl border border-dashed border-[hsl(var(--input))] bg-[hsl(var(--muted))]/20 p-3">
                  <input
                    type="file"
                    required
                    accept="application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-[hsl(var(--muted-foreground))] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-500/10 file:text-brand-600 dark:file:text-brand-400 hover:file:bg-brand-500/20 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[hsl(var(--border))]">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="flex items-center gap-2 rounded-lg gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Publicar Guia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
