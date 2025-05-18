const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['em andamento', 'finalizado', 'arquivado'], default: 'em andamento' },
  description: { type: String, required: true },
  patientName: { type: String, required: true },
  patientDOB: { type: Date, required: true },
  patientAge: { type: Number, required: false },
  patientGender: { type: String, enum: ['masculino', 'feminino', 'outro'], required: true },
  patientID: { type: String, required: true },
  patientContact: { type: String },
  incidentDate: { type: Date, required: true },
  incidentLocation: { type: String, required: true },
  incidentDescription: { type: String, required: true },
  incidentWeapon: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', CaseSchema);
