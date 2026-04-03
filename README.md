# FitPatch IA

## 📋 Descrição

**FitPatch IA** é uma aplicação web inovadora focada na geração e acompanhamento de treinos de musculação personalizados usando Inteligência Artificial. A plataforma adapta automaticamente os treinos ao tempo disponível e ao nível de energia do usuário, mantendo o foco em hipertrofia muscular e progressão de carga.

**Status Atual:** Em fase de prototipagem do front-end com mocks de interface.

---

## ✨ Funcionalidades Atuais (Front-end Mocks)

### 1. Tela de Autenticação

- Fluxo integrado de **Login** e **Cadastro**
- Alternância dinâmica entre as duas telas
- Validação básica de campos (E-mail, Senha, Nome para cadastro)
- Design Dark Mode com acentos em vermelho
- Redirecionamento fictício para check-in após autenticação

[Insira a imagem aqui]

### 2. Tela de Check-in

- **Seleção de Ficha de Treino:** Dropdown com diferentes tipos de rotinas
- **Ajuste de Tempo Disponível:** Slider para definir tempo em minutos (15-180 min)
- **Nível de Energia:** Slider para indicar disposição do usuário (1-5)
- Interface limpa com validação em tempo real
- Mudança visual dinâmica dos valores selecionados

[Insira a imagem aqui]

### 3. Tela de Treino Ativo (Streaming/Visualização)

- **Foco do Dia:** Exibição dinâmica do objetivo principal do treino
- **Carrossel de Exercícios:** Scroll horizontal para visualizar cada exercício
- **Detalhes do Exercício:**
  - Nome do exercício
  - Séries e repetições recomendadas
  - Campo para entrada de carga (kg) realizada
  - Campo para entrada de repetições feitas
  - Animação de carregamento (skeleton) durante a geração
- **Botão de Finalizar:** Retorna para nova geração de treino

[Insira a imagem aqui]

---

## 🛠️ Tecnologias Utilizadas

### Front-end

- **React** 18+ - Biblioteca para construção de interfaces de usuário
- **TypeScript** - Tipagem estática para maior segurança e manutenibilidade
- **Tailwind CSS** - Framework de utilitários CSS para estilização responsiva
- **Lucide React** - Componentes de ícones modernos
- **Vite** - Build tool rápido e moderno

### Back-end (Em breve)

- Planejamento em progresso para implementação de API REST
- Banco de dados para persistência de usuários, treinos e histórico
- Integração com serviços de IA para geração inteligente de treinos
- Sistema de autenticação real com JWT

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 16+ instalado

### Instalação

1. **Clone ou navegue até o diretório do projeto:**

   ```bash
   cd fitpatch-ia-gtech
   ```

2. **Instale as dependências do Front-end:**

   ```bash
   cd frontend
   npm install
   ```

3. **Instale as dependências do Back-end (opcional):**
   ```bash
   cd ../backend
   npm install
   ```

### Execução

#### Rodando o Front-end

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (porta padrão do Vite).

#### Rodando o Back-end

```bash
cd backend
npm run dev
```

O servidor estará disponível em `http://localhost:3000` (ou na porta especificada no arquivo de configuração).

---

## 📚 Estrutura do Projeto

```
fitpatch-ia-gtech/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.tsx          # Componente de Login/Cadastro
│   │   │   ├── CheckInForm.tsx       # Formulário de check-in
│   │   │   ├── ExerciseCard.tsx      # Card individual de exercício
│   │   │   └── WorkoutSkeletons.tsx  # Componentes de loading
│   │   ├── services/
│   │   │   └── workoutStream.ts      # Serviço de streaming de treinos
│   │   ├── types/
│   │   │   └── workout.ts            # Tipos TypeScript
│   │   ├── utils/
│   │   │   └── parseWorkoutText.ts   # Parser de resposta de IA
│   │   ├── App.tsx                   # Componente raiz
│   │   └── main.tsx                  # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── workout.ts            # Rotas de treino
│   │   ├── services/
│   │   │   └── gemini.ts             # Integração com API de IA
│   │   ├── types/
│   │   │   └── workout.ts            # Tipos de dados
│   │   └── index.ts                  # Entry point
│   ├── .env.example                  # Variáveis de ambiente (exemplo)
│   └── package.json
│
└── README.md
```

---

## 🗺️ Próximos Passos (Roadmap)

### Fase 1: Integração de Rotas

- Implementar React Router para navegação real entre telas
- Adicionar proteção de rotas (redirect para autenticação)
- Estado global com Context API ou similar

### Fase 2: Conexão com Back-end

- Integrar autenticação real com JWT
- Conectar formulário de check-in com API
- Salvar estado do treino em análise
- Receber dados reais de geração de IA via streaming

### Fase 3: Persistência de Dados

- Histórico de treinos completos do usuário
- Dashboard de progresso (carga progressiva)
- Análise de desempenho

### Fase 4: Melhorias de UX/UI

- Animações mais suaves
- Notificações e feedback visual
- Responsividade aprimorada para dispositivos móveis
- Modo offline (cache local)

---

## 📝 Notas de Desenvolvimento

- Todas as telas atualmente são **mocks** para simulação visual
- Os `console.log` informativos aparecem ao submeter formulários
- O design segue padrão Dark Mode com acentos em vermelho (#EF4444)
- A aplicação usa Tailwind CSS com cores customizadas para manter consistência visual

---

## 📧 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato com a equipe de desenvolvimento.

---

**Última atualização:** Abril de 2026  
**Versão:** 0.1.0 (Prototipagem)
