import { useState } from 'react'
import { getClientSubdomainUrl } from '@/utils/subdomain'
import { ArrowUpRight, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react'

export function Bi2BFooterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-[#05222f] text-[#AEC3CE] pt-16 sm:pt-20 pb-28 md:pb-16 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 pb-14 border-b border-white/10">
          {/* Col 1 & 2: Brand & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="#topo"
              className="font-heading font-bold text-2xl text-white flex items-center gap-2 tracking-tight group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000] shadow-[0_0_12px_2px_rgba(255,0,0,0.8)] group-hover:scale-110 transition-transform" />
              <span>Bi2B Consultoria</span>
            </a>

            <p className="text-sm text-[#AEC3CE] leading-relaxed max-w-sm">
              Plataforma SaaS Multi-Tenant definitiva para escritórios de contabilidade. Gestão centralizada de clientes, automação fiscal e portal white-label com segurança de ponta.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Palmas / TO · Atendimento Nacional em todo o Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Infraestrutura 100% em conformidade com a LGPD</span>
              </div>
            </div>
          </div>

          {/* Col 3: Navegação da Plataforma */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#o-que-fazemos" className="hover:text-cyan-300 transition-colors">
                  O que fazemos
                </a>
              </li>
              <li>
                <a href="#funcionalidades" className="hover:text-cyan-300 transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#ecossistema" className="hover:text-cyan-300 transition-colors">
                  Grafo do Ecossistema
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-cyan-300 transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-cyan-300 transition-colors">
                  Benefícios
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Recursos & Sucesso */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Recursos
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#cases" className="hover:text-cyan-300 transition-colors">
                  Histórias de Sucesso
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-cyan-300 transition-colors">
                  Blog & Artigos
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-cyan-300 transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-cyan-300 transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a
                  href={getClientSubdomainUrl('/')}
                  className="text-cyan-300 font-semibold hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Portal do Cliente</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Novidades Contábeis */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Radar Contábil
            </h4>
            <p className="text-xs text-[#AEC3CE] leading-relaxed">
              Receba novidades sobre tecnologia contábil, reforma tributária e automação.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Inscrição realizada com sucesso!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Seu e-mail profissional"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white/5 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-sm bg-cyan-400 text-[#083A50] hover:bg-cyan-300 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Sem spam. Cancele quando quiser.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-400">
          <div>
            © {new Date().getFullYear()} Bi2B Consultoria · Todos os direitos reservados
          </div>
          <div className="flex items-center gap-6">
            <span>Privacidade & LGPD</span>
            <span>Termos de Uso</span>
            <span>Segurança da Informação</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
