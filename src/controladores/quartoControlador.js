import Quarto from '../models/quarto.js'; // Importa o modelo Quarto

// Função para criar um novo quarto
export const criarQuarto = async (req, res) => {
  try {
    const { num_quarto, capa_adultos, capa_criancas, id_hospede_responsavel } = req.body;

    // Cria o quarto no banco
    const novoQuarto = await Quarto.create({
      num_quarto,
      capa_adultos,
      capa_criancas,
      id_hospede_responsavel,
    });

    return res.status(201).json({
      message: 'Quarto criado com sucesso!',
      quarto: novoQuarto,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar quarto.' });
  }
};

// Função para listar todos os quartos
export const listarQuartos = async (req, res) => {
  try {
    const quartos = await Quarto.findAll();
    return res.status(200).json(quartos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar quartos.' });
  }
};
