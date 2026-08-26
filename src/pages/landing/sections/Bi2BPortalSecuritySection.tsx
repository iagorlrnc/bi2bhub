import { ShieldCheck, Lock, Server, Users } from 'lucide-react'

export function Bi2BPortalSecuritySection() {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Criptografia de Ponta a Ponta',
      desc: 'Comunicação protegida por protocolo SSL/TLS 256-bit e armazenamento criptografado em repouso.',
    },
    {
      icon: ShieldCheck,
      title: 'Conformidade Rigorosa com a LGPD',
      desc: 'Tratamento de dados estritamente alinhado à Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
    },
    {
      icon: Users,
      title: 'Perfis e Permissões Granulares',
      desc: 'Controle quais operadores ou departamentos podem visualizar balancetes, guias fiscais ou documentos de RH.',
    },
    {
      icon: Server,
      title: 'Backups Diários Automatizados',
      desc: 'Infraestrutura em nuvem de alta redundância com cópias de segurança diárias e rastreabilidade total.',
    },
  ]

  return (
    <section id="seguranca" className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <div className="bg-[#083A50] text-white rounded-[24px] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl bi2b-reveal in">
          {/* Background Radial Glow */}
          <div
            className="absolute -right-20 -top-20 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-2xl"
            style={{ background: 'radial-gradient(circle, #38bdf8, transparent 70%)' }}
          />

          <div className="relative z-10 max-w-3xl mb-12 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-[0.7rem] uppercase tracking-wider font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FF0000] shadow-[0_0_8px_1px_rgba(255,0,0,0.8)]" />
              <span>Privacidade &amp; Proteção de Dados</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-heading">
              Seus dados fiscais e contábeis protegidos com{' '}
              <span className="text-white border-b-4 border-[#FF0000] pb-0.5 inline-block">
                segurança de padrão bancário
              </span>
              .
            </h2>

            <p className="text-[#AEC3CE] text-base sm:text-lg leading-relaxed max-w-[56ch]">
              Entendemos a sensibilidade dos números da sua empresa. Por isso, o Portal Bi2B adota os mais rigorosos padrões de segurança da informação e sigilo profissional contábil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10 text-left">
            {securityFeatures.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-[#0B4F6C] text-white border border-white/20">
                      <Icon className="w-5 h-5 text-emerald-300" />
                    </div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#AEC3CE] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
