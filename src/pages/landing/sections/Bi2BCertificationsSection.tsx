import { ShieldCheck, Lock, Cpu, Award } from 'lucide-react'

export function Bi2BCertificationsSection() {
  const certs = [
    {
      icon: ShieldCheck,
      title: '100% LGPD Compliant',
      desc: 'Isolamento estrito de bases de dados, controle de consentimento e termos de sigilo corporativo.',
      stat: 'Privacidade Total',
    },
    {
      icon: Lock,
      title: 'Criptografia Bancária AES-256',
      desc: 'Seus documentos e dados fiscais protegidos com os mesmos protocolos de segurança dos maiores bancos.',
      stat: 'SSL / TLS 1.3',
    },
    {
      icon: Cpu,
      title: 'Disponibilidade 99.9% SLA',
      desc: 'Infraestrutura distribuída em nuvem de alta performance com backups automáticos redundantes a cada 6h.',
      stat: 'Zero Downtime',
    },
    {
      icon: Award,
      title: 'Suporte Consultivo CRC',
      desc: 'Time técnico treinado em rotinas fiscais e contábeis reais para atendimento ágil e sem enrolação.',
      stat: '98% de Satisfação',
    },
  ]

  return (
    <section className="py-16 sm:py-20 bg-[#052635] border-y border-white/10 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((cert, index) => {
            const Icon = cert.icon
            return (
              <div
                key={index}
                className="p-5 rounded-md bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2 rounded-sm bg-cyan-500/10 text-cyan-300">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-300 border border-cyan-400/20 uppercase">
                      {cert.stat}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-heading mb-2">
                    {cert.title}
                  </h3>

                  <p className="text-xs text-[#AEC3CE] leading-relaxed">
                    {cert.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
