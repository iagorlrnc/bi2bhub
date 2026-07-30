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
  const profileRef = useRef<any | null>(null)
  const [companyUser, setCompanyUser] = useState<any | null>(null)
  const [company, setCompany] = useState<Tables<'empresas'> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const lastFetchedUserId = useRef<string | null>(null)
  const isFetchingRef = useRef<boolean>(false)

  useEffect(() => {
    profileRef.current = profile
  }, [profile])

  const fetchProfile = useCallback(async (userId: string, force = false) => {
    if (!force && lastFetchedUserId.current === userId && isFetchingRef.current) {
      return
    }

    lastFetchedUserId.current = userId
    isFetchingRef.current = true
    
    // Apenas ativa o indicador global na primeira busca (quando não há perfil na memória)
    if (!profileRef.current) {
      setIsLoading(true)
    }

    try {
      const { data: profileData } = await supabase
        .from('usuarios')
        .select('id, email, full_name, avatar_url, phone, user_type, is_active, codigo_empresa')
        .eq('id', userId)
        .single() as any

      // Garantir que todos os membros da BI2B Consultoria possuam user_type = 'admin'
      if (profileData) {
        const { data: bi2bOffice } = await supabase
          .from('empresas')
          .select('id, codigo_exclusivo')
          .ilike('name', '%BI2B%')
          .maybeSingle()

        if (bi2bOffice && (profileData.codigo_empresa === bi2bOffice.codigo_exclusivo || profileData.user_type !== 'admin')) {
          // Se for membro da equipe do escritório, forçar como admin
          const { data: empCheck } = await supabase
            .from('usuarios_empresa')
            .select('company_id')
            .eq('user_id', userId)
            .eq('company_id', bi2bOffice.id)
            .maybeSingle()

          if (empCheck || profileData.codigo_empresa === bi2bOffice.codigo_exclusivo || profileData.user_type === 'admin') {
            profileData.user_type = 'admin'
          }
        }
      }

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
      } else if (profileData && profileData.user_type === 'admin') {
        // Buscar vínculo da empresa escritório contábil do administrador no banco de dados
        const { data: adminCompUserData } = await supabase
          .from('usuarios_empresa')
          .select('id, company_id, user_id, role, permissions, is_active, company:empresas(id, name, trade_name, cnpj, email, plan, max_users, is_active, codigo_exclusivo)')
          .eq('user_id', userId)
          .maybeSingle() as any

        if (adminCompUserData?.company) {
          setCompanyUser(adminCompUserData)
          setCompany(adminCompUserData.company)
        } else {
          // Carregar empresa matriz 'BI2B Consultoria' ou escritório cadastrado no banco de dados
          const { data: bi2bOffice } = await supabase
            .from('empresas')
            .select('id, name, trade_name, cnpj, email, plan, max_users, is_active, codigo_exclusivo')
            .ilike('name', '%BI2B%')
            .maybeSingle() as any

          if (bi2bOffice) {
            setCompanyUser(null)
            setCompany(bi2bOffice)
          } else {
            const { data: firstComp } = await supabase
              .from('empresas')
              .select('id, name, trade_name, cnpj, email, plan, max_users, is_active, codigo_exclusivo')
              .eq('is_active', true)
              .order('created_at', { ascending: true })
              .limit(1)
              .maybeSingle() as any

            setCompanyUser(null)
            setCompany(firstComp || null)
          }
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



  useEffect(() => {
    let isMounted = true

    // Obter sessão inicial do Supabase Auth
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
        } else {
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

    try {
      await supabase.auth.signOut({ scope: 'global' })
    } catch (e) {
      if (import.meta.env.DEV) console.error('Erro no signOut:', e)
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
