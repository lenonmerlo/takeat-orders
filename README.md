# Takeat Orders

Projeto do desafio Takeat com backend e frontend separados por pastas.

## Destaques da solução

- Fluxo de pedidos com consistência transacional de estoque no backend
- Idempotência de criação de pedidos com `clientRequestId`
- Frontend orientado ao uso operacional do garçom
- Fila offline com sincronização automática ao reconectar (diferencial)

## Parte 3 — Diferencial (Desafio Extra)

Estratégia implementada para cenário de conexão instável no momento do envio do pedido:

1. Se a requisição falhar por erro de rede, o app não trava e não perde os dados.
2. O pedido é salvo em fila local no client-side (`localStorage`).
3. Quando a conexão volta, a fila é processada automaticamente.
4. Em conflito tardio de estoque na sincronização, o item fica com status de falha e mensagem amigável para o garçom.

Referências:

- Estratégia detalhada: `frontend/README.md`
- Roteiro de demonstração: `GUIA_BANCA.md`

## Estrutura do repositório

- `backend/`: API REST (Node.js + Express + Sequelize + PostgreSQL)
- `frontend/`: aplicação web (React + Vite)

## Documentação por módulo

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Roteiro de demonstração para banca: `GUIA_BANCA.md`

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

## Arquivos de ambiente (exemplos)

- Raiz (Docker Compose): `.env.example`
- Backend local: `backend/.env.example`
- Frontend local: `frontend/.env.example`

Copie para `.env` no respectivo diretório e ajuste os valores conforme seu ambiente.

## Qualidade contínua (CI)

Pipeline em `.github/workflows/ci.yml` executa:

- Backend: testes críticos de pedidos (idempotência, transação e restauração de estoque)
- Frontend: lint + build

## Observações

- Credenciais e dados sensíveis não devem ser commitados.
- Use arquivos `.env` locais e mantenha `*.example` com placeholders.
- Para visão completa de arquitetura e diferenciais, consulte `backend/README.md` e `frontend/README.md`.
