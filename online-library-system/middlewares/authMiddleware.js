import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Periksa apakah header otorisasi ada
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ msg: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Periksa apakah token ada di database dan masih aktif
    const tokenRecord = await User.findOne({
      where: {
        id: decoded.id, // Periksa apakah user dengan id yang sesuai ada
        token: token, // Periksa apakah token yang disimpan di database cocok dengan yang diterima
        isLogin: true, // Memastikan pengguna masih dalam status login
      },
    });

    if (!tokenRecord) {
      return res.status(401).json({ msg: 'Token is invalid or has been logged out.' });
    }

    // Tambahkan informasi pengguna ke objek `req`
    req.user = decoded;
    next();
  } catch (err) {
    // Menangani berbagai kesalahan token
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    } else {
      return res.status(500).json({ msg: 'Internal server error', error: err.message });
    }
  }
};

export default authMiddleware;
