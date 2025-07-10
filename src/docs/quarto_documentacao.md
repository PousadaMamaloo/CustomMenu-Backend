## Rotas de Quartos (`/api/quartos`)

### 1. Criar Quarto
- **Caminho:** `/api/quartos`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Cria um novo quarto no sistema.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "numero": "string",
    "capacidade": "number",
    "disponivel": "boolean"
  }
  ```
- **Respostas:**
  - `201 Created`: Quarto criado com sucesso.
    ```json
    {
      "mensagem": "Quarto criado com sucesso!",
      "quarto": { ... }
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 2. Listar Quartos
- **Caminho:** `/api/quartos`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista todos os quartos existentes.
- **Respostas:**
  - `200 OK`: Lista de quartos retornada com sucesso.
    ```json
    [
      { "id": 1, "numero": "101", "capacidade": 2, "disponivel": true, "createdAt": "...", "updatedAt": "..." },
      { "id": 2, "numero": "102", "capacidade": 3, "disponivel": false, "createdAt": "...", "updatedAt": "..." }
    ]
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 3. Buscar Quarto por Número
- **Caminho:** `/api/quartos/:num`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Busca um quarto específico pelo seu número.
- **Parâmetros de Caminho:**
  - `num`: Número do quarto (string).
- **Respostas:**
  - `200 OK`: Quarto encontrado.
    ```json
    {
      "id": 1,
      "numero": "101",
      "capacidade": 2,
      "disponivel": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
    ```
  - `404 Not Found`: Quarto não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 4. Atualizar Quarto
- **Caminho:** `/api/quartos/:num`
- **Método HTTP:** `PUT`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Atualiza as informações de um quarto existente pelo seu número.
- **Parâmetros de Caminho:**
  - `num`: Número do quarto (string).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "capacidade": "number" (opcional),
    "disponivel": "boolean" (opcional)
  }
  ```
- **Respostas:**
  - `200 OK`: Quarto atualizado com sucesso.
    ```json
    {
      "mensagem": "Quarto atualizado com sucesso!"
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `404 Not Found`: Quarto não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 5. Deletar Quarto
- **Caminho:** `/api/quartos/:num` num = número do quarto
- **Método HTTP:** `DELETE`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Exclui um quarto existente pelo seu número. Caso o quarto esteja associado a algum evento, a associação é removida automaticamente antes da exclusão do quarto.
- **Parâmetros de Caminho:**
  - `num`: Número do quarto (string).
- **Respostas:**
  - `200 OK`: Quarto deletado com sucesso.
    ```json
    {
      "mensagem": "Quarto excluído com sucesso!"
    }
    ```
  - `404 Not Found`: Quarto não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.
