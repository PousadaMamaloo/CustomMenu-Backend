# Documentação dos Relacionamentos do Banco de Dados - CustomMenu-Backend

Este documento detalha os relacionamentos entre as entidades do banco de dados utilizadas no projeto CustomMenu-Backend, com base nos modelos Sequelize e suas associações.

## Visão Geral dos Relacionamentos

O banco de dados do CustomMenu-Backend é composto por diversas tabelas que se interligam para gerenciar informações sobre quartos, hóspedes, administradores, itens e eventos. Os principais relacionamentos identificados são:

- **Quarto e Hóspede:** Um quarto pode ter um hóspede responsável, e um hóspede pode estar associado a um ou mais quartos.
- **Evento e Item:** Um evento pode conter múltiplos itens, e um item pode estar presente em múltiplos eventos. Relacionamento muitos-para-muitos.
- **Evento e Quarto:** Um evento pode estar vinculado a vários quartos, e um quarto pode estar associado a vários eventos.
- **Evento e Data:** Um evento pode ocorrer em uma ou mais datas específicas.
- **Evento e Horário:** Um evento pode ocorrer em um ou mais horários específicos.
- **Pedido e Item:** Cada pedido pode conter vários itens, e cada item pode aparecer em vários pedidos. Muitos-para-muitos com quantidade.

## Detalhamento dos Relacionamentos

### 1. Quarto e Hóspede (Um-para-Um ou Um-para-Muitos no caso de um hóspede ser responsável por mais de um quarto

- **Tabela Principal:** `tab_quarto`
- **Tabela Relacionada:** `tab_hospede`
- **Chave Estrangeira:** `id_hospede_responsavel`
- **Descrição:** Indica qual hóspede é o responsável por determinado quarto.

### 2. Evento e Item (Muitos-para-Muitos)

- **Tabelas:** `tab_evento` ↔ `tab_item`
- **Tabela Intermediária:** `tab_re_evento_item`
- **Descrição:** Permite associar múltiplos itens a eventos.

### 3. Evento e Quarto (Muitos-para-Muitos)

- **Tabelas:** `tab_evento` ↔ `tab_quarto`
- **Tabela Intermediária:** `tab_re_evento_quarto`
- **Descrição:** Define os quartos participantes de um evento.

### 4. Evento e Data (Um-para-Muitos)

- **Tabela Principal:** `tab_evento`
- **Tabela Relacionada:** `tab_re_evento_data`
- **Descrição:** Representa as datas específicas em que o evento ocorrerá.

### 5. Evento e Horário (Muitos-para-Muitos)

- **Tabela Principal:** `tab_evento`
- **Tabela Intermediária:** `tab_re_evento_horario`
- **Descrição:** Relacionamento entre eventos e horários do dia em que ocorrem. Permite múltiplos horários por evento.

### 6. Pedido e Item (Muitos-para-Muitos com Quantidade)

- **Tabela Intermediária:** `tab_re_item_pedido`
- **Chaves Estrangeiras:**
  - `id_pedido` → `tab_pedido`
  - `id_item` → `tab_item`
- **Descrição:** Associa itens a pedidos com controle de quantidade e preço.

### 7. Pedido e Evento (Muitos-para-Um)

- **Tabela:** `tab_pedido`
- **Chave Estrangeira:** `id_evento`
- **Descrição:** Relaciona um pedido a um evento específico.

### 8. Pedido e Quarto

- **Tabela:** `tab_pedido`
- **Chave Estrangeira:** `id_quarto`
- **Descrição:** Indica o quarto responsável por um pedido.
