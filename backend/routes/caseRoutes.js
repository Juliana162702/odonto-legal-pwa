const express = require('express');
const router = express.Router();
const { 
  createCase, 
  getCases, 
  getCaseById,
  updateCase, 
  deleteCase,
  addEvidence,  // Nova rota para adicionar evidência
  generateReport // Nova rota para gerar relatórios
} = require('../controllers/caseController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Rotas CRUD para casos
router.post('/', authMiddleware, roleMiddleware(['admin', 'perito']), createCase); // Criar caso
router.get('/', authMiddleware, getCases); // Listar casos
router.get('/:id', authMiddleware, getCaseById); // Detalhar caso
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'perito']), updateCase); // Atualizar caso
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'perito']), deleteCase); // Excluir caso

// Rota para adicionar evidência (qualquer assistente, perito ou admin pode adicionar)
router.post('/evidence', authMiddleware, roleMiddleware(['admin', 'perito', 'assistente']), addEvidence);

// Rota para gerar relatórios (somente admin e perito podem gerar relatórios)
router.get('/report', authMiddleware, roleMiddleware(['admin', 'perito']), generateReport);

module.exports = router;
