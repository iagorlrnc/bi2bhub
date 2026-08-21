import { useState, useEffect } from 'react'
import {
  X,
  Download,
  Loader2,
  FileText,
  FileImage,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  File,
  AlertCircle,
  Check,
  Copy,
  Maximize2,
  Minimize2,
  ExternalLink
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface PreviewFile {
  name: string
  url?: string
  filePath?: string
  bucket?: string
  size?: number
  type?: string
  updatedAt?: string
}

export interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  file: PreviewFile | null
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return 'Tamanho desconhecido'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function getFileExtension(filename: string): string {
  if (!filename) return ''
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

function getFileTypeCategory(filename: string, mimeType?: string): 'image' | 'pdf' | 'text' | 'audio' | 'video' | 'spreadsheet' | 'archive' | 'doc' | 'other' {
  const ext = getFileExtension(filename)
  const mime = (mimeType || '').toLowerCase()

  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'ico'].includes(ext) || mime.startsWith('image/')) {
    return 'image'
  }
  if (ext === 'pdf' || mime === 'application/pdf') {
    return 'pdf'
  }
  if (['txt', 'json', 'csv', 'log', 'md', 'xml', 'sql', 'js', 'ts', 'html', 'css'].includes(ext) || mime.startsWith('text/')) {
    return 'text'
  }
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext) || mime.startsWith('audio/')) {
    return 'audio'
  }
  if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext) || mime.startsWith('video/')) {
    return 'video'
  }
  if (['xlsx', 'xls', 'ods', 'csv'].includes(ext)) {
    return 'spreadsheet'
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return 'archive'
  }
  if (['doc', 'docx', 'ppt', 'pptx', 'odt'].includes(ext)) {
    return 'doc'
  }
  return 'other'
}

function renderFileIcon(category: ReturnType<typeof getFileTypeCategory>) {
  switch (category) {
    case 'image':
      return <FileImage className="h-5 w-5 text-emerald-500" />
    case 'pdf':
      return <FileText className="h-5 w-5 text-rose-500" />
    case 'text':
      return <FileCode className="h-5 w-5 text-blue-500" />
    case 'spreadsheet':
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />
    case 'archive':
      return <FileArchive className="h-5 w-5 text-amber-500" />
    default:
      return <File className="h-5 w-5 text-purple-500" />
  }
}

