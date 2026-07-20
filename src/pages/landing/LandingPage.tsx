import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants'
import {
  Hexagon,
  ArrowRight,
  Shield,
  FileText,
  MessageSquare,
  FolderOpen,
  FileCode2,
  Lock,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Send,
  Menu,
  X,
  Star,
  Globe,
  Sun,
  Moon,
  Database,
  Terminal,
  Activity
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import logoPng from '@/assets/logo.png'
import bpontoPng from '@/assets/bponto.png'

// ===== Variantes de Animação =====
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
} as const

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
} as const

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
} as const

// ===== Dados de FAQ =====
const faqData = [
  { q: 'Como funciona o Portal do Cliente?', a: 'O Portal é uma plataforma digital que conecta sua empresa e a contabilidade em tempo real. Pelo ecossistema integrado (XMLHub, MonitorHub, ConnectHub, TaskHub e DriveHub), todos os dados, notas e certidões são gerenciados de forma automatizada.' },
  { q: 'O que são os módulos XMLHub e MonitorHub?', a: 'O XMLHub monitora a SEFAZ em tempo real para capturar, validar e baixar notas fiscais. O MonitorHub realiza varredura automática de certidões e obrigações, alertando antes que qualquer prazo expire.' },
  { q: 'Meus dados estão isolados no banco de dados?', a: 'Sim! Utilizamos arquitetura de banco de dados PostgreSQL com Row Level Security (RLS) avançado. Seus dados são totalmente isolados lógica e fisicamente de outras empresas.' },
  { q: 'Posso configurar acessos diferentes para minha equipe?', a: 'Sim. O usuário Cliente Master pode convidar até 5 membros adicionais para sua empresa no plano pró e definir permissões modulares de forma individualizada.' },
  { q: 'O Portal do Cliente é compatível com celulares?', a: 'Sim. Nossa interface é 100% responsiva (Mobile-First) e adaptada para funcionar perfeitamente em smartphones, tablets e computadores.' },
]

// ===== Parceiros Fictícios =====
const partners = [
  { name: 'Sólida Auditoria' },
  { name: 'Nexum Consultores' },
  { name: 'Vanguarda Holdings' },
  { name: 'Prime Capital' },
  { name: 'Scale Finanças' },
  { name: 'Diretiva Contábil' },
]

// ===== Depoimentos =====
const testimonials = [
  {
    name: 'Roberto Dutra',
    role: 'Diretor Financeiro, Vanguarda Tech',
    text: 'A integração do XMLHub transformou nossa rotina contábil. Economizamos dezenas de horas mensais que antes eram gastas baixando notas manualmente da SEFAZ.',
    rating: 5,
  },
  {
    name: 'Karina de Souza',
    role: 'Sócia-Administradora, Clinica Saúde Prime',
    text: 'O MonitorHub é espetacular. Receber alertas de vencimento de certidões antes mesmo da contabilidade ligar nos poupou multas caras este ano.',
    rating: 5,
  },
  {
    name: 'Leonardo Costa',
    role: 'CEO, Logix Logística',
    text: 'O isolamento de dados via RLS do Supabase nos deu a tranquilidade de segurança exigida por nossos investidores para migrar para a plataforma.',
    rating: 5,
  },
]

