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
    "nome_evento": "string",
    "desc_evento": "string",
    "horarios": ["HH:MM"],
    "sts_evento": "boolean"
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
    "nome_evento": "string" (opcional),
    "desc_evento": "string" (opcional),
    "horarios": ["HH:MM"] (opcional),
    "sts_evento": "boolean" (opcional)
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

### 6. Vincular Itens a Evento
- **Caminho:** `/api/eventos/:id/itens`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Vincula um ou mais itens a um evento específico.
- **Parâmetros de Caminho:**
  - `id`: ID do evento (number).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "itensIds": ["number"]
  }
  ```
- **Respostas:**
  - `200 OK`: Itens vinculados com sucesso.
    ```json
    {
      "mensagem": "Itens vinculados ao evento com sucesso!"
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `404 Not Found`: Evento ou itens não encontrados.
  - `500 Internal Server Error`: Erro interno do servidor.

### 7. Desvincular Item de Evento
- **Caminho:** `/api/eventos/:id/itens/:id_item`
- **Método HTTP:** `DELETE`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Desvincula um item de um evento específico.
- **Parâmetros de Caminho:**
  - `id`: ID do evento (number).
  - `id_item`: ID do item a ser desvinculado (number).
- **Respostas:**
  - `200 OK`: Item desvinculado com sucesso.
    ```json
    {
      "mensagem": "Item desvinculado do evento com sucesso!"
    }
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `404 Not Found`: Evento ou item não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.

