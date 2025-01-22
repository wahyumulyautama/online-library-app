import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const Book = sequelize.define('Book', {
  id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false }, // Menambahkan jumlah buku
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true }, // Status ketersediaan
});

// Hook untuk memperbarui status ketersediaan berdasarkan quantity
Book.addHook('beforeSave', (book, options) => {
  book.isAvailable = book.quantity > 0;
});

Book.sync();
export default Book;
