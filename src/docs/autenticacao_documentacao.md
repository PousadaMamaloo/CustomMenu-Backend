## Rotas de Autenticação (`/api/autenticacao`)

### 1. Login Hóspede
- **Caminho:** `/api/autenticacao/login`
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

### 2. Logout
- **Caminho:** `/api/autenticacao/logout`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Invalida o token JWT do usuário, realizando o logout.
- **Respostas:**
  - `200 OK`: Logout realizado com sucesso.
  - `400 Bad Request`: Token não fornecido ou inválido.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 3. Validar Token JWT
- **Caminho:** `/api/autenticacao/validar-token`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Verifica se o token JWT fornecido na requisição é válido e não está na blacklist.
- **Respostas:**
  - `200 OK`: Token JWT válido.
    ```json
    {
      "status": 200,
      "message": "Token JWT válido.",
      "data": {
        "usuario": {
          "id": "number",
          "email": "string",
          "tipo": "string" (e.g., "administrador", "hospede")
        }
      }
    }
    ```
  - `401 Unauthorized`: Token de autenticação ausente, inválido ou na blacklist.
  - `500 Internal Server Error`: Erro interno do servidor.


