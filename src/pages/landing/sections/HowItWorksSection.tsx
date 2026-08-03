import {
  UserPlus,
  KeyRound,
  FileCheck2,
  MailCheck,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HowItWorksSectionProps {
  isDark?: boolean
}

const userSteps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Cadastro & Perfil',
    subtitle: 'Criação de Conta',
    desc: 'Preencha suas informações corporativas básicas: nome, e-mail e defina a senha de Gestor de acesso seguro.',
    mockup: (isDark: boolean) => (
      <div className={cn('rounded-xl border p-3 font-mono text-[10px] space-y-2', isDark ? 'bg-[#050b14]/90 border-cyan-500/15' : 'bg-slate-50 border-slate-200')}>
        <div className="flex items-center justify-between border-b pb-1.5 border-slate-200 dark:border-white/10">
          <span className="font-bold text-cyan-400">Criar Conta</span>
          <span className="text-[8px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold">Etapa 1/4</span>
        </div>
        <div className="space-y-1.5 text-slate-400">
          <div className={cn('p-1.5 rounded border text-[9px]', isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200')}>
            <span className="text-slate-500">Empresa:</span> Bi2B Consultoria LTDA
          </div>
          <div className={cn('p-1.5 rounded border text-[9px]', isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200')}>
            <span className="text-slate-500">E-mail:</span> contato@bi2b.com.br
          </div>
        </div>
      </div>
    ),
  },
  {
    step: '02',
    icon: KeyRound,
    title: 'Vínculo do Token',
    subtitle: 'Código de 4 Dígitos',
    desc: 'Conecte-se à sua empresa informando o ID individual disponibilizado pela Bi2B Consultoria.',
    mockup: (isDark: boolean) => (
      <div className={cn('rounded-xl border p-3 font-mono text-[10px] space-y-2', isDark ? 'bg-[#050b14]/90 border-cyan-500/15' : 'bg-slate-50 border-slate-200')}>
        <div className="flex items-center justify-between border-b pb-1.5 border-slate-200 dark:border-white/10">
          <span className="font-bold text-emerald-400">Chave de Conexão</span>
          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">VINCULADO</span>
        </div>
        <div className="flex justify-center gap-2 py-1">
          {['8', '4', '1', '9'].map((digit, i) => (
            <div key={i} className={cn('w-7 h-8 rounded border flex items-center justify-center font-bold text-xs shadow-inner', isDark ? 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300' : 'bg-cyan-50 border-cyan-300 text-[#0d6084]')}>
              {digit}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    step: '03',
    icon: FileCheck2,
    title: 'Aceite & Termos LGPD',
    subtitle: 'Conformidade Legal',
    desc: 'Revise os Termos de Uso e Política de Privacidade garantindo 100% de conformidade com a LGPD.',
    mockup: (isDark: boolean) => (
      <div className={cn('rounded-xl border p-3 font-mono text-[10px] space-y-2', isDark ? 'bg-[#050b14]/90 border-cyan-500/15' : 'bg-slate-50 border-slate-200')}>
        <div className="flex items-center justify-between border-b pb-1.5 border-slate-200 dark:border-white/10">
          <span className="font-bold text-cyan-400">Proteção LGPD</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="space-y-1 text-[8px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Criptografia de ponta a ponta
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Conformidade total com a LGPD
          </div>
        </div>
      </div>
    ),
  },
  {
    step: '04',
    icon: MailCheck,
    title: 'Portal Bi2B',
    subtitle: 'Acesso Imediato',
    desc: 'Confirme seu e-mail e comece a consultar impostos, certidões e enviar arquivos sem complicação.',
    mockup: (isDark: boolean) => (
      <div className={cn('rounded-xl border p-3 font-mono text-[10px] space-y-2', isDark ? 'bg-[#050b14]/90 border-cyan-500/15' : 'bg-slate-50 border-slate-200')}>
        <div className="flex items-center justify-between border-b pb-1.5 border-slate-200 dark:border-white/10">
          <span className="font-bold text-cyan-400">Empresa</span>
          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">ONLINE</span>
        </div>
        <div className="flex items-center justify-between text-[9px] pt-1">
          <span className={cn(isDark ? 'text-slate-300' : 'text-slate-700')}>Portal Bi2B</span>
          <span className="text-emerald-400 font-bold">100% Sincronizado</span>
        </div>
      </div>
    ),
  },
]

export function HowItWorksSection({ isDark }: HowItWorksSectionProps) {
  const isDarkTheme = isDark ?? false

  return (
    <section id="como-funciona" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header do Acesso do Usuário */}
        <div className="text-center space-y-4 mb-16">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-md',
              isDarkTheme ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300' : 'border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]'
            )}
          >
            Acesso do Usuário
          </span>
          <h2 className={cn('font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance', isDarkTheme ? 'text-white' : 'text-slate-900')}>
            Como funciona o cadastro de empresas e usuários em 4 etapas
          </h2>
          <p className={cn('max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-balance', isDarkTheme ? 'text-slate-300' : 'text-slate-600')}>
            Cadastre-se ao portal de forma simples, ágil e com segurança de ponta a ponta.
          </p>
        </div>

        {/* Grid do Acesso do Usuário (4 Passos do Commit cefe982) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {userSteps.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={idx}
                className={cn(
                  'relative rounded-3xl border p-6 text-left shadow-xl transition-all duration-300 group flex flex-col justify-between backdrop-blur-2xl overflow-hidden',
                  isDarkTheme
                    ? 'bg-[#040914]/80 border-white/10 hover:border-cyan-400/40 shadow-[0_12px_35px_rgba(0,0,0,0.4)]'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-lg shadow-slate-200/30'
                )}
              >
                {/* Passo d'água grande */}
                <div
                  className={cn(
                    'absolute -top-3 right-4 text-[4.5rem] font-sans font-black leading-none select-none pointer-events-none',
                    isDarkTheme ? 'text-white/[0.04]' : 'text-slate-200/60'
                  )}
                >
                  {s.step}
                </div>

                <div>
                  <div className="relative z-10 flex items-center justify-between mb-5">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl border flex items-center justify-center shadow-md',
                        isDarkTheme
                          ? 'bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border-cyan-400/40 text-cyan-200 shadow-cyan-950/40'
                          : 'bg-cyan-50 border-cyan-200 text-[#0d6084]'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className={cn(
                        'text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full border',
                        isDarkTheme ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300' : 'bg-cyan-50 border-cyan-200 text-[#0d6084]'
                      )}
                    >
                      Passo {s.step}
                    </span>
                  </div>

                  <h3 className={cn('font-sans text-lg font-bold mb-1', isDarkTheme ? 'text-white' : 'text-slate-900')}>
                    {s.title}
                  </h3>

                  <p className={cn('text-xs font-semibold mb-3', isDarkTheme ? 'text-cyan-400' : 'text-[#0d6084]')}>
                    {s.subtitle}
                  </p>

                  <p className={cn('text-xs leading-relaxed mb-6', isDarkTheme ? 'text-slate-300' : 'text-slate-600')}>
                    {s.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-2">
                  {s.mockup(isDarkTheme)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
