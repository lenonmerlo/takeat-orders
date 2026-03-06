# Takeat Orders Frontend

Aplicação web para operação de pedidos do restaurante, com foco em fluxo rápido para garçom e tratamento resiliente de falhas de conexão.

## Stack

- React + Vite
- React Router
- CSS utilitário do projeto (`tk-*`)
- ESLint

## Funcionalidades implementadas

- Home com acesso rápido para Cardápio e Pedidos
- Cardápio com busca de produtos e montagem do pedido
- Carrinho com ajuste de quantidade, remoção e total
- Criação de pedido com `clientRequestId` para idempotência
- Tratamento amigável de indisponibilidade de insumos
- Lista de pedidos com ação de cancelamento
- Detalhe de pedido por ID
- Indicador de status de conexão

## Diferencial de resiliência (offline-first)

Quando o envio do pedido falha por falta de internet:

- O pedido é salvo localmente (fila offline no `localStorage`)
- O sistema mostra feedback claro para o garçom
- A fila tenta sincronizar automaticamente ao reconectar
- Conflitos tardios (ex.: estoque insuficiente no momento da sincronização) ficam marcados como falha com mensagem amigável
- Itens sincronizados podem ser limpos manualmente no painel da fila

Componentes principais dessa estratégia:

- `src/hooks/useOrderQueue.js`
- `src/services/orderQueueStorage.js`
- `src/components/orders/OrderQueuePanel.jsx`
- `src/utils/orderErrors.js`

## Rotas

- `/` Home
- `/products` Cardápio e montagem do pedido
- `/orders` Lista de pedidos
- `/orders/:id` Detalhe do pedido

## Scripts

- `npm run dev` inicia frontend em desenvolvimento
- `npm run build` gera build de produção
- `npm run preview` serve build localmente
- `npm run lint` executa lint

## Execução local

```bash
npm install
npm run dev
```

> Configure o backend em `http://localhost:3001` (ver documentação em `../backend/README.md`).
> Arquivo de exemplo para ambiente: `frontend/.env.example`.

## Estrutura resumida

- `src/pages/`: páginas e fluxos de tela
- `src/components/`: componentes de UI e domínio
- `src/hooks/`: regras de estado e orquestração
- `src/services/`: integração HTTP e persistência local
- `src/utils/`: helpers e formatadores
- `src/styles/`: estilos globais

## Guia para apresentação

Para um roteiro pronto de demonstração (incluindo cenários de estoque como refrigerante e X-Bacon), consulte `../GUIA_BANCA.md`.
