const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'bom_kitchen_secret_key_2025';
  const authHeader = req.headers.authorization || req.headers['authorization'];
  
  if (!authHeader) return res.status(403).json({ error: 'Không có quyền truy cập' });
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) return res.status(403).json({ error: 'Không có quyền truy cập' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = verifyToken;
