# 🚀 Deploy Rápido - Site Vendas

## 📋 Passo a Passo para Hospedar

### 1. Criar Conta no GitHub (se não tiver)
1. Acesse: https://github.com
2. Crie uma conta gratuita
3. Confirme o email

### 2. Criar Repositório
1. No GitHub, clique em "New repository"
2. Nome: `site-vendas-mvp`
3. Marque "Public"
4. Clique "Create repository"

### 3. Subir Código para GitHub
No seu computador, execute:
```bash
# Navegar para o diretório do projeto
cd "C:\Site Vendas"

# Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/site-vendas-mvp.git

# Subir código
git push -u origin main
```

### 4. Deploy do Backend (Render.com)
1. **Acesse**: https://render.com
2. **Crie conta** com GitHub
3. **New Web Service**
4. **Conecte repositório**: `site-vendas-mvp`
5. **Configure**:
   - Name: `site-vendas-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. **Variáveis de ambiente**:
   ```
   NODE_ENV=production
   JWT_SECRET=meu_super_jwt_secreto_123456789
   JWT_EXPIRES_IN=24h
   UPLOAD_PATH=uploads
   MAX_FILE_SIZE=3145728
   DEFAULT_WHATSAPP_NUMBER=5562999999999
   FRONTEND_URL=https://site-vendas-mvp.vercel.app
   ```
7. **Adicionar PostgreSQL**:
   - No dashboard, "New" > "PostgreSQL"
   - Name: `site-vendas-db`
   - Conectar ao web service
8. **Deploy** - Aguardar 5-10 minutos

### 5. Deploy do Frontend (Vercel)
1. **Acesse**: https://vercel.com
2. **Crie conta** com GitHub
3. **Import Project**
4. **Selecione**: `site-vendas-mvp`
5. **Configure**:
   - Framework: `Vite`
   - Root Directory: `autovendas-mvp`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Variável de ambiente**:
   ```
   VITE_API_URL=https://site-vendas-backend.onrender.com/api
   ```
7. **Deploy** - Aguardar 2-3 minutos

### 6. Configuração Final
1. **Atualizar CORS** no Render:
   - Vá em Variables
   - Edite `FRONTEND_URL` com a URL real do Vercel
   - Exemplo: `https://site-vendas-mvp-abc123.vercel.app`

### 7. Testar Aplicação
1. **Acesse** a URL do Vercel
2. **Login**: `vendedor@teste.com` / `123456`
3. **Teste** o WhatsApp nos veículos

## 🎉 Resultado Final

Após completar os passos:
- **Frontend**: `https://site-vendas-mvp-abc123.vercel.app`
- **Backend**: `https://site-vendas-backend.onrender.com`

## ⚠️ Observações

- **Primeiro acesso**: Backend pode demorar 1-2 minutos (plano gratuito)
- **Dados**: Já vem com veículos e usuário de teste
- **WhatsApp**: Configurado para número padrão (pode alterar)

## 🆘 Se Algo Der Errado

1. **Erro 500**: Aguardar inicialização do banco (até 5 min)
2. **CORS Error**: Verificar se FRONTEND_URL está correto
3. **Login não funciona**: Aguardar backend inicializar completamente

## 📞 Suporte

Se precisar de ajuda:
1. Verificar logs no Render Dashboard
2. Verificar logs no Vercel Dashboard
3. Tentar novamente após alguns minutos
