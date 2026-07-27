import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import logoPng from '@/assets/logo.png'
import { getAdminSubdomainUrl } from '@/utils/subdomain'

interface FooterSectionProps {
  isDark: boolean
}

export function FooterSection({ isDark }: FooterSectionProps) {
  const navigate = useNavigate()

  return (
    <footer
      className={cn(
        "border-t py-16 text-left relative",
        isDark ? "bg-slate-950/80 border-cyan-950/40" : "bg-slate-900 border-slate-800 text-slate-300"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Branding Column */}
          <div className="space-y-4">
            <div className="flex items-center cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
              <img src={logoPng} alt={APP_NAME} className="h-7 w-auto object-contain" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bi2B Consultoria — Portal inteligente conectando empresas à contabilidade de forma automatizada e com total segurança.
            </p>
            {/* LGPD Seal */}
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-2 rounded-lg border",
              isDark ? "bg-cyan-950/20 border-cyan-500/10" : "bg-slate-800 border-slate-700"
            )}>
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">Dados Protegidos</p>
                <p className="text-[8px] text-slate-500">Conformidade LGPD</p>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className={cn("text-xs font-bold uppercase tracking-[0.15em]", isDark ? "text-slate-200" : "text-white")}>Módulos</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              {['Guias Bi2B', 'Monitora Bi2B', 'Bi2B Chamados', 'Tarefas Bi2B', 'Bi2B Drive'].map((item) => (
                <li key={item}>
                  <span className={cn("cursor-pointer transition-colors duration-200", isDark ? "text-slate-400 hover:text-cyan-400" : "text-slate-300 hover:text-cyan-300")}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={cn("text-xs font-bold uppercase tracking-[0.15em]", isDark ? "text-slate-200" : "text-white")}>Sobre</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              {['A Bi2B Consultoria', 'Diferenciais', 'Planos e Preços', 'Fale Conosco'].map((item) => (
                <li key={item}>
                  <span className={cn("cursor-pointer transition-colors duration-200", isDark ? "text-slate-400 hover:text-cyan-400" : "text-slate-300 hover:text-cyan-300")}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={cn("text-xs font-bold uppercase tracking-[0.15em]", isDark ? "text-slate-200" : "text-white")}>Informações de Segurança</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              {['Termos de Uso', 'Privacidade de Dados', 'Regulamentação LGPD', 'Certificado SSL'].map((item) => (
                <li key={item}>
                  <span
                    onClick={() => {
                      toast.info(`${item}: Seus dados são protegidos com criptografia de ponta a ponta e armazenados em estrita conformidade com a LGPD (Lei nº 13.709/2018).`, { duration: 6000 })
                    }}
                    className={cn("cursor-pointer transition-colors duration-200", isDark ? "text-slate-400 hover:text-cyan-400" : "text-slate-300 hover:text-cyan-300")}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className={cn("mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4", isDark ? "border-cyan-950/20" : "border-slate-800")}>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span
              onClick={() => { window.location.href = getAdminSubdomainUrl('/') }}
              className="hover:text-cyan-400 cursor-pointer transition-colors font-bold"
            >
              🔒 Acesso Administrativo
            </span>
            <span>•</span>
            <span className="font-mono">CNPJ: 00.000.000/0001-00</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
