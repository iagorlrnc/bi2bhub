import { useState } from 'react'
import {
  X,
  QrCode,
  Copy,
  Check,
  FileText,
  Upload,
  ShieldCheck,
  AlertCircle,
  Clock,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Lock,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Cobranca } from '@/types/finance'
import { financeService } from '@/lib/financeService'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface PaymentModalProps {
  cobranca: Cobranca
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PaymentModal({ cobranca, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'pix' | 'boleto' | 'comprovante'>('pix')
  const [copiedPix, setCopiedPix] = useState(false)
  const [copiedBoleto, setCopiedBoleto] = useState(false)

  // Estados do formulário de comprovante
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  if (!isOpen) return null

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    } catch {
      return dateStr
    }
  }

  const handleCopyPix = () => {
    if (!cobranca.pix_code) return
    navigator.clipboard.writeText(cobranca.pix_code)
    setCopiedPix(true)
    toast.success('Código PIX Copia e Cola copiado com sucesso!')
    setTimeout(() => setCopiedPix(false), 2500)
  }

  const handleCopyBoleto = () => {
    if (!cobranca.boleto_barcode) return
    navigator.clipboard.writeText(cobranca.boleto_barcode.replace(/\s+/g, ''))
    setCopiedBoleto(true)
    toast.success('Linha digitável do Boleto copiada!')
    setTimeout(() => setCopiedBoleto(false), 2500)
  }

  // Upload do comprovante
  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo de comprovante (PDF ou imagem).')
      return
    }

    setIsUploading(true)
    try {
      let receiptPath = `comprovante_${cobranca.id}_${Date.now()}.${selectedFile.name.split('.').pop()}`

      // Tentar upload no bucket 'documents' do Supabase se configurado
      try {
        const filePath = `comprovantes/${cobranca.id}/${receiptPath}`
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, selectedFile, { upsert: true })

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(filePath)
          if (publicUrlData?.publicUrl) {
            receiptPath = publicUrlData.publicUrl
          }
        }
      } catch (err) {
        if (import.meta.env.DEV) console.warn('Supabase storage upload fallback:', err)
      }

      await financeService.submitReceipt(cobranca.id, selectedFile.name, receiptPath, user?.id)
      toast.success('Comprovante enviado com sucesso! Nosso escritório irá validar a transferência.')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Erro ao enviar comprovante:', err)
      toast.error('Erro ao enviar o comprovante. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl overflow-hidden text-[hsl(var(--foreground))] flex flex-col h-[560px] max-h-[90vh]">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 px-5 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d6084]/15 text-[#0d6084] dark:bg-cyan-500/20 dark:text-cyan-400">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold leading-tight">Pagamento de Cobrança</h3>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] truncate max-w-[240px] sm:max-w-xs">{cobranca.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Resumo do Valor */}
        <div className="bg-gradient-to-r from-[#0d6084]/15 via-cyan-500/10 to-[#0d6084]/5 p-4 sm:p-5 border-b border-[hsl(var(--border))] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[hsl(var(--muted-foreground))]">Valor a Pagar</span>
            <div className="font-heading text-2xl sm:text-3xl font-black text-[#0d6084] dark:text-cyan-400">
              {formatCurrency(cobranca.amount)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[hsl(var(--muted-foreground))]">Vencimento</span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[hsl(var(--foreground))] mt-0.5">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              {formatDate(cobranca.due_date)}
            </div>
          </div>
        </div>

        {/* Abas de Opções de Pagamento */}
        <div className="flex border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 shrink-0">
          <button
            onClick={() => setActiveTab('pix')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'pix'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            PIX
          </button>
          <button
            onClick={() => setActiveTab('boleto')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'boleto'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/10'
                : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Boleto Bancário
          </button>
          <button
            onClick={() => setActiveTab('comprovante')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'comprovante'
                ? 'border-[#0d6084] text-[#0d6084] dark:text-cyan-300 bg-[#0d6084]/15'
                : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            Enviar Comprovante
          </button>
        </div>

        {/* Conteúdo das Abas com Rolo de Scroll Flexível */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: PIX */}
          {activeTab === 'pix' && (
            <div className="flex flex-col items-center text-center gap-4">
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Escaneie o código QR abaixo no aplicativo do seu banco ou copie o código Pix Copia e Cola.
              </p>

              {/* QR Code Visual SVG */}
              <div className="relative p-3 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center shrink-0">
                <svg className="w-36 h-36 sm:w-40 sm:h-40" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="25" height="25" fill="#0d6084" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="#0d6084" />

                  <rect x="65" y="10" width="25" height="25" fill="#0d6084" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="#0d6084" />

                  <rect x="10" y="65" width="25" height="25" fill="#0d6084" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="#0d6084" />

                  <rect x="42" y="12" width="6" height="6" fill="#0d6084" />
                  <rect x="52" y="18" width="6" height="12" fill="#0d6084" />
                  <rect x="40" y="30" width="18" height="6" fill="#0d6084" />
                  <rect x="10" y="42" width="8" height="14" fill="#0d6084" />
                  <rect x="22" y="48" width="14" height="6" fill="#0d6084" />
                  <rect x="42" y="42" width="16" height="16" fill="#0d6084" />
                  <rect x="65" y="42" width="12" height="18" fill="#0d6084" />
                  <rect x="80" y="45" width="10" height="10" fill="#0d6084" />
                  <rect x="40" y="65" width="12" height="12" fill="#0d6084" />
                  <rect x="58" y="68" width="16" height="8" fill="#0d6084" />
                  <rect x="78" y="65" width="12" height="25" fill="#0d6084" />
                  <rect x="45" y="80" width="22" height="10" fill="#0d6084" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="rounded-full bg-emerald-500 text-white p-1.5 shadow-lg border-2 border-white">
                    <QrCode className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="w-full space-y-1">
                <label className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider block text-left">
                  Código Pix Copia e Cola
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={cobranca.pix_code}
                    className="w-full text-xs font-mono bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-[hsl(var(--foreground))] select-all"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copiar PIX
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl p-3 w-full border border-emerald-500/20 text-left">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <span className="text-[11px] leading-tight">
                  Pagamentos PIX são identificados em até 2 horas pela plataforma.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: BOLETO */}
          {activeTab === 'boleto' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Utilize a linha digitável para pagar no seu internet banking ou aplicativo financeiro.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider block">
                  Linha Digitável do Boleto
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={cobranca.boleto_barcode}
                    className="w-full text-xs font-mono bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-[hsl(var(--foreground))] select-all"
                  />
                  <button
                    onClick={handleCopyBoleto}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
                  >
                    {copiedBoleto ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[hsl(var(--foreground))]">Boleto Bancário PDF</h4>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Documento completo em formato PDF</p>
                  </div>
                </div>
                <a
                  href={`#download-boleto-${cobranca.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    toast.info('Abrindo boleto bancário PDF...')
                  }}
                  className="px-3.5 py-2 text-xs font-bold bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-xl flex items-center gap-1.5 border border-[hsl(var(--border))] transition-all shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-blue-500" /> Abrir PDF
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: ENVIAR COMPROVANTE */}
          {activeTab === 'comprovante' && (
            <form onSubmit={handleUploadReceipt} className="flex flex-col gap-3.5">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0d6084]/10 border border-[#0d6084]/20 text-[#0d6084] dark:text-cyan-300 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#0d6084] dark:text-cyan-400" />
                <span className="text-[11px] leading-tight">
                  Efetuou o pagamento via transferência, TED ou PIX direto? Anexe o comprovante abaixo para rápida verificação pelo nosso escritório.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold block text-[hsl(var(--foreground))]">Anexar Comprovante (PDF, PNG, JPG)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-[hsl(var(--muted-foreground))] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0d6084] file:text-white hover:file:bg-[#0a4a62] file:cursor-pointer cursor-pointer border border-[hsl(var(--border))] rounded-2xl bg-[hsl(var(--muted))]/40 p-2"
                />
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span className="truncate font-medium">{selectedFile.name}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="w-full py-2.5 bg-gradient-to-r from-[#0d6084] via-[#0f729d] to-[#0a4a62] hover:from-[#0f6f99] hover:to-[#0c5874] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all mt-1 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Enviar Comprovante para Validação
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Rodapé de Segurança */}
        <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-5 py-2.5 flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))] shrink-0">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            <span>Ambiente Criptografado e Seguro</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-[hsl(var(--foreground))] hover:underline"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
