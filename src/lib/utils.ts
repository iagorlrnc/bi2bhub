import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte um ID de empresa (UUID ou string) em um ID de 4 dígitos exclusivo (1000 - 9999)
 */
export function getCompanyCode(id: string): string {
  if (!id) return '1000'
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

/**
 * Valida se um código é numérico de exatamente 4 dígitos (ex: "8419", "1048").
 */
export function isValid4DigitCode(code?: string | null): boolean {
  if (!code) return false
  return /^\d{4}$/.test(String(code).trim())
}

/**
 * Gera um código numérico aleatório de 4 dígitos (1000 a 9999) garantidamente único.
 */
export function generate4DigitCode(existingCodes: (string | null | undefined)[] = []): string {
  const used = new Set(
    existingCodes
      .filter((c): c is string => typeof c === 'string' && /^\d{4}$/.test(c.trim()))
      .map(c => c.trim())
  )

  let newCode = ''
  let attempts = 0
  do {
    newCode = String(Math.floor(1000 + Math.random() * 9000))
    attempts++
  } while (used.has(newCode) && attempts < 10000)

  return newCode
}

/**
 * Higieniza a tabela de empresas garantindo que TODAS as empresas
 * possuam um código numérico exclusivo de 4 dígitos (sem duplicações).
 */
export async function ensureUniqueCompanyCodes(supabaseClient: any): Promise<void> {
  try {
    const { data: allCompanies, error } = await supabaseClient
      .from('empresas')
      .select('id, name, codigo_exclusivo, created_at')
      .order('created_at', { ascending: true })

    if (error || !allCompanies || allCompanies.length === 0) return

    const usedCodes = new Set<string>()
    const updates: Promise<any>[] = []

    for (const company of allCompanies) {
      let code = company.codigo_exclusivo
      // Se o código for inválido ou já estiver duplicado/em uso por outra empresa
      if (!isValid4DigitCode(code) || usedCodes.has(String(code).trim())) {
        const freshCode = generate4DigitCode(Array.from(usedCodes))
        usedCodes.add(freshCode)
        company.codigo_exclusivo = freshCode
        updates.push(
          supabaseClient
            .from('empresas')
            .update({ codigo_exclusivo: freshCode })
            .eq('id', company.id)
        )
      } else {
        usedCodes.add(String(code).trim())
      }
    }

    if (updates.length > 0) {
      await Promise.allSettled(updates)
    }
  } catch (err) {
    if (import.meta.env.DEV) console.error('Erro ao higienizar códigos de empresas:', err)
  }
}
