import { useState, useEffect, useRef } from 'react'
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
  X,
  Users,
  UserPlus,
  Search,
  Check,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
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
  isDark?: boolean
}

export function FeaturesSection({ isDark }: FeaturesSectionProps) {
  const { resolvedTheme } = useTheme()
  const isDarkTheme = isDark ?? (resolvedTheme === 'dark')
  const [activeTab, setActiveTab] = useState<'xml' | 'monitor' | 'connect' | 'task' | 'drive'>('xml')
  const [modalTab, setModalTab] = useState<'xml' | 'monitor' | 'connect' | 'task' | 'drive' | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Trava a rolagem da página principal ao abrir a simulação no modal
  useEffect(() => {
    if (modalTab) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalTab])

  // Demo State 1: Guias Bi2B (DAS, ISS, FGTS)
  const [guiasData, setGuiasData] = useState([
    { id: '102542', title: 'DAS Simples Nacional', due: '20/08/2026', val: 'R$ 4.490,00', status: 'A Vencer', type: 'DAS', downloaded: false },
    { id: '102543', title: 'ISS Imposto Municipal', due: '15/08/2026', val: 'R$ 1.250,00', status: 'A Vencer', type: 'ISS', downloaded: false },
    { id: '102544', title: 'FGTS Digital Mensal', due: '07/08/2026', val: 'R$ 2.180,00', status: 'Pago', type: 'FGTS', downloaded: true },
  ])
  const handleDownloadGuia = (id: string) => {
    setGuiasData(prev => prev.map(g => g.id === id ? { ...g, downloaded: true } : g))
  }

  // Demo State 2: Equipe & Colaboradores
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'João', role: 'Gestor', email: 'joao@empresa.com.br', status: 'Ativo' },
    { id: 2, name: 'Maria', role: 'Colaborador', email: 'maria@empresa.com.br', status: 'Ativo' },
    { id: 3, name: 'Pedro', role: 'Colaborador', email: 'pedro@empresa.com.br', status: 'Pendente' },
  ])
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberEmail.trim()) return
    const nameFromEmail = newMemberEmail.split('@')[0].replace('.', ' ')
    const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
    setTeamMembers(prev => [
      ...prev,
      { id: Date.now(), name: capitalizedName, role: 'Colaborador', email: newMemberEmail, status: 'Pendente' }
    ])
    setNewMemberEmail('')
  }

  // Demo State 3: Chat Interativo no Bi2B Chamados (Máximo de 2 mensagens)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'support' | 'client'; text: string; time: string }>>([
    { sender: 'client', text: 'Olá! Preciso tirar uma dúvida sobre o vencimento da guia de impostos.', time: '14:20' },
    { sender: 'support', text: 'Boa tarde! As guias de DAS e ISS do mês atual já estão disponíveis com vencimentos calculados no painel.', time: '14:22' },
  ])
  const [newMsg, setNewMsg] = useState('')
  const [chatSentCount, setChatSentCount] = useState(0)

  // Auto-scroll do chat para a última mensagem enviada
  useEffect(() => {
    if (modalTab === 'connect') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, modalTab])

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMsg.trim() || chatSentCount >= 2) return
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setChatMessages((prev) => [...prev, { sender: 'client', text: newMsg, time: timeNow }])
    const typedMsg = newMsg
    setNewMsg('')
    setChatSentCount(prev => prev + 1)

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'support',
          text: `Perfeito! Recebi sua mensagem: "${typedMsg}". Nossa equipe fiscal já foi notificada e em breve enviará a resposta.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    }, 1200)
  }

  // Demo State 4: Tarefas Bi2B & Envios Mensais
  const [tasksData, setTasksData] = useState([
    { id: 1, title: 'Upload de Notas Fiscais (XML Entrada/Saída)', due: 'Vence em 15/08', status: 'Concluído', cat: 'Fiscal' },
    { id: 2, title: 'Envio de Extratos Bancários (Conciliação)', due: 'Vence em 10/08', status: 'Em Aberto', cat: 'Contábil' },
    { id: 3, title: 'Comprovantes e Despesas Operacionais', due: 'Vence em 20/08', status: 'Em Aberto', cat: 'Financeiro' },
  ])
  const handleCompleteTask = (id: number) => {
    setTasksData(prev => prev.map(t => t.id === id ? { ...t, status: 'Concluído' } : t))
  }

  // Demo State 5: Bi2B Drive (Máximo de 3 uploads)
  const [driveFiles, setDriveFiles] = useState([
    { id: 1, name: 'Balanço Patrimonial 2025.pdf', size: '2.4 MB', cat: 'Contábil' },
    { id: 2, name: 'Contrato Social Consolidado.pdf', size: '1.8 MB', cat: 'Societário' },
    { id: 3, name: 'Folha Pagamento Julho.xlsx', size: '950 KB', cat: 'RH / Trabalhista' },
    { id: 4, name: 'Comprovante Guia DAS 07-2025.pdf', size: '420 KB', cat: 'Fiscal' },
  ])
  const [driveSearch, setDriveSearch] = useState('')
  const [driveCategory, setDriveCategory] = useState<string>('Todas')
  const [uploadSimulatedCount, setUploadSimulatedCount] = useState(0)

  const handleSimulateUpload = () => {
    if (uploadSimulatedCount >= 3) return
    const sampleFiles = [
      { name: 'Relatorio_Faturamento_Mensal.pdf', size: '1.2 MB', cat: 'Fiscal' },
      { name: 'Comprovante_Pagamento_FGTS.pdf', size: '380 KB', cat: 'RH / Trabalhista' },
      { name: 'Alteracao_Contratual_2026.pdf', size: '2.1 MB', cat: 'Societário' },
    ]
    const randomFile = sampleFiles[uploadSimulatedCount % sampleFiles.length]
    setDriveFiles(prev => [{ id: Date.now(), ...randomFile }, ...prev])
    setUploadSimulatedCount(prev => prev + 1)
  }

  const filteredDriveFiles = driveFiles.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(driveSearch.toLowerCase()) || f.cat.toLowerCase().includes(driveSearch.toLowerCase())
    const matchesCategory = driveCategory === 'Todas' || f.cat.includes(driveCategory)
    return matchesSearch && matchesCategory
  })

  const modulesList = [
    {
      id: 'xml' as const,
      name: 'Guias Bi2B',
      icon: FileCode2,
      tagline: 'Consulta e Envio',
      desc: 'Painel visual de controle de impostos (DAS, ISS, FGTS) com aviso de datas limite.',
    },
    {
      id: 'monitor' as const,
      name: 'Equipe',
      icon: Shield,
      tagline: 'Gestão de Colaboradores',
      desc: 'Gerencie os colaboradores que têm acesso aos dados da sua empresa.',
    },
    {
      id: 'connect' as const,
      name: 'Bi2B Chamados',
      icon: MessageSquare,
      tagline: 'Suporte Contábil Realtime',
      desc: 'Comunicação direta com o suporte da Bi2B com histórico completo e status de chamados.',
    },
    {
      id: 'task' as const,
      name: 'Tarefas Bi2B',
      icon: Activity,
      tagline: 'Gestão de Guias e Prazos',
      desc: 'Campo para envio mensal de notas fiscais e documentos para verificação contábil e fiscal.',
    },
    {
      id: 'drive' as const,
      name: 'Bi2B Drive',
      icon: FolderOpen,
      tagline: 'Gestão de Arquivos',
      desc: 'Armazenamento organizado por pastas e upload de arquivos 100% digitais.',
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
        "py-28 border-b relative overflow-hidden transition-colors duration-300",
        isDarkTheme 
          ? "bg-[#040914] border-white/10 dark:bg-[#040914] dark:border-white/10" 
          : "bg-slate-50 border-slate-200 dark:bg-[#040914] dark:border-white/10"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção */}
        <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-md transition-colors duration-300",
            isDarkTheme 
              ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300 dark:border-cyan-400/30 dark:bg-cyan-500/10 dark:text-cyan-300" 
              : "border-[#0d6084]/20 bg-[#0d6084]/5 text-[#0d6084] dark:border-cyan-400/30 dark:bg-cyan-500/10 dark:text-cyan-300"
          )}>
            Ecossistema de Funcionalidades
          </span>
          <h2 className={cn(
            "font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance transition-colors duration-300",
            isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white"
          )}>
            Soluções conectadas em um único portal
          </h2>
          <p className={cn(
            "max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-balance transition-colors duration-300",
            isDarkTheme ? "text-slate-300/90 dark:text-slate-300/90" : "text-slate-600 dark:text-slate-300/90"
          )}>
            Tudo o que sua empresa e seu escritório contábil precisam para operar em sintonia, sem dispersão de dados ou ruído de comunicação.
          </p>
        </motion.div>

        {/* GRAFO DO ECOSSISTEMA INTERATIVO + APRESENTAÇÃO */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Grafo do Ecossistema Interativo */}
          <motion.div
            variants={scaleIn}
            className="lg:col-span-6 relative flex justify-center items-center"
          >
            {/* Outer rotating light circle */}
            <div className={cn("absolute inset-0 -m-8 border rounded-full animate-[spin_40s_linear_infinite]", isDarkTheme ? "border-cyan-500/10 dark:border-cyan-500/10" : "border-slate-200/60 dark:border-cyan-500/10")} />
            <div className={cn("absolute inset-0 -m-16 border border-dashed rounded-full animate-[spin_60s_linear_infinite]", isDarkTheme ? "border-cyan-500/10 dark:border-cyan-500/10" : "border-slate-200/50 dark:border-cyan-500/10")} />

            {/* Grafo do Ecossistema Interativo */}
            <div 
              className={cn(
                "relative w-full aspect-square max-w-[420px] rounded-3xl border p-6 backdrop-blur-2xl flex items-center justify-center hover-elevate shadow-2xl transition-all duration-300",
                isDarkTheme 
                  ? "bg-[#040914]/80 border-cyan-500/20 bi2b-border-glow shadow-cyan-950/30 dark:bg-[#040914]/80 dark:border-cyan-500/20" 
                  : "bg-white border-slate-200/90 shadow-2xl shadow-slate-200/60 dark:bg-[#040914]/80 dark:border-cyan-500/20"
              )}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                {/* Linhas Conectoras Centrais */}
                <motion.line x1="200" y1="200" x2="200" y2="70" stroke={isDarkTheme ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="310" y2="150" stroke={isDarkTheme ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="270" y2="300" stroke={isDarkTheme ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="130" y2="300" stroke={isDarkTheme ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="90" y2="150" stroke={isDarkTheme ? "rgba(126, 231, 255, 0.25)" : "rgba(13, 96, 132, 0.3)"} strokeWidth="1.5" strokeDasharray="5,5" />

                {/* Sinais luminosos em movimento */}
                <motion.circle r="4" fill={isDarkTheme ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 200], cy: [200, 70] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }} />
                <motion.circle r="4" fill={isDarkTheme ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 310], cy: [200, 150] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }} />
                <motion.circle r="4" fill={isDarkTheme ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 270], cy: [200, 300] }} transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }} />
                <motion.circle r="4" fill={isDarkTheme ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 130], cy: [200, 300] }} transition={{ repeat: Infinity, duration: 2.6, ease: 'linear' }} />
                <motion.circle r="4" fill={isDarkTheme ? "#7ee7ff" : "#0d6084"} animate={{ cx: [200, 90], cy: [200, 150] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }} />
              </svg>

              {/* Nó Central Bi2B */}
              <div 
                className={cn(
                  "absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border flex flex-col items-center justify-center shadow-xl z-10 p-2 cursor-pointer transition-transform hover:scale-110",
                  isDarkTheme ? "border-cyan-400/40 shadow-cyan-500/20" : "border-cyan-400/30 shadow-slate-300"
                )}
              >
                <img src={bpontoPng} alt="Bi2B Icon" className="h-10 w-10 object-contain animate-pulse" />
                <span className="text-[8px] font-bold tracking-wider uppercase text-cyan-300 mt-0.5">Bi2B</span>
              </div>

              {/* Satellite Node 1: Guias Bi2B */}
              <div 
                onClick={() => { setActiveTab('xml'); setModalTab('xml') }}
                className="absolute top-6 flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'xml'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDarkTheme ? "bg-[#08101d] border-cyan-500/20 text-cyan-400 dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084] dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400")
                  )}
                >
                  <FileCode2 className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'xml' ? "text-cyan-400" : (isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-700 dark:text-slate-300"))}>Guias Bi2B</span>
              </div>

              {/* Satellite Node 2: Equipe */}
              <div 
                onClick={() => { setActiveTab('monitor'); setModalTab('monitor') }}
                className="absolute right-6 top-[28%] flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'monitor'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDarkTheme ? "bg-[#08101d] border-cyan-500/20 text-cyan-400 dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084] dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400")
                  )}
                >
                  <Shield className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'monitor' ? "text-cyan-400" : (isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-700 dark:text-slate-300"))}>Equipe</span>
              </div>

              {/* Satellite Node 3: Bi2B Chamados */}
              <div 
                onClick={() => { setActiveTab('connect'); setModalTab('connect') }}
                className="absolute right-12 bottom-8 flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'connect'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDarkTheme ? "bg-[#08101d] border-cyan-500/20 text-cyan-400 dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084] dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400")
                  )}
                >
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'connect' ? "text-cyan-400" : (isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-700 dark:text-slate-300"))}>Bi2B Chamados</span>
              </div>

              {/* Satellite Node 4: Tarefas Bi2B */}
              <div 
                onClick={() => { setActiveTab('task'); setModalTab('task') }}
                className="absolute left-12 bottom-8 flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'task'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDarkTheme ? "bg-[#08101d] border-cyan-500/20 text-cyan-400 dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084] dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400")
                  )}
                >
                  <Activity className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'task' ? "text-cyan-400" : (isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-700 dark:text-slate-300"))}>Tarefas Bi2B</span>
              </div>

              {/* Satellite Node 5: Bi2B Drive */}
              <div 
                onClick={() => { setActiveTab('drive'); setModalTab('drive') }}
                className="absolute left-6 top-[28%] flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-lg border flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110",
                    activeTab === 'drive'
                      ? "bg-[#0d6084] border-cyan-400 text-white shadow-cyan-500/30"
                      : (isDarkTheme ? "bg-[#08101d] border-cyan-500/20 text-cyan-400 dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400" : "bg-slate-50 border-slate-200 text-[#0d6084] dark:bg-[#08101d] dark:border-cyan-500/20 dark:text-cyan-400")
                  )}
                >
                  <FolderOpen className="h-5 w-5" />
                </div>
                <span className={cn("text-[10px] font-bold transition-colors group-hover:text-cyan-400", activeTab === 'drive' ? "text-cyan-400" : (isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-700 dark:text-slate-300"))}>Bi2B Drive</span>
              </div>
            </div>
          </motion.div>

          {/* Cards Conectados do Ecossistema */}
          <div className="lg:col-span-6 space-y-4">
            {modulesList.map((m) => {
              const isActive = activeTab === m.id
              return (
                <motion.div
                  key={m.id}
                  onClick={() => { setActiveTab(m.id); setModalTab(m.id) }}
                  className={cn(
                    "rounded-2xl border p-5 transition-all duration-300 cursor-pointer flex items-start gap-4 hover:-translate-y-0.5 relative overflow-hidden backdrop-blur-xl shadow-lg group",
                    isActive
                      ? (isDarkTheme
                          ? "bg-[#08152b] border-cyan-400 shadow-[0_8px_30px_rgba(13,96,132,0.3)] dark:bg-[#08152b] dark:border-cyan-400"
                          : "bg-white border-[#0d6084] shadow-xl shadow-slate-200/60 dark:bg-[#08152b] dark:border-cyan-400")
                      : (isDarkTheme
                          ? "bg-[#040914]/70 border-white/10 hover:border-cyan-400/30 dark:bg-[#040914]/70 dark:border-white/10"
                          : "bg-white/80 border-slate-200/80 hover:border-slate-300 dark:bg-[#040914]/70 dark:border-white/10")
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-[#0d6084]" />
                  )}

                  <div className={cn(
                    "w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300",
                    isActive
                      ? "bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border-cyan-400/40 text-cyan-200 shadow-md"
                      : (isDarkTheme ? "bg-white/5 border-white/10 text-cyan-400 dark:bg-white/5 dark:border-white/10 dark:text-cyan-400" : "bg-cyan-50 border-cyan-200 text-[#0d6084] dark:bg-white/5 dark:border-white/10 dark:text-cyan-400")
                  )}>
                    <m.icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={cn("font-bold text-base transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white")}>
                        {m.name}
                      </h3>
                      <span className={cn(
                        "text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 transition-colors duration-300",
                        isActive
                          ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                          : (isDarkTheme ? "bg-white/5 border-white/10 text-slate-400 dark:bg-white/5 dark:border-white/10 dark:text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-400")
                      )}>
                        {m.tagline}
                      </span>
                    </div>

                    <p className={cn("text-xs leading-relaxed mt-1.5 transition-colors duration-300", isDarkTheme ? "text-slate-300/90 dark:text-slate-300/90" : "text-slate-600 dark:text-slate-300/90")}>
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

        {/* DEMONSTRAÇÃO INTERATIVA EM MODAL AO CLICAR */}
        <AnimatePresence>
          {modalTab && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalTab(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Modal Dialog Container */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={cn(
                  "relative w-full max-w-5xl rounded-3xl border p-6 sm:p-10 backdrop-blur-2xl shadow-2xl z-10 transition-colors duration-300 max-h-[90vh] overflow-y-auto",
                  isDarkTheme 
                    ? "bg-[#040914] border-cyan-500/30 text-white shadow-cyan-950/50 dark:bg-[#040914] dark:border-cyan-500/30" 
                    : "bg-white border-slate-200 text-slate-900 shadow-2xl dark:bg-[#040914] dark:border-cyan-500/30"
                )}
              >
                {/* Botão Fechar Modal */}
                <button
                  onClick={() => setModalTab(null)}
                  className={cn(
                    "absolute top-5 right-5 rounded-full p-2 border transition-all duration-200 cursor-pointer hover:scale-110 z-20",
                    isDarkTheme
                      ? "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10 hover:text-white"
                      : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  )}
                  title="Fechar Demonstração"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Seletor de Abas no Topo do Modal */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/10 pr-10">
                  {modulesList.map((m) => {
                    const isSelected = modalTab === m.id
                    return (
                      <button
                        key={m.id}
                        onClick={() => { setActiveTab(m.id); setModalTab(m.id) }}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer",
                          isSelected
                            ? "bg-[#0d6084] border-cyan-400 text-white shadow-md shadow-cyan-500/30"
                            : (isDarkTheme ? "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200")
                        )}
                      >
                        <m.icon className="w-4 h-4" />
                        <span>{m.name}</span>
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence mode="wait">

                  {/* 1. GUIAS BI2B (DAS, ISS, FGTS) */}
                  {modalTab === 'xml' && (
                    <motion.div
                      key="xml"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid md:grid-cols-12 gap-8 items-center w-full"
                    >
                      <div className="md:col-span-6 space-y-6 text-left">
                        <div 
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300",
                            isDarkTheme ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400 dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084] dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400"
                          )}
                        >
                          <FileCode2 className="h-6 w-6" />
                        </div>
                        <h3 className={cn("font-heading text-2xl font-bold transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white")}>Guias Bi2B</h3>
                        <p className={cn("text-sm leading-relaxed transition-colors duration-300", isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-600 dark:text-slate-300")}>
                          Painel visual de controle de impostos (DAS, ISS, FGTS) com aviso de datas limite. Acompanhe vencimentos em tempo real, efetue download das guias em PDF e anexe comprovantes de pagamento de forma centralizada.
                        </p>
                        <ul className={cn("space-y-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300", isDarkTheme ? "text-slate-400 dark:text-slate-400" : "text-slate-600 dark:text-slate-400")}>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Visualização clara de datas de vencimento de tributos
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Download instantâneo de guias em PDF
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Anexo e confirmação de comprovantes de pagamento
                          </li>
                        </ul>
                      </div>
                      
                      {/* Prévia Guias Bi2B */}
                      <div className="md:col-span-6">
                        <div className={cn("rounded-2xl border p-4 shadow-2xl text-[11px] text-left font-mono transition-colors duration-300", isDarkTheme ? "bg-[#050b14]/90 border-cyan-500/10 dark:bg-[#050b14]/90 dark:border-cyan-500/10" : "bg-slate-50 border-slate-200 dark:bg-[#050b14]/90 dark:border-cyan-500/10")}>
                          <div className={cn("flex items-center justify-between border-b pb-2.5 mb-3 transition-colors duration-300", isDarkTheme ? "border-cyan-950 dark:border-cyan-950" : "border-slate-200 dark:border-cyan-950")}>
                            <div>
                              <span className={cn("font-bold block transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-800 dark:text-white")}>Minhas Guias Tributárias</span>
                              <span className="text-[9px] text-slate-500 font-normal">Clique no botão para simular o download</span>
                            </div>
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">Sincronizado</span>
                          </div>
                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {guiasData.map((xml) => (
                              <div 
                                key={xml.id} 
                                className={cn(
                                  "flex justify-between items-center border rounded-xl p-3 transition-all duration-200",
                                  isDarkTheme ? "bg-[#08101d] border-cyan-500/10 dark:bg-[#08101d] dark:border-cyan-500/10" : "bg-white border-slate-200 dark:bg-[#08101d] dark:border-cyan-500/10"
                                )}
                              >
                                <div>
                                  <div className={cn("font-bold flex items-center gap-1.5 transition-colors duration-300", isDarkTheme ? "text-slate-200 dark:text-slate-200" : "text-slate-800 dark:text-slate-200")}>
                                    <span>{xml.title}</span>
                                    <span className="text-[8px] px-1.5 py-0.2 rounded font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">#{xml.id}</span>
                                  </div>
                                  <div className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-2">
                                    <span>Vencimento: <strong className="text-amber-400 font-semibold">{xml.due}</strong></span>
                                  </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                  <div className={cn("font-bold text-xs transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white")}>{xml.val}</div>
                                  <button
                                    onClick={() => handleDownloadGuia(xml.id)}
                                    className={cn(
                                      "text-[9px] px-2 py-1 rounded flex items-center gap-1 font-bold transition-all cursor-pointer border",
                                      xml.downloaded
                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                        : "bg-[#0d6084] hover:bg-[#0b5474] text-white border-cyan-400/30"
                                    )}
                                  >
                                    {xml.downloaded ? (
                                      <>
                                        <Check className="w-2.5 h-2.5" /> Baixado PDF
                                      </>
                                    ) : (
                                      <>
                                        <Download className="w-2.5 h-2.5" /> Baixar PDF
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 2. EQUIPE & GESTÃO DE COLABORADORES */}
                  {modalTab === 'monitor' && (
                    <motion.div
                      key="monitor"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid md:grid-cols-12 gap-8 items-center w-full"
                    >
                      <div className="md:col-span-5 space-y-6 text-left">
                        <div 
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300",
                            isDarkTheme ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400 dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084] dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400"
                          )}
                        >
                          <Shield className="h-6 w-6" />
                        </div>
                        <h3 className={cn("font-heading text-2xl font-bold transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white")}>Equipe & Permissões</h3>
                        <p className={cn("text-sm leading-relaxed transition-colors duration-300", isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-600 dark:text-slate-300")}>
                          Gerencie os colaboradores que têm acesso aos dados da sua empresa. Mantenha controle total da segurança do portal.
                        </p>
                        <ul className={cn("space-y-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300", isDarkTheme ? "text-slate-400 dark:text-slate-400" : "text-slate-600 dark:text-slate-400")}>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Controle de perfis de acesso
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Solicitação rápida de colaboradores via cadastro.
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Histórico de acessos e membros da empresa
                          </li>
                        </ul>
                      </div>

                      {/* Prévia Gestão de Equipe Interativa */}
                      <div className="md:col-span-7">
                        <div className={cn("rounded-2xl border p-4 shadow-2xl text-[11px] text-left font-sans transition-colors duration-300 space-y-3", isDarkTheme ? "bg-[#050b14]/90 border-cyan-500/10 dark:bg-[#050b14]/90 dark:border-cyan-500/10" : "bg-slate-50 border-slate-200 dark:bg-[#050b14]/90 dark:border-cyan-500/10")}>
                          <div className={cn("flex items-center justify-between border-b pb-2.5 transition-colors duration-300", isDarkTheme ? "border-cyan-950 dark:border-cyan-950" : "border-slate-200 dark:border-cyan-950")}>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-cyan-400" />
                              <span className={cn("font-bold transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-800 dark:text-white")}>Colaboradores da Empresa</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">{teamMembers.length} membros</span>
                          </div>

                          {/* Form de Convite Simulado sem select de cargo */}
                          <form onSubmit={handleInviteMember} className="flex gap-2">
                            <input
                              type="email"
                              placeholder="Convidar colaborador por e-mail..."
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                              className={cn("flex-1 border rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none transition-colors duration-300 font-mono", isDarkTheme ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#0d6084]/50")}
                            />
                            <button
                              type="submit"
                              className="bg-[#0d6084] hover:bg-[#0b5474] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-cyan-500/20 flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <UserPlus className="w-3 h-3" /> Convidar
                            </button>
                          </form>

                          {/* Lista de Membros */}
                          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                            {teamMembers.map((member) => (
                              <div
                                key={member.id}
                                className={cn(
                                  "flex justify-between items-center border rounded-xl p-2.5 transition-all duration-200",
                                  isDarkTheme ? "bg-[#08101d] border-cyan-500/5 dark:bg-[#08101d] dark:border-cyan-500/5" : "bg-white border-slate-200 dark:bg-[#08101d] dark:border-cyan-500/5"
                                )}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0d6084] to-[#0a4a62] text-cyan-200 flex items-center justify-center font-bold text-xs border border-cyan-400/30">
                                    {member.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className={cn("font-bold text-[11px]", isDarkTheme ? "text-slate-200" : "text-slate-800")}>{member.name}</div>
                                    <div className="text-[9px] text-slate-500 font-mono">{member.email} • <span className="text-cyan-400 font-semibold">{member.role}</span></div>
                                  </div>
                                </div>
                                <span className={cn(
                                  "text-[9px] px-2 py-0.5 rounded font-bold border font-mono",
                                  member.status === 'Ativo'
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                )}>
                                  {member.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 3. BI2B CHAMADOS (CHAT SUPORTE REALTIME) */}
                  {modalTab === 'connect' && (
                    <motion.div
                      key="connect"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid md:grid-cols-12 gap-8 items-center w-full"
                    >
                      <div className="md:col-span-5 space-y-6 text-left">
                        <div 
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300",
                            isDarkTheme ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400 dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084] dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400"
                          )}
                        >
                          <MessageSquare className="h-6 w-6" />
                        </div>
                        <h3 className={cn("font-heading text-2xl font-bold transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white")}>Bi2B Chamados</h3>
                        <p className={cn("text-sm leading-relaxed transition-colors duration-300", isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-600 dark:text-slate-300")}>
                          Comunicação direta com o suporte da Bi2B com histórico completo e status de chamados. Esclareça dúvidas fiscais, receba orientações e acompanhe o andamento dos seus tickets.
                        </p>
                        <div className={cn("border rounded-xl p-3 text-[10px] italic flex gap-2 items-center transition-colors duration-300", isDarkTheme ? "bg-cyan-950/20 border-cyan-500/10 text-cyan-300 dark:bg-cyan-950/20 dark:border-cyan-500/10 dark:text-cyan-300" : "bg-cyan-50 border-cyan-200/50 text-[#0d6084] dark:bg-cyan-950/20 dark:border-cyan-500/10 dark:text-cyan-300")}>
                          <Sparkles className="w-4 h-4 shrink-0 text-cyan-500 animate-pulse" />
                          Experimente enviar uma mensagem no chat interativo ao lado!
                        </div>
                      </div>

                      {/* Chat Interativo Real */}
                      <div className="md:col-span-7">
                        <div className={cn("rounded-2xl border p-4 shadow-2xl flex flex-col gap-3 h-[280px] justify-between transition-colors duration-300", isDarkTheme ? "bg-[#050b14]/90 border-cyan-500/10 dark:bg-[#050b14]/90 dark:border-cyan-500/10" : "bg-slate-50 border-slate-200 dark:bg-[#050b14]/90 dark:border-cyan-500/10")}>
                          {/* Topo do Chat */}
                          <div className={cn("flex items-center justify-between border-b pb-2 text-xs transition-colors duration-300", isDarkTheme ? "border-cyan-950 dark:border-cyan-950" : "border-slate-200 dark:border-cyan-950")}>
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                              <span className={cn("font-bold transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-800 dark:text-white")}>Suporte Contábil • Setor Fiscal</span>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono">Chamado #1048</span>
                          </div>

                          {/* Lista de Mensagens */}
                          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-[11px] flex flex-col">
                            {chatMessages.map((msg, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "max-w-[85%] rounded-2xl p-2.5 flex flex-col gap-0.5 transition-colors duration-300 font-sans",
                                  msg.sender === 'client'
                                    ? (isDarkTheme 
                                        ? "bg-cyan-950/60 border border-cyan-500/10 text-slate-100 self-end rounded-tr-none dark:bg-cyan-950/60 dark:border-cyan-500/10 dark:text-slate-100" 
                                        : "bg-cyan-50 border border-cyan-200/60 text-slate-800 self-end rounded-tr-none dark:bg-cyan-950/60 dark:border-cyan-500/10 dark:text-slate-100")
                                    : (isDarkTheme 
                                        ? "bg-slate-900 border border-slate-800 text-slate-300 self-start rounded-tl-none dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300" 
                                        : "bg-slate-200/60 border border-slate-300/40 text-slate-700 self-start rounded-tl-none dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300")
                                )}
                              >
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className="text-[8px] text-slate-500 text-right self-end mt-0.5 font-mono">{msg.time}</span>
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>

                          {/* Input do Chat */}
                          <form onSubmit={handleSendChat} className={cn("flex gap-2 border-t pt-2.5 transition-colors duration-300", isDarkTheme ? "border-cyan-950 dark:border-cyan-950" : "border-slate-200 dark:border-cyan-950")}>
                            <input
                              type="text"
                              placeholder="Digite sua mensagem para o suporte..."
                              value={newMsg}
                              disabled={chatSentCount >= 2}
                              onChange={(e) => setNewMsg(e.target.value)}
                              className={cn(
                                "flex-1 border rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors duration-300",
                                chatSentCount >= 2 ? "opacity-60 cursor-not-allowed" : "",
                                isDarkTheme ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500/50 dark:bg-slate-950 dark:border-slate-800 dark:text-white" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#0d6084]/50 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                              )}
                            />
                            <button
                              type="submit"
                              disabled={chatSentCount >= 2}
                              className={cn(
                                "rounded-lg px-3 flex items-center justify-center border transition-all",
                                chatSentCount >= 2
                                  ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                                  : "bg-[#0d6084] hover:bg-[#0b5474] text-white border-cyan-500/20 cursor-pointer"
                              )}
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 4. TAREFAS BI2B (GESTAO DE GUIAS, ENVIOS E PRAZOS) */}
                  {modalTab === 'task' && (
                    <motion.div
                      key="task"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid md:grid-cols-12 gap-8 items-center w-full"
                    >
                      <div className="md:col-span-6 space-y-6 text-left">
                        <div 
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300",
                            isDarkTheme ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400 dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084] dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400"
                          )}
                        >
                          <Activity className="h-6 w-6" />
                        </div>
                        <h3 className={cn("font-heading text-2xl font-bold transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white")}>Tarefas Bi2B</h3>
                        <p className={cn("text-sm leading-relaxed transition-colors duration-300", isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-600 dark:text-slate-300")}>
                          Campo para envio mensal de notas fiscais e documentos para verificação contábil e fiscal. Acompanhe os prazos limite e faça o envio de movimentações sem complicação.
                        </p>
                        <ul className={cn("space-y-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300", isDarkTheme ? "text-slate-400 dark:text-slate-400" : "text-slate-600 dark:text-slate-400")}>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Envio mensal de notas fiscais (XML) e extratos
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Acompanhamento em tempo real de status e prazos
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Confirmação de recebimento para o setor fiscal
                          </li>
                        </ul>
                      </div>

                      {/* Prévia Tarefas Bi2B */}
                      <div className="md:col-span-6">
                        <div className={cn("rounded-2xl border p-4 shadow-2xl text-[11px] text-left font-mono transition-colors duration-300 space-y-3", isDarkTheme ? "bg-[#050b14]/90 border-cyan-500/10 dark:bg-[#050b14]/90 dark:border-cyan-500/10" : "bg-slate-50 border-slate-200 dark:bg-[#050b14]/90 dark:border-cyan-500/10")}>
                          <div className={cn("flex items-center justify-between border-b pb-2.5 transition-colors duration-300", isDarkTheme ? "border-cyan-950 dark:border-cyan-950" : "border-slate-200 dark:border-cyan-950")}>
                            <div>
                              <span className={cn("font-bold block transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-800 dark:text-white")}>Envios e Solicitações Mensais</span>
                              <span className="text-[9px] text-slate-500 font-normal">Clique para simular o envio do documento</span>
                            </div>
                            <span className="text-[9px] text-cyan-400 font-mono font-bold">Agosto 2026</span>
                          </div>
                          <div className="space-y-2">
                            {tasksData.map((t) => (
                              <div 
                                key={t.id} 
                                className={cn(
                                  "flex justify-between items-center border rounded-xl p-3 transition-all duration-200",
                                  isDarkTheme ? "bg-[#08101d] border-cyan-500/5 dark:bg-[#08101d] dark:border-cyan-500/5" : "bg-white border-slate-200 dark:bg-[#08101d] dark:border-cyan-500/5"
                                )}
                              >
                                <div>
                                  <div className={cn("font-bold text-[11px] transition-colors duration-300", isDarkTheme ? "text-slate-200 dark:text-slate-200" : "text-slate-700 dark:text-slate-200")}>{t.title}</div>
                                  <div className="text-[9px] text-slate-500 flex items-center gap-1.5 mt-1 font-mono">
                                    <Clock className="w-2.5 h-2.5 text-cyan-400" />
                                    <span>{t.due}</span>
                                    <span>•</span>
                                    <span className="text-slate-400">{t.cat}</span>
                                  </div>
                                </div>
                                <div>
                                  {t.status === 'Concluído' ? (
                                    <span className="text-[9px] px-2 py-1 rounded font-bold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                                      <CheckCircle className="w-2.5 h-2.5" /> Enviado
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleCompleteTask(t.id)}
                                      className="text-[9px] px-2 py-1 rounded font-bold border bg-cyan-500/10 text-cyan-300 hover:bg-[#0d6084] hover:text-white border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                      <Plus className="w-2.5 h-2.5" /> Enviar Arquivo
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 5. BI2B DRIVE (GESTAO DE ARQUIVOS DIGITAIS) */}
                  {modalTab === 'drive' && (
                    <motion.div
                      key="drive"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid md:grid-cols-12 gap-8 items-center w-full"
                    >
                      <div className="md:col-span-5 space-y-6 text-left">
                        <div 
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300",
                            isDarkTheme ? "bg-cyan-950/50 border-cyan-500/20 text-cyan-400 dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400" : "bg-cyan-50 border-cyan-200/60 text-[#0d6084] dark:bg-cyan-950/50 dark:border-cyan-500/20 dark:text-cyan-400"
                          )}
                        >
                          <FolderOpen className="h-6 w-6" />
                        </div>
                        <h3 className={cn("font-heading text-2xl font-bold transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-900 dark:text-white")}>Bi2B Drive</h3>
                        <p className={cn("text-sm leading-relaxed transition-colors duration-300", isDarkTheme ? "text-slate-300 dark:text-slate-300" : "text-slate-600 dark:text-slate-300")}>
                          Armazenamento organizado por pastas e upload de arquivos 100% digitais. Estruture documentos por categorias (Contábil, Fiscal, Societário, RH) e acesse em qualquer dispositivo.
                        </p>
                        <ul className={cn("space-y-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300", isDarkTheme ? "text-slate-400 dark:text-slate-400" : "text-slate-600 dark:text-slate-400")}>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Busca por nome ou categoria
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Organização em pastas 100% digitais
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                            Upload rápido e download seguro em nuvem
                          </li>
                        </ul>
                      </div>

                      {/* Prévia Bi2B Drive Interativa */}
                      <div className="md:col-span-7">
                        <div className={cn("rounded-2xl border p-4 shadow-2xl text-[11px] text-left font-mono transition-colors duration-300 space-y-3", isDarkTheme ? "bg-[#050b14]/90 border-cyan-500/10 dark:bg-[#050b14]/90 dark:border-cyan-500/10" : "bg-slate-50 border-slate-200 dark:bg-[#050b14]/90 dark:border-cyan-500/10")}>
                          <div className={cn("flex items-center justify-between border-b pb-2.5 transition-colors duration-300", isDarkTheme ? "border-cyan-950 dark:border-cyan-950" : "border-slate-200 dark:border-cyan-950")}>
                            <span className={cn("font-bold transition-colors duration-300", isDarkTheme ? "text-white dark:text-white" : "text-slate-800 dark:text-white")}>Arquivos no Bi2B Drive</span>
                            <button
                              onClick={handleSimulateUpload}
                              disabled={uploadSimulatedCount >= 3}
                              className={cn(
                                "text-[9px] px-2.5 py-1 rounded font-bold flex items-center gap-1 border transition-all font-mono",
                                uploadSimulatedCount >= 3
                                  ? "bg-slate-800/80 text-slate-500 border-slate-700 cursor-not-allowed opacity-60"
                                  : "bg-[#0d6084] hover:bg-[#0b5474] text-white border-cyan-400/30 cursor-pointer"
                              )}
                            >
                              <Plus className="w-2.5 h-2.5" /> Simular Upload
                            </button>
                          </div>

                          {/* Campo de Busca e Categorias */}
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="relative flex-1 min-w-[140px]">
                              <Search className="w-3 h-3 absolute left-2.5 top-2 text-slate-500" />
                              <input
                                type="text"
                                placeholder="Buscar arquivo..."
                                value={driveSearch}
                                onChange={(e) => setDriveSearch(e.target.value)}
                                className={cn("w-full border rounded-lg pl-7 pr-2 py-1 text-[10px] focus:outline-none transition-colors duration-300", isDarkTheme ? "bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-500/50" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#0d6084]/50")}
                              />
                            </div>
                            <div className="flex items-center gap-1 overflow-x-auto text-[9px]">
                              {['Todas', 'Contábil', 'Fiscal', 'RH'].map(cat => (
                                <button
                                  key={cat}
                                  onClick={() => setDriveCategory(cat)}
                                  className={cn(
                                    "px-2 py-0.5 rounded border transition-colors cursor-pointer shrink-0 font-bold",
                                    driveCategory === cat
                                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                                      : (isDarkTheme ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900")
                                  )}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Lista de Arquivos */}
                          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                            {filteredDriveFiles.length === 0 ? (
                              <div className="text-center py-4 text-slate-500 text-[10px]">
                                Nenhum arquivo encontrado nesta busca.
                              </div>
                            ) : (
                              filteredDriveFiles.map((f) => (
                                <div 
                                  key={f.id} 
                                  className={cn(
                                    "flex items-center gap-3 border rounded-xl p-2.5 transition-all duration-200",
                                    isDarkTheme ? "bg-[#08101d] border-cyan-500/5 dark:bg-[#08101d] dark:border-cyan-500/5" : "bg-white border-slate-200 dark:bg-[#08101d] dark:border-cyan-500/5"
                                  )}
                                >
                                  <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className={cn("font-bold truncate text-[10px] transition-colors duration-300", isDarkTheme ? "text-slate-200 dark:text-slate-200" : "text-slate-700 dark:text-slate-200")}>{f.name}</div>
                                    <div className="text-[8px] text-slate-500 mt-0.5">{f.size} • <span className="text-cyan-400">{f.cat}</span></div>
                                  </div>
                                  <span className="text-[9px] text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-0.5 font-bold shrink-0">
                                    <Download className="w-2.5 h-2.5" /> Baixar
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </motion.section>
  )
}

