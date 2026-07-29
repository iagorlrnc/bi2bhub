import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Uncaught error:', error, errorInfo)
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[hsl(var(--background))] p-4">
          <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-lg font-bold text-[hsl(var(--foreground))]">
              Algo deu errado na exibição
            </h2>
            <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
              {import.meta.env.DEV
                ? (this.state.error?.message || 'Ocorreu um erro inesperado ao carregar esta página.')
                : 'Ocorreu um erro inesperado ao carregar esta página. Tente recarregar.'}
            </p>
            <button
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Recarregar a página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
