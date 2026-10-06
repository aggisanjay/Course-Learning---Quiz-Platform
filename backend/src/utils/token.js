const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'learnflow_super_secret_jwt_key_2026_dev_prod',
    {
      expiresIn: '7d'
    }
  );
};

module.exports = { generateToken };
