import { motion } from 'framer-motion'
import {
  UserPlus,
  KeyRound,
  FileCheck2,
  MailCheck,
  CheckCircle2,
  Building2,
  QrCode,
  Users,
  Rocket,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
} as const

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 18, stiffness: 120 } },
} as const

interface HowItWorksSectionProps {
  isDark: boolean
}

const userSteps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Cadastro & Perfil',
    subtitle: 'Criação de Conta',
    desc: 'Preencha suas informações corporativas básicas: nome, e-mail e defina a senha Master de acesso seguro.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-cyan-400">Criar Conta</span>
          <span className="text-[8px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Etapa 1/4</span>
        </div>
        <div className="space-y-1.5 text-slate-400">
          <div className={cn("p-1.5 rounded border text-[9px]", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
            <span className="text-slate-500">Empresa:</span> Bi2B Consultoria LTDA
          </div>
          <div className={cn("p-1.5 rounded border text-[9px]", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
            <span className="text-slate-500">E-mail:</span> contato@bi2b.com.br
          </div>
        </div>
      </div>
    )
  },
  {
    step: '02',
    icon: KeyRound,
    title: 'Vínculo do Token',
    subtitle: 'Código de 4 Dígitos',
    desc: 'Conecte-se à sua empresa informando o ID exclusivo disponibilizado pela Bi2B Consultoria.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-emerald-400">Chave de Conexão</span>
          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">VINCULADO</span>
        </div>
        <div className="flex justify-center gap-2 py-1">
          {['8', '4', '1', '9'].map((digit, i) => (
            <div key={i} className={cn("w-7 h-8 rounded border flex items-center justify-center font-bold text-xs shadow-inner", isDark ? "bg-cyan-950/60 border-cyan-500/30 text-cyan-300" : "bg-cyan-50 border-cyan-300 text-[#0d6084]")}>
              {digit}
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    step: '03',
    icon: FileCheck2,
    title: 'Aceite & Termos LGPD',
    subtitle: 'Conformidade Legal',
    desc: 'Revise os Termos de Uso e Política de Privacidade garantindo 100% de conformidade com a LGPD.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
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
    )
  },
  {
    step: '04',
    icon: MailCheck,
    title: 'Painel Liberado',
    subtitle: 'Acesso Imediato',
    desc: 'Confirme seu e-mail e comece a consultar impostos, certidões e enviar arquivos sem complicação.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-cyan-400">Empresa</span>
          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold animate-pulse">ONLINE</span>
        </div>
        <div className="flex items-center justify-between text-[9px] pt-1">
          <span className={cn(isDark ? "text-slate-300" : "text-slate-700")}>Portal Bi2B</span>
          <span className="text-emerald-400 font-bold">100% Sincronizado</span>
        </div>
      </div>
    )
  },
]

const companySteps = [
  {
    step: '01',
    icon: Building2,
    title: 'Cadastro da Empresa',
    subtitle: 'Perfil Corporativo',
    desc: 'Cadastre os dados fiscais da empresa ou escritório contábil e configure os administradores iniciais.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-cyan-400">Conta Empresa</span>
          <span className="text-[8px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold">ATIVADA</span>
        </div>
        <div className="space-y-1.5 text-slate-400">
          <div className={cn("p-1.5 rounded border text-[9px]", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
            <span className="text-slate-500">Razão Social:</span> Bi2B Contabilidade LTDA
          </div>
          <div className={cn("p-1.5 rounded border text-[9px]", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
            <span className="text-slate-500">CNPJ:</span> 00.000.000/0001-00
          </div>
        </div>
      </div>
    )
  },
  {
    step: '02',
    icon: QrCode,
    title: 'Geração da Chave',
    subtitle: 'ID Exclusivo de Acesso',
    desc: 'O portal gera automaticamente o Token exclusivo para disponibilizar e vincular usuários e clientes.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-emerald-400">Token Gerado</span>
          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">DISPONÍVEL</span>
        </div>
        <div className="flex justify-center gap-2 py-1">
          {['B', 'I', '2', 'B'].map((char, i) => (
            <div key={i} className={cn("w-7 h-8 rounded border flex items-center justify-center font-bold text-xs shadow-inner", isDark ? "bg-cyan-950/60 border-cyan-500/30 text-cyan-300" : "bg-cyan-50 border-cyan-300 text-[#0d6084]")}>
              {char}
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    step: '03',
    icon: Users,
    title: 'Gestão de Permissões',
    subtitle: 'Controle Modular',
    desc: 'Defina os níveis de acesso e privilégios para cada colaborador ou cliente visualizar guias e documentos.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-cyan-400">Permissões</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="space-y-1 text-[8px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Módulos de Impostos & Guias
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Drive de Documentos & Chamados
          </div>
        </div>
      </div>
    )
  },
  {
    step: '04',
    icon: Rocket,
    title: 'Operação Centralizada',
    subtitle: 'Conexão Concluída',
    desc: 'Pronto! A empresa passa a disponibilizar guias, receber arquivos e responder chamados em um único lugar.',
    mockup: (isDark: boolean) => (
      <div className={cn("rounded-xl border p-3 font-mono text-[10px] space-y-2", isDark ? "bg-[#050b14]/90 border-cyan-500/15" : "bg-slate-50 border-slate-200")}>
        <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <span className="font-bold text-cyan-400">Portal Empresa</span>
          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold animate-pulse">OPERACIONAL</span>
        </div>
        <div className="flex items-center justify-between text-[9px] pt-1">
          <span className={cn(isDark ? "text-slate-300" : "text-slate-700")}>Integração Bi2B</span>
          <span className="text-emerald-400 font-bold">100% Conectada</span>
        </div>
      </div>
    )
  },
]

export function HowItWorksSection({ isDark }: HowItWorksSectionProps) {
  return (
    <motion.section
      id="como-funciona"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative overflow-hidden",
        isDark ? "bg-[#040914]/60 border-white/10" : "bg-slate-100/60 border-slate-200/80"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Bloco 1: Header do Acesso do Usuário */}
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-md",
            isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]"
          )}>
            Acesso do Usuário
          </span>
          <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance", isDark ? "text-white" : "text-slate-900")}>
            Como funciona o acesso do usuário em 4 etapas
          </h2>
          <p className={cn("max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-balance", isDark ? "text-slate-300/90" : "text-slate-600")}>
            Conecte-se ao portal de forma simples, ágil e com segurança de ponta a ponta.
          </p>
        </motion.div>

        {/* Grid do Acesso do Usuário */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mb-24">
          {userSteps.map((s, idx) => (
            <motion.div
              key={idx}
              variants={scaleUp}
              className={cn(
                "relative rounded-3xl border p-6 text-left shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between backdrop-blur-2xl overflow-hidden",
                isDark
                  ? "bg-[#040914]/80 border-white/10 hover:border-cyan-400/40 shadow-[0_12px_35px_rgba(0,0,0,0.4)]"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-lg shadow-slate-200/30"
              )}
            >
              <div className={cn(
                "absolute -top-3 right-4 text-[4.5rem] font-sans font-black leading-none select-none transition-all duration-500 group-hover:scale-110 pointer-events-none",
                isDark ? "text-white/[0.04] group-hover:text-cyan-400/10" : "text-slate-200/60 group-hover:text-[#0d6084]/15"
              )}>
                {s.step}
              </div>

              <div>
                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-md",
                    isDark
                      ? "bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border-cyan-400/40 text-cyan-200 shadow-cyan-950/40"
                      : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}>
                    <s.icon className="h-5 w-5" />
                  </div>

                  <span className={cn(
                    "text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full border",
                    isDark ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300" : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}>
                    Passo {s.step}
                  </span>
                </div>

                <h3 className={cn(
                  "font-sans text-lg font-bold transition-colors duration-300 group-hover:text-cyan-400 mb-1",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  {s.title}
                </h3>
                
                <p className={cn(
                  "text-xs font-semibold mb-3",
                  isDark ? "text-cyan-400" : "text-[#0d6084]"
                )}>
                  {s.subtitle}
                </p>

                <p className={cn(
                  "text-xs leading-relaxed mb-6 transition-colors duration-300",
                  isDark ? "text-slate-300/90" : "text-slate-600"
                )}>
                  {s.desc}
                </p>
              </div>

              <div className="relative z-10 pt-2">
                {s.mockup(isDark)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divisor Visual entre Seções */}
        <div className={cn("w-full h-px mb-20", isDark ? "bg-gradient-to-r from-transparent via-white/15 to-transparent" : "bg-gradient-to-r from-transparent via-slate-300 to-transparent")} />

        {/* Bloco 2: Header do Acesso da Empresa */}
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-md",
            isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]"
          )}>
            Acesso da Empresa
          </span>
          <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance", isDark ? "text-white" : "text-slate-900")}>
            Como funciona para a empresa disponibilizar acesso em 4 etapas
          </h2>
          <p className={cn("max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-balance", isDark ? "text-slate-300/90" : "text-slate-600")}>
            Cadastre sua estrutura corporativa, gere a chave de acesso e centralize sua operação.
          </p>
        </motion.div>

        {/* Grid do Acesso da Empresa */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {companySteps.map((s, idx) => (
            <motion.div
              key={idx}
              variants={scaleUp}
              className={cn(
                "relative rounded-3xl border p-6 text-left shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between backdrop-blur-2xl overflow-hidden",
                isDark
                  ? "bg-[#040914]/80 border-white/10 hover:border-cyan-400/40 shadow-[0_12px_35px_rgba(0,0,0,0.4)]"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-lg shadow-slate-200/30"
              )}
            >
              <div className={cn(
                "absolute -top-3 right-4 text-[4.5rem] font-sans font-black leading-none select-none transition-all duration-500 group-hover:scale-110 pointer-events-none",
                isDark ? "text-white/[0.04] group-hover:text-cyan-400/10" : "text-slate-200/60 group-hover:text-[#0d6084]/15"
              )}>
                {s.step}
              </div>

              <div>
                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-md",
                    isDark
                      ? "bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border-cyan-400/40 text-cyan-200 shadow-cyan-950/40"
                      : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}>
                    <s.icon className="h-5 w-5" />
                  </div>

                  <span className={cn(
                    "text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full border",
                    isDark ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300" : "bg-cyan-50 border-cyan-200 text-[#0d6084]"
                  )}>
                    Passo {s.step}
                  </span>
                </div>

                <h3 className={cn(
                  "font-sans text-lg font-bold transition-colors duration-300 group-hover:text-cyan-400 mb-1",
                  isDark ? "text-white" : "text-slate-900"
                )}>
                  {s.title}
                </h3>
                
                <p className={cn(
                  "text-xs font-semibold mb-3",
                  isDark ? "text-cyan-400" : "text-[#0d6084]"
                )}>
                  {s.subtitle}
                </p>

                <p className={cn(
                  "text-xs leading-relaxed mb-6 transition-colors duration-300",
                  isDark ? "text-slate-300/90" : "text-slate-600"
                )}>
                  {s.desc}
                </p>
              </div>

              <div className="relative z-10 pt-2">
                {s.mockup(isDark)}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.section>
  )
}

