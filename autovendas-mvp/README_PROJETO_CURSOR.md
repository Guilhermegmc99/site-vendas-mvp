# AutoVendas - Projeto Completo para Cursor

Este é um sistema completo de vendas de automóveis desenvolvido em React + Vite + TypeScript + Tailwind CSS.

## 🚀 Como usar no Cursor

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar o projeto
```bash
npm run dev
```

### 3. Build para produção
```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/
│   │   ├── header.tsx           # Cabeçalho com navegação
│   │   └── footer.tsx           # Rodapé com informações
│   └── ui/                      # Componentes UI (shadcn/ui)
│       ├── vehicle-card.tsx     # Card de veículo
│       ├── search-filters.tsx   # Filtros de busca
│       └── ...                  # Outros componentes UI
├── pages/
│   ├── Index.tsx               # Página inicial
│   ├── Login.tsx               # Página de login
│   ├── Dashboard.tsx           # Painel administrativo
│   ├── VehicleDetail.tsx       # Detalhes do veículo
│   ├── VehicleForm.tsx         # Formulário de veículo
│   └── NotFound.tsx            # Página 404
├── data/
│   └── mock-vehicles.ts        # Dados mockados dos veículos
├── assets/
│   └── hero-automotive-new.jpg # Imagem hero
├── lib/
│   └── utils.ts                # Utilitários
├── hooks/
│   └── use-toast.ts            # Hook para toasts
├── index.css                   # Estilos globais e design system
└── main.tsx                    # Ponto de entrada
```

## 🎨 Sistema de Design

O projeto usa um sistema de design robusto com tokens semânticos:

### Cores Principais
- **Primary**: Azul automotivo (confiança)
- **Accent**: Laranja energético (ação/conversão)
- **Secondary**: Cinza neutro
- **Background**: Branco/gradientes sutis

### Componentes Principais
- `Header`: Navegação com logo e botões de autenticação
- `Footer`: Informações de contato (Goiânia, GO)
- `VehicleCard`: Card responsivo para exibir veículos
- `SearchFilters`: Filtros avançados de busca

## 🚗 Funcionalidades

### Página Inicial (Index.tsx)
- Hero section com call-to-action
- Seção de estatísticas
- Lista de veículos com filtros
- Integração WhatsApp para leads

### Sistema de Autenticação
- **Login**: admin@autovendas.com / 123456
- Redirecionamento para dashboard
- Estados de autenticação no header

### Filtros de Busca
- Busca por texto
- Faixa de preço
- Ano do veículo
- Tipo de combustível
- Transmissão
- Quilometragem

## 🛠️ Tecnologias

- **React 18** + TypeScript
- **Vite** para build
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **React Router** para navegação
- **Lucide React** para ícones
- **React Hook Form** para formulários
- **TanStack Query** para estado

## 📱 Responsividade

O projeto é totalmente responsivo com:
- Grid adaptável para veículos
- Menu mobile no header
- Cards otimizados para mobile
- Filtros colapsíveis em telas menores

## 🎯 Recursos Especiais

### WhatsApp Integration
```typescript
const handleWhatsAppClick = (vehicleId: string) => {
  const message = `Olá, tenho interesse no ${vehicle.title}`;
  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};
```

### Design System Tokens
```css
:root {
  --primary: 215 84% 35%;
  --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-light)));
  --shadow-glow: 0 0 0 1px hsl(var(--primary) / 0.1);
}
```

### Filtros Dinâmicos
```typescript
const filteredVehicles = mockVehicles.filter(vehicle => {
  if (filters.search && !vehicle.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
  if (filters.minPrice && vehicle.price < filters.minPrice) return false;
  // ... outros filtros
  return true;
});
```

## 🔧 Customização

### Adicionar Novos Veículos
Edite `src/data/mock-vehicles.ts`:

```typescript
{
  id: "novo-id",
  title: "Nome do Veículo",
  price: 50000,
  year: 2023,
  mileage: 15000,
  fuel: "Flex",
  transmission: "Manual",
  color: "Branco",
  location: "Goiânia, GO",
  description: "Descrição detalhada...",
  images: ["/placeholder.svg"],
  features: ["Ar condicionado", "Direção hidráulica"],
  status: "active",
  createdAt: "2024-01-01T00:00:00Z"
}
```

### Personalizar Cores
Edite `src/index.css` e `tailwind.config.ts`:

```css
:root {
  --primary: [nova-cor-hsl];
  --accent: [nova-cor-hsl];
}
```

### Adicionar Novas Páginas
1. Crie o componente em `src/pages/`
2. Adicione a rota em `src/App.tsx`
3. Atualize a navegação no `Header`

## 📧 Contato & Suporte

- **Email**: contato@autovendas.com
- **WhatsApp**: (62) 99999-9999
- **Endereço**: Av. T-4, 1000 - Setor Bueno, Goiânia - GO

## 🚦 Como Contribuir

1. Clone o repositório
2. Crie uma branch para sua feature
3. Faça as alterações
4. Teste localmente
5. Abra um Pull Request

## 📋 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
npm run lint       # Linting do código
```

## 🎨 Guia de Estilo

- Use sempre tokens do design system
- Mantenha componentes pequenos e focados
- Siga a estrutura de pastas existente
- Use TypeScript para tipagem completa
- Implemente responsividade mobile-first

---

**AutoVendas** - Conectando pessoas aos seus carros dos sonhos há mais de 10 anos. 🚗✨