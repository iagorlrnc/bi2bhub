# Bi2B Consultoria

O **Bi2B Consultoria** é um Portal do Cliente moderno, seguro e escalável projetado para empresas de contabilidade. O sistema opera sob uma arquitetura de Software as a Service (SaaS) multi-tenant, garantindo o isolamento completo de dados de cada empresa via **Row Level Security (RLS)** no PostgreSQL (Supabase) e permitindo aos clientes finais acompanhar sua situação fiscal, enviar/receber documentos, consultar XMLs e se comunicar com o escritório contábil.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** & **TypeScript**
- **Vite 8** — Bundler ultra-rápido para desenvolvimento
- **TailwindCSS 4** — Configuração baseada em `@theme` CSS
- **React Router DOM** — Roteamento declarativo e guards de proteção
- **TanStack Query (React Query) v5** — Cache de dados e gerenciamento de estado assíncrono
- **Framer Motion** — Micro-animações e transições de página
- **Recharts** — Exibição visual de indicadores financeiros, evolução tributária e faturamento
- **Lucide React** — Pacote premium de ícones vetoriais
- **Sonner** — Notificações dinâmicas (toast)

### Backend & Segurança
- **Supabase** (Auth, Database, Storage, Realtime)
- **PostgreSQL** — Banco de dados relacional
- **Row Level Security (RLS)** — Isolamento nativo de dados por Tenant (`company_id`)
- **Triggers PL/pgSQL** — Automatização de profiles de usuários e limite de membros por plano

---

## 📦 Estrutura de Pastas

```
project/
├── public/                 # Favicon e ativos estáticos
├── supabase/               # Migrações SQL e scripts de banco de dados
│   └── migration.sql       # Schema completo com RLS, Triggers e Buckets
├── src/
│   ├── app/                # Provedores globais
│   ├── assets/             # Arquivos de imagem e recursos locais
│   ├── constants/          # Definições de rotas e dicionários
│   ├── contexts/           # Contextos Globais (Autenticação, Tema)
│   ├── layouts/            # Templates estruturais (Landing, Cliente, Admin)
│   ├── lib/                # Configuração de clientes (Supabase, QueryClient)
│   ├── pages/              # Telas da aplicação (Landing, Auth, Client, Admin)
│   ├── routes/             # Definição e proteção do roteador
│   ├── styles/             # Estilos globais e tokens TailwindCSS 4
│   ├── types/              # Tipagens geradas do Supabase
│   └── utils/              # Funções auxiliares e formatadores
```

---

## 🛠️ Como Executar o Projeto Localmente

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto contendo as credenciais de acesso ao Supabase:
```env
VITE_SUPABASE_URL=https://sua-url-supabase.supabase.co
VITE_SUPABASE_ANON_KEY=seu-token-anon-key
VITE_APP_NAME=ContaSync
VITE_APP_URL=http://localhost:5173
```

### 3. Rodar em Ambiente de Desenvolvimento
```bash
npm run dev
```

### 4. Compilar para Produção (Build)
```bash
npm run build
```

---

## 🔐 Credenciais de Demonstração (Bypass)

Para fins de testes visuais rápidos sem a necessidade de instanciar credenciais do Supabase na primeira execução, o sistema contém credenciais mockadas integradas no `AuthContext`:

- **Painel do Cliente:**
  - **E-mail:** `client@empresa.com.br`
  - **Senha:** *Qualquer valor*

- **Painel Administrativo:**
  - **E-mail:** `admin@contasync.com.br`
  - **Senha:** *Qualquer valor*

---

## 🗄️ Estrutura do Banco de Dados (19 Tabelas)

O banco de dados do Supabase é gerido por meio das tabelas criadas no arquivo [supabase/migration.sql](supabase/migration.sql):

1. **`profiles`**: Dados cadastrais do usuário e tipo (`admin`, `staff`, `client_master`, `client_user`).
2. **`companies`**: Contas das empresas clientes (Tenants), guardando plano comercial e limites.
3. **`company_users`**: Tabela de junção n:m mapeando usuários às empresas com suas respectivas permissões.
4. **`roles`**: Papéis do sistema para RLS.
5. **`permissions`**: Permissões de controle fino de acesso a módulos.
6. **`role_permissions`**: Ligação de papéis às permissões.
7. **`folders`**: Diretórios de armazenamento de arquivos por empresa.
8. **`documents`**: Documentos associados aos diretórios (Balanços, Contratos).
9. **`tickets`**: Chamados de suporte abertos por clientes.
10. **`ticket_messages`**: Mensagens de chat dos chamados.
11. **`notifications`**: Alertas internos da plataforma para os usuários.
12. **`activities`**: Histórico simples de logs de ações do painel de cliente.
13. **`audit_logs`**: Logs globais de segurança registrando operações do banco.
14. **`xml_documents`**: Notas Fiscais Eletrônicas capturadas.
15. **`strategic_indicators`**: KPIs calculados para relatórios executivos.
16. **`monitoring_events`**: Prazos de obrigações e monitoramento de certidões.
17. **`dashboard_metrics`**: Cache de agregados do Dashboard.
18. **`invitations`**: Convites pendentes de envio por e-mail para novos usuários da empresa.
19. **`settings`**: Configurações de preferência por Tenant (timezone, idioma, etc).

---

## 🛡️ Políticas de Isolamento de Dados (RLS)

O sistema aplica **Row Level Security** estrito. Cada consulta ao banco é implicitamente filtrada pelo identificador do usuário conectado (`auth.uid()`).

- **Isolamento de Tenants:** Um usuário comum só consegue listar dados associados a empresas onde ele possui registro ativo na tabela `company_users`.
- **Proteção no Storage:** Buckets de documentos privados (`documents`, `xml-documents`, `ticket-attachments`) rejeitam requisições de leitura ou gravação cujo `company_id` não pertença à empresa do usuário autenticado.
