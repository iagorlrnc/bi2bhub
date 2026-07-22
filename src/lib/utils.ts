import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte um ID de empresa (UUID ou string) em um ID de 4 dígitos exclusivo (1000 - 9999)
 */
export function getCompanyCode(id: string): string {
  if (!id) return '0000'
  const cleanId = id.trim()
  if (/^\d{4}$/.test(cleanId)) return cleanId

  let hash = 0
  for (let i = 0; i < cleanId.length; i++) {
    hash = ((hash << 5) - hash) + cleanId.charCodeAt(i)
    hash |= 0
  }
  const code = (Math.abs(hash) % 9000) + 1000
  return String(code)
}
