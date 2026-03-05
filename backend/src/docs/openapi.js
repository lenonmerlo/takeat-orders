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
                  },
                  required: ["status"],
                },
              },
            },
          },
          500: { $ref: "#/components/responses/InternalErrorResponse" },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Lista produtos com ficha técnica",
        responses: {
          200: {
            description: "Lista de produtos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
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
        responses: {
          200: {
            description: "Lista de insumos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/InputStock" },
                },
                examples: {
                  success: { $ref: "#/components/examples/ListInputsExample" },
                },
              },
            },
          },
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
        value: [
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
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "X-Burger" },
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
      UpdateProductPayload: {
        type: "object",
        properties: {
          name: { type: "string", example: "X-Burger Especial" },
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