export function LandingPage() {
  const navigate = useNavigate()
  const { resolvedTheme, toggleTheme } = useTheme()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'monitor' | 'connect' | 'xml' | 'task' | 'drive'>('monitor')
  const { scrollYProgress } = useScroll()
  const headerBg = useTransform(scrollYProgress, [0, 0.05], [0, 1])
  const [headerOpacity, setHeaderOpacity] = useState(0)

  // Form states
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadCnpj, setLeadCnpj] = useState('')

  useEffect(() => {
    const unsubscribe = headerBg.on('change', (v: number) => setHeaderOpacity(v))
    return unsubscribe
  }, [headerBg])

  const navItems = [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Ecossistema', href: '#ecossistema' },
    { label: 'Soluções', href: '#solucoes' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'FAQ', href: '#faq' },
  ]

  const scrollTo = (id: string) => {
    setMobileMenu(false)
    const el = document.querySelector(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadName || !leadEmail || !leadPhone) {
      toast.error('Preencha os campos obrigatórios!')
      return
    }
    toast.success('Demonstração solicitada! Em breve entraremos em contato via WhatsApp.')
    setLeadName('')
    setLeadEmail('')
    setLeadPhone('')
    setLeadCnpj('')
  }

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Background Glows (Bi2B Identity) */}
      <div className="absolute top-0 left-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#0d6084]/15 blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-[20%] right-1/4 h-[500px] w-[500px] rounded-full bg-[#0a4a62]/20 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[20%] left-1/3 h-[700px] w-[700px] rounded-full bg-[#0d6084]/10 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* ===== HEADER / NAVBAR ===== */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: headerOpacity > 0.5 ? 'rgba(5, 11, 20, 0.85)' : 'transparent',
          backdropFilter: headerOpacity > 0.5 ? 'blur(16px)' : 'none',
          borderBottom: headerOpacity > 0.5 ? '1px solid rgba(126, 231, 255, 0.08)' : 'none',
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            <img src={logoPng} alt={APP_NAME} className="h-9 w-auto object-contain" />
          </div>

          {/* Navegação Centrada Estilo BI2B */}
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-cyan-300 transition-colors"
              title="Alternar Modo de Cores"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="hidden rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:bg-white/5 sm:block"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="hidden rounded-xl bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-[#0d6084]/20 hover:shadow-[#0d6084]/45 transition-all hover:brightness-110 sm:block border border-cyan-500/20"
            >
              Acessar Portal
            </button>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/5 lg:hidden"
            >
              {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-cyan-950 bg-[#050b14]/95 backdrop-blur-xl lg:hidden"
            >
              <div className="space-y-1.5 p-6">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollTo(item.href)}
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.2em] text-slate-300 hover:bg-white/5 hover:text-cyan-300 transition-all"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 flex flex-col gap-2.5">
                  <button
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="w-full rounded-xl border border-cyan-800/40 py-3 text-center text-sm font-bold uppercase tracking-[0.15em] text-slate-300"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="w-full rounded-xl bg-gradient-to-r from-[#0d6084] to-[#0a4a62] py-3 text-center text-sm font-bold uppercase tracking-[0.15em] text-white"
                  >
                    Acessar Portal
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section id="inicio" className="relative min-h-screen flex items-center pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Coluna de Texto (Esquerda) */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-7 space-y-8 text-left"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300"
            >
              <Zap className="h-3.5 w-3.5" />
              Portal do Cliente & Automatização Contábil
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              O ecossistema contábil <br />
              <span className="gradient-bi2b-text font-black">inteligente e conectado</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-xl text-base sm:text-lg text-slate-400 leading-relaxed"
            >
              Unificamos a sua empresa à contabilidade em uma única jornada digital sem ruídos. XMLs automáticos da SEFAZ, obrigações monitoradas, guarda de documentos e suporte ágil.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#0d6084] to-[#0a4a62] px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-[#0d6084]/20 hover:shadow-[#0d6084]/45 transition-all border border-cyan-500/20"
              >
                Ver na Prática
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollTo('#contato')}
                className="flex items-center justify-center gap-2 rounded-xl border border-cyan-800/40 bg-[#050b14]/50 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Solicitar Demonstração
              </button>
            </motion.div>
          </motion.div>

          {/* Coluna da Visualização Interativa do Ecossistema (Direita) */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Outer rotating light circle */}
            <div className="absolute inset-0 -m-8 border border-cyan-500/5 rounded-full animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-0 -m-16 border border-cyan-500/5 border-dashed rounded-full animate-[spin_60s_linear_infinite]" />

            {/* Grafo do Ecossistema Interativo (Modelo Hub de Rede Bi2B) */}
            <div className="relative w-full aspect-square max-w-[380px] bg-slate-950/40 rounded-3xl border border-cyan-500/10 p-6 backdrop-blur-sm bi2b-border-glow flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                {/* Central lines */}
                <motion.line x1="200" y1="200" x2="200" y2="70" stroke="rgba(126, 231, 255, 0.2)" strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="310" y2="150" stroke="rgba(126, 231, 255, 0.2)" strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="270" y2="300" stroke="rgba(126, 231, 255, 0.2)" strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="130" y2="300" stroke="rgba(126, 231, 255, 0.2)" strokeWidth="1.5" strokeDasharray="5,5" />
                <motion.line x1="200" y1="200" x2="90" y2="150" stroke="rgba(126, 231, 255, 0.2)" strokeWidth="1.5" strokeDasharray="5,5" />

                {/* Pulsing signal on lines */}
                <motion.circle r="4" fill="#7ee7ff" animate={{ cx: [200, 200], cy: [200, 70] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }} />
                <motion.circle r="4" fill="#7ee7ff" animate={{ cx: [200, 310], cy: [200, 150] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} />
                <motion.circle r="4" fill="#7ee7ff" animate={{ cx: [200, 270], cy: [200, 300] }} transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }} />
              </svg>

              {/* Central Node */}
              <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#0d6084] to-[#0a4a62] border border-cyan-400/30 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/10 z-10 p-2">
                <img src={bpontoPng} alt="Bi2B Icon" className="h-10 w-10 object-contain animate-pulse" />
                <span className="text-[8px] font-bold tracking-wider uppercase text-cyan-300 mt-0.5">Bi2B</span>
              </div>

              {/* Satellite Node 1: XMLHub */}
              <div className="absolute top-6 flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-lg bg-slate-900 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-md">
                  <FileCode2 className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">XMLHub</span>
              </div>

              {/* Satellite Node 2: MonitorHub */}
              <div className="absolute right-6 top-[28%] flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-lg bg-slate-900 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-md">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">MonitorHub</span>
              </div>

              {/* Satellite Node 3: ConnectHub */}
              <div className="absolute right-14 bottom-10 flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-lg bg-slate-900 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-md">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">ConnectHub</span>
              </div>

              {/* Satellite Node 4: TaskHub */}
              <div className="absolute left-14 bottom-10 flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-lg bg-slate-900 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-md">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">TaskHub</span>
              </div>

              {/* Satellite Node 5: DriveHub */}
              <div className="absolute left-6 top-[28%] flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-lg bg-slate-900 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-md">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">DriveHub</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PROVA SOCIAL (PARCEIROS) ===== */}
      <section className="border-t border-b border-cyan-950/40 bg-[#040810]/50 py-10 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-6">
            Empresas e escritórios contábeis que otimizam suas rotinas conosco
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center justify-items-center opacity-65 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#0d6084] to-[#0a4a62] flex items-center justify-center border border-cyan-400/20">
                  <Hexagon className="h-3.5 w-3.5 text-cyan-300" />
                </div>
                <span className="font-heading text-sm font-extrabold tracking-wider text-slate-300 uppercase">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOBRE NÓS ===== */}
      <section id="sobre" className="py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            
            {/* Texto de posicionamento */}
            <motion.div variants={fadeInUp} className="space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Inovação B2B</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Modernização e automação sem atrito para sua gestão contábil
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Desenvolvemos soluções para eliminar a burocracia diária entre contabilidades e empresários. Através de monitoramentos fiscais contínuos e armazenamento criptografado de alta performance, proporcionamos total transparência operacional.
              </p>
              
              {/* Pontos fortes */}
              <div className="space-y-3.5 pt-2">
                {[
                  'Isolamento completo de dados por empresa (Multitenancy RLS)',
                  'Sincronização imediata de guias tributárias e certidões',
                  'Logs de auditoria e controle de payloads para conformidade LGPD',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/25">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Grid de Estatísticas (Stats Grid) */}
            <motion.div variants={fadeIn} className="grid gap-6 sm:grid-cols-2 items-stretch">
              {[
                { value: '+10M', label: 'XMLs Processados', desc: 'Notas fiscais baixadas e estruturadas automaticamente da SEFAZ.' },
                { value: '99.99%', label: 'Disponibilidade (Uptime)', desc: 'Serviço operacional e estável garantido 24 horas por dia, 7 dias por semana.' },
                { value: '< 1.8s', label: 'Tempo de Resposta', desc: 'Sincronização ágil e monitoramentos fiscais atualizados continuamente.' },
                { value: 'Zero', label: 'Multas por Atraso', desc: 'Alertas automáticos de obrigações tributárias e certidões emitidas.' },
              ].map((stat, idx) => (
                <div key={idx} className="rounded-2xl border border-cyan-500/10 bg-slate-950/50 p-6 backdrop-blur-sm shadow-md bi2b-border-glow text-left flex flex-col justify-between hover:border-cyan-500/25 transition-colors">
                  <div>
                    <span className="font-heading text-4xl font-black text-cyan-300 block mb-1">
                      {stat.value}
                    </span>
                    <h4 className="text-sm font-bold text-slate-200 tracking-wide uppercase mb-2">
                      {stat.label}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ===== TABS SECTION (ECOSSISTEMA INTERATIVO HUBSTROM) ===== */}
      <section id="ecossistema" className="bg-[#03070d]/60 border-t border-b border-cyan-950/40 py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Ecossistema Modular</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              O Ecossistema Bi2B Consultoria
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-slate-400">
              Escolha e ative os módulos ideais de acordo com a demanda da sua contabilidade ou empresa. Tudo se integra nativamente.
            </p>

            {/* Seletores das Abas Estilo Hubstrom */}
            <div className="flex flex-wrap justify-center gap-2.5 pt-6 max-w-4xl mx-auto">
              {[
                { id: 'monitor', label: 'MonitorHub', icon: Shield },
                { id: 'connect', label: 'ConnectHub', icon: MessageSquare },
                { id: 'xml', label: 'XMLHub', icon: FileCode2 },
                { id: 'task', label: 'TaskHub', icon: Activity },
                { id: 'drive', label: 'DriveHub', icon: FolderOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-5 py-3.5 text-xs font-bold uppercase tracking-[0.15em] border transition-all duration-300',
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#0d6084] to-[#0a4a62] border-cyan-400 text-white shadow-lg shadow-[#0d6084]/20'
                      : 'bg-slate-950/60 border-cyan-500/10 text-slate-400 hover:text-white hover:border-cyan-500/25'
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo Dinâmico das Abas */}
          <div className="rounded-3xl border border-cyan-500/10 bg-slate-950/60 p-6 sm:p-10 backdrop-blur-sm bi2b-border-glow shadow-xl max-w-6xl mx-auto min-h-[420px] flex items-center">
            <AnimatePresence mode="wait">
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/20 text-cyan-400">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white">MonitorHub</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Varredura automática e monitoramento contínuo das certidões negativas de débitos (CNDs) municipais, estaduais e federais. O sistema emite alertas antes de expirar.
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Varredura diária na Receita Federal
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Alertas de prazos de DCTFWeb e FGTS
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Histórico completo de CNDs salvas
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-6">
                    <div className="rounded-2xl border border-cyan-500/10 bg-[#050b14]/80 p-5 shadow-2xl space-y-3 font-mono text-left text-xs">
                      <div className="flex items-center justify-between border-b border-cyan-950 pb-2.5">
                        <span className="font-semibold text-slate-200">Certidões Ativas</span>
                        <span className="text-[10px] uppercase text-cyan-300">Monitorando</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-2.5">
                          <span className="text-emerald-400 text-[11px]">CND Federal (PGFN/RFB)</span>
                          <span className="bg-emerald-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-bold">REGULAR</span>
                        </div>
                        <div className="flex justify-between items-center bg-amber-950/20 border border-amber-500/20 rounded-lg p-2.5">
                          <span className="text-amber-400 text-[11px]">Certidão do FGTS (CRF)</span>
                          <span className="bg-amber-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-bold">VENCE EM 12 DIAS</span>
                        </div>
                        <div className="flex justify-between items-center bg-rose-950/20 border border-rose-500/20 rounded-lg p-2.5">
                          <span className="text-rose-400 text-[11px]">CND Municipal SP</span>
                          <span className="bg-rose-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-bold">EXPIRADA</span>
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
                  <div className="md:col-span-6 space-y-6 text-left">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/20 text-cyan-400">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white">ConnectHub</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Centralização da comunicação direta e suporte técnico com a sua equipe de contabilidade. Envio de anexos com chat fluido e histórico completo.
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Histórico permanente de chamados abertos
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Notificações de novas mensagens por e-mail e push
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Classificação de chamados por prioridades e tags
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-6">
                    <div className="rounded-2xl border border-cyan-500/10 bg-[#050b14]/80 p-5 shadow-2xl space-y-3 text-xs text-left">
                      <p className="text-[10px] font-semibold text-cyan-300 uppercase">Chamado #1848 — Atendimento</p>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto">
                        <div className="bg-slate-900 border border-cyan-950 rounded-lg p-2 max-w-[80%]">
                          <p className="font-semibold text-cyan-400 text-[10px]">Cliente</p>
                          <p className="text-slate-300 text-[11px] mt-0.5">Preciso enviar a alteração de endereço.</p>
                        </div>
                        <div className="bg-gradient-to-r from-[#0d6084] to-[#0a4a62] rounded-lg p-2 max-w-[80%] ml-auto text-white">
                          <p className="font-semibold text-cyan-300 text-[10px]">Suporte Bi2B</p>
                          <p className="text-[11px] mt-0.5">Minuta enviada para assinatura digital.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/20 text-cyan-400">
                      <FileCode2 className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white">XMLHub</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Sincronização imediata de Notas Fiscais Eletrônicas (NF-e, CT-e, NFS-e) emitidas e recebidas direto da base do fisco.
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Download em lote de arquivos XML
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Filtros de busca rápida por CNPJ emitente
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Visualizador de chaves de acesso
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-6">
                    <div className="rounded-2xl border border-cyan-500/10 bg-[#050b14]/80 p-4 shadow-2xl text-[11px] text-left">
                      <table className="w-full text-slate-300">
                        <thead>
                          <tr className="border-b border-cyan-950 text-cyan-300 font-bold">
                            <th className="pb-2">Nº Nota</th>
                            <th className="pb-2">Emitente</th>
                            <th className="pb-2 text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyan-950/30">
                          <tr>
                            <td className="py-2">100542</td>
                            <td className="py-2 truncate max-w-[120px]">Distribuidora Sul LTDA</td>
                            <td className="py-2 text-right text-cyan-300 font-semibold">R$ 1.842,00</td>
                          </tr>
                          <tr>
                            <td className="py-2">100543</td>
                            <td className="py-2 truncate max-w-[120px]">Indústrias Alfa S/A</td>
                            <td className="py-2 text-right text-cyan-300 font-semibold">R$ 4.210,50</td>
                          </tr>
                        </tbody>
                      </table>
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/20 text-cyan-400">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white">TaskHub</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Gerenciamento de tarefas internas da equipe da contabilidade, atribuição e controle de prazos fiscais e trabalhistas para entrega.
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Quadro visual de status das guias mensais
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Histórico de auditoria de alteração de tarefas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Gestão de colaboradores internos (Staff)
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-6">
                    <div className="rounded-2xl border border-cyan-500/10 bg-[#050b14]/80 p-5 shadow-2xl space-y-2 text-xs text-left">
                      <p className="font-semibold text-slate-200 border-b border-cyan-950 pb-2">Gestão de Demandas Internas</p>
                      <div className="flex items-center justify-between bg-slate-900 border border-cyan-950 rounded-lg p-2.5">
                        <div>
                          <p className="font-semibold text-slate-300 text-[11px]">Gerar DAS Simples Nacional</p>
                          <p className="text-[10px] text-slate-400">Responsável: Juliana Contadora</p>
                        </div>
                        <span className="bg-amber-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Aberto</span>
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/20 text-cyan-400">
                      <FolderOpen className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white">DriveHub</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Gerenciador inteligente de arquivos estruturado por categorias e pastas. Oferece drag-and-drop e visualização rápida integrada.
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Upload fácil de documentos PDF, Excel e Zip
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Divisão por tags (Fiscal, Contábil, RH)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                        Marcação de documentos favoritos
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-6">
                    <div className="rounded-2xl border border-cyan-500/10 bg-[#050b14]/80 p-5 shadow-2xl space-y-2 text-xs text-left">
                      <p className="font-semibold text-slate-200 border-b border-cyan-950 pb-2">Documentos Compartilhados</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 bg-slate-900 border border-cyan-950 p-2.5 rounded-lg">
                          <FileText className="h-4.5 w-4.5 text-cyan-400" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-300 text-[11px] truncate">Balanço Patrimonial 2025.pdf</p>
                            <p className="text-[10px] text-slate-500">2.4 MB • Ontem</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 bg-slate-900 border border-cyan-950 p-2.5 rounded-lg">
                          <FileText className="h-4.5 w-4.5 text-cyan-400" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-300 text-[11px] truncate">Contrato Social Consolidado.pdf</p>
                            <p className="text-[10px] text-slate-500">5.2 MB • Há 4 dias</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ===== OUTRAS FUNCIONALIDADES ===== */}
      <section id="solucoes" className="py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Recursos Técnicos</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Arquitetura voltada para conformidade e segurança
            </h2>
            <p className="max-w-xl mx-auto text-sm text-slate-400">
              Além das rotinas operacionais, estruturamos recursos essenciais de segurança de nível corporativo.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Database, title: 'Isolamento de Tenants', desc: 'Regras de RLS (Row Level Security) evitam vazamentos acidentais de registros corporativos.' },
              { icon: Lock, title: 'LGPD Compliance', desc: 'Gerenciamento seguro de acessos com criptografia na base de dados de ponta a ponta.' },
              { icon: Terminal, title: 'Auditoria de Modificações', desc: 'Rastreabilidade total das alterações contábeis com registro histórico de payloads.' },
              { icon: Globe, title: 'Infraestrutura Cloud', desc: 'Hospedagem de alta escalabilidade com backups e redundância lógica automatizada.' },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-cyan-500/10 bg-slate-950/40 p-6 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:-translate-y-1 text-left shadow-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/20">
                    <feat.icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-white tracking-wide">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS ===== */}
      <section id="depoimentos" className="bg-[#03070d]/60 border-t border-b border-cyan-950/40 py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Depoimentos</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Histórias de sucesso com a Bi2B Consultoria
            </h2>
            <p className="max-w-xl mx-auto text-sm text-slate-400">
              O que dizem os tomadores de decisões que já utilizam nosso ecossistema no dia a dia.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl border border-cyan-500/10 bg-slate-950/40 p-6 flex flex-col justify-between text-left backdrop-blur-sm bi2b-border-glow shadow-md hover:border-cyan-500/25 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-cyan-950/65 flex flex-col">
                  <span className="text-xs font-bold text-white">{t.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-wider">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-28 relative">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Dúvidas Frequentes</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3 text-left">
            {faqData.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-cyan-500/10 bg-slate-950/40 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4.5 text-left text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4.5 w-4.5 shrink-0 text-cyan-400" />
                  ) : (
                    <ChevronDown className="h-4.5 w-4.5 shrink-0 text-slate-500" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 pb-5"
                  >
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FORMULÁRIO DE LEADS / CONTATO ===== */}
      <section id="contato" className="py-28 bg-[#03070d]/60 border-t border-cyan-950/40 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto de Conversão */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Ative Sua Conta</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Solicite uma demonstração completa da Bi2B Consultoria
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Descubra como podemos conectar o fluxo contábil da sua empresa. Preencha o formulário e um especialista entrará em contato em menos de 15 minutos via WhatsApp.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Telefone e WhatsApp</p>
                    <p className="text-sm font-semibold text-slate-200">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-500/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Comercial</p>
                    <p className="text-sm font-semibold text-slate-200">contato@bi2b.com.br</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário Glass-bi2b */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-cyan-500/10 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-md bi2b-border-glow max-w-xl mx-auto">
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-left">
                      <label htmlFor="lead-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nome Completo *</label>
                      <input
                        id="lead-name"
                        type="text"
                        required
                        placeholder="Ex: Alice Silva"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full rounded-lg border border-cyan-950 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                    <div className="text-left">
                      <label htmlFor="lead-email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">E-mail Corporativo *</label>
                      <input
                        id="lead-email"
                        type="email"
                        required
                        placeholder="alice@empresa.com.br"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full rounded-lg border border-cyan-950 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-left">
                      <label htmlFor="lead-phone" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">WhatsApp / Celular *</label>
                      <input
                        id="lead-phone"
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full rounded-lg border border-cyan-950 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                    <div className="text-left">
                      <label htmlFor="lead-cnpj" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">CNPJ da Empresa</label>
                      <input
                        id="lead-cnpj"
                        type="text"
                        placeholder="00.000.000/0001-00"
                        value={leadCnpj}
                        onChange={(e) => setLeadCnpj(e.target.value)}
                        className="w-full rounded-lg border border-cyan-950 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-left">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#0d6084] to-[#0a4a62] py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-[#0d6084]/20 hover:shadow-[#0d6084]/45 transition-all hover:brightness-110 border border-cyan-500/20"
                    >
                      <Send className="h-4 w-4" />
                      Solicitar Demonstração
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== RODAPÉ ===== */}
      <footer className="border-t border-cyan-950/40 bg-[#03070d]/80 py-16 text-left relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
                <img src={logoPng} alt={APP_NAME} className="h-8 w-auto object-contain" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bi2B Consultoria — Inteligência e automatização integrando empresas à contabilidade de forma segura.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-200">Módulos</h4>
              <ul className="mt-4 space-y-2.5 text-xs">
                {['MonitorHub', 'ConnectHub', 'XMLHub', 'TaskHub', 'DriveHub'].map((item) => (
                  <li key={item}>
                    <span className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-200">Sobre</h4>
              <ul className="mt-4 space-y-2.5 text-xs">
                {['A Bi2B Consultoria', 'Diferenciais', 'Planos', 'Contato'].map((item) => (
                  <li key={item}>
                    <span className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-200">Informações de Segurança</h4>
              <ul className="mt-4 space-y-2.5 text-xs">
                {['Termos de Uso', 'Privacidade de Dados', 'Regulamentação LGPD', 'Certificado SSL'].map((item) => (
                  <li key={item}>
                    <span className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-cyan-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
            </p>
            <p className="text-xs text-slate-500">
              CNPJ: 00.000.000/0001-00 • São Paulo, SP
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
