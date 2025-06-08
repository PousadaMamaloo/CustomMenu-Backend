## Rotas de Eventos (`/api/eventos`)

### 1. Listar Eventos
- **Caminho:** `/api/eventos/`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista todos os eventos existentes.
- **Respostas:**
  - `200 OK`: Lista de eventos retornada com sucesso.
    ```json
    [
      { "id": 1, "nome": "Evento 1", "data": "YYYY-MM-DD", "horaInicio": "HH:MM", "horaFim": "HH:MM", ... },
      { "id": 2, "nome": "Evento 2", "data": "YYYY-MM-DD", "horaInicio": "HH:MM", "horaFim": "HH:MM", ... }
    ]
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 2. Listar Itens por Evento
- **Caminho:** `/api/eventos/:id/itens`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Lista os itens associados a um evento específico.
- **Parâmetros de Caminho:**
  - `id`: ID do evento (number).
- **Respostas:**
  - `200 OK`: Lista de itens do evento retornada com sucesso.
    ```json
    [
      { "id": 1, "nome": "Item 1", "preco": 10.00, ... },
      { "id": 2, "nome": "Item 2", "preco": 15.50, ... }
    ]
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `404 Not Found`: Evento não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.

### 3. Criar Evento
- **Caminho:** `/api/eventos/`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Validação:** `eventoValidador`
- **Descrição:** Cria um novo evento.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome": "string",
    "data": "YYYY-MM-DD",
    "horaInicio": "HH:MM",
    "horaFim": "HH:MM",
    "descricao": "string" (opcional)
  }
  ```
- **Respostas:**
  - `201 Created`: Evento criado com sucesso.
    ```json
    {
      "mensagem": "Evento criado com sucesso!",
      "evento": { ... }
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `500 Internal Server Error`: Erro interno do servidor.

### 4. Atualizar Evento
- **Caminho:** `/api/eventos/:id`
- **Método HTTP:** `PUT`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Validação:** `eventoValidador`
- **Descrição:** Atualiza as informações de um evento existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `id`: ID do evento (number).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome": "string" (opcional),
    "data": "YYYY-MM-DD" (opcional),
    "horaInicio": "HH:MM" (opcional),
    "horaFim": "HH:MM" (opcional),
    "descricao": "string" (opcional)
  }
  ```
- **Respostas:**
  - `200 OK`: Evento atualizado com sucesso.
    ```json
    {
      "mensagem": "Evento atualizado com sucesso!"
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `404 Not Found`: Evento não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.

### 5. Excluir Evento
- **Caminho:** `/api/eventos/:id`
- **Método HTTP:** `DELETE`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Exclui um evento existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `id`: ID do evento (number).
- **Respostas:**
  - `200 OK`: Evento excluído com sucesso.
    ```json
    {
      "mensagem": "Evento excluído com sucesso!"
    }
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `404 Not Found`: Evento não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.