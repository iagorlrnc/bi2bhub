import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Award, CheckCircle2 } from 'lucide-react'

interface TeamSectionProps {
  isDark?: boolean
}

const teamMembers = [
  {
    name: 'Carlos Eduardo Silva',
    role: 'Sócio-Fundador & Contador Responsável',
    crc: 'CRC-SP 123.456/O-8',
    specialties: ['Planejamento Tributário', 'Lucro Real', 'Reestruturação'],
    bio: 'Mais de 15 anos de atuação em contabilidade de médio e grande porte. Especialista em estratégias fiscais e governança.',
    initials: 'CE',
    gradient: 'from-[#0d6084] to-cyan-500',
  },
  {
    name: 'Mariana Oliveira, Esp.',
    role: 'Head de Contabilidade Consultiva',
    crc: 'CRC-SP 234.567/O-1',
    specialties: ['Balancetes Gerenciais', 'KPIs Financeiros', 'Auditoria'],
    bio: 'Especialista em transformação de dados contábeis em inteligência de negócios e relatórios executivos para diretoria.',
    initials: 'MO',
    gradient: 'from-blue-600 to-cyan-400',
  },
  {
    name: 'Roberto Mendes',
    role: 'Líder de BPO Financeiro & Controladoria',
    crc: 'CRA-SP 45.890',
    specialties: ['Gestão de Caixa', 'Conciliação Bancária', 'Valuation'],
    bio: 'Expert em gestão de tesouraria, fluxo de caixa diário e estruturação de rotinas financeiras de alta eficiência.',
    initials: 'RM',
    gradient: 'from-[#0a4a62] to-[#0d6084]',
  },
  {
    name: 'Fernanda Costa',
    role: 'Gestora de Departamento Pessoal',
    crc: 'Especialista eSocial',
    specialties: ['Folha de Pagamento', 'eSocial', 'Leis Trabalhistas'],
    bio: 'Especialista no eSocial e legislação trabalhista, garantindo conformidade em contratações, tributos sobre folha e rescisões.',
    initials: 'FC',
    gradient: 'from-cyan-600 to-sky-500',
  },
]

export function TeamSection({ isDark }: TeamSectionProps) {
  return (
    <section id="equipe" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Accent */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[160px] pointer-events-none -z-10',
          isDark ? 'bg-[#0d6084]/15' : 'bg-cyan-500/10'
        )}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0d6084]/30 bg-[#0d6084]/10 text-[#0d6084] dark:text-cyan-300 font-semibold text-xs uppercase tracking-widest mb-4"
          >
            Especialistas Certificados
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Equipe de Contadores e{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-[#38bdf8] to-[#0d6084] bg-clip-text text-transparent">
              Consultores Bi2B
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              'mt-4 text-base sm:text-lg leading-relaxed',
              isDark ? 'text-slate-300' : 'text-slate-600'
            )}
          >
            Nossa equipe é formada por profissionais com registro no Conselho Regional de Contabilidade (CRC), dedicados a entregar máxima precisão e orientação proativa.
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'group relative rounded-3xl p-6 transition-all duration-300 border flex flex-col justify-between hover:-translate-y-1.5',
                isDark
                  ? 'bg-[#060e20]/90 border-white/10 hover:border-cyan-400/40 hover:shadow-[0_20px_40px_rgba(13,96,132,0.25)]'
                  : 'bg-white border-slate-200/90 shadow-lg shadow-slate-200/40 hover:border-[#0d6084]/40 hover:shadow-xl'
              )}
            >
              <div>
                {/* Avatar Icon / Initial */}
                <div className="relative mb-6 flex justify-center">
                  <div
                    className={cn(
                      'w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-xl bg-gradient-to-tr transition-transform group-hover:scale-105 duration-300 border-4',
                      member.gradient,
                      isDark ? 'border-[#060e20]' : 'border-white'
                    )}
                  >
                    {member.initials}
                  </div>
                  <div className="absolute bottom-0 right-1/2 translate-x-8 bg-cyan-500 text-slate-950 p-1.5 rounded-full shadow-md" title="Certificado CRC">
                    <Award className="w-4 h-4" />
                  </div>
                </div>

                {/* Name & Role */}
                <div className="text-center mb-4">
                  <h3
                    className={cn(
                      'text-lg font-bold transition-colors group-hover:text-[#0d6084] dark:group-hover:text-cyan-300',
                      isDark ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#0d6084] dark:text-cyan-400 mt-0.5">
                    {member.role}
                  </p>
                  <span
                    className={cn(
                      'inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border',
                      isDark
                        ? 'bg-white/5 border-white/10 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    )}
                  >
                    {member.crc}
                  </span>
                </div>

                {/* Bio */}
                <p
                  className={cn(
                    'text-xs leading-relaxed text-center mb-4',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  {member.bio}
                </p>

                {/* Specialties Badges */}
                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {member.specialties.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className={cn(
                        'text-[10px] font-medium px-2 py-0.5 rounded-md',
                        isDark ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40' : 'bg-cyan-50 text-[#0d6084] border border-cyan-200'
                      )}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status footer */}
              <div
                className={cn(
                  'pt-4 border-t flex items-center justify-between text-xs',
                  isDark ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-500'
                )}
              >
                <span className="flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Atendimento Ativo
                </span>
                <span className="text-[11px] font-semibold text-[#0d6084] dark:text-cyan-400">
                  Bi2B Consultoria
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
