# Bi2B Consultoria

O **Bi2B Consultoria** é um Portal do Cliente moderno, seguro e altamente escalável, projetado sob medida para escritórios de contabilidade e suas respectivas empresas clientes. O sistema opera sob uma arquitetura de Software as a Service (SaaS) multi-tenant, utilizando **Row Level Security (RLS)** no PostgreSQL (Supabase) para assegurar o isolamento rígido de dados entre as empresas parceiras.

Através deste portal, as empresas clientes acompanham sua saúde fiscal, baixam guias de impostos, enviam/recebem documentos confidenciais, controlam prazos de obrigações e se comunicam em tempo real com o suporte contábil.

---

## 🎨 Design Premium & Tema Visual

A interface do portal foi projetada seguindo as mais refinadas práticas de design contemporâneo (estética inspirada no portal financeiro *Fingu*), focando em legibilidade, contraste e fluidez:

*   **Tema Claro / Escuro / Sistema**: O controle global de aparência permite alternar entre os temas Claro e Escuro, com a opção de herdar as preferências do sistema operacional (`system`). O tema é persistido de forma segura no navegador (`localStorage` sob a chave `bi2b-theme`). A lógica é gerenciada centralizadamente pelo [ThemeContext](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/contexts/ThemeContext.tsx).
*   **Transições Suaves (`theme-transition-sync`)**: Classe utilitária inserida no [globals.css](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/styles/globals.css) que sincroniza a mudança de cores de fundos, bordas, fontes, sombras e ícones SVG de maneira suave em 300ms.
*   **Estética Visual Premium**: 
    *   **Efeito Hover Elevate (`hover-elevate`)**: Efeito em cartões e botões com transição tridimensional suave ao passar o cursor.
    *   **Cartões Premium (`card-premium`)**: Componentes de exibição com brilho interno dinâmico e sombras suaves.
    *   **Foco Inteligente (`input-glow-focus`)**: Brilho azul/ciano suave ao focar em inputs de texto para otimização da usabilidade.
    *   **Marquee de Parceiros (`animate-marquee`)**: Carrossel contínuo de logotipos com efeito blur nas laterais.
*   **LGPD & Privacidade ([CookieConsent](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/components/CookieConsent.tsx))**: Banner flutuante para aceitação de termos de uso e política de privacidade de dados em conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018).

---

## 🔐 Módulo de Autenticação e Cadastro

*   **Validação de Senha Forte**: Regex robusta que exige tamanho mínimo de 8 caracteres, pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial. Definições no [constants/index.ts](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/constants/index.ts).
*   **Esqueci Minha Senha / Redefinição**: Fluxo integrado com o Supabase Auth nas páginas [ForgotPasswordPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/auth/ForgotPasswordPage.tsx) e [ResetPasswordPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/auth/ResetPasswordPage.tsx).
*   **Portal de Cadastro de Clientes ([RegisterPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/auth/RegisterPage.tsx))**: Fluxo assistido em 4 etapas:
    1.  **Dados Pessoais**: Criação de dados do usuário (nome, e-mail, telefone, senhas).
    2.  **Vinculação à Empresa**: Localização da empresa do cliente através de um **Código Exclusivo de 4 dígitos** (`codigo_exclusivo`) cadastrado no banco.
    3.  **Termos de Serviço**: Aceite das políticas da plataforma.
    4.  **Validação de E-mail**: Simulação visual de código OTP para validação da conta.
*   **Status Pendente de Usuários**: Ao se cadastrar, o usuário fica com status inativo (`is_active: false`) e é impedido de logar até que sua solicitação seja aprovada. Caso tente o login, o sistema exibe uma notificação informando que a solicitação está pendente de aprovação.

---

## 💼 Área do Cliente (Painel do Cliente)

Destinado aos sócios e colaboradores da empresa parceira, com rotas protegidas pelo painel do cliente:

1.  **Impostos e Faturamento ([TaxesPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/client/TaxesPage.tsx))**: 
    *   Listagem de guias tributárias organizadas por ano fiscal.
    *   Status de pagamento interativo (Pendente, Pago, Vencido) e download de guias em PDF.
    *   Gráficos dinâmicos de faturamento consolidado vs. impostos utilizando a biblioteca Recharts.
2.  **Obrigações e Calendário ([TasksPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/client/TasksPage.tsx))**: 
    *   Rastreamento de prazos tributários recorrentes da empresa (FGTS, GFIP, Declarações).
3.  **Drive de Documentos ([DrivePage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/client/DrivePage.tsx))**: 
    *   Navegador de arquivos integrado ao Storage do Supabase isolado por RLS.
    *   Criação de pastas e upload de documentos.
    *   Suporte a formatos ampliados: PDF, XML, planilhas (XLS/XLSX), imagens (PNG, JPG, JPEG, WEBP), arquivos compactados (ZIP, RAR, 7Z) e bancos de dados (CSV).
4.  **Chamados e Suporte ([TicketsPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/client/TicketsPage.tsx))**: 
    *   Abertura de chamados técnicos contábeis categorizados por setores (Fiscal, Contábil, Societário, DP).
    *   Acompanhamento de status, definição de prioridade e chat interativo com envio de mensagens de texto e arquivos anexos.
5.  **Gestão de Equipe ([TeamPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/client/TeamPage.tsx))**: 
    *   Aba **Membros da Equipe**: Permite ao Usuário Master gerenciar colaboradores cadastrados, alterar perfis de acesso, remover colaboradores e definir permissões modulares refinadas por recurso (`dashboard`, `strategic`, `monitoring`, `xml`, `drive`, `tickets`).
    *   Aba **Solicitações de Acesso Pendentes**: Visualização e aprovação rápida de novos colaboradores que se cadastraram usando o código exclusivo da empresa.
