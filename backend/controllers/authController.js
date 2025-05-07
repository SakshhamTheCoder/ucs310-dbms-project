// controllers/authController.js
import sqlQuery from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const { username, email, password, phone, passport } = req.body;

  // 1) Required field checks
  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'Username, email, and password are all required'
    });
  }

  // 2) Password length check
  if (password.length < 8) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long'
    });
  }

  try {
    // 3) Prevent duplicate emails
    const existing = await sqlQuery(
      'SELECT 1 FROM users WHERE email = ?',
      [email]
    );
    if (existing.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Default role is 'user', not admin
    const role = 'user';
    const roleResult = await sqlQuery(
      'SELECT role_id FROM roles WHERE role_name = ?',
      [role]
    );
    
    if (!roleResult || !roleResult.length) {
      return res.status(500).json({ message: 'Role not found' });
    }
    
    const role_id = roleResult[0].role_id;

    // 4) Hash & insert
    const hashed = await bcrypt.hash(password, 10);
    const insertSql = `
      INSERT INTO users
        (username, email, password, phone_number, passport_number, role_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await sqlQuery(insertSql, [
      username,
      email,
      hashed,
      phone || null,
      passport || null,
      role_id
    ]);

    // 5) Sign and return token
    const token = jwt.sign(
      { id: result.insertId, username, role },
      process.env.JWT_SECRET,
      { expiresIn: '1y' }
    );
    return res.status(201).json({
      token,
      user: { id: result.insertId, username, email, role }
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
    return res.status(400).json({
      message: 'Please provide email (or username) and password'
    });
  }

  try {
    const users = await sqlQuery(
      'SELECT *, role_name FROM users LEFT JOIN roles ON users.role_id = roles.role_id WHERE email = ? OR username = ?',
      [loginId, loginId]
    );
    if (!users.length) {
      return res.status(401).json({
        message: 'Invalid email/username or password'
      });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: 'Invalid email/username or password'
      });
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1y' }
    );

    return res.json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role_name
      }
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
      'SELECT user_id, username, email, phone_number, role_name FROM users LEFT JOIN roles ON users.role_id = roles.role_id WHERE user_id = ?',
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
        role: u.role_name
      }
    });
  } catch (err) {
    console.error('Auth Error:', err);
    return res
      .status(401)
      .json({ message: 'Invalid or expired token' });
  }
};
