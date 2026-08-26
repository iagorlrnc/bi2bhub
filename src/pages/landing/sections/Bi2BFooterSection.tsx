import { getClientSubdomainUrl } from '@/utils/subdomain'
import { Lock } from 'lucide-react'

export function Bi2BFooterSection() {
  return (
    <footer className="bg-[#083A50] text-[#AEC3CE] py-12 pb-24 md:pb-12 border-t border-white/10">
      <div className="wrap">
        <div className="flex flex-wrap gap-6 justify-between items-center pb-8 border-b border-white/10">
          {/* Brand Logo with Glowing Red Dot */}
          <a
            href="#topo"
            className="brand font-heading font-bold text-xl text-white flex items-center gap-2 tracking-tight group"
          >
            <span className="dot w-2.5 h-2.5 rounded-full bg-[#FF0000] shadow-[0_0_12px_1px_rgba(255,0,0,0.6)]" />
            <span>Bi2B Consultoria</span>
          </a>

          {/* CRC and Location Metadata */}
          <div className="font-mono text-xs text-[#AEC3CE] tracking-wider">
            Palmas/TO · Consultoria de Inteligência Financeira · Contadores Registrados CRC
          </div>

          {/* Client Portal Link */}
          <a
            href={getClientSubdomainUrl('/')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-white border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-[#FF0000]" />
            <span>Acessar Portal do Cliente</span>
          </a>
        </div>

        {/* Quick Links & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[#AEC3CE]">
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            <a href="#topo" className="hover:text-white transition-colors">
              Início
            </a>
            <a href="#vilao" className="hover:text-white transition-colors">
              O vilão
            </a>
            <a href="#guia" className="hover:text-white transition-colors">
              Quem somos
            </a>
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Como funciona
            </a>
            <a href="#cases" className="hover:text-white transition-colors">
              Casos Reais
            </a>
            <a href="#planos" className="hover:text-white transition-colors">
              Planos
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#agendar" className="text-white hover:underline font-semibold">
              Diagnóstico gratuito
            </a>
          </div>

          <div>
            © {new Date().getFullYear()} Bi2B · Pare de decidir no escuro.
          </div>
        </div>
      </div>
    </footer>
  )
}

