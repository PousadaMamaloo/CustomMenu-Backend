# Documentação dos Relacionamentos do Banco de Dados - CustomMenu-Backend

Este documento detalha os relacionamentos entre as entidades do banco de dados utilizadas no projeto CustomMenu-Backend, com base nos modelos Sequelize e suas associações.

## Visão Geral dos Relacionamentos

O banco de dados do CustomMenu-Backend é composto por diversas tabelas que se interligam para gerenciar informações sobre quartos, hóspedes, administradores, itens e eventos. Os principais relacionamentos identificados são:

- **Quarto e Hóspede:** Um quarto pode ter um hóspede responsável, e um hóspede pode estar associado a um quarto.
- **Evento e Item:** Um evento pode conter múltiplos itens, e um item pode estar presente em múltiplos eventos. Este é um relacionamento muitos-para-muitos.

## Detalhamento dos Relacionamentos

### 1. Quarto e Hóspede (Um-para-Um ou Um-para-Muitos)

Embora o modelo `Quarto` contenha `id_hospede_responsavel` que referencia `tab_hospede`, o relacionamento mais comum para esta estrutura é de um Quarto ter um Hóspede Responsável, e um Hóspede poder ser responsável por um ou mais Quartos (se o `id_hospede_responsavel` for único por quarto, é um-para-um; se um hóspede puder ser responsável por vários quartos, é um-para-muitos).

- **Tabela Principal:** `tab_quarto` (Quarto)
- **Tabela Relacionada:** `tab_hospede` (Hóspede)
- **Chave Estrangeira:** `id_hospede_responsavel` na tabela `tab_quarto` referencia `id_hospede` na tabela `tab_hospede`.
- **Descrição:** Este relacionamento indica qual hóspede é o responsável por um determinado quarto. Isso pode ser útil para rastrear a ocupação ou a administração de quartos por hóspedes específicos.

### 2. Evento e Item (Muitos-para-Muitos)

Os modelos `Evento` e `Item` possuem um relacionamento muitos-para-muitos, o que significa que um evento pode ter vários itens associados a ele, e um item pode ser associado a vários eventos. Este relacionamento é gerenciado por uma tabela intermediária (`tab_re_evento_item` ou `EventoItem`).

- **Tabela Principal 1:** `tab_evento` (Evento)
- **Tabela Principal 2:** `tab_item` (Item)
- **Tabela Intermediária:** `tab_re_evento_item` (EventoItem)
- **Chaves Estrangeiras na Tabela Intermediária:**
  - `id_evento` referencia `id_evento` na tabela `tab_evento`.
  - `id_item` referencia `id_item` na tabela `tab_item`.
- **Descrição:** Este relacionamento permite que a aplicação associe itens específicos a eventos. Por exemplo, um evento de café da manhã pode ter itens como 


café, pão e frutas, e esses mesmos itens podem ser usados em outros eventos. A tabela `tab_re_evento_item` armazena essas associações.

### 3. Administrador

O modelo `Administrador` é uma entidade independente, sem relacionamentos diretos com outras tabelas no esquema atual, servindo principalmente para autenticação e autorização de usuários com privilégios administrativos.

- **Tabela:** `tab_administrador` (Administrador)
- **Descrição:** Armazena informações sobre os administradores do sistema, como credenciais de login. Não possui chaves estrangeiras que referenciem outras tabelas, nem outras tabelas a referenciam diretamente.


