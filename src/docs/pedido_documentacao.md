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
    "id_evento": "number" (opcional),
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
        "itens": [
          {
            "id_item": "number",
            "nome": "string",
            "quantidade": "number",
            "valor_unitario": "number",
            "valor_total": "number"
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


