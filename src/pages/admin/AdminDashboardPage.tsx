import { useState, useEffect } from 'react'
import { Building2, Users, MessageSquare, ScrollText, AlertTriangle, Loader2 } from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { supabase } from '@/lib/supabase'
import { isBi2bCompany } from '@/lib/utils'

export function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    companiesCount: 0,
    usersCount: 0,
    pendingTicketsCount: 0,
    documentsCount: 0
  })
  const [recentTickets, setRecentTickets] = useState<any[]>([])
  const [growthData, setGrowthData] = useState<any[]>([])

  const fetchAdminData = async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      // 1. Total de Clientes (Companies - excluindo BI2B)
      const { data: allComps } = await supabase
        .from('empresas')
        .select('id, name, trade_name, codigo_exclusivo, created_at')

      const clientCompanies = (allComps || []).filter((c) => !isBi2bCompany(c))
      const cCount = clientCompanies.length

      // 2. Total de Usuários (Apenas clientes - exclui admin e contadores/staff)
      const { count: uCount } = await supabase
        .from('usuarios')
        .select('id', { count: 'exact', head: true })
        .in('user_type', ['client_master', 'client_user'])

      // 3. Chamados Pendentes
      const { count: tCount } = await supabase
        .from('chamados')
        .select('id', { count: 'exact', head: true })
        .in('status', ['aberto', 'em_andamento'])

      // 4. Documentos Armazenados
      const { count: dCount } = await supabase
        .from('documentos')
        .select('id', { count: 'exact', head: true })

      setStats({
        companiesCount: cCount,
        usersCount: uCount || 0,
        pendingTicketsCount: tCount || 0,
        documentsCount: dCount || 0
      })

      // 5. Fila de Chamados
      const { data: ticketsData } = await supabase
        .from('chamados')
        .select('*, company:empresas(name)')
        .in('status', ['aberto', 'em_andamento'])
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentTickets(ticketsData || [])

      // 6. Crescimento de Empresas e Usuários (exclui contadores e admins do escritório)
      const [{ data: clientUsersList }] = await Promise.all([
        supabase.from('usuarios').select('created_at').in('user_type', ['client_master', 'client_user'])
      ])
      const companiesList = clientCompanies

      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
      const periodsSet = new Set<string>()

      const companyCountMap: Record<string, number> = {}
      ;(companiesList || []).forEach(comp => {
        const date = new Date(comp.created_at)
        const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        periodsSet.add(period)
        companyCountMap[period] = (companyCountMap[period] || 0) + 1
      })

      const userCountMap: Record<string, number> = {}
      ;(clientUsersList || []).forEach(usr => {
        const date = new Date(usr.created_at)
        const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        periodsSet.add(period)
        userCountMap[period] = (userCountMap[period] || 0) + 1
      })

      const sortedPeriods = Array.from(periodsSet).sort()

      let runningCompanies = 0
      let runningUsers = 0

      const chartList = sortedPeriods.map(period => {
        const [year, monthNumStr] = period.split('-')
        const monthNum = parseInt(monthNumStr, 10)
        const monthLabel = `${months[monthNum - 1]} ${year.slice(2)}`

        runningCompanies += (companyCountMap[period] || 0)
        runningUsers += (userCountMap[period] || 0)

        return {
          month: monthLabel,
          'Total de Empresas': runningCompanies,
          'Usuários Cadastrados': runningUsers
        }
      })

      setGrowthData(chartList)

    } catch (err) {
      if (import.meta.env.DEV) console.error('Erro ao buscar dados administrativos:', err)
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
    const handleRefresh = () => fetchAdminData(true)
    window.addEventListener('bi2b:refresh-data', handleRefresh)
    return () => window.removeEventListener('bi2b:refresh-data', handleRefresh)
  }, [])

  const adminStats = [
    { label: 'Total de Empresas', value: String(stats.companiesCount), icon: Building2, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' },
    { label: 'Usuários Cadastrados', value: String(stats.usersCount), icon: Users, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' },
    { label: 'Chamados Pendentes', value: String(stats.pendingTicketsCount), icon: MessageSquare, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' },
    { label: 'Documentos Armazenados', value: String(stats.documentsCount), icon: ScrollText, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' },
  ]

  return (
    <div className="space-y-6">


      {isLoading ? (
        <div className="flex h-96 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mr-2" />
          <span className="text-[hsl(var(--muted-foreground))] font-medium">Carregando painel de controle administrativo...</span>
        </div>
      ) : (
        <>
          {/* Grade de Estatísticas (Cards) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {adminStats.map(stat => (
              <div key={stat.label} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm hover-lift">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-heading text-3xl font-bold text-[hsl(var(--foreground))]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Grade de Gráficos */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Gráfico de linha de crescimento */}
            <div className="lg:col-span-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Crescimento de Empresas e Usuários Cadastrados</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Evolução de empresas clientes vs usuários cadastrados (exclui contadores e admins)</p>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="Total de Empresas" stroke="#6366f1" strokeWidth={3} name="Total de Empresas" />
                  <Line type="monotone" dataKey="Usuários Cadastrados" stroke="#10b981" strokeWidth={3} name="Usuários Cadastrados" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Lista da Barra Lateral de Chamados */}
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
                <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Fila de Chamados</h3>
                <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  Ação Requerida
                </span>
              </div>
              <div className="space-y-3">
                {recentTickets.length > 0 ? (
                  recentTickets.map((t, idx) => (
                    <div key={idx} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3 hover:bg-[hsl(var(--muted))]/55 cursor-pointer transition-all">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-brand-500">{t.company?.name || 'Empresa'}</span>
                        <span className="text-[hsl(var(--muted-foreground))]">
                          {new Date(t.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-[hsl(var(--foreground))]">{t.subject}</h4>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-[hsl(var(--muted-foreground))]">
                    Nenhum chamado aberto na fila.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
