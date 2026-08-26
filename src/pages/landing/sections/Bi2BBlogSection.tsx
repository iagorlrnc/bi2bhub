import { ArrowRight, Calendar, Clock } from 'lucide-react'

export function Bi2BBlogSection() {
  const posts = [
    {
      id: 1,
      category: 'GESTÃO & ESCALA',
      date: '22 de Agosto, 2026',
      readTime: '5 min de leitura',
      title: 'Como Escritórios Contábeis Estão Dobrando a Carteira Usando Portais Multi-Tenant',
      summary:
        'Descubra como a centralização do autoatendimento do cliente PJ elimina o gargalo operacional e permite admitir mais empresas sem sobrecarregar a equipe.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      category: 'INTELIGÊNCIA FISCAL',
      date: '18 de Agosto, 2026',
      readTime: '7 min de leitura',
      title: 'Reforma Tributária: O Fim do Contador Tradicional e a Ascensão do Contador Consultivo',
      summary:
        'A transição para o IBS/CBS exigirá dos escritórios relatórios gerenciais e DREs visuais. Veja como preparar a sua infraestrutura tecnológica.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      category: 'SEGURANÇA & LGPD',
      date: '10 de Agosto, 2026',
      readTime: '4 min de leitura',
      title: 'Guarda de Documentos e Criptografia: Os Riscos Invisíveis de Usar WhatsApp e E-mail',
      summary:
        'Por que escritórios contábeis são alvos frequentes de vazamentos de dados e como a segregação multi-tenant protege o seu CNPJ e o dos seus clientes.',
      image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80',
    },
  ]

  return (
    <section id="blog" className="py-24 sm:py-32 bg-[#083A50] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold text-xs uppercase tracking-widest mb-4">
              Conteúdo & Insights
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-heading leading-tight">
              Artigos estratégicos para{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-[#38bdf8] to-white bg-clip-text text-transparent">
                líderes contábeis
              </span>
            </h2>
          </div>

          <a
            href="#topo"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-white transition-colors group cursor-pointer"
          >
            <span>Ver todos os artigos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Blog Post Cards Grid with Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-md bg-[#062837]/90 border border-white/10 hover:border-cyan-400/50 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/20 flex flex-col justify-between group"
            >
              {/* Featured Cover Image */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 group-hover:brightness-105 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062837] via-[#062837]/50 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-sm bg-[#083A50]/90 backdrop-blur-md text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-200 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-300" />
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-heading mb-2.5 group-hover:text-cyan-200 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#AEC3CE] leading-relaxed mb-5 font-normal">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>

                  <span className="text-xs font-bold text-cyan-400 group-hover:text-white flex items-center gap-1 transition-colors">
                    <span>Ler artigo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
