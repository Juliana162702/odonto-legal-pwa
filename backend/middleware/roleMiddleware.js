const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Rota que só pode ser acessada por administradores
router.delete('/admin/data', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  // Ação de exclusão de dados
  res.json({ msg: 'Dados excluídos' });
});

// Rota que pode ser acessada por admin ou perito
router.put('/case/update', authMiddleware, roleMiddleware(['admin', 'perito']), (req, res) => {
  // Ação de atualização de caso
  res.json({ msg: 'Caso atualizado com sucesso' });
});

module.exports = router;
