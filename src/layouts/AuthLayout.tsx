import { type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import loginpageImg from '@/assets/loginpage.png'
import { APP_NAME } from '@/constants'
import { ChevronDown, ArrowLeft } from 'lucide-react'
import { getMainDomainUrl } from '@/utils/subdomain'

interface AuthLayoutProps {
  children?: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const handleGoHome = (path: string = '/') => {
    window.location.href = getMainDomainUrl(path)
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#030712] text-slate-100 font-sans select-none overflow-x-hidden relative">
      {/* Grid de Fundo Sutil */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      {/* Conteúdo Principal (2 Colunas 50/50 em telas lg:) */}
      <div className="flex-1 w-full flex flex-col lg:flex-row min-h-[calc(100vh-100px)]">
        {/* Lado Esquerdo: Marca & Banner Ilustrativo (Visível em telas lg: 1024px+) */}
        <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-8 xl:p-12 relative overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#030712] via-[#061024] to-[#040917]">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[#0d6084]/25 blur-[140px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-10 right-10 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />

          {/* Topo: Botão de Redirecionamento para a Landing Page (Desktop) */}
          <div className="z-10 flex items-center justify-between">
            <button 
              type="button"
              onClick={() => handleGoHome('/')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all duration-300 backdrop-blur-md shadow-lg group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
              <span>Voltar para a Página Inicial</span>
            </button>
          </div>

          {/* Centro: Chamada e Imagem Ilustrativa */}
          <div className="z-10 my-auto flex flex-col items-center text-center space-y-6 max-w-xl mx-auto py-6">
            <div className="space-y-3">
              <p className="text-xs xl:text-sm text-slate-300/80 leading-relaxed max-w-md mx-auto">
                Conecte sua empresa à contabilidade em tempo real com controle de impostos, tarefas mensais e segurança corporativa.
              </p>
            </div>

            {/* Imagem do caminho src/assets/loginpage.png */}
            <div className="relative group w-full flex justify-center pt-3">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-[#0d6084]/40 to-blue-600/30 blur-2xl opacity-60 group-hover:opacity-90 transition duration-700" />

              <img
                src={loginpageImg}
                alt="Bi2B Platform Preview"
                className="relative rounded-2xl border border-cyan-400/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] max-h-[420px] xl:max-h-[480px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>
          </div>
        </div>

        {/* Lado Direito: Área de Formulário (Login / Cadastro / Redefinição) */}
        <div className="w-full lg:w-[48%] flex flex-col items-center justify-center p-4 sm:p-8 md:p-10 relative bg-[#030712]/95 backdrop-blur-3xl min-h-full">
          {/* Glow sutil de canto */}
          <div className="absolute top-1/2 right-0 h-[350px] w-[350px] rounded-full bg-[#0d6084]/15 blur-[120px] pointer-events-none" />
          
          {/* Botão de Redirecionamento para a Landing Page (Mobile / Telas Pequenas) */}
          <div className="w-full max-w-md lg:hidden mb-4 flex justify-start z-20">
            <button 
              type="button"
              onClick={() => handleGoHome('/')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all duration-300 backdrop-blur-md shadow-md group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
              <span>Voltar para a Página Inicial</span>
            </button>
          </div>

          <div className="w-full max-w-md my-auto relative z-10 py-4 sm:py-6">
            {children || <Outlet />}
          </div>
        </div>
      </div>

      {/* Footer Global Estilo Instagram ao Fim da Página */}
      <footer className="w-full py-6 px-4 border-t border-white/10 bg-[#02050c] text-center z-20">
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Links Inline Centralizados */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-400">
            <button type="button" onClick={() => handleGoHome('/')} className="hover:text-cyan-300 transition-colors cursor-pointer">Bi2B</button>
            <button type="button" onClick={() => handleGoHome('/#como-funciona')} className="hover:text-cyan-300 transition-colors cursor-pointer">Sobre</button>
            <button type="button" onClick={() => handleGoHome('/#solucoes')} className="hover:text-cyan-300 transition-colors cursor-pointer">Soluções</button>
            <button type="button" onClick={() => handleGoHome('/#resultados')} className="hover:text-cyan-300 transition-colors cursor-pointer">Resultados</button>
            <button type="button" onClick={() => handleGoHome('/#planos')} className="hover:text-cyan-300 transition-colors cursor-pointer">Planos</button>
            <button type="button" onClick={() => handleGoHome('/#contato')} className="hover:text-cyan-300 transition-colors cursor-pointer">Ajuda</button>
            <button type="button" onClick={() => handleGoHome('/#contato')} className="hover:text-cyan-300 transition-colors cursor-pointer">Privacidade</button>
            <button type="button" onClick={() => handleGoHome('/#contato')} className="hover:text-cyan-300 transition-colors cursor-pointer">Termos</button>
            <button type="button" onClick={() => handleGoHome('/#contato')} className="hover:text-cyan-300 transition-colors cursor-pointer">Contato</button>
          </div>

          {/* Idioma e Direitos Autorais */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
            <span className="cursor-pointer hover:text-slate-300 transition-colors flex items-center gap-1 select-none">
              Português (Brasil) <ChevronDown className="w-3 h-3 opacity-60" />
            </span>
            <span>•</span>
            <span>© {new Date().getFullYear()} {APP_NAME}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
