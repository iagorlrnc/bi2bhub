import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { getClientSubdomainUrl } from '@/utils/subdomain'
import { ArrowUpRight } from 'lucide-react'

export function Bi2BFooterSection() {
  const navigate = useNavigate()

  return (
    <footer className="bg-[#083A50] text-[#AEC3CE] pt-12 pb-24 md:pb-16 border-t border-white/10">
      <div className="bi2b-wrap">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-white/10">
          {/* Brand */}
          <div>
            <a
              href="#topo"
              className="font-heading font-bold text-2xl text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000] shadow-[0_0_12px_1px_rgba(255,0,0,0.6)]" />
              <span>Bi2B</span>
            </a>
            <p className="text-xs text-[#AEC3CE] mt-2 max-w-sm">
              Inteligência Financeira e Contabilidade Consultiva para o comércio varejista e atacadista.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#topo" className="text-[#AEC3CE] hover:text-white transition-colors">
              Início
            </a>
            <a href="#cases" className="text-[#AEC3CE] hover:text-white transition-colors">
              Casos Reais
            </a>
            <a href="#parceiros" className="text-[#AEC3CE] hover:text-white transition-colors">
              Parceiros
            </a>
            <a href="#planos" className="text-[#AEC3CE] hover:text-white transition-colors">
              Planos
            </a>
            <a href="#portal" className="text-[#AEC3CE] hover:text-white transition-colors">
              Portal do Cliente
            </a>
            <button
              onClick={() => {
                navigate(ROUTES.PORTAL_INFO)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-[#AEC3CE] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>Sobre o Portal</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
            <a
              href={getClientSubdomainUrl('/')}
              className="text-white hover:text-cyan-300 font-semibold transition-colors inline-flex items-center gap-1"
            >
              <span>Área do Cliente</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[#AEC3CE]/80">
          <div>
            © {new Date().getFullYear()} Bi2B Consultoria · Todos os direitos reservados · CRC-TO
          </div>
          <div className="text-center sm:text-right">
            Palmas / TO · Tocantins · Brasil
          </div>
        </div>
      </div>
    </footer>
  )
}
