## Rotas de Pedidos (`/api/pedidos`)

### 1. Criar Pedido
- **Caminho:** `/api/pedidos`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador`)
- **Validação:** `pedidoValidadorCriar`
- **Descrição:** Cria um novo pedido no sistema.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "id_quarto": "number",
    "id_evento": "number",
    "id_horario": "number",
    "obs_pedido": "string (opcional, até 300 caracteres)",
    "itens": [
      {
        "id_item": "number",
        "qntd_item": "number"
      }
    ]
  }
  ```
- **Respostas:**
  - `201 Created`: Pedido criado com sucesso.
    ```json
    {
      "mensagem": "Pedido criado com sucesso!",
      "data": { "id_pedido": "number" }
    }
    ```
  - `400 Bad Request`: Erro de validação ou dados inválidos.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 2. Obter Pedido por ID
- **Caminho:** `/api/pedidos/:idPedido`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Obtém os detalhes de um pedido específico pelo seu ID.
- **Parâmetros de Caminho:**
  - `idPedido`: ID do pedido (number).
- **Respostas:**
  - `200 OK`: Pedido encontrado com sucesso.
    ```json
    {
      "mensagem": "Pedido encontrado com sucesso!",
      "data": {
        "id_pedido": "number",
        "evento": "string" (nome do evento, se houver),
        "data_pedido": "YYYY-MM-DDTHH:MM:SS.sssZ",
        "horario_cafe_manha": "string" (formato HH:MM, ou null),
        "itens": [
          {
            "id_item": "number",
            "nome": "string",
            "quantidade": "number",
            "valor_unitario": "number",
            "valor_total": "number",
            "foto_item": "string" (imagem em base64 no formato data URI)
          }
        ]
      }
    }
    ```
  - `404 Not Found`: Pedido não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 3. Atualizar Pedido
- **Caminho:** `/api/pedidos/:idPedido`
- **Método HTTP:** `PUT`
- **Autenticação:** Necessária (via `autenticador`)
- **Validação:** `pedidoValidadorAtualizar`
- **Descrição:** Atualiza os itens de um pedido existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `idPedido`: ID do pedido (number).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "itens": [
      {
        "id_item": "number",
        "qntd_item": "number"
      }
    ]
  }
  ```
- **Respostas:**
  - `200 OK`: Pedido atualizado com sucesso.
    ```json
    {
      "mensagem": "Pedido atualizado com sucesso!"
    }
    ```
  - `400 Bad Request`: Erro de validação ou dados inválidos.
  - `404 Not Found`: Pedido não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 4. Deletar Pedido
- **Caminho:** `/api/pedidos/:idPedido`
- **Método HTTP:** `DELETE`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Deleta um pedido existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `idPedido`: ID do pedido (number).
- **Respostas:**
  - `200 OK`: Pedido excluído com sucesso.
    ```json
    {
      "mensagem": "Pedido excluído com sucesso!"
    }
    ```
  - `404 Not Found`: Pedido não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `500 Internal Server Error`: Erro interno do servidor.

### 5. Listar Pedidos por Quarto
- **Caminho:** `/api/pedidos/quarto/:numQuarto`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista todos os pedidos associados a um quarto específico.
- **Parâmetros de Caminho:**
  - `numQuarto`: Número do quarto (string).
- **Respostas:**
  - `200 OK`: Pedidos do quarto listados com sucesso.
    ```json
    {
      "mensagem": "Pedidos do quarto listados com sucesso!",
      "data": [
        { "id_pedido": "number", "id_quarto": "number", "id_evento": "number" (ou null), "data_pedido": "YYYY-MM-DDTHH:MM:SS.sssZ", "Items": [...] },
        ...
      ]
    }
    ```
  - `404 Not Found`: Quarto não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.




### 6. Listar Pedidos de Eventos Ativos
- **Caminho:** `/api/pedidos/eventos/ativos`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Lista todos os pedidos associados a eventos que estão ativos na data atual (recorrentes ou com data específica para hoje).
- **Respostas:**
  - `200 OK`: Pedidos de eventos ativos listados com sucesso.
    ```json
    [
      {
        "id_pedido": "number",
        "data_pedido": "YYYY-MM-DDTHH:MM:SS.sssZ",
        "horario_cafe_manha": "string" (formato HH:MM, ou null),
        "quarto": "string" (número do quarto),
        "evento": {
          "id_evento": "number",
          "nome_evento": "string",
          "desc_evento": "string"
        },
        "itens": [
          {
            "id_item": "number",
            "nome_item": "string",
            "quantidade": "number",
            "valor_unitario": "number",
            "valor_total": "number",
            "foto_item": "string" (imagem em base64 no formato data URI)
          }
        ]
      }
    ]
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `500 Internal Server Error`: Erro interno do servidor.

