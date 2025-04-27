import sqlQuery from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const { username, email, password, phone, passport } = req.body;
  try {
    // Prevent duplicate emails
    const existing = await sqlQuery(
      'SELECT 1 FROM users WHERE email = ?',
      [email]
    );
    if (existing.length) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and insert
    const hashed = await bcrypt.hash(password, 10);
    const insertSql = `
      INSERT INTO users
        (username, email, password, phone_number, passport_number)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await sqlQuery(insertSql, [
      username,
      email,
      hashed,
      phone,
      passport,
    ]);

    // Sign token (include username for role checks)
    const token = jwt.sign(
      { id: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: '1y' }
    );

    return res.status(201).json({
      token,
      user: { id: result.insertId, username, email },
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res
      .status(500)
      .json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  const { email, username, password } = req.body;
  const loginId = email || username;

  if (!loginId || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide email or username and password.' });
  }

  console.log('Login attempt for:', loginId);

  try {
    // Lookup by email OR username
    const users = await sqlQuery(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [loginId, loginId]
    );
    console.log('Users found:', users.length);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: 'Invalid email/username or password' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);

    if (!match) {
      return res
        .status(401)
        .json({ message: 'Invalid email/username or password' });
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1y' }
    );

    return res.json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res
      .status(500)
      .json({ message: 'Server error during login' });
  }
};

export const me = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const rows = await sqlQuery(
      'SELECT user_id, username, email, phone_number FROM users WHERE user_id = ?',
      [decoded.id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    const u = rows[0];
    return res.json({
      user: {
        id: u.user_id,
        username: u.username,
        email: u.email,
        phone: u.phone_number,
      },
    });
  } catch (err) {
    console.error('Auth Error:', err);
    return res
      .status(401)
      .json({ message: 'Invalid or expired token' });
  }
};
