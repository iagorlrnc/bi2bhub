import { useState, useRef } from 'react'
import { X, Plus, Paperclip, Loader2, FileText, Send } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { logAuditActivity } from '@/lib/audit'

interface NewTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  companiesList?: { id: string; name: string }[]
  isAdmin?: boolean
}

export function NewTicketModal({
  isOpen,
  onClose,
  onSuccess,
  companiesList = [],
  isAdmin = false
}: NewTicketModalProps) {
  const { user, company } = useAuth()

  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('fiscal')
  const [priority, setPriority] = useState('media')
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const targetCompanyId = isAdmin ? selectedCompanyId : company?.id
    if (!targetCompanyId) {
      toast.error('Por favor, selecione uma empresa.')
      return
    }

    if (!subject.trim()) {
      toast.error('Informe o assunto do chamado.')
      return
    }

    if (!description.trim()) {
      toast.error('Informe a descrição do chamado.')
      return
    }

    setIsSubmitting(true)
    try {
      // 1. Criar Chamado
      const { data: ticketData, error: ticketError } = await supabase
        .from('chamados')
        .insert({
          company_id: targetCompanyId,
          subject: subject.trim(),
          description: description.trim(),
          category: category as any,
          priority: priority as any,
          status: 'aberto',
          created_by: user?.id
        })
        .select()
        .single()

      if (ticketError) throw ticketError

      logAuditActivity({
        userId: user?.id,
        companyId: targetCompanyId,
        action: 'CRIAR_CHAMADO',
        entityType: 'chamados',
        entityId: ticketData?.id,
        metadata: {
          origin: isAdmin ? 'Painel Admin' : 'Painel do Cliente',
          subject: subject.trim(),
          category,
          priority,
          has_attachment: !!selectedFile,
          file_name: selectedFile?.name
        }
      })

      // 2. Se houver anexo inicial, fazer upload e inserir primeira mensagem
      if (selectedFile && ticketData?.id) {
        const filePath = `${targetCompanyId}/tickets/${ticketData.id}/${Date.now()}_${selectedFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, selectedFile)

        if (!uploadError) {
          await supabase
            .from('mensagens_chamado')
            .insert({
              ticket_id: ticketData.id,
              sender_id: user?.id,
              content: `Chamado aberto com anexo inicial: ${selectedFile.name}`,
              attachments: [{
                name: selectedFile.name,
                file_path: filePath,
                mime_type: selectedFile.type || 'application/octet-stream',
                size: selectedFile.size
              }],
              is_internal: false
            })
        }
      }

      toast.success('Chamado aberto com sucesso!')
      onSuccess()
      onClose()
      // Reset
      setSubject('')
      setDescription('')
      setSelectedFile(null)
      setCategory('fiscal')
      setPriority('media')
    } catch (err) {
      console.error('Erro ao criar chamado:', err)
      toast.error('Erro ao abrir chamado. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 cursor-default"
      >
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between bg-[hsl(var(--muted))]/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[hsl(var(--foreground))]">Novo Chamado</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Preencha os dados abaixo para abrir uma solicitação</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Empresa (Se for Admin) */}
          {isAdmin && (
            <div>
              <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Empresa Solicitante *</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                required
                className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
              >
                <option value="">Selecione uma empresa...</option>
                {companiesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Assunto */}
          <div>
            <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Assunto do Chamado *</label>
            <input
              type="text"
              placeholder="Ex: Dúvida sobre guia de imposto de renda"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Categoria e Prioridade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
              >
                <option value="fiscal">Fiscal</option>
                <option value="contabil">Contábil</option>
                <option value="trabalhista">Trabalhista</option>
                <option value="societario">Societário</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="financeiro">Financeiro</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Prioridade *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente / Crítica</option>
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Descrição Detalhada *</label>
            <textarea
              rows={4}
              placeholder="Descreva a solicitação ou problema com o máximo de detalhes possível..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] p-2.5 font-medium text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 leading-relaxed"
            />
          </div>

          {/* Anexo de Arquivo */}
          <div>
            <label className="block font-semibold mb-1 text-[hsl(var(--foreground))]">Anexar Arquivo (Opcional)</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0])
                }
              }}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-brand-300 bg-brand-50/40 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate font-semibold">{selectedFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-brand-100 dark:hover:bg-brand-900 rounded-md text-rose-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-[hsl(var(--input))] rounded-xl p-3 flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))] hover:border-brand-500 hover:text-brand-500 transition-colors cursor-pointer"
              >
                <Paperclip className="h-4 w-4" />
                <span>Clique para selecionar um arquivo PDF, Imagem ou Documento</span>
              </button>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-[hsl(var(--border))] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[hsl(var(--border))] font-semibold text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Abrindo Chamado...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Abrir Chamado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
