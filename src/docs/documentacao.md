# Documentação da API CustomMenu-Backend

Esta documentação detalha os endpoints da API CustomMenu-Backend, incluindo métodos HTTP, caminhos, parâmetros esperados, exemplos de requisição e resposta, e possíveis códigos de erro.

## Rotas de Quartos (`/api/quartos`)

### 1. Criar Quarto
- **Caminho:** `/api/quartos/criar`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador`)
- **Validação:** `quartoValidador`
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
- **Caminho:** `/api/quartos/listar`
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
- **Caminho:** `/api/quartos/buscar/:num`
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
- **Autenticação:** Necessária (via `autenticador`)
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
- **Caminho:** `/api/quartos/:num`
- **Método HTTP:** `DELETE`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Deleta um quarto existente pelo seu número.
- **Parâmetros de Caminho:**
  - `num`: Número do quarto (string).
- **Respostas:**
  - `200 OK`: Quarto deletado com sucesso.
    ```json
    {
      "mensagem": "Quarto deletado com sucesso!"
    }
    ```
  - `404 Not Found`: Quarto não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.




## Rotas de Hóspedes (`/api/hospedes`)

### 1. Login Hóspede
- **Caminho:** `/api/hospedes/login`
- **Método HTTP:** `POST`
- **Autenticação:** Nenhuma
- **Descrição:** Realiza o login de um hóspede e retorna um token de autenticação.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "email": "string",
    "senha": "string"
  }
  ```
- **Respostas:**
  - `200 OK`: Login bem-sucedido.
    ```json
    {
      "token": "string"
    }
    ```
  - `400 Bad Request`: Credenciais inválidas.
  - `500 Internal Server Error`: Erro interno do servidor.

### 2. Cadastrar Hóspede
- **Caminho:** `/api/hospedes/cadastrar`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador`)
- **Validação:** `hospedeValidador`
- **Descrição:** Cadastra um novo hóspede no sistema.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome": "string",
    "email": "string",
    "senha": "string",
    "telefone": "string",
    "quartoId": "number"
  }
  ```
- **Respostas:**
  - `201 Created`: Hóspede cadastrado com sucesso.
    ```json
    {
      "mensagem": "Hóspede cadastrado com sucesso!",
      "hospede": { ... }
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 3. Listar Hóspedes
- **Caminho:** `/api/hospedes/listar`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista todos os hóspedes existentes.
- **Respostas:**
  - `200 OK`: Lista de hóspedes retornada com sucesso.
    ```json
    [
      { "id": 1, "nome": "...", "email": "...", ... },
      { "id": 2, "nome": "...", "email": "...", ... }
    ]
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 4. Buscar Hóspede por ID
- **Caminho:** `/api/hospedes/:id`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Busca um hóspede específico pelo seu ID.
- **Parâmetros de Caminho:**
  - `id`: ID do hóspede (number).
- **Respostas:**
  - `200 OK`: Hóspede encontrado.
    ```json
    {
      "id": 1,
      "nome": "...",
      "email": "...",
      ...
    }
    ```
  - `404 Not Found`: Hóspede não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 5. Atualizar Hóspede
- **Caminho:** `/api/hospedes/:id`
- **Método HTTP:** `PUT`
- **Autenticação:** Necessária (via `autenticador`)
- **Validação:** `hospedeValidador`
- **Descrição:** Atualiza as informações de um hóspede existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `id`: ID do hóspede (number).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome": "string" (opcional),
    "email": "string" (opcional),
    "senha": "string" (opcional),
    "telefone": "string" (opcional),
    "quartoId": "number" (opcional)
  }
  ```
- **Respostas:**
  - `200 OK`: Hóspede atualizado com sucesso.
    ```json
    {
      "mensagem": "Hóspede atualizado com sucesso!"
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `404 Not Found`: Hóspede não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 6. Deletar Hóspede
- **Caminho:** `/api/hospedes/:id`
- **Método HTTP:** `DELETE`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Deleta um hóspede existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `id`: ID do hóspede (number).
- **Respostas:**
  - `200 OK`: Hóspede deletado com sucesso.
    ```json
    {
      "mensagem": "Hóspede deletado com sucesso!"
    }
    ```
  - `404 Not Found`: Hóspede não encontrado.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.




## Rotas de Administrador (`/api/administrador`)

### 1. Login Administrador
- **Caminho:** `/api/administrador/login`
- **Método HTTP:** `POST`
- **Autenticação:** Nenhuma
- **Descrição:** Realiza o login de um administrador e retorna um token de autenticação.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "email": "string",
    "senha": "string"
  }
  ```
- **Respostas:**
  - `200 OK`: Login bem-sucedido.
    ```json
    {
      "token": "string"
    }
    ```
  - `400 Bad Request`: Credenciais inválidas.
  - `500 Internal Server Error`: Erro interno do servidor.




## Rotas de Itens (`/api/itens`)

### 1. Criar Item
- **Caminho:** `/api/itens/criar`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador`)
- **Validação:** `itemValidador`
- **Descrição:** Cria um novo item no sistema.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome": "string",
    "descricao": "string",
    "preco": "number",
    "categoria": "string",
    "disponivel": "boolean"
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
- **Autenticação:** Necessária (via `autenticador`)
- **Validação:** `itemValidador`
- **Descrição:** Atualiza as informações de um item existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `id`: ID do item (number).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome": "string" (opcional),
    "descricao": "string" (opcional),
    "preco": "number" (opcional),
    "categoria": "string" (opcional),
    "disponivel": "boolean" (opcional)
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
- **Autenticação:** Necessária (via `autenticador`)
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




## Rotas de Itens de Evento (`/api/eventoItem`)

### 1. Associar Item a Evento
- **Caminho:** `/api/eventoItem/`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador`)
- **Validação:** `eventoItemValidador`, `validarRequisicao`
- **Descrição:** Associa um item a um evento.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "eventoId": "number",
    "itemId": "number"
  }
  ```
- **Respostas:**
  - `201 Created`: Item associado ao evento com sucesso.
    ```json
    {
      "mensagem": "Item associado ao evento com sucesso!",
      "associacao": { ... }
    }
    ```
  - `400 Bad Request`: Dados inválidos fornecidos.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 2. Listar Associações de Itens de Evento
- **Caminho:** `/api/eventoItem/`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista todas as associações entre itens e eventos.
- **Respostas:**
  - `200 OK`: Lista de associações retornada com sucesso.
    ```json
    [
      { "id": 1, "eventoId": 1, "itemId": 1, "createdAt": "...", "updatedAt": "..." },
      { "id": 2, "eventoId": 1, "itemId": 2, "createdAt": "...", "updatedAt": "..." }
    ]
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.