6.  **Configurações da Empresa ([SettingsPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/client/SettingsPage.tsx))**: 
    *   Parametrização dos dados cadastrais (Razão Social, Nome Fantasia, CNPJ, Inscrição Estadual/Municipal), regime tributário e e-mails de notificação.
7.  **Meu Perfil ([ProfilePage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/client/ProfilePage.tsx))**: 
    *   Edição de dados cadastrais do próprio usuário (nome, celular) e upload de avatar de perfil.
8.  **Central de Notificações ([NotificationsPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/client/NotificationsPage.tsx))**: 
    *   Mensagens internas enviadas pelo escritório contábil com controle de leitura por parte do usuário.

---

## 🏛️ Área do Administrador (Painel Administrativo / Staff)

Acesso restrito a administradores e funcionários da contabilidade para controle total dos Tenants:

1.  **Dashboard de Operações ([AdminDashboardPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/AdminDashboardPage.tsx))**: 
    *   Indicadores em tempo real sobre empresas cadastradas, chamados em andamento, taxas a vencer e usuários online.
2.  **Gestão de Empresas ([CompaniesPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/CompaniesPage.tsx))**: 
    *   CRUD completo das empresas clientes.
    *   Exibição e cópia direta do **Código Exclusivo de 4 dígitos** gerado automaticamente na criação de um Tenant, utilizado na vinculação de novos usuários.
3.  **Gestão de Usuários Clientes ([UsersPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/UsersPage.tsx))**: 
    *   Controle geral de perfis vinculados a todas as empresas.
    *   Aprovação ou recusa imediata de cadastros pendentes de validação de acesso.
    *   Bloqueio temporário de acessos, alteração de empresas associadas, redefinição de senhas e exclusão definitiva de contas.
    *   Indicação visual de inativação com motivos detalhados (ex: "Removido pelo usuário Master").
4.  **Gestão de Equipe Contábil ([StaffPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/StaffPage.tsx))**: 
    *   Cadastro e controle de privilégios de outros funcionários do escritório de contabilidade (`staff` ou `admin`).
5.  **Central de Chamados Geral ([AdminTicketsPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/AdminTicketsPage.tsx))**: 
    *   Visualização macro de chamados de suporte abertos por todas as empresas parceiras.
    *   Designação de funcionários contábeis para atendimento e resposta interativa via chat.
6.  **Logs de Segurança e Auditoria ([AuditPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/AuditPage.tsx))**: 
    *   Histórico global das atividades efetuadas no painel, contendo logs das modificações do banco de dados para segurança e conformidade de dados.
7.  **Drive de Todas as Empresas ([AdminDrivePage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/AdminDrivePage.tsx))**: 
    *   Organizador de pastas e arquivos das empresas parceiras para o envio facilitado de relatórios e balancetes fiscais do mês.
8.  **Gestão de Mensalidades ([AdminMonthlyPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/AdminMonthlyPage.tsx))**: 
    *   Acompanhamento financeiro dos planos comerciais vigentes contratados por cada Tenant.
9.  **Publicação de Impostos ([AdminTaxesPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/AdminTaxesPage.tsx))**: 
    *   Módulo para o upload e lançamento de guias de impostos a pagar (ISS, ICMS, etc.), atrelando a guia a uma empresa e mês fiscal específico.
10. **Central de Avisos ([AdminNotificationsPage](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/pages/admin/AdminNotificationsPage.tsx))**: 
    *   Criação e disparo de comunicados globais ou direcionados a Tenants específicos.

---

## 🛠️ Tecnologias Utilizadas

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
│   ├── components/         # Componentes compartilhados (ex: CookieConsent)
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

Para fins de testes visuais rápidos sem a necessidade de instanciar credenciais do Supabase na primeira execução, o sistema contém credenciais mockadas integradas no [AuthContext](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/src/contexts/AuthContext.tsx):

---

## 🗄️ Estrutura do Banco de Dados (19 Tabelas)

O banco de dados do Supabase é gerido por meio das tabelas criadas no arquivo [supabase/migration.sql](file:///c:/Users/iagoor/Downloads/MULTI-TENANT/project/supabase/migration.sql):

1.  **`profiles`** / **`usuarios`**: Dados cadastrais do usuário, tipo (`admin`, `staff`, `client_master`, `client_user`), status de atividade (`is_active`), código de empresa (`codigo_empresa`), vínculo de tenant (`company_id`) e justificativa de inativação (`status_reason`).
2.  **`companies`** / **`empresas`**: Contas das empresas clientes (Tenants), guardando plano comercial, limites de usuários e o **`codigo_exclusivo`** (ID exclusivo de 4 dígitos para busca).
3.  **`company_users`** / **`usuarios_empresa`**: Tabela de junção n:m mapeando usuários às empresas com suas respectivas permissões (`dashboard`, `strategic`, `monitoring`, `xml`, `drive`, `tickets`) e status de aprovação (`is_active`).
4.  **`roles`**: Papéis do sistema para RLS.
5.  **`permissions`**: Permissões de controle fino de acesso a módulos.
6.  **`role_permissions`**: Ligação de papéis às permissões.
7.  **`folders`**: Diretórios de armazenamento de arquivos por empresa.
8.  **`documents`**: Documentos associados aos diretórios (Balanços, Contratos).
9.  **`tickets`**: Chamados de suporte abertos por clientes.
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

-   **Isolamento de Tenants**: Um usuário comum só consegue listar dados associados a empresas onde ele possui registro ativo na tabela `company_users`.
-   **Proteção no Storage**: Buckets de documentos privados (`documents`, `xml-documents`, `ticket-attachments`) rejeitam requisições de leitura ou gravação cujo `company_id` não pertença à empresa do usuário autenticado.
