const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey123!@#');
    req.user = decoded; // Should contain id, username, email
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
