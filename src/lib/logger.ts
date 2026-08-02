/**
 * Utilitário de logging seguro para produção.
 * Em ambiente de desenvolvimento (DEV), exibe mensagens completas.
 * Em ambiente de produção (PROD), oculta logs detalhados e mensagens sensíveis de erro/schema.
 */
export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args)
    }
  },
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args)
    }
  },
  error: (message: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(message, error)
    }
  },
}
