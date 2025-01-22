import express from 'express';
import { sync } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body parser for JSON
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/user', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;

sync().then(() => {
  console.log('Database connected.');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
});
