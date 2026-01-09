# Submita — Simplificando a submissão científica

Plataforma web para gerenciamento de submissão e avaliação de artigos científicos em eventos acadêmicos.

---

## 📘 Sobre o projeto

O Submita é um sistema web desenvolvido para apoiar a organização de eventos científicos, permitindo o cadastro de eventos e suas edições anuais, submissão de artigos em PDF, cadastro de revisores e realização de avaliações por meio de formulários personalizados.

A plataforma busca simplificar todo o fluxo de submissão científica, conectando autores, revisores e organizadores em um único ambiente, promovendo maior agilidade, organização e transparência no processo de avaliação de trabalhos acadêmicos.

---

## 🎯 Objetivo

Desenvolver um sistema web para gerenciamento de submissão e avaliação de artigos científicos em eventos acadêmicos.

---

## 🛠 Tecnologias

- Next.js 16 (Fullstack)
- React 19
- TypeScript
- Prisma ORM
- SQLite (ambiente de desenvolvimento)
- Tailwind CSS

> Futuramente o banco de dados poderá ser migrado para MySQL visando ambiente de produção.

---

## ⚙️ Funcionalidades

- Cadastro de eventos científicos e edições anuais  
- Submissão de artigos em PDF  
- Cadastro de revisores e áreas de atuação  
- Associação de revisores aos artigos  
- Criação de formulários de avaliação  
- Avaliação de artigos por revisores  

---

## 🗄 Banco de Dados

O projeto utiliza o Prisma ORM para modelagem e acesso ao banco de dados.

Durante o desenvolvimento, o banco utilizado é o SQLite, por simplicidade e facilidade de configuração.

Posteriormente, o banco poderá ser migrado para MySQL sem necessidade de alterações significativas na aplicação.

---

## 🚀 Como executar o projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/gguiallex/submita.git
cd submita
```
### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Configurar o banco de dados
Crie um arquivo .env:
```env
DATABASE_URL="file:./dev.db"
```

### 4️⃣ Rodar as migrations
Crie um arquivo .env:
```bash
npx prisma migrate dev --name init
```

### 5️⃣ Executar o projeto
```bash
npm run dev
```
acesse no navegador:
👉 http://localhost:3000

### 📁 Estrutura do Projeto
```bash
submita/
├── app/            # Rotas e páginas (Next.js App Router)
├── prisma/         # Schema e migrations do Prisma
├── public/         # Arquivos públicos
├── styles/         # Estilos globais
├── .env            # Configuração do banco
├── package.json
└── README.md
```

### 📌 Status do Projeto

🚧 Em desenvolvimento — Projeto acadêmico em andamento.

### 📄 Licença

Projeto acadêmico desenvolvido no contexto da bolsa de pesquisa na UFLA.

### 👨‍💻 Autor

Guilherme Alexandre Cunha Silva
Graduando em Sistemas de Informação — UFLA
Projeto desenvolvido no contexto da bolsa de pesquisa em Desenvolvimento de Sistemas de Software Gerenciais.