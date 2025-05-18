const Evidence = require('../models/Evidence');

// Criar nova evidência
exports.createEvidence = async (req, res) => {
  try {
    const { case: caseId, imageUrl, videoUrl, documentUrl, latitude, longitude, description, collectionDate, collectionTime, attachment } = req.body;

    if (!caseId || latitude === undefined || longitude === undefined || !description || !collectionDate || !collectionTime) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const evidence = new Evidence({
      case: caseId,
      imageUrl,
      videoUrl,
      documentUrl,
      latitude,
      longitude,
      description,
      collectionDate,
      collectionTime,
      attachment
    });

    await evidence.save();
    res.status(201).json({ message: 'Evidência salva com sucesso', evidence });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar evidência: ' + error.message });
  }
};

// Obter todas as evidências
exports.getAllEvidence = async (req, res) => {
  try {
    const evidences = await Evidence.find().populate('case');
    res.status(200).json(evidences);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar evidências: ' + error.message });
  }
};
// Obter evidências por ID do caso
exports.getEvidenceByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;
    const evidences = await Evidence.find({ case: caseId }).populate('case');

    res.status(200).json(evidences);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar evidências do caso: ' + error.message });
  }
};

// Obter evidência por ID
exports.getEvidenceById = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id).populate('case');
    if (!evidence) {
      return res.status(404).json({ error: 'Evidência não encontrada' });
    }
    res.status(200).json(evidence);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar evidência: ' + error.message });
  }
};

// Atualizar evidência por ID
exports.updateEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!evidence) {
      return res.status(404).json({ error: 'Evidência não encontrada' });
    }
    res.status(200).json({ message: 'Evidência atualizada com sucesso', evidence });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar evidência: ' + error.message });
  }
};

// Deletar evidência por ID
exports.deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);
    if (!evidence) {
      return res.status(404).json({ error: 'Evidência não encontrada' });
    }
    res.status(200).json({ message: 'Evidência deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar evidência: ' + error.message });
  }
};

