const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Takeat Orders API",
    version: "1.0.0",
    description:
      "API de gerenciamento de produtos e ficha técnica para o desafio Takeat.",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Ambiente local",
    },
  ],
  tags: [
    { name: "Health", description: "Status da API" },
    { name: "Inputs", description: "Operações de insumos" },
    { name: "Orders", description: "Operações de pedidos" },
    { name: "Products", description: "Operações de produtos" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Verifica saúde da API",
        responses: {
          200: {
            description: "API saudável",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    db: { type: "string", example: "up" },
                  },
                  required: ["status", "db"],
                },
              },
            },
          },
          503: {
            description: "API degradada (banco indisponível)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "degraded" },
                    db: { type: "string", example: "down" },
                  },
                  required: ["status", "db"],
                },
              },
            },
          },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Lista produtos com ficha técnica",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Lista de produtos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedProductsResponse",
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Cria um produto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProductPayload" },
            },
          },
        },
        responses: {
          201: {
            description: "Produto criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Busca produto por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          200: {
            description: "Produto encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          404: { $ref: "#/components/responses/ProductNotFoundResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Atualiza nome/preço do produto",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProductPayload" },
            },
          },
        },
        responses: {
          200: {
            description: "Produto atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          404: { $ref: "#/components/responses/ProductNotFoundResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
    },
    "/api/products/{id}/recipe": {
      put: {
        tags: ["Products"],
        summary: "Substitui a ficha técnica de um produto",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateRecipePayload" },
            },
          },
        },
        responses: {
          200: {
            description: "Receita atualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          404: { $ref: "#/components/responses/RecipeNotFoundResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
    },
    "/api/inputs": {
      get: {
        tags: ["Inputs"],
        summary: "Lista insumos",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Lista de insumos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedInputsResponse",
                },
                examples: {
                  success: { $ref: "#/components/examples/ListInputsExample" },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
      post: {
        tags: ["Inputs"],
        summary: "Cria um insumo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateInputPayload" },
            },
          },
        },
        responses: {
          201: {
            description: "Insumo criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputStock" },
                examples: {
                  success: { $ref: "#/components/examples/CreateInputExample" },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
    },
    "/api/inputs/{id}/stock": {
      patch: {
        tags: ["Inputs"],
        summary: "Atualiza estoque do insumo",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateStockPayload" },
            },
          },
        },
        responses: {
          200: {
            description: "Estoque atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InputStock" },
                examples: {
                  success: {
                    $ref: "#/components/examples/UpdateStockSuccessExample",
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          404: { $ref: "#/components/responses/InputNotFoundResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
    },
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "Lista pedidos com itens",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Lista de pedidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedOrdersResponse",
                },
                examples: {
                  success: { $ref: "#/components/examples/OrderListExample" },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Cria pedido com validação atômica de estoque",
        parameters: [
          {
            name: "Idempotency-Key",
            in: "header",
            required: false,
            schema: {
              type: "string",
              maxLength: 80,
            },
            description:
              "Chave idempotente opcional no header. Se não enviada, clientRequestId no body é obrigatório.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderPayload" },
            },
          },
        },
        responses: {
          201: {
            description: "Pedido criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
                examples: {
                  created: {
                    $ref: "#/components/examples/OrderCreatedExample",
                  },
                },
              },
            },
          },
          200: {
            description: "Replay idempotente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
                examples: {
                  replay: { $ref: "#/components/examples/OrderReplayExample" },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          404: { $ref: "#/components/responses/OrderProductsNotFoundResponse" },
          409: { $ref: "#/components/responses/InsufficientStockResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
    },
    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Busca pedido por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          200: {
            description: "Pedido encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
                examples: {
                  success: {
                    $ref: "#/components/examples/OrderCreatedExample",
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          404: { $ref: "#/components/responses/OrderNotFoundResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
    },
    "/api/orders/{id}/status": {
      patch: {
        tags: ["Orders"],
        summary: "Atualiza status do pedido",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrderStatusPayload" },
            },
          },
        },
        responses: {
          200: {
            description: "Status atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
                examples: {
                  canceled: {
                    $ref: "#/components/examples/OrderStatusUpdatedExample",
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationErrorResponse" },
          404: { $ref: "#/components/responses/OrderNotFoundResponse" },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
    },
  },
  components: {
    responses: {
      ValidationErrorResponse: {
        description: "Payload inválido",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            examples: {
              invalidPayload: {
                $ref: "#/components/examples/ValidationErrorExample",
              },
            },
          },
        },
      },
      ProductNotFoundResponse: {
        description: "Produto não encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            examples: {
              productNotFound: {
                $ref: "#/components/examples/ProductNotFoundExample",
              },
            },
          },
        },
      },
      InputNotFoundResponse: {
        description: "Insumo não encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            examples: {
              inputNotFound: {
                $ref: "#/components/examples/InputNotFoundExample",
              },
            },
          },
        },
      },
      OrderProductsNotFoundResponse: {
        description: "Um ou mais produtos não existem",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            examples: {
              missingProducts: {
                $ref: "#/components/examples/OrderProductsNotFoundExample",
              },
            },
          },
        },
      },
      OrderNotFoundResponse: {
        description: "Pedido não encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            examples: {
              orderNotFound: {
                $ref: "#/components/examples/OrderNotFoundExample",
              },
            },
          },
        },
      },
      InsufficientStockResponse: {
        description: "Estoque insuficiente para finalizar o pedido",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            examples: {
              insufficientStock: {
                $ref: "#/components/examples/InsufficientStockExample",
              },
            },
          },
        },
      },
      RecipeNotFoundResponse: {
        description: "Produto ou insumos não encontrados",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            examples: {
              productNotFound: {
                $ref: "#/components/examples/ProductNotFoundExample",
              },
              missingInputs: {
                $ref: "#/components/examples/MissingInputsExample",
              },
            },
          },
        },
      },
      InternalErrorResponse: {
        description: "Erro interno inesperado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            examples: {
              internal: { $ref: "#/components/examples/InternalErrorExample" },
            },
          },
        },
      },
    },
    examples: {
      ValidationErrorExample: {
        summary: "Erro de validação",
        value: {
          error: "VALIDATION_ERROR",
          message: "Payload inválido",
          details: [
            {
              field: "name",
              message: "name é obrigatório",
            },
          ],
        },
      },
      ProductNotFoundExample: {
        summary: "Produto inexistente",
        value: {
          error: "NOT_FOUND",
          message: "Produto não encontrado",
        },
      },
      InputNotFoundExample: {
        summary: "Insumo inexistente",
        value: {
          error: "NOT_FOUND",
          message: "Insumo não encontrado",
        },
      },
      OrderProductsNotFoundExample: {
        summary: "Produtos inexistentes no pedido",
        value: {
          error: "NOT_FOUND",
          message: "Um ou mais produtos não existem",
          details: {
            missingProductIds: [99],
          },
        },
      },
      OrderNotFoundExample: {
        summary: "Pedido inexistente",
        value: {
          error: "NOT_FOUND",
          message: "Pedido não encontrado",
        },
      },
      MissingInputsExample: {
        summary: "Insumos inexistentes",
        value: {
          error: "NOT_FOUND",
          message: "Um ou mais insumos não existem",
          details: {
            missingInputIds: [99, 100],
          },
        },
      },
      InternalErrorExample: {
        summary: "Falha interna",
        value: {
          error: "INTERNAL_ERROR",
          message: "Erro interno",
        },
      },
      ListInputsExample: {
        summary: "Lista de insumos",
        value: {
          data: [
            {
              id: 1,
              name: "Pão",
              stockQty: 10,
              unit: "un",
            },
            {
              id: 2,
              name: "Carne",
              stockQty: 5,
              unit: "un",
            },
          ],
          meta: {
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        },
      },
      CreateInputExample: {
        summary: "Insumo criado",
        value: {
          id: 8,
          name: "Cebola",
          stockQty: 5,
          unit: "un",
        },
      },
      UpdateStockSuccessExample: {
        summary: "Estoque incrementado",
        value: {
          id: 1,
          name: "Pão",
          stockQty: 12,
          unit: "un",
        },
      },
      InsufficientStockExample: {
        summary: "Estoque insuficiente",
        value: {
          error: "INSUFFICIENT_STOCK",
          message: "Estoque insuficiente para finalizar o pedido",
          details: [
            {
              inputId: 2,
              name: "Carne",
              unit: "un",
              required: 20,
              available: 5,
            },
          ],
        },
      },
      OrderCreatedExample: {
        summary: "Pedido criado",
        value: {
          id: 1,
          clientRequestId: "ord-001",
          status: "CREATED",
          total: "50.00",
          createdAt: "2026-03-06T14:42:12.242Z",
          updatedAt: "2026-03-06T14:42:12.242Z",
          items: [
            {
              id: 1,
              orderId: 1,
              productId: 1,
              qty: 2,
              unitPrice: "25.00",
              lineTotal: "50.00",
              order_id: 1,
              product_id: 1,
              product: {
                id: 1,
                name: "X-Burger",
                price: "25.00",
              },
            },
          ],
          reused: false,
        },
      },
      OrderReplayExample: {
        summary: "Replay idempotente",
        value: {
          id: 1,
          clientRequestId: "ord-001",
          status: "CREATED",
          total: "50.00",
          createdAt: "2026-03-06T14:42:12.242Z",
          updatedAt: "2026-03-06T14:42:12.242Z",
          items: [
            {
              id: 1,
              orderId: 1,
              productId: 1,
              qty: 2,
              unitPrice: "25.00",
              lineTotal: "50.00",
              order_id: 1,
              product_id: 1,
              product: {
                id: 1,
                name: "X-Burger",
                price: "25.00",
              },
            },
          ],
          reused: true,
        },
      },
      OrderListExample: {
        summary: "Lista de pedidos",
        value: {
          data: [
            {
              id: 2,
              clientRequestId: "ord-002",
              status: "CREATED",
              total: "25.00",
              createdAt: "2026-03-06T14:50:00.000Z",
              updatedAt: "2026-03-06T14:50:00.000Z",
              items: [],
            },
          ],
          meta: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        },
      },
      OrderStatusUpdatedExample: {
        summary: "Pedido cancelado",
        value: {
          id: 1,
          clientRequestId: "ord-001",
          status: "CANCELED",
          total: "50.00",
          createdAt: "2026-03-06T14:42:12.242Z",
          updatedAt: "2026-03-06T14:55:10.000Z",
          items: [],
        },
      },
    },
    schemas: {
      ProductInputBridge: {
        type: "object",
        properties: {
          qtyRequired: { type: "number", example: 1 },
        },
      },
      Input: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Pão" },
          stockQty: { type: "integer", example: 10 },
          unit: { type: "string", example: "un" },
          ProductInput: { $ref: "#/components/schemas/ProductInputBridge" },
        },
      },
      InputStock: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Pão" },
          stockQty: { type: "integer", example: 10 },
          unit: { type: "string", example: "un" },
        },
        required: ["id", "name", "stockQty", "unit"],
      },
      PaginationMeta: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 25 },
          totalPages: { type: "integer", example: 3 },
          hasNext: { type: "boolean", example: true },
          hasPrev: { type: "boolean", example: false },
        },
        required: [
          "page",
          "limit",
          "total",
          "totalPages",
          "hasNext",
          "hasPrev",
        ],
      },
      PaginatedProductsResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Product" },
          },
          meta: { $ref: "#/components/schemas/PaginationMeta" },
        },
        required: ["data", "meta"],
      },
      PaginatedInputsResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/InputStock" },
          },
          meta: { $ref: "#/components/schemas/PaginationMeta" },
        },
        required: ["data", "meta"],
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "X-Burger" },
          description: {
            type: "string",
            nullable: true,
            example: "Hambúrguer artesanal com queijo derretido e pão brioche.",
          },
          price: { type: "string", example: "25.00" },
          inputs: {
            type: "array",
            items: { $ref: "#/components/schemas/Input" },
          },
        },
      },
      CreateProductPayload: {
        type: "object",
        properties: {
          name: { type: "string", example: "X-Bacon" },
          description: {
            type: "string",
            example: "Blend bovino com bacon crocante e molho especial.",
          },
          price: { type: "number", example: 32 },
        },
        required: ["name", "price"],
      },
      CreateInputPayload: {
        type: "object",
        properties: {
          name: { type: "string", example: "Cebola" },
          unit: { type: "string", example: "un" },
          stockQty: { type: "integer", minimum: 0, example: 5 },
        },
        required: ["name", "unit"],
      },
      UpdateStockPayload: {
        oneOf: [
          {
            type: "object",
            properties: {
              delta: { type: "integer", example: 2 },
            },
            required: ["delta"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              stockQty: { type: "integer", minimum: 0, example: 10 },
            },
            required: ["stockQty"],
            additionalProperties: false,
          },
        ],
      },
      CreateOrderItemPayload: {
        type: "object",
        properties: {
          productId: { type: "integer", minimum: 1, example: 1 },
          quantity: { type: "integer", minimum: 1, example: 2 },
        },
        required: ["productId", "quantity"],
      },
      CreateOrderPayload: {
        type: "object",
        properties: {
          clientRequestId: {
            type: "string",
            maxLength: 80,
            example: "ord-001",
            description:
              "Chave de idempotência. Obrigatória quando o header Idempotency-Key não é enviado.",
          },
          items: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/CreateOrderItemPayload" },
          },
        },
        required: ["items"],
      },
      OrderItemProduct: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "X-Burger" },
          price: { type: "string", example: "25.00" },
        },
        required: ["id", "name", "price"],
      },
      OrderItemResult: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          orderId: { type: "integer", example: 1 },
          productId: { type: "integer", example: 1 },
          qty: { type: "integer", example: 2 },
          unitPrice: { type: "string", example: "25.00" },
          lineTotal: { type: "string", example: "50.00" },
          order_id: { type: "integer", example: 1 },
          product_id: { type: "integer", example: 1 },
          product: { $ref: "#/components/schemas/OrderItemProduct" },
        },
        required: [
          "id",
          "orderId",
          "productId",
          "qty",
          "unitPrice",
          "lineTotal",
        ],
      },
      UpdateOrderStatusPayload: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["CREATED", "CANCELED"],
            example: "CANCELED",
          },
        },
        required: ["status"],
      },
      OrderResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          clientRequestId: { type: "string", example: "ord-001" },
          status: { type: "string", example: "CREATED" },
          total: { type: "string", example: "50.00" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItemResult" },
          },
          reused: { type: "boolean", example: false },
        },
        required: ["id", "clientRequestId", "status", "total", "items"],
      },
      PaginatedOrdersResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderResponse" },
          },
          meta: { $ref: "#/components/schemas/PaginationMeta" },
        },
        required: ["data", "meta"],
      },
      UpdateProductPayload: {
        type: "object",
        properties: {
          name: { type: "string", example: "X-Burger Especial" },
          description: {
            type: "string",
            example: "Hambúrguer com pão selado na manteiga e queijo prato.",
          },
          price: { type: "number", example: 29.9 },
        },
        minProperties: 1,
      },
      UpdateRecipePayload: {
        type: "object",
        properties: {
          inputs: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              properties: {
                inputId: { type: "integer", example: 1 },
                qtyRequired: { type: "number", example: 1 },
              },
              required: ["inputId", "qtyRequired"],
            },
          },
        },
        required: ["inputs"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "VALIDATION_ERROR" },
          message: { type: "string", example: "Payload inválido" },
          details: {
            oneOf: [
              {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "name" },
                    message: {
                      type: "string",
                      example: "name é obrigatório",
                    },
                  },
                },
              },
              {
                type: "object",
                additionalProperties: true,
              },
            ],
          },
        },
        required: ["error", "message"],
      },
    },
  },
};

export default openApiSpec;
