import { useMemo } from 'react'
import { Ticket, AlertCircle, Clock, CheckCircle2, Archive, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TicketDashboardCardsProps {
  tickets: any[]
}

export function TicketDashboardCards({ tickets }: TicketDashboardCardsProps) {
  const stats = useMemo(() => {
    const total = tickets.length
    const abertos = tickets.filter(t => t.status === 'aberto').length
    const emAndamento = tickets.filter(t => t.status === 'em_andamento').length
    
    const resolvidos = tickets.filter(t => t.status === 'resolvido' || t.status === 'fechado' || !!t.resolved_at).length
    const encerrados = tickets.filter(t => t.status === 'fechado' || t.status === 'resolvido').length
    const altaPrioridade = tickets.filter(t => (t.priority === 'alta' || t.priority === 'urgente') && t.status !== 'fechado' && t.status !== 'resolvido').length

    return {
      total,
      abertos,
      emAndamento,
      resolvidos,
      encerrados,
      altaPrioridade
    }
  }, [tickets])

  const cards = [
    {
      label: 'Total de Chamados',
      value: stats.total,
      description: 'Todos os registros no sistema',
      icon: Ticket,
      borderColor: 'border-blue-500/20',
      bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
    },
    {
      label: 'Em Aberto',
      value: stats.abertos,
      description: 'Aguardando primeiro atendimento',
      icon: AlertCircle,
      borderColor: 'border-cyan-500/20',
      bgColor: 'bg-cyan-50/50 dark:bg-cyan-950/20',
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      badgeColor: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
    },
    {
      label: 'Em Atendimento',
      value: stats.emAndamento,
      description: 'Em análise pelos técnicos',
      icon: Clock,
      borderColor: 'border-amber-500/20',
      bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
    },
    {
      label: 'Resolvidos',
      value: stats.resolvidos,
      description: 'Total de chamados finalizados',
      icon: CheckCircle2,
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    },
    {
      label: 'Encerrados',
      value: stats.encerrados,
      description: 'Resolvidos ou fechados total',
      icon: Archive,
      borderColor: 'border-slate-500/20',
      bgColor: 'bg-slate-50/50 dark:bg-slate-900/20',
      iconBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
      badgeColor: 'bg-slate-500/10 text-slate-700 dark:text-slate-300'
    },
    {
      label: 'Prioridade Alta',
      value: stats.altaPrioridade,
      description: 'Alta/Urgente sem solução',
      icon: ShieldAlert,
      borderColor: 'border-rose-500/20',
      bgColor: 'bg-rose-50/50 dark:bg-rose-950/20',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
    }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={cn(
              'relative overflow-hidden rounded-xl border p-3 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
              card.borderColor,
              card.bgColor
            )}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-semibold text-[hsl(var(--muted-foreground))] truncate">
                {card.label}
              </span>
              <div className={cn('p-1.5 rounded-lg shrink-0', card.iconBg)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">
                {card.value}
              </span>
            </div>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 truncate">
              {card.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
