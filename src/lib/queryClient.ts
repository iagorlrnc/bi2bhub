import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Não tentar novamente em erros 4xx
        if (error instanceof Error && 'status' in error) {
          const status = (error as Error & { status: number }).status
          if (status >= 400 && status < 500) return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: false,
    },
  },
})
