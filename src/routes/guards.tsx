import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants/routes'
import type { ReactNode } from 'react'
import { ShieldAlert } from 'lucide-react'

// ===== Tela de Carregamento =====
function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[hsl(var(--background))]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Carregando...</p>
      </div>
    </div>
  )
}

// ===== Tela de Conta Inativa =====
function InactiveAccountScreen() {
  const { signOut } = useAuth()
  
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (e) {
      console.error(e)
    }
    window.location.href = ROUTES.LOGIN
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[hsl(var(--background))] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center shadow-xl shadow-black/5 animate-fade-in-up">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="font-heading text-xl font-bold text-[hsl(var(--foreground))]">
          Conta Inativa ou Bloqueada
        </h2>
        <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
          Sua conta foi desativada ou temporariamente bloqueada pelo administrador do sistema.
        </p>
        <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed border-t border-[hsl(var(--border))] pt-4">
          Por favor, entre em contato com a equipe de suporte ou com a administração da contabilidade para reativar seu acesso.
        </p>
        <button
          onClick={handleSignOut}
          className="mt-6 w-full rounded-lg bg-[hsl(var(--destructive))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--destructive-foreground))] shadow-md hover:opacity-90 transition-all animate-pulse"
        >
          Voltar para o Login
        </button>
      </div>
    </div>
  )
}

// ===== Guarda de Autenticação (AuthGuard): requer autenticação =====
interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, profile } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingScreen />

  if (!isAuthenticated) {
    const subdomain = window.location.hostname.toLowerCase().startsWith('administrador.') ? 'administrador' : 'app'
    const redirectPath = subdomain === 'administrador' ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  // Interceptar contas inativas
  if (profile && !profile.is_active) {
    return <InactiveAccountScreen />
  }

  return <>{children}</>
}

// ===== Guarda de Regra (RoleGuard): requer regras/funções específicas =====
interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { userType, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />

  if (!userType || !allowedRoles.includes(userType)) {
    if (fallback) return <>{fallback}</>
    const isHostAdmin = window.location.hostname.toLowerCase().startsWith('administrador.')
    return <Navigate to={isHostAdmin ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}

// ===== Guarda de Permissão (PermissionGuard): requer permissão do módulo específica =====
interface PermissionGuardProps {
  children: ReactNode
  module: string
  fallback?: ReactNode
}

export function PermissionGuard({ children, module, fallback }: PermissionGuardProps) {
  const { isAdmin, isStaff, isClientMaster, companyUser, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />

  // Administradores e equipe têm todas as permissões
  if (isAdmin || isStaff) return <>{children}</>

  // O módulo de Equipe é exclusivo para o Gestor (isClientMaster)
  if (module === 'team') {
    if (isClientMaster) return <>{children}</>
  } else {
    // Cliente master tem todas as permissões do módulo
    if (isClientMaster) return <>{children}</>

    // Usuário cliente precisa de permissão específica
    const permissions = companyUser?.permissions ?? []
    if (Array.isArray(permissions) && permissions.includes(module)) {
      return <>{children}</>
    }
  }

  if (fallback) return <>{fallback}</>

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <div className="rounded-xl bg-[hsl(var(--muted))] p-6 text-center">
        <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Acesso Restrito
        </h2>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          Você não tem permissão para acessar este módulo.
          Entre em contato com o administrador da sua empresa.
        </p>
      </div>
    </div>
  )
}

// ===== Guarda de Visitante (GuestGuard): apenas para usuários não autenticados =====
interface GuestGuardProps {
  children: ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading, isAdmin, isStaff, profile } = useAuth()

  if (isLoading) return <LoadingScreen />

  if (isAuthenticated && profile && profile.is_active) {
    if (isAdmin || isStaff) {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
    }
    return <Navigate to={ROUTES.TAXES} replace />
  }

  return <>{children}</>
}
