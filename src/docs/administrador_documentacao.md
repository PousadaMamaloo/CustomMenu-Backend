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