export function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [textContent, setTextContent] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  useEffect(() => {
    if (!isOpen || !file) {
      setSignedUrl(null)
      setPdfBlobUrl(null)
      setTextContent(null)
      setError(null)
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)
    setTextContent(null)
    setPdfBlobUrl(null)

    const fetchUrl = async () => {
      try {
        const pathOrUrl = file.url || file.filePath || ''

        if (!pathOrUrl) {
          throw new Error('Caminho do arquivo não fornecido.')
        }

        const isFullHttpUrl =
          pathOrUrl.startsWith('http://') ||
          pathOrUrl.startsWith('https://') ||
          pathOrUrl.startsWith('data:') ||
          pathOrUrl.startsWith('blob:')

        if (isFullHttpUrl) {
          if (isMounted) setSignedUrl(pathOrUrl)
          return
        }

        // Se for um caminho relativo no bucket
        let bucket = file.bucket || 'documents'
        let cleanPath = pathOrUrl.replace(/^\/+/, '')

        // Se contiver nome do bucket na rota, extrair caminho interno
        if (cleanPath.includes(`/${bucket}/`)) {
          cleanPath = cleanPath.split(`/${bucket}/`)[1]
        } else if (cleanPath.includes('/documents/')) {
          cleanPath = cleanPath.split('/documents/')[1]
        }

        cleanPath = decodeURIComponent(cleanPath)

        let { data, error: signedErr } = await supabase.storage
          .from(bucket)
          .createSignedUrl(cleanPath, 3600)

        if (signedErr && bucket !== 'documents') {
          const fallback = await supabase.storage
            .from('documents')
            .createSignedUrl(cleanPath, 3600)
          if (fallback.data?.signedUrl) {
            data = fallback.data
            signedErr = null
          }
        }

        if (signedErr || !data?.signedUrl) {
          // Fallback para getPublicUrl se signedUrl falhar
          const publicRes = supabase.storage.from(bucket).getPublicUrl(cleanPath)
          if (publicRes.data?.publicUrl) {
            if (isMounted) setSignedUrl(publicRes.data.publicUrl)
            return
          }
          throw signedErr || new Error('Não foi possível gerar link do arquivo.')
        }

        if (isMounted && data?.signedUrl) {
          setSignedUrl(data.signedUrl)
        }
      } catch (err: any) {
        if (import.meta.env.DEV) console.error('Erro ao carregar preview do arquivo:', err)
        if (isMounted) setError(err.message || 'Não foi possível carregar o arquivo.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchUrl()

    return () => {
      isMounted = false
    }
  }, [isOpen, file])

  // Se for PDF, cria Blob URL para garantir renderização perfeita e sem bloqueios CSP de iframes externos
  useEffect(() => {
    if (!signedUrl || !file) return
    const category = getFileTypeCategory(file.name, file.type)
    if (category !== 'pdf') return

    let isMounted = true
    let blobUrl: string | null = null

    if (signedUrl.startsWith('blob:') || signedUrl.startsWith('data:')) {
      setPdfBlobUrl(signedUrl)
      return
    }

    fetch(signedUrl)
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar stream do PDF')
        return res.blob()
      })
      .then(blob => {
        if (isMounted) {
          const pdfBlob = new Blob([blob], { type: 'application/pdf' })
          blobUrl = URL.createObjectURL(pdfBlob)
          setPdfBlobUrl(blobUrl)
        }
      })
      .catch(err => {
        if (import.meta.env.DEV) console.warn('Carregando PDF com URL direta:', err)
        if (isMounted) {
          setPdfBlobUrl(signedUrl)
        }
      })

    return () => {
      isMounted = false
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [signedUrl, file])

  // Se for texto, buscar o conteúdo para exibir no visualizador de código
  useEffect(() => {
    if (!signedUrl || !file) return
    const category = getFileTypeCategory(file.name, file.type)

    if (category === 'text') {
      fetch(signedUrl)
        .then(res => res.text())
        .then(text => setTextContent(text))
        .catch(err => {
          if (import.meta.env.DEV) console.error('Erro ao ler texto:', err)
        })
    }
  }, [signedUrl, file])

  if (!isOpen || !file) return null

  const category = getFileTypeCategory(file.name, file.type)
  const fileExt = getFileExtension(file.name).toUpperCase()
  const displayPdfUrl = pdfBlobUrl || signedUrl

  const handleDownload = async () => {
    if (!signedUrl) {
      toast.error('URL do arquivo não disponível.')
      return
    }

    setIsDownloading(true)
    try {
      const response = await fetch(signedUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name || 'documento'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Download concluído!')
    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro no download:', err)
      // Fallback: abre direct download em nova aba
      window.open(signedUrl, '_blank')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyText = () => {
    if (!textContent) return
    navigator.clipboard.writeText(textContent)
    setIsCopied(true)
    toast.success('Texto copiado para a área de transferência!')
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className={`bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-5xl max-h-[92vh] h-[85vh]'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <div className="p-2 rounded-xl bg-[hsl(var(--muted))] shrink-0">
              {renderFileIcon(category)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-[hsl(var(--foreground))] truncate max-w-[280px] sm:max-w-md">
                  {file.name}
                </h3>
                {fileExt && (
                  <span className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-[10px] font-extrabold shrink-0 border border-brand-500/20">
                    {fileExt}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
                {formatBytes(file.size)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {signedUrl && (
              <a
                href={signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors flex items-center justify-center"
                title="Abrir arquivo em nova aba"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            {signedUrl && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-2 rounded-xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors flex items-center justify-center disabled:opacity-50"
                title="Baixar arquivo"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors hidden sm:flex"
              title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors ml-1"
              title="Fechar visualizador"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 bg-[hsl(var(--background))] overflow-auto relative flex items-center justify-center p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 p-12 text-[hsl(var(--muted-foreground))]">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              <span className="text-xs font-medium">Carregando visualização do arquivo...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
              <div className="p-3 rounded-full bg-rose-500/10 text-rose-500 mb-3">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h4 className="font-extrabold text-sm text-[hsl(var(--foreground))] mb-1">
                Erro ao carregar arquivo
              </h4>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">
                {error}
              </p>
              {signedUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="h-4 w-4" />
                  <span>Tentar Baixar Arquivo</span>
                </button>
              )}
            </div>
          ) : signedUrl ? (
            <div className="w-full h-full flex items-center justify-center">
              {/* IMAGE PREVIEW */}
              {category === 'image' && (
                <div className="relative w-full h-full flex items-center justify-center overflow-auto p-2">
                  <img
                    src={signedUrl}
                    alt={file.name}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md border border-[hsl(var(--border))]"
                  />
                </div>
              )}

              {/* PDF PREVIEW */}
              {category === 'pdf' && (
                <div className="w-full h-full relative rounded-lg overflow-hidden bg-gray-900">
                  <object
                    data={displayPdfUrl ? `${displayPdfUrl}#toolbar=1` : undefined}
                    type="application/pdf"
                    className="w-full h-full border-0 rounded-lg shadow-inner bg-gray-900"
                  >
                    <iframe
                      src={displayPdfUrl ? `${displayPdfUrl}#toolbar=1` : undefined}
                      title={file.name}
                      className="w-full h-full border-0 rounded-lg shadow-inner bg-gray-900"
                    >
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[hsl(var(--card))] text-[hsl(var(--foreground))] rounded-xl">
                        <FileText className="h-12 w-12 text-rose-500 mb-3" />
                        <h4 className="text-sm font-bold mb-1">Visualização de Documento</h4>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] max-w-sm mb-4">
                          O navegador não carregou o leitor embutido de PDF. Você pode abrir o documento diretamente ou fazer download.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {signedUrl && (
                            <a
                              href={signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Abrir em Nova Aba
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 text-[hsl(var(--foreground))] text-xs font-bold transition-all"
                          >
                            <Download className="h-4 w-4" />
                            Baixar PDF
                          </button>
                        </div>
                      </div>
                    </iframe>
                  </object>
                </div>
              )}

              {/* TEXT / CODE PREVIEW */}
              {category === 'text' && (
                <div className="w-full h-full flex flex-col bg-gray-950 text-gray-100 rounded-xl overflow-hidden border border-gray-800 shadow-inner">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-400">
                    <span>Conteúdo do Arquivo ({fileExt})</span>
                    {textContent && (
                      <button
                        type="button"
                        onClick={handleCopyText}
                        className="flex items-center gap-1 text-xs text-brand-400 hover:underline"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{isCopied ? 'Copiado!' : 'Copiar Texto'}</span>
                      </button>
                    )}
                  </div>
                  <pre className="p-4 font-mono text-xs overflow-auto flex-1 whitespace-pre-wrap leading-relaxed text-emerald-400">
                    {textContent ?? 'Carregando conteúdo de texto...'}
                  </pre>
                </div>
              )}

              {/* AUDIO PREVIEW */}
              {category === 'audio' && (
                <div className="flex flex-col items-center justify-center p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl max-w-lg w-full shadow-lg">
                  <div className="p-4 rounded-full bg-brand-500/10 text-brand-500 mb-4">
                    <File className="h-10 w-10 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-sm text-[hsl(var(--foreground))] text-center mb-4">
                    {file.name}
                  </h4>
                  <audio controls src={signedUrl} className="w-full">
                    Seu navegador não suporta reprodução de áudio.
                  </audio>
                </div>
              )}

              {/* VIDEO PREVIEW */}
              {category === 'video' && (
                <video controls src={signedUrl} className="max-w-full max-h-full rounded-xl shadow-lg border border-[hsl(var(--border))]">
                  Seu navegador não suporta reprodução de vídeo.
                </video>
              )}

              {/* DOCUMENTS / SPREADSHEETS / ARCHIVES / OTHER PREVIEW */}
              {['doc', 'spreadsheet', 'archive', 'other'].includes(category) && (
                <div className="flex flex-col items-center justify-center p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl max-w-md w-full shadow-lg text-center space-y-4">
                  <div className="p-5 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                    {renderFileIcon(category)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[hsl(var(--foreground))] truncate max-w-xs mx-auto">
                      {file.name}
                    </h4>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 font-mono">
                      Formato {fileExt} • {formatBytes(file.size)}
                    </p>
                  </div>

                  <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed px-2">
                    Este tipo de arquivo não possui pré-visualização direta no navegador. Clique no botão abaixo para baixar o arquivo completo para o seu dispositivo.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5 w-full justify-center">
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span>Baixar Arquivo ({fileExt})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
