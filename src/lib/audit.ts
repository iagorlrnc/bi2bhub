import { supabase } from '@/lib/supabase'

export interface AuditLogParams {
  userId?: string | null
  companyId?: string | null
  action: string
  entityType: string
  entityId?: string | null
  metadata?: Record<string, any>
}

/**
 * Converte uma string de User-Agent do navegador em um modelo legível e amigável.
 * Exemplo: "Google Chrome 126 em Windows 10/11 (Desktop)"
 */
export function parseUserAgent(ua?: string): {
  browser: string
  os: string
  device: string
  formatted: string
} {
  if (!ua) {
    return {
      browser: 'Navegador Desconhecido',
      os: 'Sistema Desconhecido',
      device: 'Desconhecido',
      formatted: 'Dispositivo Desconhecido'
    }
  }

  // Detectar Sistema Operacional
  let os = 'Outro SO'
  if (/windows nt 10/i.test(ua)) os = 'Windows 10/11'
  else if (/windows nt 6.3/i.test(ua)) os = 'Windows 8.1'
  else if (/windows nt 6.1/i.test(ua)) os = 'Windows 7'
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS'
  else if (/iphone/i.test(ua)) os = 'iOS (iPhone)'
  else if (/ipad/i.test(ua)) os = 'iPadOS (iPad)'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/linux/i.test(ua)) os = 'Linux'

  // Detectar Navegador e Versão
  let browser = 'Navegador Web'
  if (ua.includes('Edg/') || ua.includes('Edge/')) {
    const version = ua.match(/Edg\/([\d.]+)/i)?.[1]?.split('.')[0] || ''
    browser = `Microsoft Edge ${version}`.trim()
  } else if (ua.includes('OPR/') || ua.includes('Opera/')) {
    const version = ua.match(/OPR\/([\d.]+)/i)?.[1]?.split('.')[0] || ''
    browser = `Opera ${version}`.trim()
  } else if (/firefox|fxios/i.test(ua)) {
    const version = ua.match(/(firefox|fxios)\/([\d.]+)/i)?.[2]?.split('.')[0] || ''
    browser = `Mozilla Firefox ${version}`.trim()
  } else if (/chrome|crios/i.test(ua)) {
    const version = ua.match(/(chrome|crios)\/([\d.]+)/i)?.[2]?.split('.')[0] || ''
    browser = `Google Chrome ${version}`.trim()
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    const version = ua.match(/version\/([\d.]+)/i)?.[1]?.split('.')[0] || ''
    browser = `Safari ${version}`.trim()
  }

  // Detectar Tipo de Dispositivo
  let device = 'Desktop'
  if (/mobile|iphone|android/i.test(ua) && !/ipad|tablet/i.test(ua)) {
    device = 'Mobile'
  } else if (/ipad|tablet/i.test(ua)) {
    device = 'Tablet'
  }

  const formatted = `${browser} em ${os} (${device})`

  return { browser, os, device, formatted }
}

/**
 * Registra uma atividade de auditoria de segurança no Supabase (tabela `atividades`).
 * Não falha ou interrompe o fluxo principal do app em caso de erro na gravação.
 */
export async function logAuditActivity({
  userId,
  companyId,
  action,
  entityType,
  entityId,
  metadata = {}
}: AuditLogParams): Promise<boolean> {
  try {
    // Tentar obter o ID do usuário autenticado se não for passado explicitamente
    let finalUserId = userId
    if (!finalUserId) {
      const { data: sessionData } = await supabase.auth.getSession()
      finalUserId = sessionData?.session?.user?.id || null
    }

    const rawUserAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
    const parsedUa = parseUserAgent(rawUserAgent)

    const payload = {
      user_id: finalUserId,
      company_id: companyId || null,
      action: action.toUpperCase(),
      entity_type: entityType,
      entity_id: entityId || null,
      metadata: {
        ...metadata,
        user_agent: rawUserAgent,
        browser_info: parsedUa.formatted,
        browser_name: parsedUa.browser,
        os_name: parsedUa.os,
        device_type: parsedUa.device,
        ip_address: metadata?.ip_address || '127.0.0.1',
        timestamp: new Date().toISOString()
      }
    }

    const { error } = await supabase
      .from('atividades')
      .insert(payload as any)

    if (error) {
      console.warn('Erro ao inserir log de auditoria no Supabase:', error.message)
      return false
    }

    return true
  } catch (err) {
    if (import.meta.env.DEV) console.error('Falha ao registrar log de auditoria:', err)
    return false
  }
}

/**
 * Registra ou atualiza a ÚLTIMA visualização de um documento por um usuário.
 * Remove automaticamente entradas antigas de visualização do mesmo usuário para este arquivo.
 */
export async function logOrUpdateDocumentView(
  userId: string,
  companyId: string,
  fileId: string,
  fileName: string,
  filePath: string
): Promise<boolean> {
  try {
    if (!userId || !fileId) return false

    // 1. Apagar registros anteriores de visualização deste mesmo usuário neste documento
    await supabase
      .from('atividades')
      .delete()
      .eq('user_id', userId)
      .eq('action', 'VISUALIZAR_DOCUMENTO_DRIVE')
      .eq('entity_id', fileId)

    // 2. Registrar novo log com horário mais recente
    return await logAuditActivity({
      userId,
      companyId,
      action: 'VISUALIZAR_DOCUMENTO_DRIVE',
      entityType: 'documentos',
      entityId: fileId,
      metadata: {
        file_name: fileName,
        file_path: filePath,
        viewed_at: new Date().toISOString()
      }
    })
  } catch (err) {
    if (import.meta.env.DEV) console.error('Erro ao atualizar visualização do documento:', err)
    return false
  }
}
