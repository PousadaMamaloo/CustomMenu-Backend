## Rotas de Itens de Evento (`/api/eventoItem`)

### 1. Associar Item a Evento
- **Caminho:** `/api/eventoItem/`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
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
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
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