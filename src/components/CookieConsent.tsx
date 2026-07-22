import { useState, useEffect } from 'react'
import { ShieldCheck, Cookie } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'bi2b_lgpd_consent'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: false,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl animate-fade-in-up">
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-md text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Privacidade & Proteção de Dados (LGPD)
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Utilizamos cookies essenciais para garantir o funcionamento seguro do nosso portal e autenticação de usuários, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0">
          <button
            onClick={handleDecline}
            className="px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
          >
            Apenas Essenciais
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  )
}