### 7. Relatório Geral de Evento
- **Caminho:** `/api/pedidos/relatorio/:idEvento`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Gera um relatório detalhado para um evento específico, incluindo resumo de pedidos, itens mais vendidos e pedidos detalhados.
- **Parâmetros de Caminho:**
  - `idEvento`: ID do evento (number).
- **Respostas:**
  - `200 OK`: Relatório gerado com sucesso.
    ```json
    {
      "mensagem": "Relatório geral do evento gerado com sucesso!",
      "data": {
        "evento": {
          "id_evento": "number",
          "nome_evento": "string",
          "desc_evento": "string"
        },
        "resumo": {
          "total_pedidos": "number",
          "total_quartos_participantes": "number",
          "valor_total": "number"
        },
        "itens_mais_pedidos": [
          {
            "nome_item": "string",
            "quantidade": "number",
            "valor_unitario": "number",
            "valor_total": "number"
          }
        ],
        "pedidos_detalhados": [
          {
            "id_pedido": "number",
            "data_pedido": "YYYY-MM-DDTHH:MM:SS.sssZ",
            "quarto": "string" (número do quarto),
            "horario_cafe_manha": "string" (formato HH:MM, ou null),
            "itens": [
              {
                "nome_item": "string",
                "quantidade": "number",
                "valor_unitario": "number",
                "valor_total": "number",
                "foto_item": "string" (imagem em base64 no formato data URI)
              }
            ]
          }
        ]
      }
    }
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `404 Not Found`: Evento não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.

### 8. Histórico de Pedidos com Paginação
- **Caminho:** `/api/pedidos/historico`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Lista o histórico de todos os pedidos com suporte a paginação.
- **Parâmetros de Query:**
  - `page`: Número da página (padrão: 1).
  - `limit`: Quantidade de registros por página (padrão: 50).
- **Respostas:**
  - `200 OK`: Histórico de pedidos listado com sucesso.
    ```json
    {
      "mensagem": "Histórico de pedidos listado com sucesso!",
      "data": {
        "pedidos": [
          {
            "id_pedido": "number",
            "data_pedido": "YYYY-MM-DDTHH:MM:SS.sssZ",
            "quarto": "string" (número do quarto),
            "horario_cafe_manha": "string" (formato HH:MM, ou null),
            "evento": {
              "nome_evento": "string",
              "desc_evento": "string"
            } (ou null)
          }
        ],
        "paginacao": {
          "pagina_atual": "number",
          "total_paginas": "number",
          "total_registros": "number",
          "registros_por_pagina": "number"
        }
      }
    }
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `500 Internal Server Error`: Erro interno do servidor.




### 9. Listar Pedidos de Hoje
- **Caminho:** `/api/pedidos/hoje`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Lista todos os pedidos realizados na data atual.
- **Respostas:**
  - `200 OK`: Pedidos de hoje listados com sucesso.
    ```json
    {
      "mensagem": "Pedidos de hoje listados com sucesso!",
      "data": [
        {
          "id_pedido": "number",
          "data_pedido": "YYYY-MM-DDTHH:MM:SS.sssZ",
          "quarto": "string" (número do quarto),
          "horario_cafe_manha": "string" (formato HH:MM, ou null),
          "evento": {
            "nome_evento": "string",
            "desc_evento": "string"
          } (ou null)
        }
      ]
    }
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `500 Internal Server Error`: Erro interno do servidor.


