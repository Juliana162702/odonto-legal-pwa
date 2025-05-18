require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const userRoutes = require('./routes/userRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const laudoRoutes = require('./routes/laudoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');

const app = express();

// 1) CORS — permitir apenas seu frontend publicado
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500', // adicionado Live Server do VS Code
    'http://localhost:5500', // também pode incluir esse
    'https://dent-case.netlify.app'
  ], // adiciona localhost
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2) Body parser
app.use(express.json());

// 3) Rota de teste para a raiz
app.get('/', (req, res) => {
  res.send('API Laudos Periciais rodando 🚀');
});

// 4) Conexão com MongoDB
connectDB();

// 5) Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);  // Certifique-se que no frontend a URL seja `/api/cases`
app.use('/api/users', userRoutes);
app.use('/api/evidences', evidenceRoutes);
app.use('/api/laudos', laudoRoutes);
app.use('/api/relatorios', relatorioRoutes);

// 6) Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));