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
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

  return (
    <motion.section
      id="funcionalidades"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className={cn(
        "py-28 border-b relative",
        isDark ? "border-cyan-950/40" : "border-slate-200"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Ecossistema Modular</span>
          <h2 className={cn("font-heading text-3xl sm:text-4xl font-extrabold", isDark ? "text-white" : "text-slate-900")}>
            Conheça os Módulos do Portal
          </h2>
          <p className={cn("max-w-xl mx-auto text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Gerencie suas demandas, notas e impostos de forma modular. Ative apenas o que sua operação precisa.
          </p>

          {/* Seletores das Abas */}
          <div className="flex flex-wrap justify-center gap-3 pt-6 max-w-4xl mx-auto relative z-10">
            {[
              { id: 'xml', label: 'Guias Bi2B', icon: FileCode2 },
              { id: 'monitor', label: 'Monitora Bi2B', icon: Shield },
              { id: 'connect', label: 'Bi2B Chamados', icon: MessageSquare },
              { id: 'task', label: 'Tarefas Bi2B', icon: Activity },
              { id: 'drive', label: 'Bi2B Drive', icon: FolderOpen },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'relative flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
                    isActive
                      ? 'border-cyan-500/40 text-white shadow-md shadow-cyan-950/20'
                      : (isDark 
                          ? "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white" 
                          : "bg-white border-slate-200 text-slate-500 hover:text-slate-800")
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <tab.icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Conteúdo das Abas com Animação */}
        <motion.div 
          variants={scaleIn}
          className={cn(
            "rounded-3xl border p-6 sm:p-10 backdrop-blur-md shadow-xl max-w-6xl mx-auto min-h-[460px] flex items-center",
            isDark 
              ? "bg-[#08101d]/60 border-cyan-500/10 bi2b-border-glow shadow-cyan-950/40" 
              : "bg-white border-slate-200 shadow-2xl shadow-slate-200/60"
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
