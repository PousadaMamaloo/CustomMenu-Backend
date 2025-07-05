## Rotas de Hóspedes (`/api/hospedes`)

Esta documentação detalha os endpoints para gerenciar os hóspedes e sua associação com os quartos.

---

### 1. Cadastrar Hóspede e Associar a um Quarto
- **Caminho:** `/api/hospedes`
- **Método HTTP:** `POST`
- **Autenticação:** Necessária (Administrador)
- **Descrição:** Cadastra um novo hóspede e o associa imediatamente a um quarto vago. A operação é transacional: ou ambos os passos são concluídos com sucesso, ou nada é salvo no banco de dados.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "id_quarto": 15,
    "nome_hospede": "Maria Souza",
    "email_hospede": "maria.s@exemplo.com",
    "telef_hospede": "82999887766",
    "data_chegada": "2025-08-01",
    "data_saida": "2025-08-10"
  }
  ```
  * `id_quarto` (number): **Obrigatório**. ID do quarto a ser ocupado.
- **Respostas:**
  - `201 Created`: Hóspede criado e associado com sucesso.
    ```json
    {
      "status": 201,
      "message": "Hóspede criado e associado ao quarto com sucesso!",
      "data": { }
    }
    ```
  - `400 Bad Request`: O `id_quarto` não foi fornecido.
  - `404 Not Found`: O quarto com o `id_quarto` fornecido não foi encontrado.
  - `409 Conflict`: O quarto já está ocupado por outro hóspede.
  - `500 Internal Server Error`: Erro interno do servidor.

### 2. Listar Hóspedes
- **Caminho:** `/api/hospedes`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (Administrador)
- **Descrição:** Retorna uma lista de todos os hóspedes cadastrados no sistema.
- **Respostas:**
  - `200 OK`: Lista de hóspedes retornada com sucesso.
    ```json
    {
      "status": 200,
      "message": "Lista de hóspedes.",
      "data": [ ]
    }
    ```
  - `500 Internal Server Error`: Erro interno do servidor.

### 3. Buscar Hóspede por ID
- **Caminho:** `/api/hospedes/:id`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (Administrador)
- **Descrição:** Busca e retorna os dados de um hóspede específico pelo seu ID.
- **Parâmetros de Caminho:**
  - `id` (number): ID do hóspede a ser buscado.
- **Respostas:**
  - `200 OK`: Hóspede encontrado.
    ```json
    {
      "status": 200,
      "message": "Hóspede encontrado.",
      "data": { "id_hospede": 1, "nome_hospede": "...", "..." }
    }
    ```
  - `404 Not Found`: Hóspede não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.

### 4. Atualizar Hóspede / Transferir de Quarto
- **Caminho:** `/api/hospedes/:id`
- **Método HTTP:** `PUT`
- **Autenticação:** Necessária (Administrador)
- **Descrição:** Atualiza as informações de um hóspede. Opcionalmente, pode transferir o hóspede para um novo quarto se o campo `id_quarto` for fornecido. A operação é transacional.
- **Parâmetros de Caminho:**
  - `id` (number): ID do hóspede a ser atualizado.
- **Corpo da Requisição (JSON):**
  ```json
  {
    "id_quarto": 25,
    "nome_hospede": "Maria Silva Souza",
    "data_saida": "2025-08-12"
  }
  ```
  * `id_quarto` (number): **Opcional**. Se fornecido, o hóspede será transferido para o novo quarto (que deve estar vago).
  * Demais campos são opcionais.
- **Respostas:**
  - `200 OK`: Hóspede atualizado com sucesso.
    ```json
    {
      "status": 200,
      "message": "Hóspede atualizado com sucesso.",
      "data": { "...dados do hospede atualizado..." }
    }
    ```
  - `404 Not Found`: Hóspede ou novo quarto não encontrado.
  - `409 Conflict`: O novo quarto para o qual se tenta transferir o hóspede já está ocupado.
  - `500 Internal Server Error`: Erro interno do servidor.

### 5. Deletar Hóspede
- **Caminho:** `/api/hospedes/:id`
- **Método HTTP:** `DELETE`
- **Autenticação:** Necessária (Administrador)
- **Descrição:** Exclui um hóspede do sistema. Se o hóspede for o responsável por um quarto, essa associação é removida, deixando o quarto vago. A operação é transacional.
- **Parâmetros de Caminho:**
  - `id` (number): ID do hóspede a ser deletado.
- **Respostas:**
  - `200 OK`: Hóspede deletado com sucesso.
    ```json
    {
      "status": 200,
      "message": "Hóspede excluído e quarto desassociado com sucesso."
    }
    ```
  - `404 Not Found`: Hóspede não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.
