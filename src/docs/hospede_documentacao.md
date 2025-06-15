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
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
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
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
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
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
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
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
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
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
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