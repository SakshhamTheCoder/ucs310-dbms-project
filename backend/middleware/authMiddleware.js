import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verify error:', err);
      return res
        .status(403)
        .json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // { id, username, role }
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  console.log('req.user:', req.user); // Debugging
  if (req.user?.role_id !== 1) {
    return res
      .status(403)
      .json({ message: 'Access denied: Admins only' });
  }
  next();
};
