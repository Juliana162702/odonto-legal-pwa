const express = require('express');
const router = express.Router();
const laudoController = require('../controllers/laudoController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Importa o middleware de autenticação

// Rotas CRUD para Laudos, protegidas com authMiddleware
router.post('/', authMiddleware, laudoController.createLaudo); // Criação de laudo requer autenticação
router.get('/', authMiddleware, laudoController.getAllLaudos); // Listagem de laudos protegida
router.get('/:id', authMiddleware, laudoController.getLaudoById); // Obter laudo por ID protegido
router.put('/:id', authMiddleware, laudoController.updateLaudo); // Atualizar laudo requer autenticação
router.delete('/:id', authMiddleware, laudoController.deleteLaudo); // Deletar laudo protegido

module.exports = router;