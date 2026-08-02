// ===== App Constants =====
export const APP_NAME = 'Bi2B Consultoria'
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const ALLOWED_FILE_TYPES = [
  '.pdf',
  '.docx',
  '.xlsx',
  '.xls',
  '.csv',
  '.zip',
  '.rar',
  '.7z',
  '.xml',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp'
]

// Mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const PASSWORD_REQUIREMENTS_MESSAGE = 'A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@$!%*?&).'

// Re-export notifications constants & helpers
export * from './notifications'
