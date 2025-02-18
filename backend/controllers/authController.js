import sqlQuery from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await sqlQuery('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1y' });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const register = async (req, res) => {
    const { username, email, password, phone, passport } = req.body;

    try {
        const existingUsers = await sqlQuery('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
            INSERT INTO users (username, email, password, phone_number, passport_number) 
            VALUES (?, ?, ?, ?, ?)
        `;

        const result = await sqlQuery(insertQuery, [username, email, hashedPassword, phone, passport]);
        const newUser = await sqlQuery('SELECT user_id, username, email FROM users WHERE user_id = ?', [
            result.insertId,
        ]);

        const token = jwt.sign({ id: newUser[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1y' });

        res.status(201).json({
            token,
            user: {
                id: newUser[0].user_id,
                username: newUser[0].username,
                email: newUser[0].email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const me = async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = await sqlQuery('SELECT user_id, username, email FROM users WHERE user_id = ?', [decoded.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            user: {
                id: users[0].user_id,
                username: users[0].username,
                email: users[0].email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

