## PRD — Site Vendas (MVP)

- **Produto**: Site Vendas  
- **Owner**: Guilherme  
- **Versão**: 0.1 (MVP)  
- **Última atualização**: [preencher]

### 1. Sumário
MVP para cadastro e exibição de carros, com login para vendedores e integração de contato via WhatsApp. Ao clicar em “Falar no WhatsApp”, registrar o lead com contexto mínimo e redirecionar para a conversa.

### 2. Escopo do MVP
- Cadastro e gestão de carros (CRUD) por vendedor autenticado.
- Listagem pública e página de detalhes do carro.
- Botão “Falar no WhatsApp” com mensagem pré-preenchida.
- Registro simples de lead no clique do WhatsApp (mínimo: veículo, horário, origem, nome do cliente).
- Autenticação (login/logout).

Fora de escopo neste MVP: multi-tenant completo, painel avançado de leads, dashboards, integrações externas além do WhatsApp (somente link padrão).

### 3. Personas (resumo)
- **Vendedor**: cadastra/edita veículos e acessa login.
- **Cliente**: navega, vê detalhes e clica para WhatsApp.
- **Admin (básico)**: mesmo papel do vendedor neste MVP (1 papel único).

### 4. Regras de Negócio
- **RB-01**: Veículo só pode ser publicado se tiver: título, preço, ano, quilometragem, transmissão, combustível e ao menos 1 foto.
- **RB-02**: Preço pode ser “sob consulta”; marcar flag e exibir no front.
- **RB-03**: Clique no WhatsApp registra lead antes do redirecionamento.
- **RB-04**: Veículos inativos não aparecem no site público.
- **RB-05**: Limite de 10 fotos por veículo; formatos: JPG/PNG/WEBP (máx. 3 MB por foto).
- **RB-06**: Login obrigatório para CRUD; visitantes não autenticados apenas visualizam.
- **RB-07**: Dados de lead usados somente para prospecção (LGPD – mínimo necessário).

### 5. Requisitos Funcionais
- **Autenticação**
  - Login via email/senha; logout.
  - Sessão segura (cookie httpOnly ou JWT).
- **Carros (CRUD)**
  - Criar/editar/excluir/ativar-desativar.
  - Campos: título, descrição, preço, ano, quilometragem, transmissão, combustível, cor, localização, status (ativo/inativo), fotos.
  - Upload de imagens com compressão e ordenação.
- **Listagem/Detalhe**
  - Lista com filtros básicos: preço, ano, quilometragem, transmissão, combustível.
  - Ordenação: mais recentes, menor preço, maior preço.
  - Página de detalhe com galeria e especificações.
- **WhatsApp + Lead**
  - Botão “Falar no WhatsApp” com mensagem: “Olá, tenho interesse no {Título} — {Link}”.
  - Registro do lead: `vehicle_id`, `created_at`, `referrer/utm`, `ip_hashed`, `user_agent`, `client_name`.
  - Redirecionamento após confirmação do registro (com fallback se falhar).

### 6. Fluxos de Usuário
- **Vendedor**
  - Acessa `/login` → autentica → “Novo Veículo” → preenche → faz upload → salva → veículo publicado.
- **Cliente**
  - Acessa home → filtra → abre detalhe → clica “Falar no WhatsApp” → lead registrado → abre WhatsApp.

### 7. Modelagem de Dados (mínima)
- `User`: id, name, email (unique), password_hash, created_at, updated_at
- `Vehicle`: id, user_id, title, slug, price, year, mileage_km, transmission, fuel, color, location, description, status, created_at, updated_at
- `VehicleImage`: id, vehicle_id, url, position, created_at
- `Lead`: id, vehicle_id, client_name, referrer, utm_source, utm_medium, utm_campaign, ip_hashed, user_agent, created_at

Índices: `vehicle.status`, `vehicle.user_id`, `lead.vehicle_id`, `lead.created_at`.

### 8. API (MVP)
- Auth
  - `POST /auth/login`
  - `POST /auth/logout`
- Vehicles (autenticado)
  - `GET /vehicles?status=active|inactive&filters...`
  - `POST /vehicles`
  - `GET /vehicles/:id`
  - `PUT /vehicles/:id`
  - `DELETE /vehicles/:id`
