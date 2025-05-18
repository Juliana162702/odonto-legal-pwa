const Case = require('../models/Case');

// Função para criar um caso (admin e perito)
exports.createCase = async (req, res) => {
  if (!['admin', 'perito'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Acesso negado: apenas administradores e peritos podem criar casos' });
  }

  const {
    caseId, status, description, patientName, patientDOB, patientAge,
    patientGender, patientID, patientContact, incidentDate, incidentLocation,
    incidentDescription, incidentWeapon
  } = req.body;

  try {
    const assignedUserId = req.user.role === 'perito' ? req.user.id : req.body.assignedUser;

    const newCase = new Case({
      caseId,
      status,
      description,
      patientName,
      patientDOB,
      patientAge,
      patientGender,
      patientID,
      patientContact,
      incidentDate,
      incidentLocation,
      incidentDescription,
      incidentWeapon,
      assignedUser: assignedUserId,
      createdBy: req.user.id
    });

    const savedCase = await newCase.save();
    res.status(201).json({
      _id: savedCase._id,
      caseId: savedCase.caseId,
      status: savedCase.status,
      patientName: savedCase.patientName,
      assignedUser: savedCase.assignedUser,
      createdAt: savedCase.createdAt
    });
  } catch (err) {
    console.error('Erro ao criar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para listar todos os casos (acesso liberado a todos os usuários autenticados)
exports.getCases = async (req, res) => {
  try {
    let cases = await Case.find().select('-__v');

    if (!cases || cases.length === 0) {
      return res.status(404).json({ error: "Nenhum caso encontrado." });
    }

    // Ocultar dados sensíveis para usuários que não são admin
    if (req.user.role !== 'admin') {
      cases = cases.map(caseItem => {
        const caseData = caseItem.toObject ? caseItem.toObject() : caseItem;
        const { patientContact, incidentWeapon, ...safeData } = caseData;
        return safeData;
      });
    }

    res.status(200).json(cases);
  } catch (err) {
    console.error('Erro ao obter casos:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para buscar um caso específico
exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id).select('-__v');

    if (!caseData) {
      return res.status(404).json({ error: 'Caso não encontrado' });
    }

    // Ocultar dados sensíveis se não for admin
    let responseData = caseData.toObject();
    if (req.user.role !== 'admin') {
      const { patientContact, incidentWeapon, ...safeData } = responseData;
      responseData = safeData;
    }

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Erro ao buscar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para atualizar um caso (admin e perito dono do caso)
exports.updateCase = async (req, res) => {
  try {
    const foundCase = await Case.findById(req.params.id);
    if (!foundCase) {
      return res.status(404).json({ error: 'Caso não encontrado' });
    }

    if (req.user.role !== 'admin' && (req.user.role !== 'perito' || foundCase.assignedUser.toString() !== req.user.id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updatableFields = [
      'status', 'description', 'patientName', 'patientDOB', 'patientAge',
      'patientGender', 'patientID', 'patientContact', 'incidentDate',
      'incidentLocation', 'incidentDescription', 'incidentWeapon'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        foundCase[field] = req.body[field];
      }
    });

    foundCase.updatedAt = Date.now();
    const updatedCase = await foundCase.save();

    res.status(200).json({
      _id: updatedCase._id,
      status: updatedCase.status,
      patientName: updatedCase.patientName,
      updatedAt: updatedCase.updatedAt
    });
  } catch (err) {
    console.error('Erro ao atualizar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para deletar um caso (apenas admin)
exports.deleteCase = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado: apenas administradores podem deletar casos' });
    }

    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ error: 'Caso não encontrado' });
    }

    res.status(200).json({ message: 'Caso removido com sucesso', deletedCaseId: deletedCase._id });
  } catch (err) {
    console.error('Erro ao deletar caso:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para adicionar evidência a um caso (apenas admin e perito)
exports.addEvidence = async (req, res) => {
  try {
    if (!['admin', 'perito'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Apenas administradores e peritos podem adicionar evidências' });
    }

    const { caseId, evidenceData } = req.body;

    const caseToUpdate = await Case.findById(caseId);
    if (!caseToUpdate) {
      return res.status(404).json({ error: 'Caso não encontrado' });
    }

    caseToUpdate.evidences.push(evidenceData);
    await caseToUpdate.save();

    res.status(201).json({ msg: 'Evidência adicionada com sucesso', case: caseToUpdate });
  } catch (err) {
    console.error('Erro ao adicionar evidência:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função para gerar relatório (todos os usuários podem)
exports.generateReport = async (req, res) => {
  try {
    const { caseId } = req.query;

    let caseToReport;
    if (caseId) {
      caseToReport = await Case.findById(caseId);
      if (!caseToReport) {
        return res.status(404).json({ error: 'Caso não encontrado' });
      }
    } else {
      caseToReport = await Case.find();
    }

    res.json({ msg: 'Relatório gerado', case: caseToReport });
  } catch (err) {
    console.error('Erro ao gerar relatório:', err.message);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};
