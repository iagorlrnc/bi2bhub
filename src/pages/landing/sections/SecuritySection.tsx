import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  Database,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
} as const

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 16, stiffness: 100 } },
} as const

interface SecuritySectionProps {
  isDark: boolean
}

const securityFeatures = [
  {
    icon: Database,
    title: 'RLS Multi-Tenant',
    badge: 'PostgreSQL',
    description: 'Cada empresa opera em uma camada de dados totalmente isolada via Row Level Security (RLS) do Supabase. Nenhum dado de um tenant é acessível por outro — garantido em nível de banco de dados.',
    bullets: [
      'Isolamento lógico em nível de linha',
      'Políticas RLS aplicadas a todas as tabelas',
      'Auditoria de acesso por empresa',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'LGPD Compliance',
    badge: 'Lei 13.709/2018',
    description: 'O portal foi construído seguindo os princípios de privacidade by design. Consentimento LGPD, minimização de dados e direito ao esquecimento estão implementados nativamente.',
    bullets: [
      'Consentimento granular de cookies',
      'Portabilidade e exclusão de dados',
      'Registro de tratamento de dados',
    ],
  },
  {
    icon: Lock,
    title: 'Criptografia & SSL',
    badge: 'AES-256',
    description: 'Dados criptografados em trânsito (TLS 1.3) e em repouso (AES-256). Conexões ao banco via SSL obrigatório. Backups cifrados com chaves rotacionadas.',
    bullets: [
      'TLS 1.3 em todas as conexões',
      'Senhas com hash bcrypt + salt',
      'Tokens JWT com expiração curta',
    ],
  },
]

export function SecuritySection({ isDark }: SecuritySectionProps) {
  return (
    <motion.section
      id="seguranca"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative overflow-hidden",
        isDark ? "bg-[#0b1329]/40 border-cyan-950/40" : "bg-slate-100/50 border-slate-200/60"
      )}
    >
      {/* Subtle background glow */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none",
        isDark ? "bg-cyan-500/5" : "bg-[#0d6084]/3"
      )} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full shield-pulse",
              isDark ? "bg-cyan-950/60 text-cyan-400" : "bg-cyan-50 text-[#0d6084]"
            )}>
              <Shield className="h-5 w-5" />
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Segurança e Confiança</span>
          <h2 className={cn("font-heading text-3xl sm:text-4xl font-extrabold", isDark ? "text-white" : "text-slate-900")}>
            Seus dados protegidos por design
          </h2>
          <p className={cn("max-w-2xl mx-auto text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Contadores lidam com dados sensíveis de centenas de empresas. Nossa arquitetura garante isolamento total, conformidade legal e criptografia em cada camada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {securityFeatures.map((feat, idx) => (
            <motion.div
              key={idx}
              variants={scaleUp}
              className={cn(
                "card-premium rounded-2xl border p-7 text-left group relative overflow-hidden",
                isDark
                  ? "bg-[#08101d]/70 border-cyan-500/8 shadow-lg shadow-cyan-950/20"
                  : "bg-white border-slate-200/80 shadow-lg shadow-slate-200/30"
              )}
            >
              {/* Hover overlay */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl",
                isDark
                  ? "bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent"
                  : "bg-gradient-to-br from-[#0d6084]/3 via-transparent to-transparent"
              )} />

              <div className="relative z-10">
                {/* Icon + Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner transition-all duration-500 group-hover:scale-110",
                    isDark
                      ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400"
                      : "bg-cyan-50 border-cyan-200/60 text-[#0d6084]"
                  )}>
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                    isDark
                      ? "bg-cyan-950/40 border-cyan-500/15 text-cyan-400"
                      : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}>
                    {feat.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className={cn(
                  "font-heading text-lg font-bold mb-3 transition-colors duration-300 group-hover:text-cyan-500",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  {feat.title}
                </h3>

                {/* Description */}
                <p className={cn(
                  "text-sm leading-relaxed mb-5",
                  isDark ? "text-slate-300" : "text-slate-600"
                )}>
                  {feat.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-2.5">
                  {feat.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className={cn(
                        "flex items-center gap-2 text-xs font-semibold",
                        isDark ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
