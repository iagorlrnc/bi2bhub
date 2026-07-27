// ===== Utilitários de Identificação e Roteamento por Subdomínio =====

export type SubdomainType = 'app' | 'administrador' | 'main'

/**
 * Identifica o subdomínio atual com base no hostname da janela.
 * Ex: 
 * - app.localhost:5173 / app.bi2b.com.br -> 'app'
 * - administrador.localhost:5173 / administrador.bi2b.com.br -> 'administrador'
 * - localhost:5173 / bi2b.com.br -> 'main'
 */
export function getSubdomain(): SubdomainType {
  const hostname = window.location.hostname.toLowerCase()
  if (hostname.startsWith('app.')) {
    return 'app'
  }
  if (hostname.startsWith('administrador.')) {
    return 'administrador'
  }
  return 'main'
}

/**
 * Retorna a URL base de um subdomínio específico.
 */
export function getSubdomainBaseUrl(targetSubdomain: 'app' | 'administrador'): string {
  const { protocol, hostname, port } = window.location
  const portSuffix = port ? `:${port}` : ''

  // Se já estivermos no subdomínio desejado
  const currentSubdomain = getSubdomain()
  if (currentSubdomain === targetSubdomain) {
    return `${protocol}//${window.location.host}`
  }

  // Tratamento para ambiente local (localhost / 127.0.0.1)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${targetSubdomain}.localhost${portSuffix}`
  }

  // Tratamento para domínio de produção (ex: bi2b.com.br)
  const parts = hostname.split('.')
  if (parts.length > 2 && (parts[0] === 'administrador' || parts[0] === 'app' || parts[0] === 'www')) {
    parts.shift()
  }
  const baseDomain = parts.join('.')
  return `${protocol}//${targetSubdomain}.${baseDomain}${portSuffix}`
}

/**
 * Retorna a URL completa para a área de cliente (subdomínio app.*)
 */
export function getClientSubdomainUrl(path: string = '/'): string {
  const baseUrl = getSubdomainBaseUrl('app')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

/**
 * Retorna a URL completa para a área de administração (subdomínio administrador.*)
 */
export function getAdminSubdomainUrl(path: string = '/'): string {
  const baseUrl = getSubdomainBaseUrl('administrador')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}
