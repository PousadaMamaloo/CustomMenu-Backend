## Rotas de Itens (`/api/itens`)

### 1. Criar Item
- **Caminho:** `/api/itens/criar`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Validação:** `itemValidador`
- **Descrição:** Cria um novo item no sistema.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome_item": "string",
    "desc_item": "string",
    "foto_item": "string (imagem em base64 no formato data URI)",
    "categ_item": "string",
    "qntd_max_hospede": "number",
    "valor_item": "number"
  }
  ```
- **Respostas:**
  - `201 Created`: Item criado com sucesso.
    ```json
    {
      "mensagem": "Item criado com sucesso!",
      "item": { ... }
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 2. Listar Itens
- **Caminho:** `/api/itens/listar`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista todos os itens existentes.
- **Respostas:**
  - `200 OK`: Lista de itens retornada com sucesso.
    ```json
    [
      { "id": 1, "nome": "...", "preco": ..., "categoria": "...", ... },
      { "id": 2, "nome": "...", "preco": ..., "categoria": "...", ... }
    ]
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 3. Atualizar Item
- **Caminho:** `/api/itens/atualizar/:id`
- **Método HTTP:** `PUT`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Validação:** `itemValidador`
- **Descrição:** Atualiza as informações de um item existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `id`: ID do item (number).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome_item": "string" (opcional),
    "desc_item": "string" (opcional),
    "foto_item": "string (imagem em base64 no formato data URI)" (opcional),
    "categ_item": "string" (opcional),
    "qntd_max_hospede": "number" (opcional),
    "valor_item": "number" (opcional)
  }
  ```
- **Respostas:**
  - `200 OK`: Item atualizado com sucesso.
    ```json
    {
      "mensagem": "Item atualizado com sucesso!"
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `404 Not Found`: Item não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 4. Excluir Item
- **Caminho:** `/api/itens/excluir/:id`
- **Método HTTP:** `DELETE`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Exclui um item existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `id`: ID do item (number).
- **Respostas:**
  - `200 OK`: Item excluído com sucesso.
    ```json
    {
      "mensagem": "Item excluído com sucesso!"
    }
    ```
  - `404 Not Found`: Item não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 5. Listar Categorias Únicas
- **Caminho:** `/api/itens/categorias`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista todas as categorias únicas de itens existentes.
- **Respostas:**
  - `200 OK`: Lista de categorias retornada com sucesso.
    ```json
    [
      "Bebidas",
      "Comidas",
      "Sobremesas"
    ]
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.