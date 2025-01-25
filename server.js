const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');  // Módulo fs para ler arquivos

const app = express();
const port = 3000;

// Configuração de CORS
const corsOptions = {
    origin: 'https://ar-wedding-nu.vercel.app', // Permitir todas as origens
    methods: ['GET', 'PATCH', 'OPTIONS'], // Permitir métodos GET, PATCH, e OPTIONS
    allowedHeaders: ['Content-Type'], // Permitir cabeçalhos específicos
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Função para carregar a lista de presentes a partir do arquivo JSON
function carregarPresentes() {
    const data = fs.readFileSync('presentes.json'); // Lê o arquivo JSON
    return JSON.parse(data); // Retorna os dados do arquivo como um objeto
}

// Endpoint para obter todos os presentes
app.get('/presentes', (req, res) => {
    const presentes = carregarPresentes(); // Carrega os dados do arquivo
    res.json(presentes); // Retorna os presentes
});

// Endpoint para obter um presente específico
app.get('/presentes/:id', (req, res) => {
    const { id } = req.params;  // Pega o ID da URL
    const presentes = carregarPresentes(); // Carrega os dados do arquivo
    const presente = presentes.find(p => p.id == id);  // Busca o presente com o ID fornecido

    if (!presente) {
        return res.status(404).json({ message: 'Presente não encontrado!' });
    }

    res.json(presente);  // Retorna o presente encontrado
});

// Endpoint para alterar a disponibilidade de um presente
app.patch('/presentes/:id', (req, res) => {
    const { id } = req.params;
    const { disponivel } = req.body;
    let presentes = carregarPresentes(); // Carrega os dados do arquivo

    let presente = presentes.find(p => p.id == id);

    if (!presente) {
        return res.status(404).json({ message: 'Presente não encontrado!' });
    }

    // Atualiza a disponibilidade
    presente.disponivel = disponivel;

    // Grava de volta o arquivo JSON com os dados atualizados
    fs.writeFileSync('presentes.json', JSON.stringify(presentes, null, 2));

    res.json(presente);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
