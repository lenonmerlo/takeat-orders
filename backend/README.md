# Takeat Orders Backend

API REST em Node.js + Express + Sequelize para gestão de produtos, insumos e pedidos, com foco em consistência transacional de estoque e idempotência.

## Principais decisões técnicas

- **Arquitetura em camadas**: `routes -> controllers -> services -> repositories -> models`
- **Idempotência em pedidos**: `clientRequestId` (body ou `Idempotency-Key`) com replay seguro
- **Consistência de estoque**: criação de pedido em transação com lock de linhas de insumo
- **Erros padronizados**: `ValidationError`, `NotFoundError`, `InsufficientStockError`
- **Documentação OpenAPI**: disponível em `/docs`

## Tecnologias

- Node.js (ESM)
- Express
- Sequelize
- PostgreSQL
- Docker Compose
- Swagger UI

## Estrutura resumida

- `src/controllers`: camada HTTP
- `src/services`: regras de negócio
- `src/repositories`: acesso a dados
- `src/models`: modelos Sequelize
- `src/docs/openapi.js`: especificação OpenAPI
- `migrations`: migrations SQL versionadas

## Variáveis de ambiente (`backend/.env`)

Exemplo mínimo:

```env
PORT=3001
APP_HOST=localhost
DB_HOST=localhost
DB_PORT=5433
DB_NAME=SEU_DB_NAME
DB_USER=SEU_DB_USER
DB_PASSWORD=SUA_SENHA_FORTE
```

> Em Docker Compose, o backend usa `DB_HOST=db` internamente.
>
> **Nota de segurança:** não versionar credenciais reais no repositório. Para avaliação, use valores de ambiente locais (`.env` não commitado) ou arquivo de exemplo (`.env.example`) com placeholders.

## Executando com Docker

Na raiz do projeto:

```bash
docker compose up -d --build
```

- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- OpenAPI JSON: `http://localhost:3001/docs/openapi.json`

## Executando local (sem Docker backend)

```bash
npm install
npm run seed
npm run dev
```

## Scripts úteis

- `npm run dev`: sobe API com nodemon
- `npm run start`: sobe API em modo normal
- `npm run seed`: popula dados iniciais
- `npm run migrate:sql -- <arquivo.sql>`: executor SQL genérico
- `npm run migrate:idempotency:up`: aplica NOT NULL em `orders.client_request_id`
- `npm run migrate:idempotency:down`: rollback do NOT NULL

## Endpoints principais

### Health

- `GET /api/health`
  - `200`: `{ status: "ok", db: "up" }`
  - `503`: `{ status: "degraded", db: "down" }`

### Paginação (polimento)

As listagens aceitam query params:

- `page` (padrão `1`)
- `limit` (padrão `10`, máximo `100`)

Aplicado em:

- `GET /api/products`
- `GET /api/inputs`
- `GET /api/orders`

Formato de resposta paginada:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Orders

- `POST /api/orders` cria pedido
- `GET /api/orders` lista pedidos
- `GET /api/orders/:id` busca pedido por id
- `PATCH /api/orders/:id/status` atualiza status (`CREATED` ou `CANCELED`)

## Checklist técnico

- [x] Transação no fluxo de pedido
- [x] Lock de estoque para evitar baixa concorrente inconsistente
- [x] Idempotência com replay
- [x] Validação de payloads
- [x] Swagger/OpenAPI atualizado
- [x] Paginação nas listagens
- [x] Healthcheck de banco
- [x] Migration SQL versionada