- Images (autenticado)
  - `POST /vehicles/:id/images`
  - `DELETE /vehicles/:id/images/:imageId`
- Leads (público)
  - `POST /leads` (chamado no clique do WhatsApp antes do redirect)

Obs.: Listagem/detalhe podem ser servidos via frontend com SSR/SSG; endpoints privados protegidos.

### 9. Integração WhatsApp (MVP)
- Link padrão: `https://wa.me/{DDDNumero}?text={MensagemURLCodificada}`
- Mensagem: “Olá, tenho interesse no {Título do Carro} — {URL do anúncio}”
- UTM no link do anúncio: `utm_source=site_vendas&utm_medium=whatsapp_cta&utm_campaign=default`

### 10. Requisitos Não Funcionais
- **Performance**: imagens otimizadas e lazy load; páginas públicas rápidas.
- **Segurança**: senhas com hash forte; cookies httpOnly ou JWT seguro; validação de input.
- **Privacidade**: armazenar apenas o mínimo para o lead; hash de IP.
- **Disponibilidade**: se falhar registro do lead, ainda redirecionar para WhatsApp e logar erro.

### 11. Critérios de Aceite
- É possível fazer login/logout com credenciais válidas.
- Usuário autenticado cadastra e publica veículo com campos obrigatórios e ao menos 1 foto.
- Visitante vê listagem com filtros e detalhe do veículo.
- Botão WhatsApp registra lead e redireciona corretamente.
- Veículos inativos não aparecem publicamente.

### 12. Métricas do MVP
- Leads/dia e leads/mês (contagem).
- CTR do botão WhatsApp por veículo.
- Número de veículos ativos.

### 13. Roadmap curto
- v0.1: Login, CRUD de veículos, listagem/detalhe, WhatsApp + registro de lead.
- v0.2: Exportação CSV simples de leads, melhorias de filtros e ordenação.
- v0.3: Separação de papéis (admin/seller), início de multi-tenant.

### 14. Stack Tecnológico (MVP)
- **Frontend**: React com TypeScript, Vite, TailwindCSS, Shadcn/UI
- **Backend**: Node.js com Express e TypeScript
- **Banco de dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Upload de arquivos**: Multer
- **Validação**: Express Validator e Zod

### 15. Novas Funcionalidades Adicionadas
1. **Campo de Placa**: 
   - Visível apenas para vendedores autenticados
   - Oculto para clientes finais
   - Filtro por placa disponível no dashboard do vendedor
   - Validação de formato de placa brasileira (ABC1234 ou ABC1D23)

2. **Sistema Multi-Tenant (Futuro)**:
   - URLs personalizadas por vendedor (ex: rafaprimeiramao.com.br)
   - Isolamento de dados por vendedor
   - Configuração de domínios customizados

### 16. Changelog

#### v0.1.0 - MVP Inicial (Implementado)
- ✅ **Backend completo implementado**:
  - API REST com Express e TypeScript
  - Banco PostgreSQL com Prisma ORM
  - Autenticação JWT
  - CRUD de veículos com campo de placa
  - Sistema de leads com registro automático
  - Middleware de segurança (helmet, CORS, rate limiting)
  - Validação de dados com express-validator

- ✅ **Frontend integrado**:
  - Conectado com APIs do backend
  - Contexto de autenticação React
  - Serviço de API centralizado
  - Páginas atualizadas para usar dados reais
  - Estados de loading e tratamento de erros

- ✅ **Funcionalidades principais**:
  - Login/logout com JWT
  - Listagem pública de veículos
  - Registro de leads no clique do WhatsApp
  - Dashboard para vendedores (estrutura criada)
  - Campo de placa visível apenas para vendedores

- ✅ **Segurança e LGPD**:
  - Hash de senhas com bcrypt
  - Hash de IP para privacidade
  - Rate limiting para prevenir spam
  - Validação de dados de entrada

#### Próximos Passos (v0.2.0)
- [ ] Upload de imagens de veículos
- [ ] Dashboard completo do vendedor
- [ ] Exportação CSV de leads
- [ ] Sistema de URLs personalizadas
- [ ] Deploy em produção
