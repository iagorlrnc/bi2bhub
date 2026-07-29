import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Tables, UserType } from '@/types/database.types'
import { logAuditActivity } from '@/lib/audit'

// ===== Tipos =====
interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: any | null
  companyUser: any | null
  company: Tables<'empresas'> | null
  isLoading: boolean
  isAuthenticated: boolean
  userType: UserType | null
  isAdmin: boolean
  isStaff: boolean
  isClientMaster: boolean
  isClientUser: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ===== Provedor =====
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [companyUser, setCompanyUser] = useState<any | null>(null)
  const [company, setCompany] = useState<Tables<'empresas'> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const lastFetchedUserId = useRef<string | null>(null)
  const isFetchingRef = useRef<boolean>(false)

  const fetchProfile = useCallback(async (userId: string, force = false) => {
    if (!force && lastFetchedUserId.current === userId && isFetchingRef.current) {
      return
    }

    lastFetchedUserId.current = userId
    isFetchingRef.current = true
    
    // Apenas ativa o indicador global na primeira busca (quando não há perfil na memória)
    if (!profile) {
      setIsLoading(true)
    }

    try {
      const { data: profileData } = await supabase
        .from('usuarios')
        .select('id, email, full_name, avatar_url, phone, user_type, is_active')
        .eq('id', userId)
        .single() as any

      setProfile(profileData)

      // Se for usuário cliente, buscar associação com a empresa
      if (profileData && (profileData.user_type === 'client_master' || profileData.user_type === 'client_user')) {
        const { data: companyUserData } = await supabase
          .from('usuarios_empresa')
          .select('id, company_id, user_id, role, permissions, is_active')
          .eq('user_id', userId)
          .eq('is_active', true)
          .single() as any

        setCompanyUser(companyUserData)

        if (companyUserData) {
          const { data: companyData } = await supabase
            .from('empresas')
            .select('id, name, trade_name, cnpj, email, plan, max_users, is_active, codigo_exclusivo')
            .eq('id', companyUserData.company_id)
            .single() as any

          setCompany(companyData)
        } else {
          setCompany(null)
        }
      } else {
        setCompanyUser(null)
        setCompany(null)
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching profile:', error)
      }
    } finally {
      isFetchingRef.current = false
      setIsLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id, true)
    }
  }, [user?.id, fetchProfile])

  // Perfis MOCK para contas de teste
  const setMockSession = (email: string, isRestoration = false) => {
    const isMockAdmin = email.toLowerCase() === 'admin@bi2b.com.br'
    const mockUser = {
      id: isMockAdmin ? '90000000-0000-0000-0000-000000000001' : '90000000-0000-0000-0000-000000000101',
      email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString()
    } as User

    const mockProfile = isMockAdmin ? {
      id: '90000000-0000-0000-0000-000000000001',
      email: 'admin@bi2b.com.br',
      full_name: 'Administrador Bi2B',
      user_type: 'admin',
      is_active: true
    } : {
      id: '90000000-0000-0000-0000-000000000101',
      email: 'cliente@bi2b.com.br',
      full_name: 'Cliente Bi2B (Demonstração)',
      user_type: 'client_master',
      is_active: true
    }

    const mockCompanyUser = !isMockAdmin ? {
      id: '90000000-0000-0000-0000-000000000101',
      company_id: '91111111-1111-1111-1111-111111111111',
      user_id: '90000000-0000-0000-0000-000000000101',
      role: 'client_master',
      permissions: ['strategic', 'monitoring', 'drive', 'tickets', 'team', 'settings'],
      is_active: true
    } : null

    const mockCompany = !isMockAdmin ? {
      id: '91111111-1111-1111-1111-111111111111',
      name: 'Empresa Teste Bi2B S.A.',
      trade_name: 'Cliente Bi2B',
      cnpj: '12.345.678/0001-90',
      email: 'cliente@bi2b.com.br',
      plan: 'enterprise' as const,
      max_users: 50,
      is_active: true,
      codigo_exclusivo: 'BI2B-TESTE'
    } : null

    const mockSessionObj = {
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh',
      user: mockUser
    } as Session

    localStorage.setItem('bi2b_mock_session', JSON.stringify({ email, mockProfile, mockCompanyUser, mockCompany }))
    setSession(mockSessionObj)
    setUser(mockUser)
    setProfile(mockProfile)
    setCompanyUser(mockCompanyUser)
    setCompany(mockCompany as any)
    setIsLoading(false)

    if (!isRestoration) {
      logAuditActivity({
        userId: mockUser.id,
        action: 'LOGIN_SUCESSO',
        entityType: 'auth',
        metadata: { email, user_type: isMockAdmin ? 'admin' : 'client_master' }
      })
    }
  }

  useEffect(() => {
    let isMounted = true

    // Checar mock session no carregamento inicial
    const storedMock = localStorage.getItem('bi2b_mock_session')
    if (storedMock) {
      try {
        const parsed = JSON.parse(storedMock)
        setMockSession(parsed.email, true)
        return
      } catch (e) {
        localStorage.removeItem('bi2b_mock_session')
      }
    }

    // Obter sessão inicial
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id)
      } else {
        setIsLoading(false)
      }
    })

    // Ouvir alterações de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return

        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('bi2b_mock_session')
          setSession(null)
          setUser(null)
          setProfile(null)
          setCompanyUser(null)
          setCompany(null)
          setIsLoading(false)
          lastFetchedUserId.current = null
          return
        }

        if (currentSession?.user) {
          setSession(currentSession)
          setUser(currentSession.user)
          const isNewUser = lastFetchedUserId.current !== currentSession.user.id
          await fetchProfile(currentSession.user.id, isNewUser)
        } else if (!localStorage.getItem('bi2b_mock_session')) {
          setSession(null)
          setUser(null)
          setProfile(null)
          setCompanyUser(null)
          setCompany(null)
          setIsLoading(false)
          lastFetchedUserId.current = null
        }
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase()

    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
    
    if (error) {
      // Fallback para contas de teste reservadas caso o Supabase Auth ainda não possua o usuário criado
      if (
        (cleanEmail === 'admin@bi2b.com.br' || cleanEmail === 'cliente@bi2b.com.br' || cleanEmail === 'colaborador@bi2b.com.br') &&
        password === '123456'
      ) {
        setMockSession(cleanEmail)
        return
      }
      throw error
    }

    if (data?.user) {
      logAuditActivity({
        userId: data.user.id,
        action: 'LOGIN_SUCESSO',
        entityType: 'auth',
        metadata: { email: cleanEmail, method: 'password' }
      })

      const { data: profileData, error: profileError } = await supabase
        .from('usuarios')
        .select('is_active')
        .eq('id', data.user.id)
        .single() as any

      if (profileError) {
        await supabase.auth.signOut()
        throw profileError
      }

      if (profileData && !profileData.is_active) {
        // Verificar se é uma solicitação de acesso pendente na empresa
        const { data: pendingCompanyUser } = await supabase
          .from('usuarios_empresa')
          .select('id')
          .eq('user_id', data.user.id)
          .eq('is_active', false)
          .maybeSingle() as any

        await supabase.auth.signOut()

        if (pendingCompanyUser) {
          throw new Error('Sua solicitação de acesso está aguardando aprovação pelo responsável ou administrador da empresa.')
        }

        throw new Error('Sua conta está inativa ou bloqueada. Contate o administrador.')
      }
    }
  }

  const signOut = async () => {
    if (user?.id) {
      logAuditActivity({
        userId: user.id,
        action: 'LOGOUT',
        entityType: 'auth',
        metadata: { email: user.email }
      })
    }

    localStorage.removeItem('bi2b_mock_session')
    try {
      await supabase.auth.signOut({ scope: 'global' })
    } catch (e) {
      // Ignore if session was mock
    }
    setSession(null)
    setUser(null)
    setProfile(null)
    setCompanyUser(null)
    setCompany(null)
  }

  const userType = profile?.user_type ?? null

  const value: AuthContextValue = {
    session,
    user,
    profile,
    companyUser,
    company,
    isLoading,
    isAuthenticated: !!session,
    userType,
    isAdmin: userType === 'admin',
    isStaff: userType === 'staff',
    isClientMaster: userType === 'client_master',
    isClientUser: userType === 'client_user',
    signIn,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

const defaultAuthContext: AuthContextValue = {
  session: null,
  user: null,
  profile: null,
  companyUser: null,
  company: null,
  isLoading: true,
  isAuthenticated: false,
  userType: null,
  isAdmin: false,
  isStaff: false,
  isClientMaster: false,
  isClientUser: false,
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
}

// ===== Hook customizado =====
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    return defaultAuthContext
  }
  return context
}
