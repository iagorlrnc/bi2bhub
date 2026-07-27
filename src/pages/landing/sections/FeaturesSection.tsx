import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCode2,
  Shield,
  MessageSquare,
  Activity,
  FolderOpen,
  CheckCircle2,
  Download,
  Plus,
  Clock,
  FileText,
  Send,
  Sparkles,
  ArrowUpRight,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import bpontoPng from '@/assets/logo.png'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
} as const

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

interface FeaturesSectionProps {
  isDark: boolean
}

export function FeaturesSection({ isDark }: FeaturesSectionProps) {
  const [activeTab, setActiveTab] = useState<'xml' | 'monitor' | 'connect' | 'task' | 'drive'>('xml')

  // Chat Interativo no Bi2B Chamados
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'support' | 'client'; text: string; time: string }>>([
    { sender: 'client', text: 'Olá! Preciso enviar a documentação para o fechamento mensal.', time: '14:20' },
    { sender: 'support', text: 'Boa tarde! Pode anexar diretamente na aba Bi2B Drive ou enviar por aqui.', time: '14:22' },
  ])
  const [newMsg, setNewMsg] = useState('')

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMsg.trim()) return
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setChatMessages((prev) => [...prev, { sender: 'client', text: newMsg, time: timeNow }])
    const typedMsg = newMsg
    setNewMsg('')

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'support',
          text: `Perfeito! Recebi sua mensagem: "${typedMsg}". Nossa equipe fiscal já foi notificada.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    }, 1200)
  }

  const modulesList = [
    {
      id: 'xml' as const,
      name: 'Guias Bi2B',
      icon: FileCode2,
      tagline: 'Sincronização SEFAZ & Lote',
      desc: 'Varredura imediata de NF-e, CT-e e NFS-e direto da base nacional com guarda garantida.',
    },
    {
      id: 'monitor' as const,
      name: 'Monitora Bi2B',
      icon: Shield,
      tagline: 'CNDs & Alertas Preventivos',
      desc: 'Varredura automática de certidões negativas e obrigações federais, estaduais e municipais.',
    },
    {
      id: 'connect' as const,
      name: 'Bi2B Chamados',
      icon: MessageSquare,
      tagline: 'Suporte Contábil Realtime',
      desc: 'Comunicação direta com o suporte contábil com histórico completo e status de chamados.',
    },
    {
      id: 'task' as const,
      name: 'Tarefas Bi2B',
      icon: Activity,
      tagline: 'Gestão de Guias e Prazos',
      desc: 'Painel visual de controle de impostos (DAS, ISS, FGTS) com aviso de datas limite.',
    },
    {
      id: 'drive' as const,
      name: 'Bi2B Drive',
      icon: FolderOpen,
      tagline: 'Gestão de Arquivos Criptografados',
      desc: 'Armazenamento organizado por pastas (Fiscal, RH, Societário) com busca por tag.',
    },
  ]

  return (
    <motion.section
      id="solucoes"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative overflow-hidden",
        isDark ? "bg-[#040914] border-white/10" : "bg-slate-50 border-slate-200"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção */}
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-md",
            isDark ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300" : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084]"
          )}>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Ecossistema Integrado de Soluções
          </span>
          <h2 className={cn("font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance", isDark ? "text-white" : "text-slate-900")}>
            Soluções conectadas em um único portal
          </h2>
          <p className={cn("max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-balance", isDark ? "text-slate-300/90" : "text-slate-600")}>
            Tudo o que sua empresa e seu escritório contábil precisam para operar em sintonia, sem dispersão de dados ou ruído de comunicação.
          </p>
        </motion.div>

        {/* GRAFO DO ECOSSISTEMA INTERATIVO (100% PRESERVADO INTEGRALMENTE) + APRESENTAÇÃO */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Grafo do Ecossistema Interativo (Coluna Esquerda/Topo) */}
          <motion.div
            variants={scaleIn}
            className="lg:col-span-6 relative flex justify-center items-center"
          >
            {/* Outer rotating light circle */}
            <div className={cn("absolute inset-0 -m-8 border rounded-full animate-[spin_40s_linear_infinite]", isDark ? "border-cyan-500/10" : "border-slate-200/60")} />
            <div className={cn("absolute inset-0 -m-16 border border-dashed rounded-full animate-[spin_60s_linear_infinite]", isDark ? "border-cyan-500/10" : "border-slate-200/50")} />

            {/* Grafo do Ecossistema Interativo Preservado */}
            <div 
              className={cn(
                "relative w-full aspect-square max-w-[420px] rounded-3xl border p-6 backdrop-blur-2xl flex items-center justify-center hover-elevate shadow-2xl",
                isDark 
                  ? "bg-[#040914]/80 border-cyan-500/20 bi2b-border-glow shadow-cyan-950/30" 
                  : "bg-white border-slate-200/90 shadow-2xl shadow-slate-200/60"
              )}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                {/* Linhas Conectoras Centrais */}
                <motion.line x1="200" y1="200" x2="200" y2="70" stroke={isDark ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="310" y2="150" stroke={isDark ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="270" y2="300" stroke={isDark ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="130" y2="300" stroke={isDark ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="90" y2="150" stroke={isDark ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />

                {/* Sinais luminosos em movimento */}
                <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 200], cy: [200, 70] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }} />
                <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 310], cy: [200, 150] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }} />
                <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 270], cy: [200, 300] }} transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }} />
                <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 130], cy: [200, 300] }} transition={{ repeat: Infinity, duration: 2.6, ease: 'linear' }} />
                <motion.circle r="4" fill={isDark ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 90], cy: [200, 150] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }} />
              </svg>

              {/* Nó Central Bi2B */}
              <div 
                className={cn(
                  "absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border flex flex-col items-center justify-center shadow-xl z-10 p-2 cursor-pointer transition-transform hover:scale-110",
                  isDark ? "border-cyan-400/40 shadow-cyan-500/20" : "border-cyan-400/30 shadow-slate-300"
                )}
              >
                <img src={bpontoPng} alt="Bi2B Icon" className="h-10 w-10 object-contain animate-pulse" />
                <span className="text-[8px] font-bold tracking-wider uppercase text-cyan-300 mt-0.5">Bi2B</span>
              </div>

              {/* Satellite Node 1: Guias Bi2B */}
              <div 
                onClick={() => setActiveTab('xml')}
                className="absolute top-6 flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'xml'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]")
                  )}
                >
                  <FileCode2 className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'xml' ? "text-cyan-400" : (isDark ? "text-slate-300" : "text-slate-700"))}>Guias Bi2B</span>
              </div>

              {/* Satellite Node 2: Monitora Bi2B */}
              <div 
                onClick={() => setActiveTab('monitor')}
                className="absolute right-6 top-[28%] flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'monitor'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]")
                  )}
                >
                  <Shield className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'monitor' ? "text-cyan-400" : (isDark ? "text-slate-300" : "text-slate-700"))}>Monitora Bi2B</span>
              </div>

              {/* Satellite Node 3: Bi2B Chamados */}
              <div 
                onClick={() => setActiveTab('connect')}
                className="absolute right-12 bottom-8 flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'connect'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]")
                  )}
                >
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'connect' ? "text-cyan-400" : (isDark ? "text-slate-300" : "text-slate-700"))}>Bi2B Chamados</span>
              </div>

              {/* Satellite Node 4: Tarefas Bi2B */}
              <div 
                onClick={() => setActiveTab('task')}
                className="absolute left-12 bottom-8 flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'task'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]")
                  )}
                >
                  <Activity className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'task' ? "text-cyan-400" : (isDark ? "text-slate-300" : "text-slate-700"))}>Tarefas Bi2B</span>
              </div>

              {/* Satellite Node 5: Bi2B Drive */}
              <div 
                onClick={() => setActiveTab('drive')}
                className="absolute left-6 top-[28%] flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-lg border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'drive'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDark ? "bg-[#08101d] border-cyan-500/20 text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084]")
                  )}
                >
                  <FolderOpen className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'drive' ? "text-cyan-400" : (isDark ? "text-slate-300" : "text-slate-700"))}>Bi2B Drive</span>
              </div>
            </div>
          </motion.div>

          {/* Cards Conectados do Ecossistema — HubStrom Style */}
          <div className="lg:col-span-6 space-y-4">
            {modulesList.map((m) => {
              const isActive = activeTab === m.id
              return (
                <motion.div
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={cn(
                    "rounded-2xl border p-5 transition-all duration-300 cursor-pointer flex items-start gap-4 hover:-translate-y-0.5 relative overflow-hidden backdrop-blur-xl shadow-lg",
                    isActive
                      ? (isDark
                          ? "bg-[#08152b] border-cyan-400 shadow-[0_8px_30px_rgba(13,96,132,0.3)]"
                          : "bg-white border-[#0d6084] shadow-xl shadow-slate-200/60")
                      : (isDark
                          ? "bg-[#040914]/70 border-white/10 hover:border-cyan-400/30"
                          : "bg-white/80 border-slate-200/80 hover:border-slate-300")
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-[#0d6084]" />
                  )}

                  <div className={cn(
                    "w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300",
                    isActive
                      ? "bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border-cyan-400/40 text-cyan-200 shadow-md"
                      : (isDark ? "bg-white/5 border-white/10 text-cyan-400" : "bg-cyan-50 border-cyan-200 text-[#0d6084]")
                  )}>
                    <m.icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={cn("font-bold text-base", isDark ? "text-white" : "text-slate-900")}>
                        {m.name}
                      </h3>
                      <span className={cn(
                        "text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0",
                        isActive
                          ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                          : (isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600")
                      )}>
                        {m.tagline}
                      </span>
                    </div>

                    <p className={cn("text-xs leading-relaxed mt-1.5", isDark ? "text-slate-300/90" : "text-slate-600")}>
                      {m.desc}
                    </p>

                    <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-cyan-400 group">
                      <span>Ver Demonstração Interativa</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>

        {/* DEMONSTRAÇÃO INTERATIVA DO MÓDULO SELECIONADO */}
        <motion.div 
          variants={scaleIn}
          className={cn(
            "rounded-3xl border p-6 sm:p-10 backdrop-blur-2xl shadow-2xl max-w-6xl mx-auto min-h-[460px] flex items-center transition-all duration-300",
            isDark 
              ? "bg-[#040914]/80 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-cyan-950/20" 
              : "bg-white border-slate-200/90 shadow-2xl shadow-slate-200/60"
          )}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'xml' && (
              <motion.div
                key="xml"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-8 items-center w-full"
              >
                <div className="md:col-span-6 space-y-6 text-left">
                  <div 
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner",
                      isDark ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084]"
                    )}
                  >
                    <FileCode2 className="h-6 w-6" />
                  </div>
                  <h3 className={cn("font-heading text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Guias Bi2B</h3>
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
                    Sincronização imediata de Notas Fiscais Eletrônicas (NF-e, CT-e, NFS-e) emitidas e recebidas direto da base da SEFAZ, permitindo download em lote.
                  </p>
                  <ul className={cn("space-y-2.5 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-600")}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Guarda eletrônica garantida por 5 anos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Filtros de busca rápida por emitente
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Painel visualizador de chaves de acesso
                    </li>
                  </ul>
                </div>
                
                {/* Prévia XML Fiscal */}
                <div className="md:col-span-6">
                  <div className={cn("rounded-2xl border p-4 shadow-2xl text-[11px] text-left font-mono", isDark ? "bg-[#050b14]/90 border-cyan-500/10" : "bg-slate-50 border-slate-200")}>
                    <div className={cn("flex items-center justify-between border-b pb-2.5 mb-3", isDark ? "border-cyan-950" : "border-slate-200")}>
                      <span className={cn("font-bold", isDark ? "text-white" : "text-slate-800")}>XMLs Recentes (SEFAZ)</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">Sincronizado</span>
                    </div>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {[
                        { no: '102542', emit: 'Alfa Distribuidora', val: 'R$ 4.250,00' },
                        { no: '102543', emit: 'Beta Indústria S/A', val: 'R$ 12.890,00' },
                        { no: '102544', emit: 'Serviços Globais SP', val: 'R$ 890,00' }
                      ].map((xml, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "flex justify-between items-center border rounded-lg p-2.5 hover:border-cyan-500/35 cursor-pointer hover:scale-[1.01] transition-transform duration-200",
                            isDark ? "bg-[#08101d] border-cyan-500/5" : "bg-white border-slate-200"
                          )}
                        >
                          <div>
                            <div className={cn("font-bold", isDark ? "text-slate-200" : "text-slate-700")}>NF-e #{xml.no}</div>
                            <div className="text-[9px] text-slate-500 truncate max-w-[120px]">{xml.emit}</div>
                          </div>
                          <div className="text-right">
                            <div className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>{xml.val}</div>
                            <div className="text-[9px] text-cyan-500 flex items-center gap-0.5 justify-end">
                              <Download className="w-2.5 h-2.5" /> Baixar
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'monitor' && (
              <motion.div
                key="monitor"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-8 items-center w-full"
              >
                <div className="md:col-span-6 space-y-6 text-left">
                  <div 
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner",
                      isDark ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084]"
                    )}
                  >
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className={cn("font-heading text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Monitora Bi2B</h3>
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
                    Varredura diária automatizada de certidões negativas de débitos (CNDs) federais, estaduais e municipais, emitindo alertas antes que qualquer prazo expire.
                  </p>
                  <ul className={cn("space-y-2.5 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-600")}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Histórico permanente de certidões emitidas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Alertas de prazos de DCTFWeb, CRF e FGTS
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Avisos via painel do cliente e e-mail
                    </li>
                  </ul>
                </div>

                {/* Prévia Monitora Bi2B */}
                <div className="md:col-span-6">
                  <div className={cn("rounded-2xl border p-4 shadow-2xl text-[11px] text-left font-mono", isDark ? "bg-[#050b14]/90 border-cyan-500/10" : "bg-slate-50 border-slate-200")}>
                    <div className={cn("flex items-center justify-between border-b pb-2.5 mb-3", isDark ? "border-cyan-950" : "border-slate-200")}>
                      <span className={cn("font-bold", isDark ? "text-white" : "text-slate-800")}>Varredura de CNDs</span>
                      <span className="text-[9px] text-cyan-500">Varrendo...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 animate-pulse">
                        <span className="text-emerald-500">CND Federal (RFB/PGFN)</span>
                        <span className="bg-emerald-500/20 text-emerald-500 text-[9px] px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">REGULAR</span>
                      </div>
                      <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
                        <span className="text-amber-400">Certidão do FGTS (CRF)</span>
                        <span className="bg-amber-500/20 text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-bold border border-amber-500/30">VENCE EM 8 DIAS</span>
                      </div>
                      <div className="flex justify-between items-center bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                        <span className="text-rose-400">CND Municipal (São Paulo)</span>
                        <span className="bg-rose-500/20 text-rose-400 text-[9px] px-1.5 py-0.5 rounded font-bold border border-rose-500/30">EXPIRADA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'connect' && (
              <motion.div
                key="connect"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-8 items-center w-full"
              >
                <div className="md:col-span-5 space-y-6 text-left">
                  <div 
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner",
                      isDark ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084]"
                    )}
                  >
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className={cn("font-heading text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Bi2B Chamados (Chat)</h3>
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
                    Envie mensagens em tempo real para seu suporte contábil. Uma interface fluida e de resposta imediata com histórico completo dos chamados.
                  </p>
                  <div className={cn("border rounded-xl p-3 text-[10px] italic flex gap-2 items-center", isDark ? "bg-cyan-950/20 border-cyan-500/10 text-cyan-300" : "bg-cyan-50 border-cyan-200/50 text-[#0d6084]")}>
                    <Sparkles className="w-4 h-4 shrink-0 text-cyan-500 animate-pulse" />
                    Experimente digitar no chat ao lado! A inteligência de simulação responderá.
                  </div>
                </div>

                {/* Chat Interativo Real */}
                <div className="md:col-span-7">
                  <div className={cn("rounded-2xl border p-4 shadow-2xl flex flex-col gap-3 h-[250px] justify-between", isDark ? "bg-[#050b14]/90 border-cyan-500/10" : "bg-slate-50 border-slate-200")}>
                    {/* Topo do Chat */}
                    <div className={cn("flex items-center justify-between border-b pb-2 text-xs", isDark ? "border-cyan-950" : "border-slate-200")}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className={cn("font-bold", isDark ? "text-white" : "text-slate-800")}>Suporte Contábil (Online)</span>
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase">Chamado #1048</span>
                    </div>

                    {/* Lista de Mensagens */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-[11px] flex flex-col">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            "max-w-[85%] rounded-2xl p-2.5 flex flex-col gap-0.5",
                            msg.sender === 'client'
                              ? (isDark 
                                  ? "bg-cyan-950/60 border border-cyan-500/10 text-slate-100 self-end rounded-tr-none" 
                                  : "bg-cyan-50 border border-cyan-200/60 text-slate-800 self-end rounded-tr-none")
                              : (isDark 
                                  ? "bg-slate-900 border border-slate-800 text-slate-300 self-start rounded-tl-none" 
                                  : "bg-slate-200/60 border border-slate-300/40 text-slate-700 self-start rounded-tl-none")
                          )}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                          <span className="text-[8px] text-slate-500 text-right self-end mt-0.5">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Input do Chat */}
                    <form onSubmit={handleSendChat} className={cn("flex gap-2 border-t pt-2.5", isDark ? "border-cyan-950" : "border-slate-200")}>
                      <input
                        type="text"
                        placeholder="Digite sua dúvida contábil..."
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        className={cn("flex-1 border rounded-lg px-3 py-2 text-[11px] focus:outline-none", isDark ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#0d6084]/50")}
                      />
                      <button
                        type="submit"
                        className="bg-[#0d6084] hover:bg-[#0b5474] text-white rounded-lg px-3 flex items-center justify-center border border-cyan-500/20 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'task' && (
              <motion.div
                key="task"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-8 items-center w-full"
              >
                <div className="md:col-span-6 space-y-6 text-left">
                  <div 
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner",
                      isDark ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084]"
                    )}
                  >
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className={cn("font-heading text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Tarefas Bi2B</h3>
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
                    Gerenciador visual das guias mensais, impostos e obrigações trabalhistas. Evite atrasos acompanhando o status de cada entrega diretamente no seu painel.
                  </p>
                  <ul className={cn("space-y-2.5 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-600")}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Data limite de entrega e prazos calculados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Confirmação de recebimento assinada digitalmente
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Filtros de status (Em aberto, Concluído, Em atraso)
                    </li>
                  </ul>
                </div>

                {/* Prévia Tarefas Bi2B */}
                <div className="md:col-span-6">
                  <div className={cn("rounded-2xl border p-4 shadow-2xl text-[11px] text-left font-mono", isDark ? "bg-[#050b14]/90 border-cyan-500/10" : "bg-slate-50 border-slate-200")}>
                    <div className={cn("flex items-center justify-between border-b pb-2.5 mb-3", isDark ? "border-cyan-950" : "border-slate-200")}>
                      <span className={cn("font-bold", isDark ? "text-white" : "text-slate-800")}>Obrigações e Impostos</span>
                      <span className="text-[9px] text-slate-500 font-mono">Julho 2025</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { task: 'Gerar DAS Simples Nacional', date: 'Vence em 20/07', status: 'Concluído', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                        { task: 'Cálculo de Folha de Pagamento', date: 'Vence em 05/08', status: 'Em Aberto', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
                        { task: 'Declaração Mensal ISS', date: 'Vence em 15/07', status: 'Atrasado', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' }
                      ].map((t, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "flex justify-between items-center border rounded-lg p-2.5",
                            isDark ? "bg-[#08101d] border-cyan-500/5" : "bg-white border-slate-200"
                          )}
                        >
                          <div>
                            <div className={cn("font-bold", isDark ? "text-slate-200" : "text-slate-700")}>{t.task}</div>
                            <div className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-2.5 h-2.5" /> {t.date}
                            </div>
                          </div>
                          <span className={cn("text-[9px] px-2 py-0.5 rounded font-bold border", t.color)}>{t.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'drive' && (
              <motion.div
                key="drive"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-8 items-center w-full"
              >
                <div className="md:col-span-6 space-y-6 text-left">
                  <div 
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner",
                      isDark ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084]"
                    )}
                  >
                    <FolderOpen className="h-6 w-6" />
                  </div>
                  <h3 className={cn("font-heading text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Bi2B Drive</h3>
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
                    Gerenciamento inteligente de arquivos estruturados por categorias e pastas (Contrato Social, Balanços, RH, Fiscal). Faça uploads simples via drag-and-drop.
                  </p>
                  <ul className={cn("space-y-2.5 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-600")}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Busca instantânea por nome ou tag
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Categorização automática por tipo de documento
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      Armazenamento criptografado
                    </li>
                  </ul>
                </div>

                {/* Prévia Bi2B Drive */}
                <div className="md:col-span-6">
                  <div className={cn("rounded-2xl border p-4 shadow-2xl text-[11px] text-left font-mono", isDark ? "bg-[#050b14]/90 border-cyan-500/10" : "bg-slate-50 border-slate-200")}>
                    <div className={cn("flex items-center justify-between border-b pb-2.5 mb-3", isDark ? "border-cyan-950" : "border-slate-200")}>
                      <span className={cn("font-bold", isDark ? "text-white" : "text-slate-800")}>Arquivos Compartilhados</span>
                      <span className="text-[9px] text-cyan-400 flex items-center gap-0.5 cursor-pointer"><Plus className="w-2.5 h-2.5" /> Enviar</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { file: 'Balanço Patrimonial 2025.pdf', size: '2.4 MB', cat: 'Contábil' },
                        { file: 'Contrato Social Alterado.pdf', size: '1.8 MB', cat: 'Societário' },
                        { file: 'Folha Pagamento Julho.xlsx', size: '950 KB', cat: 'RH / Trabalhista' }
                      ].map((f, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "flex items-center gap-3 border rounded-lg p-2.5",
                            isDark ? "bg-[#08101d] border-cyan-500/5" : "bg-white border-slate-200"
                          )}
                        >
                          <FileText className="h-5 w-5 text-cyan-400 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className={cn("font-bold truncate", isDark ? "text-slate-200" : "text-slate-700")}>{f.file}</div>
                            <div className="text-[9px] text-slate-500 mt-0.5">{f.size} • {f.cat}</div>
                          </div>
                          <span className="text-[9px] text-cyan-400 cursor-pointer flex items-center gap-0.5">
                            <Download className="w-2.5 h-2.5" /> Baixar
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </motion.section>
  )
}

