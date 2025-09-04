# 🚀 Deploy do Site Vendas

## Passos para Deploy

### 1. Deploy do Backend (Railway)

1. **Acesse**: https://railway.app/
2. **Faça login** com GitHub
3. **Crie novo projeto**: "New Project" > "Deploy from GitHub repo"
4. **Selecione** o repositório do projeto
5. **Configure variáveis de ambiente**:
   ```
   NODE_ENV=production
   JWT_SECRET=seu_jwt_super_secreto_para_producao_123456789
   JWT_EXPIRES_IN=24h
   PORT=3001
   UPLOAD_PATH=uploads
   MAX_FILE_SIZE=3145728
   DEFAULT_WHATSAPP_NUMBER=5562999999999
   FRONTEND_URL=https://seu-site-frontend.vercel.app
   ```

6. **Adicione PostgreSQL**:
   - No dashboard do projeto, clique em "New"
   - Selecione "Database" > "PostgreSQL"
   - Conecte ao seu projeto
   - A variável `DATABASE_URL` será criada automaticamente

7. **Deploy**: O Railway fará o deploy automaticamente

### 2. Deploy do Frontend (Vercel)

1. **Acesse**: https://vercel.com/
2. **Faça login** com GitHub
3. **Import Project** > selecione o repositório
4. **Configure**:
   - Framework Preset: Vite
   - Root Directory: `autovendas-mvp`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Variáveis de ambiente**:
   ```
   VITE_API_URL=https://seu-backend-railway.up.railway.app/api
   ```

6. **Deploy**: Vercel fará o deploy automaticamente

### 3. URLs Finais

Após o deploy, você terá:
- **Frontend**: `https://seu-site.vercel.app`
- **Backend**: `https://seu-backend.up.railway.app`

### 4. Configuração Final

1. **Atualize CORS** no backend:
   - Vá no Railway > Variables
   - Atualize `FRONTEND_URL` com a URL real do Vercel

2. **Teste a aplicação**:
   - Acesse o frontend
   - Faça login com: `vendedor@teste.com` / `123456`
   - Teste o registro de leads no WhatsApp

## 🔧 Troubleshooting

- **Erro de CORS**: Verificar `FRONTEND_URL` no Railway
- **Erro de banco**: Aguardar inicialização do PostgreSQL (pode levar alguns minutos)
- **Erro 500**: Verificar logs no Railway Dashboard
