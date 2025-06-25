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
    "num_quarto": "string",
    "telef_hospede": "string"
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
    "nome_hospede": "string",
    "email_hospede": "string",
    "telef_hospede": "string",
    "data_chegada": "YYYY-MM-DD",
    "data_saida": "YYYY-MM-DD"
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
    "nome_hospede": "string" (opcional),
    "email_hospede": "string" (opcional),
    "telef_hospede": "string" (opcional),
    "data_chegada": "YYYY-MM-DD" (opcional),
    "data_saida": "YYYY-MM-DD" (opcional)
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
    "usuario": "string",
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
    "nome_item": "string",
    "desc_item": "string",
    "foto_item": "string",
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
- **Autenticação:** Necessária (via `autenticador`)
- **Validação:** `itemValidador`
- **Descrição:** Atualiza as informações de um item existente pelo seu ID.
- **Parâmetros de Caminho:**
  - `id`: ID do item (number).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome_item": "string" (opcional),
    "desc_item": "string" (opcional),
    "foto_item": "string" (opcional),
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




## Rotas de Eventos (`/api/eventos## Rotas de Eventos (`/api/eventos`)

### 1. Listar Eventos
- **Caminho:** `/api/eventos/`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista todos os eventos existentes.
- **Respostas:**
  - `200 OK`: Lista de eventos retornada com sucesso.
    ```json
    [
      { "id": 1, "nome": "Evento 1", "datas": ["YYYY-MM-DD", "YYYY-MM-DD"], "horaInicio": "HH:MM", "horarios": ["HH:MM"], ... },
      { "id": 2, "nome": "Evento 2", "datas": ["YYYY-MM-DD"], "horarios": ["HH:MM", "HH:MM"], ... }
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
    "sts_evento": "boolean",
    "recorrencia": "boolean",
    "publico_alvo": "boolean",
    "datas": ["YYYY-MM-DD"],
    "quartos": [101, 102]
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
    "sts_evento": "boolean" (opcional),
    "recorrencia": "boolean" (opcional),
    "publico_alvo": "boolean" (opcional),
     "datas": ["YYYY-MM-DD", "YYYY-MM-DD"],
    "quartos": [int]
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

### 9. Listar Quartos de um Evento

- **Caminho:** `/api/eventos/:id/quartos`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)

### 10. Adicionar Datas a um Evento

- **Caminho:** `/api/eventos/:id/datas`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Associa datas específicas ao evento.
- **Corpo:**

  ```json
  {
    "datas": ["2025-06-20", "2025-06-21"]
  }
  ```

### 11. Listar Datas de um Evento

- **Caminho:** `/api/eventos/:id/datas`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)



### 8. Listar Eventos para Hóspede
- **Caminho:** `/api/eventos/hospede`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista os eventos disponíveis para o hóspede logado, considerando recorrência, datas específicas e quartos associados.
- **Respostas:**
  - `200 OK`: Lista de eventos retornada com sucesso.
    ```json
    [
      { "id_evento": 1, "nome_evento": "Evento Recorrente", "desc_evento": "Descrição", "sts_evento": true, "recorrencia": true, "publico_alvo": true, "horarios": ["HH:MM"], "datas": [], "quartos": [] },
      { "id_evento": 2, "nome_evento": "Evento do Quarto", "desc_evento": "Descrição", "sts_evento": true, "recorrencia": false, "publico_alvo": false, "horarios": ["HH:MM"], "datas": [], "quartos": ["num_quarto"] }
    ]
    ```
  - `400 Bad Request`: Número do quarto do hóspede não encontrado no token.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `404 Not Found`: Quarto do hóspede não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.




 inválidos fornecidos.
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

### 9. Listar Quartos de um Evento

- **Caminho:** `/api/eventos/:id/quartos`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)

### 10. Adicionar Datas a um Evento

- **Caminho:** `/api/eventos/:id/datas`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Associa datas específicas ao evento.
- **Corpo:**

  ```json
  {
    "datas": ["2025-06-20", "2025-06-21"]
  }
  ```

### 11. Listar Datas de um Evento

- **Caminho:** `/api/eventos/:id/datas`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)



### 8. Listar Eventos para Hóspede
- **Caminho:** `/api/eventos/hospede`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Lista os eventos disponíveis para o hóspede logado, considerando recorrência, datas específicas e quartos associados.
- **Respostas:**
  - `200 OK`: Lista de eventos retornada com sucesso.
    ```json
    [
      { "id_evento": 1, "nome_evento": "Evento Recorrente", "desc_evento": "Descrição", "sts_evento": true, "recorrencia": true, "publico_alvo": true, "horarios": ["HH:MM"], "datas": [], "quartos": [] },
      { "id_evento": 2, "nome_evento": "Evento do Quarto", "desc_evento": "Descrição", "sts_evento": true, "recorrencia": false, "publico_alvo": false, "horarios": ["HH:MM"], "datas": [], "quartos": ["num_quarto"] }
    ]
    ```
  - `400 Bad Request`: Número do quarto do hóspede não encontrado no token.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `404 Not Found`: Quarto do hóspede não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.




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
            "valor_total": "number"
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
            "itens": [
              {
                "nome_item": "string",
                "quantidade": "number",
                "valor_unitario": "number",
                "valor_total": "number"
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
            "evento": {
              "nome_evento": "string",
              "desc_evento": "string"
            } (ou null),
            "itens": [
              {
                "nome_item": "string",
                "quantidade": "number",
                "valor_unitario": "number",
                "valor_total": "number"
              }
            ],
            "valor_total_pedido": "number"
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









## Rotas de Autenticação (`/api/autenticacao`)

Consulte a documentação detalhada em [autenticacao_documentacao.md](autenticacao_documentacao.md).


