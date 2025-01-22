import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import User from './userModel.js';
import Book from './bookModel.js';

const Borrow = sequelize.define('Borrow', {
  id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true },
  borrowDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  dueDate: {type: DataTypes.DATEONLY, allowNull: false},
  returnDate: { type: DataTypes.DATE, allowNull: true },
  isReturned: { type: DataTypes.BOOLEAN, defaultValue: false },
  statusBorrow: {type: DataTypes.STRING, defaultValue: "On Progress", allowNull: false} 
});

Borrow.belongsTo(User, { foreignKey: 'UserId' });
Borrow.belongsTo(Book, { foreignKey: 'BookId' });

export default Borrow;
