const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Expect header: Authorization: Bearer <token>
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ msg: 'No token, authorization denied' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Invalid authorization format' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // attach user ID to request
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
