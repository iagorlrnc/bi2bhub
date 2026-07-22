import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ROUTES } from '@/constants/routes'
import {
  ArrowRight,
  Shield,
  FileCode2,
  MessageSquare,
  FolderOpen,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import bpontoPng from '@/assets/bponto.png'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
} as const

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
} as const

interface HeroSectionProps {
  isDark: boolean
}

export function HeroSection({ isDark }: HeroSectionProps) {
  const navigate = useNavigate()

  return (
    <section className="relative pt-32 pb-16 px-6 md:px-8 md:pt-40 lg:pt-44 md:pb-20 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 md:gap-16 items-center">
        
        {/* Coluna Texto (Esquerda) — Minimalista */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-7 flex flex-col gap-5 max-w-lg text-left"
        >
          <motion.h1
            variants={fadeInUp}
            className={cn(
              "text-[2rem] md:text-[2.8rem] lg:text-[3rem] xl:text-[3.4rem] font-bold leading-[1.1] tracking-tight font-serif",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Simplifique a contabilidade da sua empresa.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className={cn(
              "text-base md:text-lg leading-relaxed max-w-md",
              isDark ? "text-slate-400" : "text-slate-500"
            )}
          >
            Impostos, certidões, documentos e suporte — tudo centralizado em um portal seguro conectado ao seu escritório contábil.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-start gap-3 pt-2"
          >
            <button
              onClick={() => navigate(ROUTES.REGISTER)}
              className="inline-flex items-center justify-center gap-2 font-bold bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white hover:brightness-110 rounded-full px-8 py-4 text-sm shadow-lg shadow-cyan-950/30 border border-cyan-500/20 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] group cursor-pointer"
            >
              Começar grátis
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className={cn(
                "inline-flex items-center justify-center px-6 py-4 text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer",
                isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              Já tenho conta →
            </button>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className={cn("text-xs pt-1", isDark ? "text-slate-600" : "text-slate-400")}
          >
            Sem cartão de crédito • 3 dias grátis • LGPD compliant
          </motion.p>
        </motion.div>

        {/* Coluna Diagrama Original Conexões (Direita) — INTACTO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-5 relative flex justify-center items-center"
        >
          {/* Outer rotating light circle */}
          <div className={cn("absolute inset-0 -m-8 border rounded-full animate-[spin_40s_linear_infinite]", isDark ? "border-cyan-500/5" : "border-slate-200/50")} />
          <div className={cn("absolute inset-0 -m-16 border border-dashed rounded-full animate-[spin_60s_linear_infinite]", isDark ? "border-cyan-500/5" : "border-slate-200/40")} />

          {/* Grafo do Ecossistema Interativo (Modelo Hub de Rede Bi2B Original) */}
          <div 
            className={cn(
              "relative w-full aspect-square max-w-[380px] rounded-3xl border p-6 backdrop-blur-sm flex items-center justify-center hover-elevate",
              isDark 
                ? "bg-slate-950/40 border-cyan-500/10 bi2b-border-glow" 
                : "bg-white border-slate-200/80 shadow-2xl shadow-slate-200/60"
            )}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
              {/* Linhas Conectoras Centrais */}
              <motion.line x1="200" y1="200" x2="200" y2="70" stroke={isDark ? "rgba(126, 231, 255, 0.2)" : "rgba(13, 96, 132, 0.25)"} strokeWidth="1.5" strokeDasharray="5,5" />
              <motion.line x1="200" y1="200" x2="310" y2="150" stroke={isDark ? "rgba(126, 231, 255, 0.2)" : "rgba(13, 96, 132, 0.25)"} strokeWidth="1.5" strokeDasharray="5,5" />
              <motion.line x1="200" y1="200" x2="270" y2="300" stroke={isDark ? "rgba(126, 231, 255, 0.2)" : "rgba(13, 96, 132, 0.25)"} strokeWidth="1.5" strokeDasharray="5,5" />
              <motion.line x1="200" y1="200" x2="130" y2="300" stroke={isDark ? "rgba(126, 231, 255, 0.2)" : "rgba(13, 96, 132, 0.25)"} strokeWidth="1.5" strokeDasharray="5,5" />
              <motion.line x1="200" y1="200" x2="90" y2="150" stroke={isDark ? "rgba(126, 231, 255, 0.2)" : "rgba(13, 96, 132, 0.25)"} strokeWidth="1.5" strokeDasharray="5,5" />

              {/* Sinais luminosos em movimento */}
              <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 200], cy: [200, 70] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }} />
              <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 310], cy: [200, 150] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }} />
              <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 270], cy: [200, 300] }} transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }} />
              <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 130], cy: [200, 300] }} transition={{ repeat: Infinity, duration: 2.6, ease: 'linear' }} />
              <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 90], cy: [200, 150] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }} />
            </svg>

            {/* Nó Central */}
            <div 
              className={cn(
                "absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border flex flex-col items-center justify-center shadow-lg z-10 p-2",
                isDark ? "border-cyan-400/30 shadow-cyan-500/10" : "border-cyan-400/15 shadow-slate-300"
              )}
            >
              <img src={bpontoPng} alt="Bi2B Icon" className="h-10 w-10 object-contain animate-pulse" />
              <span className="text-[8px] font-bold tracking-wider uppercase text-cyan-300 mt-0.5">Bi2B</span>
            </div>

            {/* Satellite Node 1: XMLHub */}
            <div className="absolute top-6 flex flex-col items-center gap-1">
              <div 
                className={cn(
                  "w-11 h-11 rounded-lg border flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300",
                  isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]"
                )}
              >
                <FileCode2 className="h-5 w-5" />
              </div>
              <span className={cn("text-[10px] font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>XMLHub</span>
            </div>

            {/* Satellite Node 2: MonitorHub */}
            <div className="absolute right-6 top-[28%] flex flex-col items-center gap-1">
              <div 
                className={cn(
                  "w-11 h-11 rounded-lg border flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300",
                  isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]"
                )}
              >
                <Shield className="h-5 w-5" />
              </div>
              <span className={cn("text-[10px] font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>MonitorHub</span>
            </div>

            {/* Satellite Node 3: ConnectHub */}
            <div className="absolute right-14 bottom-10 flex flex-col items-center gap-1">
              <div 
                className={cn(
                  "w-11 h-11 rounded-lg border flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300",
                  isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]"
                )}
              >
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className={cn("text-[10px] font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>ConnectHub</span>
            </div>

            {/* Satellite Node 4: TaskHub */}
            <div className="absolute left-14 bottom-10 flex flex-col items-center gap-1">
              <div 
                className={cn(
                  "w-11 h-11 rounded-lg border flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300",
                  isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]"
                )}
              >
                <Activity className="h-5 w-5" />
              </div>
              <span className={cn("text-[10px] font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>TaskHub</span>
            </div>

            {/* Satellite Node 5: DriveHub */}
            <div className="absolute left-6 top-[28%] flex flex-col items-center gap-1">
              <div 
                className={cn(
                  "w-11 h-11 rounded-lg border flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300",
                  isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]"
                )}
              >
                <FolderOpen className="h-5 w-5" />
              </div>
              <span className={cn("text-[10px] font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>DriveHub</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
