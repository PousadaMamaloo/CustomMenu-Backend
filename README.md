# CustomMenu - Backend

Este repositório contém a API backend do projeto **CustomMenu**, construída com Node.js e Express.

Ela é preparada para ser executada em um ambiente de desenvolvimento com Docker, e está integrada ao ambiente de infraestrutura do repositório `CustomMenu-Infra`.

---

## ✅ Tecnologias utilizadas

- Node.js
- Express
- Docker
- Nodemon (hot reload)
- Dotenv (variáveis de ambiente)

---

## 🧱 Estrutura do projeto

```bash
CustomMenu-Backend/
├── src/
│   └── index.js         # Arquivo principal da aplicação
├── package.json         # Dependências e scripts
├── Dockerfile           # Docker para dev e produção
├── docker-compose.dev.yml # Inicialização para o ambiente dev     
├── .dockerignore
├── .env.dev                 # (necessário) configuração apontada ao banco do ambiente dev
```

---

## 🧪 Rodando no ambiente de desenvolvimento

Esse backend é orquestrado via `docker-compose.dev.yml` que se encontra dentro do mesmo repositório.


1. Clone o repositório 
2. Crie o arquivo `.env.dev` com as variáveis abaixo
```
POSTGRES_HOST=dev.jogajunto.tech
POSTGRES_PORT=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
```

3.  execute:

```bash
docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build
```

3. Acesse:

- API Backend: http://localhost:3000
- Banco PostgreSQL: remoto em `dev.jogajunto.tech:POSTGRES_PORT`
