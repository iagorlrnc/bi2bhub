// ===== Utilitários de Identificação e Roteamento por Subdomínio =====

export type SubdomainType = 'app' | 'administrador' | 'main'

/**
 * Identifica o subdomínio atual com base no hostname, query params ou caminho da janela.
 */
export function getSubdomain(): SubdomainType {
  const hostname = window.location.hostname.toLowerCase()
  const pathname = window.location.pathname.toLowerCase()

  // 1. Verificação por prefixo de hostname real (ex: app.bi2b.com.br / administrador.bi2b.com.br)
  if (hostname.startsWith('app.')) {
    return 'app'
  }
  if (hostname.startsWith('administrador.')) {
    return 'administrador'
  }

  // 2. Verificação por parâmetro de URL (ex: bi2bhub.vercel.app?subdomain=app)
  const searchParams = new URLSearchParams(window.location.search)
  const querySub = searchParams.get('subdomain')
  if (querySub === 'app' || querySub === 'administrador') {
    return querySub
  }

  // 3. Verificação por prefixo de rota (ex: bi2bhub.vercel.app/app ou bi2bhub.vercel.app/administrador)
  if (pathname.startsWith('/app')) {
    return 'app'
  }
  if (pathname.startsWith('/administrador') || pathname.startsWith('/admin')) {
    return 'administrador'
  }

  return 'main'
}

/**
 * Retorna a URL completa formatada para o subdomínio e caminho desejados.
 */
export function buildSubdomainUrl(targetSubdomain: 'app' | 'administrador', path: string = '/'): string {
  const { protocol, hostname, port } = window.location
  const portSuffix = port ? `:${port}` : ''
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  // Se já estivermos no subdomínio correto por Hostname
  if (
    (targetSubdomain === 'app' && hostname.startsWith('app.')) ||
    (targetSubdomain === 'administrador' && hostname.startsWith('administrador.'))
  ) {
    return `${protocol}//${window.location.host}${cleanPath}`
  }

  // Tratamento para ambiente local (localhost / 127.0.0.1)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${targetSubdomain}.localhost${portSuffix}${cleanPath}`
  }

  // Se for o domínio padrão da Vercel (.vercel.app sem wildcard habilitado), utilizar parâmetro de URL
  if (hostname.endsWith('.vercel.app')) {
    const hasQuery = cleanPath.includes('?')
    const connector = hasQuery ? '&' : '?'
    return `${protocol}//${hostname}${portSuffix}${cleanPath}${connector}subdomain=${targetSubdomain}`
  }

  // Tratamento para domínio de produção personalizado com suporte a wildcard (ex: bi2b.com.br)
  const parts = hostname.split('.')
  if (parts.length > 2 && (parts[0] === 'administrador' || parts[0] === 'app' || parts[0] === 'www')) {
    parts.shift()
  }
  const baseDomain = parts.join('.')
  return `${protocol}//${targetSubdomain}.${baseDomain}${portSuffix}${cleanPath}`
}

/**
 * Retorna a URL base de um subdomínio específico.
 */
export function getSubdomainBaseUrl(targetSubdomain: 'app' | 'administrador'): string {
  return buildSubdomainUrl(targetSubdomain, '/')
}

/**
 * Retorna a URL completa para a área de cliente (subdomínio app.*)
 */
export function getClientSubdomainUrl(path: string = '/'): string {
  return buildSubdomainUrl('app', path)
}

/**
 * Retorna a URL completa para a área de administração (subdomínio administrador.*)
 */
export function getAdminSubdomainUrl(path: string = '/'): string {
  return buildSubdomainUrl('administrador', path)
}

/**
 * Retorna a URL completa para a landing page (domínio principal sem subdomínio app ou administrador)
 */
export function getMainDomainUrl(path: string = '/'): string {
  const { protocol, hostname, port } = window.location
  const portSuffix = port ? `:${port}` : ''
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  // 1. Tratamento para localhost com subdomínio (ex: app.localhost / administrador.localhost)
  if (hostname.endsWith('.localhost')) {
    return `${protocol}//localhost${portSuffix}${cleanPath}`
  }

  // 2. Se estiver no Vercel com parâmetro de subdomínio
  if (hostname.endsWith('.vercel.app')) {
    return `${protocol}//${hostname}${portSuffix}${cleanPath}`
  }

  // 3. Domínio de produção personalizado (ex: app.bi2b.com.br -> bi2b.com.br)
  const parts = hostname.split('.')
  if (parts.length > 2 && (parts[0] === 'administrador' || parts[0] === 'app' || parts[0] === 'www')) {
    parts.shift()
  }
  const baseDomain = parts.join('.')
  return `${protocol}//${baseDomain}${portSuffix}${cleanPath}`
}
