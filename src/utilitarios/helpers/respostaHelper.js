/**
* @description Formata uma resposta padrão para a API, garantindo uma estrutura consistente.
*/

export const respostaHelper = ({ status, data = {}, message = "", errors = {} }) => {
  return {
    status,
    data,
    message,
    errors,
  };
};

