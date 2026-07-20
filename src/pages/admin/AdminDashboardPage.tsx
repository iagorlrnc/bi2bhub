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

  const fetchAdminData = async () => {
    setIsLoading(true)
    try {
      // 1. Total de Clientes (Companies)
      const { count: cCount } = await supabase
        .from('empresas')
        .select('id', { count: 'exact', head: true })

      // 2. Total de Usuários
      const { count: uCount } = await supabase
        .from('usuarios')
        .select('id', { count: 'exact', head: true })

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
        companiesCount: cCount || 0,
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

      // 6. Crescimento da carteira (todas as empresas para agrupar)
      const { data: companiesList } = await supabase
        .from('empresas')
        .select('created_at')
      
      if (companiesList) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        const sorted = [...companiesList].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        
        const countsMap: Record<string, { month: string, count: number }> = {}
        let runningTotal = 0
        
        sorted.forEach(comp => {
          const date = new Date(comp.created_at)
          const year = date.getFullYear()
          const monthNum = date.getMonth() + 1
          const period = `${year}-${String(monthNum).padStart(2, '0')}`
          
          if (!countsMap[period]) {
            countsMap[period] = {
              month: months[monthNum - 1] || String(monthNum),
              count: 0
            }
          }
          countsMap[period].count += 1
        })
        
        const chartList = Object.keys(countsMap).sort().map(period => {
          const item = countsMap[period]
          runningTotal += item.count
          return {
            month: item.month,
            'Novas Empresas': item.count,
            'Total Clientes': runningTotal
          }
        })
        setGrowthData(chartList)
      }

    } catch (err) {
      console.error('Erro ao buscar dados administrativos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const adminStats = [
    { label: 'Total de Clientes', value: String(stats.companiesCount), icon: Building2, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' },
    { label: 'Usuários Ativos', value: String(stats.usersCount), icon: Users, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' },
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
                <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Crescimento da Carteira de Clientes</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Total de empresas ativas vs novos contratos</p>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="Total Clientes" stroke="#6366f1" strokeWidth={3} name="Total Clientes" />
                  <Line type="monotone" dataKey="Novas Empresas" stroke="#10b981" strokeWidth={2} name="Novas Empresas" />
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
