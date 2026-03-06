# Takeat Orders

Projeto do desafio Takeat com backend e frontend separados por pastas.

## Estrutura do repositório

- `backend/`: API REST (Node.js + Express + Sequelize + PostgreSQL)
- `frontend/`: aplicação web (React + Vite)

## Documentação por módulo

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`

## Execução rápida (Docker)

Na raiz do projeto:

```bash
docker compose up -d --build
```

- Backend API: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`

## Execução local por módulo

Backend:

```bash
npm --prefix backend install
npm --prefix backend run seed
npm --prefix backend run dev
```

Frontend:

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

## Observações

- Credenciais e dados sensíveis não devem ser commitados.
- Use arquivos `.env` locais e mantenha `*.example` com placeholders.
