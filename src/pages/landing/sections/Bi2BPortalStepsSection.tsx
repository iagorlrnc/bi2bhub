import { UserPlus, KeyRound, FileCheck2, LayoutDashboard } from 'lucide-react'

export function Bi2BPortalStepsSection() {
  const steps = [
    {
      num: '01',
      title: 'Criação da Conta',
      sub: 'ACESSO DO GESTOR',
      desc: 'Preencha suas informações corporativas básicas: nome, e-mail institucional e senha de acesso seguro.',
      icon: UserPlus,
      tag: 'Rápido & Simples',
    },
    {
      num: '02',
      title: 'Vínculo do Token',
      sub: 'CHAVE EXCLUSIVA DE 4 DÍGITOS',
      desc: 'Conecte seu login à sua empresa informando a chave de segurança única fornecida pela Bi2B Consultoria.',
      icon: KeyRound,
      tag: 'Segurança Máxima',
    },
    {
      num: '03',
      title: 'Conformidade LGPD',
      sub: 'TERMOS & PRIVACIDADE',
      desc: 'Confirme o aceite dos termos de proteção de dados, assegurando sigilo e conformidade fiscal integral.',
      icon: FileCheck2,
      tag: '100% Criptografado',
    },
    {
      num: '04',
      title: 'Acesso ao Painel',
      sub: 'ROTINA DESCOMPLICADA',
      desc: 'Acesse imediatamente a central de impostos, balancetes, drive de documentos e suporte por chamados.',
      icon: LayoutDashboard,
      tag: 'Tudo Integrado',
    },
  ]

  return (
    <section id="como-funciona" className="bi2b-section bi2b-on-light border-t border-[#0B4F6C]/10">
      <div className="bi2b-wrap">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bi2b-eyebrow bi2b-reveal in mx-auto mb-3.5">
            Como funciona o acesso
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0C1E28] mb-3.5 leading-tight font-heading bi2b-reveal in">
            4 passos para começar a usar o{' '}
            <span className="text-[#0B4F6C]">Portal Bi2B</span>.
          </h2>
          <p className="bi2b-lead text-base sm:text-lg text-[#59707B] max-w-[50ch] mx-auto bi2b-reveal in">
            Processo ágil de ativação para você e sua equipe acessarem guias e relatórios sem burocracia.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bi2b-reveal in">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="bg-white border border-[#0B4F6C]/15 rounded-[18px] p-7 flex flex-col justify-between relative shadow-sm hover:shadow-md hover:border-[#0B4F6C]/40 transition-all text-left group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xl font-bold text-[#0B4F6C] group-hover:text-[#FF0000] transition-colors">
                      {step.num}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#0B4F6C]/10 text-[#0B4F6C] group-hover:bg-[#0B4F6C] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="font-mono text-[0.66rem] text-[#59707B] uppercase tracking-wider block mb-1">
                    {step.sub}
                  </span>

                  <h3 className="font-heading font-bold text-lg text-[#0C1E28] mb-2.5">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#59707B] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#0B4F6C]/10">
                  <span className="font-mono text-[0.66rem] font-semibold text-[#0B4F6C] bg-[#0B4F6C]/5 px-2.5 py-1 rounded">
                    {step.tag}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
