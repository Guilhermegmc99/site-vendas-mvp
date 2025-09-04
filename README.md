# 🚗 Site Vendas MVP

Sistema completo para vendedores de carros com registro automático de leads via WhatsApp.

## 🌐 **ACESSE A APLICAÇÃO**

### 🔗 URLs de Produção:
- **Frontend**: https://site-vendas-mvp.vercel.app
- **Backend**: https://site-vendas-backend.onrender.com

### 🔑 **Credenciais de Teste**:
- **Email**: `vendedor@teste.com`
- **Senha**: `123456`

---

## 🚀 Funcionalidades

### Para Visitantes:
- ✅ Listagem de veículos com filtros avançados
- ✅ Visualização de detalhes dos veículos
- ✅ Contato direto via WhatsApp (registra lead automaticamente)

### Para Vendedores:
- ✅ Login seguro com JWT
- ✅ Dashboard com estatísticas
- ✅ Gestão de veículos (campo placa visível apenas para vendedor)
- ✅ Visualização de leads recebidos
- ✅ Filtros por placa

---

## 🏗️ Arquitetura

### Frontend (React + TypeScript)
- **Framework**: Vite + React 18
- **UI**: TailwindCSS + Shadcn/UI
- **Estado**: React Context + TanStack Query
- **Deploy**: Vercel

### Backend (Node.js + TypeScript)
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Deploy**: Render

---

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+

### 1. Clone o repositório
```bash
git clone <repository-url>
cd site-vendas
```

### 2. Configure o Backend
```bash
cd backend
npm install
cp env.example .env
# Edite .env com suas configurações
npx prisma db push
npm run db:seed
npm run dev
```

### 3. Configure o Frontend
```bash
cd autovendas-mvp
npm install
cp env.example .env.local
# Edite .env.local: VITE_API_URL=http://localhost:3001/api
npm run dev
```

---

## 🚀 Deploy

### Opção 1: Deploy Automático (Recomendado)

1. **Fork este repositório**
2. **Deploy Backend (Render)**:
   - Acesse [render.com](https://render.com)
   - Conecte seu GitHub
   - Crie "New Web Service"
   - Selecione o repositório
   - Configure:
     - Root Directory: `backend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Adicione PostgreSQL Database
   - Deploy automático

3. **Deploy Frontend (Vercel)**:
   - Acesse [vercel.com](https://vercel.com)
   - Import Project do GitHub
   - Configure:
     - Root Directory: `autovendas-mvp`
     - Framework: Vite
   - Adicione variável: `VITE_API_URL=https://seu-backend.onrender.com/api`
   - Deploy automático

### Opção 2: Deploy Manual
Consulte `deploy.md` para instruções detalhadas.

---

## 📋 Especificações Técnicas

### Segurança
- ✅ Hash de senhas (bcrypt)
- ✅ Autenticação JWT
- ✅ Rate limiting anti-spam
- ✅ CORS configurado
- ✅ Validação de dados
- ✅ Hash de IP (LGPD)

### Performance
- ✅ Lazy loading de imagens
- ✅ Paginação de resultados
- ✅ Cache de queries
- ✅ Compressão de assets

### Mobile-First
- ✅ Design responsivo
- ✅ Touch-friendly
- ✅ PWA ready

---

## 🔧 Configurações

### WhatsApp
Para alterar o número do WhatsApp, configure:
- Backend: `DEFAULT_WHATSAPP_NUMBER` no .env
- Formato: `5562999999999` (país + DDD + número)

### Customização
- Cores: `autovendas-mvp/tailwind.config.ts`
- Logo: `autovendas-mvp/src/components/layout/header.tsx`
- Textos: Arquivos em `autovendas-mvp/src/pages/`

---

## 📊 Banco de Dados

### Modelos Principais:
- **User**: Vendedores autenticados
- **Vehicle**: Veículos com campo placa
- **Lead**: Leads capturados via WhatsApp
- **VehicleImage**: Imagens dos veículos

### Relacionamentos:
- User 1:N Vehicle
- Vehicle 1:N Lead
- Vehicle 1:N VehicleImage

---

## 🐛 Troubleshooting

### Erro de CORS
- Verificar `FRONTEND_URL` no backend
- Verificar `VITE_API_URL` no frontend

### Erro de Banco
- Aguardar inicialização (pode levar 2-3 minutos)
- Verificar `DATABASE_URL`

### Erro 500
- Verificar logs no Render Dashboard
- Verificar variáveis de ambiente

---

## 📝 Roadmap

### v0.2.0 (Próximo)
- [ ] Upload de imagens de veículos
- [ ] Dashboard completo do vendedor
- [ ] Exportação CSV de leads
- [ ] Notificações push

### v0.3.0 (Futuro)
- [ ] URLs personalizadas por vendedor
- [ ] Sistema multi-tenant
- [ ] WhatsApp Business API
- [ ] Analytics avançados

---

## 📄 Licença

Este projeto está sob licença MIT. Veja `LICENSE` para mais detalhes.

---

## 👥 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação
2. Verifique issues existentes
3. Crie uma nova issue

---

**Desenvolvido com ❤️ para vendedores de carros**
