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
      { "id": 1, "nome": "Evento 1", "datas": ["YYYY-MM-DD", "YYYY-MM-DD"], "horaInicio": "HH:MM", "horarios": ["HH:MM"], ... },
      { "id": 2, "nome": "Evento 2", "datas": ["YYYY-MM-DD"], "horarios": ["HH:MM", "HH:MM"], ... }
    ]
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `500 Internal Server Error`: Erro interno do servidor.

### 2. Listar Itens por Evento Visão do Administrador
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
- **Observações:**
- O campo `"horarios"` deve conter horários no formato de 24 horas (`"HH:mm"`), por exemplo: `"08:00"`, `"13:30"`, `"18:45"`.
- Os horários informados devem já existir previamente na tabela `tab_horario`. Caso contrário, o evento não será vinculado corretamente a um horário.


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
- **Observações:**
- O campo `"horarios"` deve conter horários no formato de 24 horas (`"HH:mm"`), por exemplo: `"08:00"`, `"13:30"`, `"18:45"`.
- Os horários informados devem já existir previamente na tabela `tab_horario`. Caso contrário, o evento não será vinculado corretamente a um horário.

### 5. Excluir Evento
- **Caminho:** `/api/eventos/:id`
- **Método HTTP:** `DELETE`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Exclui um evento existente pelo seu ID, removendo também todos os dados associados:
  - Itens (`tab_re_evento_item`)
  - Quartos (`tab_re_evento_quarto`)
  - Datas (`tab_re_evento_data`)
  - Horários (`tab_re_evento_horario`)
  - Pedidos vinculados (`tab_pedido`)
  - Itens dos pedidos (`tab_re_item_pedido`)
- **Parâmetros de Caminho:**
  - `id`: ID do evento (number)
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
    ```json
    {
      "mensagem": "Erro interno ao excluir evento.",
      "errors": ["Detalhes do erro"]
    }
    ```
- **Observações:**
  - A exclusão é realizada dentro de uma transação.
  - Caso haja falha em algum ponto da exclusão, todas as ações são revertidas.

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
    "itens": ["number"]
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


### 9. Obter Evento por ID
- **Caminho:** `/api/eventos/:id`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Retorna todos os dados de um evento específico, incluindo itens, horários, datas e quartos.
- **Parâmetros de Caminho:**
  - `id`: ID do evento (number).
- **Respostas:**
  - `200 OK`: Dados completos do evento retornados com sucesso.
    ```json
    {
      "id_evento": 1,
      "nome_evento": "Nome do Evento",
      "desc_evento": "Descrição do Evento",
      "sts_evento": true,
      "recorrencia": false,
      "publico_alvo": false,
      "horarios": ["10:00", "14:00"],
      "datas": ["2025-07-01", "2025-07-02"],
      "quartos": [101, 102],
      "itens": ["Item A", "Item B"]
    }
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `404 Not Found`: Evento não encontrado.
  - `500 Internal Server Error`: Erro interno do servidor.

  ### 10. Relatório de Itens dos Eventos de Hoje
- **Caminho:** `/api/eventos/hoje`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador` e `autorizaAdministrador`)
- **Descrição:** Gera um relatório dos itens relacionados aos eventos do dia atual. Considera eventos com data igual à data de hoje em `tab_re_evento_data` ou eventos marcados como recorrentes. Para cada evento, retorna os itens, foto, quantidade total, preço unitário e valor total.

- **Respostas:**
  - `200 OK`: Relatório de itens dos eventos do dia gerado com sucesso.
    ```json
    {
      "mensagem": "Relatório de itens dos eventos de hoje gerado com sucesso.",
      "data": [
        {
          "id_evento": 1,
          "nome_evento": "Café da Manhã",
          "itens": [
            {
              "id_item": 10,
              "nome_item": "Suco de Laranja",
              "foto_item": "https://.../suco-laranja.jpg",
              "preco_unitario": 5,
              "quantidade_total": 5,
              "valor_total": 25
            },
            {
              "id_item": 12,
              "nome_item": "Pão de Queijo",
              "foto_item": "https://.../pao-queijo.jpg",
              "preco_unitario": 2,
              "quantidade_total": 10,
              "valor_total": 20
            }
          ]
        }
      ]
    }
    ```
  - `404 Not Found`: Nenhum evento encontrado para hoje.
    ```json
    {
      "mensagem": "Nenhum evento encontrado para hoje.",
      "data": []
    }
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `403 Forbidden`: Usuário não autorizado.
  - `500 Internal Server Error`: Erro interno do servidor.
    ```json
    {
      "mensagem": "Erro ao gerar relatório de itens dos eventos de hoje.",
      "erros": [
        "Detalhes do erro"
      ]
    }
    ```
### 11. Associar Item a Evento
- **Caminho:** `/api/eventos/eventoItem/`
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

### 12. Listar Associações de Itens de Evento
- **Caminho:** `/api/eventos/eventoItem/`
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

### 13. Listar Detalhes Completos de um Evento

- **Caminho:** `/api/eventos/eventoItem/:id_evento`
- **Método HTTP:** `GET`
- **Autenticação:** Necessária (via `autenticador`)
- **Descrição:** Recupera todas as informações detalhadas de um evento específico, incluindo seus dados básicos (nome, descrição), a lista de itens associados, as datas em que ocorre e os horários disponíveis.
- **Respostas:**
  - `200 OK`: Detalhes do evento retornados com sucesso.
    ```json
    {
      "status": 200,
      "message": "Detalhes do evento listados com sucesso!",
      "data": {
        "nome_evento": "Café da Manhã Especial",
        "desc_evento": "Um café da manhã completo com itens artesanais.",
        "datas": [
          "2025-07-25",
          "2025-07-26"
        ],
        "horarios": [
          { "id_horario": 1, "horario": "08:00" },
          { "id_horario": 2, "horario": "09:00" }
        ],
        "itens": [
          {
            "id_item": 10,
            "nome_item": "Cesta de Pães",
            "desc_item": "Pães frescos variados.",
            "valor_item": 15.00,
            "categ_item": "Padaria",
            "foto_item": "data:image/jpeg;base64,..."
          },
          {
            "id_item": 12,
            "nome_item": "Suco de Laranja Natural",
            "desc_item": "Feito na hora.",
            "valor_item": 8.00,
            "categ_item": "Bebidas",
            "foto_item": "data:image/jpeg;base64,..."
          }
        ]
      }
    }
    ```
  - `401 Unauthorized`: Token de autenticação ausente ou inválido.
  - `404 Not Found`: O `id_evento` fornecido não corresponde a nenhum evento existente.
    ```json
    {
        "status": 404,
        "data": {},
        "message": "Evento não encontrado.",
        "errors": {}
    }
    ```
  - `500 Internal Server Error`: Erro interno ao executar a consulta no banco de dados.
