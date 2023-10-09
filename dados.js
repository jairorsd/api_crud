const categorias = [
    { id: 1, nome: 'ELETRÔNICOS' },
    { id: 2, nome: 'ELETRODOMÉSTICOS' },
];

const produtos = [
    { nome: 'TV', descricao: 'TV 42 Polegadas', categoria_id: 1 },
    { nome: 'Smartphone', descricao: 'Smartphone Android', categoria_id: 1 },
    { nome: 'Notebook', descricao: 'Notebook Ultrafino', categoria_id: 1 },
    { nome: 'Liquidificador', descricao: 'Liquidificador 700W', categoria_id: 2 },
    { nome: 'Geladeira', descricao: 'Geladeira Frost-Free', categoria_id: 2 },
    { nome: 'Aspirador de Pó', descricao: 'Aspirador de Pó Robô', categoria_id: 2 },
    { nome: 'Fone de Ouvido', descricao: 'Fone de Ouvido Bluetooth', categoria_id: 1 },
    { nome: 'Mesa de Escritório', descricao: 'Mesa de Escritório em L', categoria_id: null },
    { nome: 'Cafeteira', descricao: 'Cafeteira Expresso', categoria_id: 2 },
    { nome: 'Tablet', descricao: 'Tablet Android', categoria_id: 1 },
    { nome: 'Som Automotivo', descricao: 'Som Automotivo AM/FM USB', categoria_id: null },
    { nome: 'Secador de Cabelo', descricao: 'Secador de Cabelo Profissional', categoria_id: 2 },
    { nome: 'Máquina de Lavar Roupa', descricao: 'Máquina de Lavar 10kg', categoria_id: 2 },
    { nome: 'Console de Jogos', descricao: 'Console Xbox Series X', categoria_id: 1 },
    { nome: 'Mesa de Escritório', descricao: 'Mesa de Escritório em L', categoria_id: null },
    { nome: 'Forno de Micro-ondas', descricao: 'Forno de Micro-ondas 30L', categoria_id: 2 },
    { nome: 'Câmera DSLR', descricao: 'Câmera DSLR 24MP', categoria_id: 1 },
    { nome: 'Panela Elétrica', descricao: 'Panela Elétrica 5L', categoria_id: 2 },
    { nome: 'Camisa Polo', descricao: 'Camisa Polo Masculina Tamanho P', categoria_id: null },
    { nome: 'Monitor de Computador', descricao: 'Monitor LED 24 Polegadas', categoria_id: 1 },
    { nome: 'Robô de Limpeza', descricao: 'Robô de Limpeza Inteligente', categoria_id: 2 },
    { nome: 'Impressora', descricao: 'Impressora Multifuncional', categoria_id: 1 },
    { nome: 'Torradeira', descricao: 'Torradeira Automática', categoria_id: 2 },
    { nome: 'Câmera de Segurança', descricao: 'Câmera de Segurança Wi-Fi', categoria_id: 1 },
    { nome: 'Guarda-Roupa', descricao: 'Guarda-Roupa 4 Portas', categoria_id: null },
    { nome: 'Piano Acústico', descricao: null, categoria_id: null },
];

module.exports = {
    categorias,
    produtos
};