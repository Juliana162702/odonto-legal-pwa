const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');

// Rota para criar uma nova evidência
router.post('/', evidenceController.createEvidence);

// Rota para obter todas as evidências
router.get('/', evidenceController.getAllEvidence);
// Rota para obter evidências por ID de caso
router.get('/case/:caseId', evidenceController.getEvidenceByCaseId);

// Rota para obter uma evidência por ID
router.get('/:id', evidenceController.getEvidenceById);

// Rota para atualizar uma evidência por ID
router.put('/:id', evidenceController.updateEvidence);

// Rota para deletar uma evidência por ID
router.delete('/:id', evidenceController.deleteEvidence);

module.exports = router;

