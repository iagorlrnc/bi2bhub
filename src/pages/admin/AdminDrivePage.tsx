import { useState, useRef, useEffect } from 'react'
import { 
  FolderOpen, 
  FileText, 
  Upload, 
  Search, 
  Star,
  ChevronRight, 
  Trash2, 
  HardDrive, 
  FileImage, 
  FileArchive, 
  Loader2, 
  Plus, 
  X, 
  Building2,
  LayoutGrid,
  List,
  FileSpreadsheet,
  Database,
  Info,
  Pencil,
  Eye,
} from 'lucide-react'
import { cn, isBi2bCompany } from '@/lib/utils'
import { toast } from 'sonner'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/constants'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { logAuditActivity, logOrUpdateDocumentView } from '@/lib/audit'
import { FilePreviewModal, type PreviewFile } from '@/components/FilePreviewModal'
import { DocumentHistoryModal, type DocumentHistoryFile } from '@/components/DocumentHistoryModal'

export function AdminDrivePage() {
  const { user } = useAuth()
  const [companies, setCompanies] = useState<any[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [folders, setFolders] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null)
  const [selectedHistoryFile, setSelectedHistoryFile] = useState<DocumentHistoryFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleOpenFilePreview = (file: any) => {
    setPreviewFile({
      name: file.name,
      filePath: file.file_path,
      bucket: 'documents',
      size: file.file_size,
      type: file.file_type
    })

    if (user?.id && (selectedCompanyId || file.company_id)) {
      logOrUpdateDocumentView(user.id, selectedCompanyId || file.company_id, file.id, file.name, file.file_path)
    }
  }

  // Estado para criação e edição de pasta
  const [isOpenFolderModal, setIsOpenFolderModal] = useState(false)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderColor, setNewFolderColor] = useState('#3B82F6')
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  // Estado para edição de arquivo
  const [isOpenFileModal, setIsOpenFileModal] = useState(false)
  const [editingFileId, setEditingFileId] = useState<string | null>(null)
  const [editFileName, setEditFileName] = useState('')
  const [editFileCategory, setEditFileCategory] = useState<string>('outros')
  const [isSavingFile, setIsSavingFile] = useState(false)

  const handleStartEditFolder = (folder: any) => {
    setEditingFolderId(folder.id)
    setNewFolderName(folder.name)
    setNewFolderColor(folder.color || '#3B82F6')
    setIsOpenFolderModal(true)
  }

  const handleFolderFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim() || !selectedCompanyId || !user?.id) return
    setIsCreatingFolder(true)
    try {
      if (editingFolderId) {
        // Modo Edição
        const { error } = await supabase
          .from('pastas')
          .update({
            name: newFolderName.trim(),
            color: newFolderColor
          })
          .eq('id', editingFolderId)

        if (error) {
          if (error.code === '23505') {
            toast.error('Já existe uma pasta com este nome.')
          } else {
            throw error
          }
        } else {
          toast.success('Pasta atualizada com sucesso!')
          handleCloseFolderModal()
          fetchData()
        }
      } else {
        // Modo Criação
        const { error } = await supabase
          .from('pastas')
          .insert({
            company_id: selectedCompanyId,
            name: newFolderName.trim(),
            color: newFolderColor,
            icon: 'Folder',
            created_by: user.id
          })
        
        if (error) {
          if (error.code === '23505') {
            toast.error('Já existe uma pasta com este nome.')
          } else {
            throw error
          }
        } else {
          toast.success('Pasta criada com sucesso!')
          handleCloseFolderModal()
          fetchData()
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro ao processar pasta:', err)
      toast.error('Erro ao processar pasta.')
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleCloseFolderModal = () => {
    setIsOpenFolderModal(false)
    setNewFolderName('')
    setNewFolderColor('#3B82F6')
    setEditingFolderId(null)
  }

  const handleDeleteFolder = async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    if (!folder) return
    if (confirm(`Tem certeza que deseja excluir permanentemente a pasta "${folder.name}" e todos os seus arquivos?`)) {
      try {
        // Buscar caminhos de arquivo no storage
        const { data: folderFiles, error: fetchError } = await supabase
          .from('documentos')
          .select('file_path')
          .eq('folder_id', folderId)
        
        if (fetchError) throw fetchError

        if (folderFiles && folderFiles.length > 0) {
          const filePaths = folderFiles.map((f: any) => f.file_path)
          await supabase.storage.from('documents').remove(filePaths)
        }

        // Excluir pasta no DB (o cascade cuidará dos documentos no banco)
        const { error: deleteError } = await supabase
          .from('pastas')
          .delete()
          .eq('id', folderId)
        
        if (deleteError) throw deleteError

        toast.success('Pasta excluída com sucesso.')
        fetchData()
      } catch (err) {
        if (import.meta.env.DEV) console.error(err)
        toast.error('Erro ao excluir pasta.')
      }
    }
  }

  const handleStartEditFile = (file: any) => {
    setEditingFileId(file.id)
    setEditFileName(file.name)
    setEditFileCategory(file.category || 'outros')
    setIsOpenFileModal(true)
  }

  const handleEditFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editFileName.trim() || !editingFileId) return
    setIsSavingFile(true)
    try {
      const { error } = await supabase
        .from('documentos')
        .update({
          name: editFileName.trim(),
          category: editFileCategory as any
        })
        .eq('id', editingFileId)

      if (error) throw error

      logAuditActivity({
        userId: user?.id,
        companyId: selectedCompanyId,
        action: 'ATUALIZAR_DOCUMENTO',
        entityType: 'documentos',
        entityId: editingFileId,
        metadata: { new_name: editFileName.trim(), new_category: editFileCategory }
      })

      toast.success('Documento atualizado com sucesso!')
      setIsOpenFileModal(false)
      setEditingFileId(null)
      fetchData()
    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro ao atualizar documento:', err)
      toast.error('Erro ao atualizar documento.')
    } finally {
      setIsSavingFile(false)
    }
  }

  const currentFolder = folders.find(f => f.id === activeFolderId)

  // Buscar lista de empresas no mount
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('id, name, trade_name, codigo_exclusivo')
          .eq('is_active', true)
          .order('name')
        if (error) throw error
        const filtered = (data || []).filter((c) => !isBi2bCompany(c))
        setCompanies(filtered)
        if (filtered && filtered.length > 0) {
          setSelectedCompanyId(filtered[0].id)
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error('Erro ao buscar empresas:', err)
        toast.error('Erro ao carregar lista de empresas.')
      } finally {
        setIsLoadingCompanies(false)
      }
    }
    fetchCompanies()
  }, [])

  const fetchData = async (isSilent = false) => {
    if (!selectedCompanyId) return
    if (!isSilent) setIsLoading(true)
    try {
      // 1. Buscar pastas da empresa selecionada
      const { data: folderData, error: folderError } = await supabase
        .from('pastas')
        .select('id, company_id, parent_id, name, color, icon, created_by, is_sistema, created_at')
        .eq('company_id', selectedCompanyId)
      if (folderError) throw folderError

      // 2. Buscar arquivos da empresa selecionada
      const { data: fileData, error: fileError } = await supabase
        .from('documentos')
        .select('id, company_id, folder_id, name, description, file_path, file_size, mime_type, category, tags, is_favorite, uploaded_by, created_at')
        .eq('company_id', selectedCompanyId)
      if (fileError) throw fileError

      const resolvedFiles = fileData || []
      const resolvedFolders = (folderData || []).map((fold: any) => {
        const count = resolvedFiles.filter((f: any) => f.folder_id === fold.id).length
        return { ...fold, count }
      })

      setFolders(resolvedFolders)
      setFiles(resolvedFiles)
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Erro ao buscar dados do drive:', err)
      }
      if (!isSilent) toast.error('Erro ao carregar arquivos do Drive.')
    } finally {
      if (!isSilent) setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedCompanyId) {
      fetchData()
    } else {
      setFolders([])
      setFiles([])
    }

    const handleRefresh = () => {
      if (selectedCompanyId) fetchData(true)
    }
    window.addEventListener('bi2b:refresh-data', handleRefresh)
    return () => window.removeEventListener('bi2b:refresh-data', handleRefresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId])

  // Lógica de Filtro
  const filteredFiles = files.filter(file => {
    const matchesFolder = activeFolderId === null || file.folder_id === activeFolderId
    const matchesSearch = (file.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const isMonthlyObligation = file.tags && file.tags.includes('obrigacao_mensal')
    if (activeFolderId === null && isMonthlyObligation) {
      return false
    }

    let matchesCategory = false
    if (selectedCategory === 'all' || activeFolderId !== null) {
      matchesCategory = true
    } else if (selectedCategory === 'folders') {
      matchesCategory = true
    } else if (selectedCategory === 'favorites') {
      matchesCategory = file.is_favorite
    } else {
      matchesCategory = file.category === selectedCategory
    }
    
    return matchesFolder && matchesSearch && matchesCategory
  })

  // Formatar bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Medidor de Armazenamento Utilizado Dinâmico por Plano
  const selectedCompanyObj = companies.find(c => c.id === selectedCompanyId)
  const getStorageLimitByPlan = (plan?: string) => {
    switch ((plan || '').toLowerCase()) {
      case 'básico':
      case 'basico':
        return 5 * 1024 * 1024 * 1024 // 5 GB
      case 'pró':
      case 'pro':
        return 20 * 1024 * 1024 * 1024 // 20 GB
      case 'plus':
      case 'empresarial':
        return 100 * 1024 * 1024 * 1024 // 100 GB
      default:
        return 10 * 1024 * 1024 * 1024 // 10 GB padrão
    }
  }

  const totalStorageUsed = files.reduce((acc, f) => acc + (f.file_size || 0), 0)
  const storageLimit = getStorageLimitByPlan(selectedCompanyObj?.plan)
  const storagePercentage = Math.min((totalStorageUsed / storageLimit) * 100, 100)

  // Manipular Exclusão de Arquivo
  const handleDelete = async (id: string) => {
    const file = files.find(f => f.id === id)
    if (!file) return
    if (confirm('Tem certeza que deseja excluir permanentemente este documento?')) {
      try {
        await supabase.storage.from('documents').remove([file.file_path])
        const { error } = await supabase
          .from('documentos')
          .delete()
          .eq('id', id)
        if (error) throw error

        logAuditActivity({
          userId: user?.id,
          companyId: selectedCompanyId,
          action: 'EXCLUIR_DOCUMENTO',
          entityType: 'documentos',
          entityId: id,
          metadata: { file_name: file.name, file_path: file.file_path }
        })

        toast.success('Documento excluído.')
        fetchData()
      } catch (err) {
        if (import.meta.env.DEV) console.error(err)
        toast.error('Erro ao excluir documento.')
      }
    }
  }

  const getCategoryFromFolder = (folderId: string | null) => {
    const folder = folders.find(f => f.id === folderId)
    if (!folder) return 'outros'
    const name = folder.name.toLowerCase()
    if (name.includes('fiscal')) return 'fiscal'
    if (name.includes('contabil') || name.includes('balanç') || name.includes('finance')) return 'contabil'
    if (name.includes('trabalh') || name.includes('rh') || name.includes('pessoal')) return 'trabalhista'
    if (name.includes('societ') || name.includes('contrato')) return 'societario'
    return 'outros'
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFilesUpload(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFilesUpload(e.target.files)
    }
  }

  const handleFilesUpload = async (uploadList: FileList) => {
    if (!selectedCompanyId || !user?.id) return
    const filesArray = Array.from(uploadList)
    let uploadedCount = 0

    for (const file of filesArray) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`O arquivo "${file.name}" excede 50MB.`)
        continue
      }

      const fileExtension = '.' + (file.name.split('.').pop() || '').toLowerCase()
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        toast.error(`O tipo do arquivo "${file.name}" não é permitido.`)
        continue
      }

      const category = getCategoryFromFolder(activeFolderId)
      const filePath = `${selectedCompanyId}/${activeFolderId || 'root'}/${Date.now()}_${file.name}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)
        if (uploadError) throw uploadError

        const { error: dbError } = await supabase
          .from('documentos')
          .insert({
            company_id: selectedCompanyId,
            folder_id: activeFolderId,
            name: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type || 'application/pdf',
            category: category as any,
            is_favorite: false,
            uploaded_by: user.id
          })
        if (dbError) throw dbError
        uploadedCount++

        logAuditActivity({
          userId: user.id,
          companyId: selectedCompanyId,
          action: 'UPLOAD_DOCUMENTO',
          entityType: 'documentos',
          metadata: { file_name: file.name, file_size: file.size, file_path: filePath, category }
        })
      } catch (err: any) {
        if (import.meta.env.DEV) console.error('Erro no upload do arquivo:', err)
        toast.error(`Erro ao enviar "${file.name}": ${err.message || JSON.stringify(err)}`)
      }
    }

    if (uploadedCount > 0) {
      toast.success(`${uploadedCount} arquivo(s) enviado(s) com sucesso.`)
      fetchData()
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = (fileName.split('.').pop() || '').toLowerCase()
    switch (extension) {
      case 'zip':
      case 'rar':
      case '7z':
        return {
          icon: <FileArchive className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
          colorClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600',
          label: 'ZIP'
        }
      case 'png':
      case 'jpeg':
      case 'jpg':
      case 'gif':
      case 'webp':
      case 'svg':
        return {
          icon: <FileImage className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
          colorClass: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600',
          label: 'IMAGE'
        }
      case 'xlsx':
      case 'xls':
      case 'csv':
        return {
          icon: <FileSpreadsheet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
          colorClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600',
          label: 'EXCEL'
        }
      case 'pdf':
        return {
          icon: <FileText className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
          colorClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600',
          label: 'PDF'
        }
      default:
        return {
          icon: <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
          colorClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600',
          label: 'DOC'
        }
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'fiscal':
        return <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30">Fiscal</span>
      case 'contabil':
        return <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30">Contábil</span>
      case 'trabalhista':
        return <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">Trabalhista</span>
      case 'societario':
        return <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/30">Societário</span>
      default:
        return <span className="inline-flex items-center rounded-full bg-slate-50 dark:bg-slate-900/40 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800">Outros</span>
    }
  }

  if (isLoadingCompanies) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500 mr-2" />
        <span className="text-[hsl(var(--muted-foreground))] font-semibold">Carregando painel de documentos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6" onDragEnter={handleDrag}>
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[hsl(var(--border))] pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 shadow-inner">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--foreground))]">Drive de Documentos</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Gerencie arquivos e pastas das empresas vinculadas</p>
          </div>
        </div>

        <div className="flex items-end gap-3.5 flex-nowrap shrink-0">
          {/* Empresa select premium */}
          <div className="flex flex-col gap-1.5 min-w-[240px] relative">
            <label className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-0.5">Empresa Cliente</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))] z-10" />
              <select
                value={selectedCompanyId}
                onChange={(e) => {
                  setSelectedCompanyId(e.target.value)
                  setActiveFolderId(null)
                }}
                className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--card))] pl-9 pr-8 py-2.5 text-sm font-bold text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-sm appearance-none cursor-pointer transition-all"
              >
                <option value="">Selecione uma empresa...</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[hsl(var(--muted-foreground))]">
                <ChevronRight className="h-4 w-4 rotate-90" />
              </div>
            </div>
          </div>

          {selectedCompanyId && (
            <div className="flex gap-2 items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                className="hidden"
                multiple
              />
              <button
                onClick={() => {
                  setEditingFolderId(null)
                  setIsOpenFolderModal(true)
                }}
                className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] hover-lift transition-all"
              >
                <Plus className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                Nova Pasta
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 hover-lift transition-all"
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedCompanyId ? (
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Categoria */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-4 px-1">Categorias</h3>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'Todos os Arquivos', icon: HardDrive },
                  { id: 'folders', label: 'Todas as Pastas', icon: FolderOpen },
                  { id: 'favorites', label: 'Favoritos', icon: Star },
                  { id: 'fiscal', label: 'Fiscais', icon: FileText },
                  { id: 'contabil', label: 'Contabilidade', icon: FileSpreadsheet },
                  { id: 'trabalhista', label: 'Trabalhistas & RH', icon: Info },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setActiveFolderId(null); }}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative',
                      selectedCategory === cat.id && activeFolderId === null
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold shadow-2xs z-10'
                        : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/60 hover:text-[hsl(var(--foreground))] z-0'
                    )}
                  >
                    <cat.icon className="h-4 w-4 shrink-0" />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Visual Storage Gauge */}
              <div className="mt-6 border-t border-[hsl(var(--border))] pt-5">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[hsl(var(--foreground))] uppercase tracking-wider px-1">
                  <Database className="h-3.5 w-3.5 text-brand-500" />
                  <span>Uso da Empresa</span>
                </div>
                <div className="space-y-2 px-1">
                  <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                    <div 
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${storagePercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[hsl(var(--muted-foreground))] font-semibold">
                    <span>{formatBytes(totalStorageUsed)} usado</span>
                    <span>10 GB limite</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explorer de arquivos */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-[hsl(var(--card))]/30 p-3 rounded-xl border border-[hsl(var(--border))]/50 shadow-none">
              <nav className="flex items-center gap-1.5 text-sm px-2">
                <button 
                  onClick={() => { setActiveFolderId(null); }} 
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] font-bold transition-colors"
                >
                  Drive
                </button>
                {currentFolder && (
                  <>
                    <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] opacity-60" />
                    <span className="text-[hsl(var(--foreground))] font-semibold">{currentFolder.name}</span>
                  </>
                )}
              </nav>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="text"
                    placeholder="Buscar arquivos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-56 rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--card))] py-2 pl-9 pr-4 text-xs font-semibold focus:border-brand-500 focus:outline-none transition-all shadow-none"
                  />
                </div>

                {/* Seletor de visualização (Grade vs Lista) */}
                <div className="flex items-center gap-1 rounded-xl border border-[hsl(var(--border))] p-1 bg-[hsl(var(--card))] shadow-none">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      viewMode === 'grid'
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    )}
                    title="Exibir em Grade"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      viewMode === 'list'
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    )}
                    title="Exibir em Lista"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pastas grade */}
            {activeFolderId === null && selectedCategory === 'folders' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-1">Pastas</h3>
                {folders.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {folders.map(folder => {
                        const dynamicBorderColor = folder.color ? `${folder.color}33` : 'rgba(59, 130, 246, 0.2)'
                        const dynamicBgColor = folder.color ? `${folder.color}08` : 'rgba(59, 130, 246, 0.03)'
                        return (
                          <div
                            key={folder.id}
                            onClick={() => setActiveFolderId(folder.id)}
                            className="group relative flex items-center justify-between gap-4.5 rounded-xl border bg-[hsl(var(--card))] p-4.5 shadow-sm hover:shadow-md cursor-pointer transition-all hover-lift min-w-0 overflow-hidden"
                            style={{ 
                              borderColor: dynamicBorderColor,
                              backgroundColor: dynamicBgColor
                            }}
                          >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900/60 shadow-sm border border-[hsl(var(--border))]/40">
                                <FolderOpen className="h-6 w-6" style={{ color: folder.color || '#3b82f6' }} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="truncate text-sm font-bold text-[hsl(var(--foreground))]" title={folder.name}>{folder.name}</h4>
                                <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium mt-0.5">{folder.count} arquivos</p>
                              </div>
                            </div>
                            {/* Folder actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleStartEditFolder(folder)}
                                className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-brand-600 hover:bg-[hsl(var(--muted))] transition-colors"
                                title="Editar Pasta"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteFolder(folder.id)}
                                className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                                title="Excluir Pasta"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse table-fixed">
                          <thead>
                            <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                              <th className="py-3.5 px-5 w-[45%] sm:w-[40%]">Nome da Pasta</th>
                              <th className="py-3.5 px-4 hidden sm:table-cell w-[20%]">Tipo</th>
                              <th className="py-3.5 px-4 hidden sm:table-cell w-[20%]">Quantidade de Arquivos</th>
                              <th className="py-3.5 px-4 hidden lg:table-cell w-[15%]">Criado Em</th>
                              <th className="py-3.5 px-5 text-right w-[90px]">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[hsl(var(--border))]">
                            {folders.map(folder => {
                              return (
                                <tr 
                                  key={folder.id} 
                                  onClick={() => setActiveFolderId(folder.id)}
                                  className="hover:bg-[hsl(var(--muted))]/30 cursor-pointer transition-colors group"
                                >
                                  <td className="py-3 px-5 font-medium min-w-0 max-w-0">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900/60 shadow-sm border border-[hsl(var(--border))]/40">
                                        <FolderOpen className="h-5 w-5" style={{ color: folder.color || '#3b82f6' }} />
                                      </div>
                                      <span className="truncate block min-w-0 text-sm font-semibold text-[hsl(var(--foreground))] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" title={folder.name}>
                                        {folder.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-xs font-semibold text-[hsl(var(--muted-foreground))] hidden sm:table-cell">
                                    Pasta de Documentos
                                  </td>
                                  <td className="py-3 px-4 text-xs font-semibold text-[hsl(var(--muted-foreground))] hidden sm:table-cell">
                                    {folder.count} arquivos
                                  </td>
                                  <td className="py-3 px-4 text-xs font-semibold text-[hsl(var(--muted-foreground))] hidden lg:table-cell">
                                    {new Date(folder.created_at).toLocaleDateString('pt-BR')}
                                  </td>
                                  <td className="py-3 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        onClick={() => handleStartEditFolder(folder)}
                                        className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-brand-600 hover:bg-[hsl(var(--muted))] transition-colors"
                                        title="Editar Pasta"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteFolder(folder.id)}
                                        className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                                        title="Excluir Pasta"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-6 text-center border border-[hsl(var(--border))] rounded-xl bg-[hsl(var(--card))]/50">
                    <p className="text-sm text-[hsl(var(--muted-foreground))] italic">Nenhuma pasta criada. Use o botão "Nova Pasta" para organizar.</p>
                  </div>
                )}
              </div>
            )}

            {/* Lista de arquivos */}
            {(selectedCategory !== 'folders' || activeFolderId !== null) && (
              <div className="space-y-3 relative min-h-[250px]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] px-1">Arquivos</h3>
                
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))]">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-500 mb-2" />
                    <span className="text-sm text-[hsl(var(--muted-foreground))] font-semibold">Carregando arquivos...</span>
                  </div>
                ) : filteredFiles.length > 0 ? (
                  <div>
                    {/* Visualização em Lista */}
                    {viewMode === 'list' && (
                      <div className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                                <th className="py-3.5 px-5 w-[45%] sm:w-[40%] md:w-[35%]">Nome</th>
                                <th className="py-3.5 px-4 hidden md:table-cell w-[20%]">Categoria</th>
                                <th className="py-3.5 px-4 hidden sm:table-cell w-[15%]">Tamanho</th>
                                <th className="py-3.5 px-4 hidden lg:table-cell w-[15%]">Modificado</th>
                                <th className="py-3.5 px-5 text-right w-[110px]">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[hsl(var(--border))]">
                              {filteredFiles.map(file => {
                                const fileMeta = getFileIcon(file.name)
                                return (
                                  <tr key={file.id} className="hover:bg-[hsl(var(--muted))]/30 transition-colors group">
                                    <td className="py-3 px-5 font-medium min-w-0 max-w-0">
                                      <div 
                                        onClick={() => handleOpenFilePreview(file)}
                                        className="flex items-center gap-3 min-w-0 cursor-pointer group/name hover:text-brand-600 dark:hover:text-brand-400"
                                        title={`Clique para visualizar ${file.name}`}
                                      >
                                        <div className={cn("p-2 rounded-xl shrink-0 border border-[hsl(var(--border))]/40", fileMeta.colorClass)}>
                                          {fileMeta.icon}
                                        </div>
                                        <span className="truncate block min-w-0 text-sm font-semibold text-[hsl(var(--foreground))] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors group-hover/name:underline" title={file.name}>
                                          {file.name}
                                        </span>
                                        {file.tags?.includes('deletado_pelo_usuario') && (
                                          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shrink-0">
                                            Deletado por {file.tags?.find((t: string) => t.startsWith('deletado_por:'))?.replace('deletado_por:', '') || 'Cliente'}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 hidden md:table-cell">
                                      {getCategoryBadge(file.category)}
                                    </td>
                                    <td className="py-3 px-4 text-xs font-semibold text-[hsl(var(--muted-foreground))] hidden sm:table-cell">
                                      {formatBytes(file.file_size)}
                                    </td>
                                    <td className="py-3 px-4 text-xs font-semibold text-[hsl(var(--muted-foreground))] hidden lg:table-cell">
                                      {new Date(file.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="py-3 px-5 text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <button
                                          onClick={() => setSelectedHistoryFile(file)}
                                          className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-brand-600 hover:bg-brand-500/10 transition-colors"
                                          title="Histórico e Detalhes do Documento"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleStartEditFile(file)}
                                          className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-brand-600 hover:bg-[hsl(var(--muted))] transition-colors"
                                          title="Editar Arquivo"
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDelete(file.id)}
                                          className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                                          title="Excluir Arquivo"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Visualização em Grade */}
                    {viewMode === 'grid' && (
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {filteredFiles.map(file => {
                          const fileMeta = getFileIcon(file.name)
                          return (
                            <div 
                              key={file.id} 
                              className="group relative flex flex-col justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm hover:shadow-md transition-all hover-lift min-w-0 overflow-hidden"
                            >
                              <div className="flex items-start justify-between gap-4 min-w-0">
                                <div 
                                  onClick={() => handleOpenFilePreview(file)}
                                  className={cn("p-3 rounded-xl border border-[hsl(var(--border))]/40 cursor-pointer hover:scale-105 transition-transform shrink-0", fileMeta.colorClass)}
                                  title="Clique para visualizar"
                                >
                                  {fileMeta.icon}
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0">
                                  <button
                                    onClick={() => setSelectedHistoryFile(file)}
                                    className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-brand-600 hover:bg-brand-500/10 transition-colors"
                                    title="Histórico e Detalhes do Documento"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleStartEditFile(file)}
                                    className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-brand-600 hover:bg-[hsl(var(--muted))] transition-colors"
                                    title="Editar Arquivo"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(file.id)}
                                    className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                                    title="Excluir Arquivo"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              <div 
                                onClick={() => handleOpenFilePreview(file)}
                                className="mt-4 min-w-0 cursor-pointer"
                                title={`Clique para visualizar ${file.name}`}
                              >
                                <h4 className="truncate block min-w-0 text-sm font-bold text-[hsl(var(--foreground))] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors hover:underline" title={file.name}>
                                  {file.name}
                                </h4>
                                <div className="flex items-center justify-between gap-2 mt-2.5 min-w-0">
                                  <span className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] shrink-0">
                                    {formatBytes(file.file_size)}
                                  </span>
                                  <div className="truncate min-w-0">
                                    {getCategoryBadge(file.category)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-[hsl(var(--border))] rounded-xl bg-[hsl(var(--card))]/50">
                    <Upload className="h-10 w-10 text-[hsl(var(--muted-foreground))] mb-3" />
                    <h3 className="font-semibold text-sm text-[hsl(var(--foreground))]">Nenhum arquivo encontrado</h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 max-w-xs">Arraste seus arquivos para esta tela ou utilize o botão de upload no topo.</p>
                  </div>
                )}

                {/* Zona Invisível que captura o Drag & Drop e mostra o Overlay quando dragActive */}
                {dragActive && (
                  <div 
                    className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[hsl(var(--background))]/85 backdrop-blur-sm border-2 border-dashed border-brand-500 rounded-xl animate-in fade-in duration-200"
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4 shadow-md">
                      <Upload className="h-8 w-8" />
                    </div>
                    <p className="text-base font-bold text-[hsl(var(--foreground))]">Solte seus arquivos aqui</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Os arquivos serão enviados para a empresa selecionada</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-[hsl(var(--border))] rounded-xl bg-[hsl(var(--card))]/40 shadow-inner">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 mb-4 shadow-sm">
            <Building2 className="h-7 w-7" />
          </div>
          <h3 className="font-heading font-bold text-[hsl(var(--foreground))] text-base">Nenhuma empresa selecionada</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1.5 max-w-md font-medium">Selecione uma empresa ativa no menu superior para visualizar a estrutura de pastas e documentos cadastrados no Drive.</p>
        </div>
      )}

      {/* Modal de Nova Pasta / Editar Pasta */}
      {isOpenFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4 mb-4">
              <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">
                {editingFolderId ? 'Editar Pasta' : 'Criar Nova Pasta'}
              </h3>
              <button
                onClick={handleCloseFolderModal}
                className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFolderFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Nome da Pasta</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Faturamento 2026, Declarações"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2.5">Selecione uma Cor</label>
                <div className="flex justify-between gap-1.5">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewFolderColor(color)}
                      className={cn(
                        'h-8 w-8 rounded-full border-2 transition-all hover:scale-105',
                        newFolderColor === color ? 'border-[hsl(var(--foreground))] scale-110 shadow-lg' : 'border-transparent'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[hsl(var(--border))]">
                <button
                  type="button"
                  onClick={handleCloseFolderModal}
                  className="rounded-xl border border-[hsl(var(--border))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder || !newFolderName.trim()}
                  className="flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 disabled:opacity-50 transition-all"
                >
                  {isCreatingFolder && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingFolderId ? 'Salvar Alterações' : 'Criar Pasta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Editar Arquivo */}
      {isOpenFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4 mb-4">
              <h3 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">Editar Documento</h3>
              <button
                onClick={() => {
                  setIsOpenFileModal(false)
                  setEditingFileId(null)
                }}
                className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditFileSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Nome do Arquivo</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do arquivo"
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Categoria</label>
                <div className="relative">
                  <select
                    value={editFileCategory}
                    onChange={(e) => setEditFileCategory(e.target.value)}
                    className="w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 text-sm font-bold text-[hsl(var(--foreground))] focus:outline-none focus:border-brand-500 shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="fiscal">Fiscal</option>
                    <option value="contabil">Contabilidade</option>
                    <option value="trabalhista">Trabalhistas & RH</option>
                    <option value="societario">Societário</option>
                    <option value="outros">Outros</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[hsl(var(--muted-foreground))]">
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[hsl(var(--border))]">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpenFileModal(false)
                    setEditingFileId(null)
                  }}
                  className="rounded-xl border border-[hsl(var(--border))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingFile || !editFileName.trim()}
                  className="flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 disabled:opacity-50 transition-all"
                >
                  {isSavingFile && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Pré-visualização de Arquivo */}
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />

      {/* Modal de Histórico e Auditoria do Documento */}
      <DocumentHistoryModal
        isOpen={!!selectedHistoryFile}
        onClose={() => setSelectedHistoryFile(null)}
        file={selectedHistoryFile}
      />
    </div>
  )
}
