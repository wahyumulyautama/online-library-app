import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' }, // 'user' or 'admin'
  token: { type: DataTypes.STRING, allowNull: true }, // Menyimpan token aktif
  isLogin: { type: DataTypes.BOOLEAN, defaultValue: false }, // Status login
});

User.sync();
export default User;
