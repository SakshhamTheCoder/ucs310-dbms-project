import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Attach decoded user to the request
        console.log('Decoded JWT:', decoded); // Debug log
        req.user = decoded;
        next();
    });
};

export const verifyAdmin = (req, res, next) => {
    console.log('User object in verifyAdmin:', req.user); // Debug log

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};
