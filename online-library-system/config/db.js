import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Menginisialisasi dotenv untuk membaca file .env

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // Ganti dengan 'postgres' jika menggunakan PostgreSQL
});

// Sinkronisasi database
export async function sync() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync({alter: true}); // Alter untuk menyesuaikan perubahan model
    console.log('All models synchronized.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

export default sequelize;
