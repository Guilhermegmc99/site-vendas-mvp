# 🚀 Instruções para Execução - Site Vendas MVP

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL (versão 12 ou superior)
- Git

## 🗄️ Configuração do Banco de Dados

1. **Instalar PostgreSQL**:
   - Windows: Baixar do site oficial postgresql.org
   - Criar um banco de dados chamado `site_vendas`

2. **Configurar conexão**:
   ```sql
   CREATE DATABASE site_vendas;
   CREATE USER site_vendas_user WITH PASSWORD 'sua_senha_aqui';
   GRANT ALL PRIVILEGES ON DATABASE site_vendas TO site_vendas_user;
   ```

## ⚙️ Configuração do Backend

1. **Navegar para o diretório do backend**:
   ```bash
   cd backend
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**:
   - Copiar `env.example` para `.env`
   - Editar `.env` com suas configurações:
   ```env
   DATABASE_URL="postgresql://site_vendas_user:sua_senha_aqui@localhost:5432/site_vendas?schema=public"
   JWT_SECRET="seu_jwt_secret_super_seguro_aqui"
   JWT_EXPIRES_IN="24h"
   PORT=3001
   NODE_ENV="development"
   UPLOAD_PATH="uploads"
   MAX_FILE_SIZE=3145728
   DEFAULT_WHATSAPP_NUMBER="5562999999999"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Executar migrações do banco**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Popular banco com dados de exemplo**:
   ```bash
   npm run db:seed
   ```

6. **Iniciar servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

   O backend estará rodando em: http://localhost:3001

## 🎨 Configuração do Frontend

1. **Navegar para o diretório do frontend**:
   ```bash
   cd autovendas-mvp
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**:
   - Copiar `env.example` para `.env.local`
   - Editar `.env.local`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Iniciar servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

   O frontend estará rodando em: http://localhost:3000

## 🔑 Credenciais de Teste

Após executar o seed do banco, você pode usar:

- **Email**: `vendedor@teste.com`
- **Senha**: `123456`

## 📱 Funcionalidades Disponíveis

### Para Visitantes (não logados):
- ✅ Ver listagem de veículos
- ✅ Filtrar veículos por preço, ano, combustível, etc.
- ✅ Ver detalhes de um veículo
- ✅ Clicar em "Falar no WhatsApp" (registra lead automaticamente)

### Para Vendedores (logados):
- ✅ Login/logout
- ✅ Ver todos os veículos (incluindo campo placa)
- ✅ Filtrar por placa
- ✅ Dashboard com estatísticas básicas
- 🚧 Criar/editar/excluir veículos (em desenvolvimento)
- 🚧 Ver leads recebidos (em desenvolvimento)

## 🛠️ Comandos Úteis

### Backend:
```bash
# Gerar cliente Prisma após mudanças no schema
npx prisma generate

# Reset do banco (cuidado: apaga todos os dados)
npx prisma migrate reset

# Visualizar dados no Prisma Studio
npx prisma studio

# Build para produção
npm run build

# Executar em produção
npm start
```

### Frontend:
```bash
# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Linting
npm run lint
```

## 🐛 Solução de Problemas

### Erro de conexão com banco:
1. Verificar se PostgreSQL está rodando
2. Conferir credenciais no arquivo `.env`
3. Verificar se o banco `site_vendas` existe

### Erro de CORS:
1. Verificar se `FRONTEND_URL` no backend está correto
2. Verificar se `VITE_API_URL` no frontend está correto

### Erro de JWT:
1. Verificar se `JWT_SECRET` está definido no `.env` do backend
2. Limpar localStorage do navegador se necessário

## 📞 Configuração do WhatsApp

Para personalizar o número do WhatsApp:
1. Editar `DEFAULT_WHATSAPP_NUMBER` no `.env` do backend
2. Formato: `5562999999999` (código do país + DDD + número)

## 🚀 Próximos Passos

1. **Upload de Imagens**: Implementar upload de fotos dos veículos
2. **Dashboard Completo**: Finalizar painel do vendedor
3. **URLs Personalizadas**: Sistema multi-tenant com domínios customizados
4. **Deploy**: Hospedar em produção (Vercel/Netlify + Render/Railway)

## 📝 Estrutura do Projeto

```
Site Vendas/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares (auth, errors)
│   │   ├── services/       # Serviços
│   │   └── utils/          # Utilitários
│   ├── prisma/             # Schema e migrações do banco
│   └── uploads/            # Arquivos enviados
├── autovendas-mvp/         # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── services/       # Serviços (API)
│   │   └── contexts/       # Contextos React
└── PRD-Site-Vendas-MVP.md  # Documentação do produto
```

## ❓ Dúvidas ou Problemas?

Se encontrar algum problema:
1. Verificar se todas as dependências foram instaladas
2. Conferir configurações do `.env`
3. Verificar logs do terminal para erros específicos
4. Consultar a documentação do Prisma: https://prisma.io/docs
