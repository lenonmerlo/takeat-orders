# Guia de Demonstração para Banca

Este documento organiza um roteiro curto e reproduzível para apresentar os principais diferenciais técnicos e de UX do projeto.

## Ambiente esperado

- Backend disponível em `http://localhost:3001`
- Frontend em execução (`npm --prefix frontend run dev`)
- Banco populado com seed (`npm --prefix backend run seed`)

## Cenários recomendados (ordem sugerida)

1. **Fluxo normal de pedido**
2. **Estoque acabando / indisponibilidade (Refrigerante Cola 350ml)**
3. **Conflito de estoque com X-Bacon (insumo Bacon limitado)**
4. **Fila offline com sincronização automática**

---

## 1) Fluxo normal de pedido

### Passos

1. Acesse `/products`.
2. Adicione itens disponíveis (ex.: `X-Burger Clássico` + `Batata Frita P`).
3. Clique em **Enviar Pedido**.

### Resultado esperado

- Mensagem de sucesso na UI.
- Pedido aparece em `/orders`.

### Comentários

- Fluxo principal está simples para operação de garçom.
- Backend valida e persiste pedido com baixa de estoque em transação.

---

## 2) Estoque acabando com refrigerante

> No seed atual, o insumo `Lata Refrigerante` inicia com **4 unidades**.

### Passos (via UI)

1. Em `/products`, adicione `Refrigerante Cola 350ml` ao carrinho.
2. Aumente a quantidade até o limite disponível.
3. Tente ultrapassar o limite (ou enviar pedido com quantidade além do estoque restante).

### Resultado esperado

- O frontend bloqueia a progressão quando não há insumo suficiente.
- Aparece mensagem amigável indicando o item em falta e quantidades.

### Comentários

- O erro é explicado com linguagem operacional.
- A validação é dupla: antecipada no frontend e garantida no backend.

---

## 3) Cenário X-Bacon (estoque limitado de bacon)

> No seed atual, `Bacon` inicia com **8 unidades** e o produto `X-Bacon` consome **2 unidades de bacon por item**.

### Passos

1. Em `/products`, selecione `X-Bacon`.
2. Tente montar mais unidades do que o bacon permite no momento.
3. Envie pedido acima da capacidade ou force sincronização tardia (cenário 4).

### Resultado esperado

- Retorno de indisponibilidade com mensagem clara (`precisa X, tem Y`).

### Comentários

- Demonstra consistência da regra de estoque por receita (`ProductInput.qtyRequired`).
- Mostra tratamento de conflito real por insumo compartilhado.

---

## 4) Fila offline + sincronização automática

### Passos

1. Abra DevTools do navegador e ative modo **Offline**.
2. Monte um pedido e clique em **Enviar Pedido**.
3. Observe o painel **Fila Offline** com item pendente.
4. Volte para **Online**.

### Resultado esperado

- Pedido sai do carrinho e vai para fila local.
- Ao reconectar, sistema sincroniza automaticamente.
- Item migra para `Sincronizado` ou `Falhou na sincronização` com mensagem amigável.

### Comentários

- Diferencial de resiliência: não perde pedido por instabilidade de rede.
- Conflitos tardios continuam rastreáveis e acionáveis na interface.

---

## Comandos de apoio (opcional durante a demo)

### Recarregar dados iniciais

```bash
npm --prefix backend run seed
```

### Healthcheck rápido da API

```bash
curl http://localhost:3001/api/health
```

No PowerShell, alternativa:

```powershell
(Invoke-WebRequest -Uri "http://localhost:3001/api/health" -Method GET).StatusCode
```

---

## Conclusão

A solução cobre o fluxo operacional completo: cardápio, montagem de pedido, listagem e cancelamento. No backend, a baixa de insumos é transacional e idempotente por `clientRequestId`, evitando inconsistência e duplicidade. No frontend, o garçom recebe mensagens claras de indisponibilidade por insumo, como no refrigerante e no X-Bacon. Como diferencial, implementamos fila offline: se a internet cair, o pedido é salvo localmente e sincronizado automaticamente quando a conexão volta, com tratamento explícito de conflito tardio.