import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { validateEmail, validatePassword } from '../utils/validation.js';
import dotenv from 'dotenv';

dotenv.config();

const { hash, compare } = bcrypt;

export async function register(req, res) {
  const { email, password, role, name } = req.body;

  // Validasi email
  if (!validateEmail(email)) {
    return res.status(400).json({ msg: 'Invalid email format.' });
  }

  // Validasi password
  if (!validatePassword(password)) {
    return res.status(400).json({
      msg: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number. Special characters are not allowed.',
    });
  }

  // Validasi role
  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ msg: 'Invalid role. Allowed roles are "user" or "admin".' });
  }

  try {
    // Periksa apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email is already registered.' });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Buat user baru
    const newUser = await User.create({ email, password: hashedPassword, role, name });

    res.status(201).json({
      msg: 'User registered successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error registering user.', error: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password.' });
    }

    // Cocokkan password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password.' });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    await user.update({
      token,
      isLogin: true,
    });

    res.status(200).json({
      msg: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error logging in.', error: err.message });
  }
}

export async function logout(req, res) {
  const { id } = req.user;

  try {

    // Update status isLogin menjadi false di tabel User
    await User.update({ isLogin: false, token: null }, { where: { id } });

    res.status(200).json({ msg: 'Logout successful.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error during logout.', error: err.message });
  }
}
