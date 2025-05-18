// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
  // 1) Pega o header "Authorization"
  const header = req.header('Authorization');
  if (!header) {
    return res.status(401).json({ msg: 'Sem token, autorização negada' });
  }

  // 2) Espera o formato "Bearer <token>"
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Formato de token inválido' });
  }
  const token = parts[1];

  try {
    // 3) Decodifica e atribui req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Já atribui o usuário decodificado

    // 4) Confirma que o usuário existe
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    // 5) Continuar para a próxima etapa
    next();
  } catch (err) {
    console.error('Erro na verificação do token:', err.message);
    return res.status(401).json({ msg: 'Token inválido ou expirado' });
  }
};

// Middleware para verificar as permissões de role
const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'Acesso negado' });
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };

