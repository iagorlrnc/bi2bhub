import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants'
import { cn } from '@/lib/utils'
import logoPng from '@/assets/logo.png'
import logoAzulPng from '@/assets/logoazul.png'
import { getAdminSubdomainUrl } from '@/utils/subdomain'
import { MessageCircle, MapPin, Mail, Phone, } from 'lucide-react'

interface FooterSectionProps {
  isDark: boolean
}

export function FooterSection({ isDark }: FooterSectionProps) {
  const navigate = useNavigate()
  const currentLogo = isDark ? logoPng : logoAzulPng

  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer
      className={cn(
        "border-t py-16 text-left relative overflow-hidden backdrop-blur-xl",
        isDark ? "bg-[#040914] border-white/10 text-slate-300" : "bg-slate-900 border-slate-800 text-slate-300"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          
          {/* Branding Column */}
          <div className="lg:col-span-2 space-y-4 pr-4">
            <div className="flex items-center cursor-pointer transition-transform hover:scale-105" onClick={() => navigate(ROUTES.HOME)}>
              <img src={currentLogo} alt={APP_NAME} className="h-9 w-auto object-contain" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Bi2B Consultoria — Soluções completas em consultoria, dados e gestão contábil para transformar informação em decisão e dar mais clareza ao crescimento do seu negócio.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-all duration-300"
                title="LinkedIn Bi2B"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-all duration-300"
                title="Instagram Bi2B"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-white/10 transition-all duration-300"
                title="WhatsApp Suporte"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1: Soluções */}
          <div>
            <h4 className={cn("text-xs font-extrabold uppercase tracking-[0.2em] mb-4", isDark ? "text-slate-100" : "text-white")}>Soluções</h4>
            <ul className="space-y-3 text-xs font-medium">
              {[
                { label: 'Guias Bi2B', href: '#solucoes' },
                { label: 'Equipe & Permissões', href: '#solucoes' },
                { label: 'Bi2B Chamados', href: '#solucoes' },
                { label: 'Tarefas Bi2B', href: '#solucoes' },
                { label: 'Bi2B Drive', href: '#solucoes' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollTo(item.href)}
                    className="text-slate-400 hover:text-cyan-300 transition-colors duration-300 text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Navegação */}
          <div>
            <h4 className={cn("text-xs font-extrabold uppercase tracking-[0.2em] mb-4", isDark ? "text-slate-100" : "text-white")}>Navegação</h4>
            <ul className="space-y-3 text-xs font-medium">
              {[
                { label: 'Como Funciona', href: '#como-funciona' },
                { label: 'Soluções', href: '#solucoes' },
                { label: 'Resultados', href: '#resultados' },
                { label: 'Planos & Preços', href: '#planos' },
                { label: 'Contato', href: '#contato' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollTo(item.href)}
                    className="text-slate-400 hover:text-cyan-300 transition-colors duration-300 text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: Contato & Endereço */}
          <div>
            <h4 className={cn("text-xs font-extrabold uppercase tracking-[0.2em] mb-4", isDark ? "text-slate-100" : "text-white")}>Atendimento</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Palmas-TO, Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>contato@bi2b.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>(99) 99999-9999</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className={cn("mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4", isDark ? "border-white/10" : "border-slate-800")}>
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span
              onClick={() => { window.location.href = getAdminSubdomainUrl('/') }}
              className="hover:text-cyan-300 cursor-pointer transition-colors font-bold uppercase tracking-wider text-[11px]"
            >
              Painel Administrativo
            </span>
            <span>•</span>
            <span className="font-mono text-slate-500">CNPJ: 00.000.000/0001-00</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
