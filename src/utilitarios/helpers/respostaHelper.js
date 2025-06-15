export const respostaHelper = ({ status, data = {}, message = "", errors = {} }) => {
  return {
    status,
    data,
    message,
    errors,
  };
};

