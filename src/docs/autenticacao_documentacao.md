## Rotas de Autenticação (`/api/auth`)

### 1. Login de Hóspede
- **Caminho:** `/api/auth/login`
- **Método HTTP:** `POST`
- **Autenticação:** Não necessária
- **Descrição:** Realiza o login de um hóspede no sistema usando número do quarto e telefone.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "num_quarto": "string",
    "telef_hospede": "string"
  }
  ```
- **Respostas:**
  - `200 OK`: Login realizado com sucesso.
    ```json
    {
      "status": 200,
      "message": "Login realizado com sucesso."
    }
    ```
  - `401 Unauthorized`: Telefone incorreto.
  - `404 Not Found`: Quarto não encontrado ou sem hóspede responsável.
  - `500 Internal Server Error`: Erro interno do servidor.

### 2. Logout
- **Caminho:** `/api/auth/logout`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Realiza o logout do usuário, invalidando o token JWT ativo e removendo o cookie de autenticação.
- **Corpo da Requisição:** Não necessário (o token é obtido automaticamente do cookie ou header Authorization)
- **Respostas:**
  - `200 OK`: Logout realizado com sucesso.
    ```json
    {
      "status": 200,
      "message": "Logout realizado com sucesso."
    }
    ```
  - `400 Bad Request`: Token não fornecido ou inválido para logout.
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

**Observações sobre o Logout:**
- O token JWT é adicionado a uma blacklist interna para impedir seu uso futuro
- O cookie de autenticação é removido do navegador
- Tokens invalidados são automaticamente limpos da blacklist após sua expiração natural
- A funcionalidade funciona tanto com tokens enviados via cookie quanto via header Authorization

