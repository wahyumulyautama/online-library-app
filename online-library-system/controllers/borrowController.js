import Borrow from '../models/borrowModel.js';
import Book from '../models/bookModel.js';
import User from '../models/userModel.js';
import sequelize from '../config/db.js';

// Endpoint untuk meminjam buku
export async function borrowBook(req, res) {
  const { id: userId, role } = req.user; // User ID dari token
  const { bookId, dueDate } = req.body; // Book ID dari request body

  if (role !== 'user') {
    return res.status(403).json({ msg: 'Access denied. Only users can borrow books.' });
  }

  try {
    // Cek apakah user sudah meminjam buku dengan status belum dikembalikan
    const existingBorrow = await Borrow.findOne({
      where: { UserId: userId, isReturned: false },
    });

    if (existingBorrow) {
      return res.status(400).json({
        msg: 'You must return the previous book before borrowing another.',
      });
    }

    // Cek apakah buku tersedia
    const book = await Book.findByPk(bookId);
    if (!book || book.quantity < 1) {
      return res.status(400).json({ msg: 'Book is not available for borrowing.' });
    }

    // Kurangi jumlah quantity buku dan perbarui status ketersediaan
    await book.update({
      quantity: book.quantity - 1,
      isAvailable: book.quantity - 1 > 0, // Set isAvailable ke false jika quantity <= 0
    });

    // Simpan data peminjaman
    const borrow = await Borrow.create({
      UserId: userId,
      BookId: bookId,
      dueDate: dueDate,
      statusBorrow: 'On Progress'
    });

    res.status(201).json({ msg: 'Book borrowed successfully.', borrow });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

// Endpoint untuk mengembalikan buku
export async function returnBook(req, res) {
  const { id: userId, role } = req.user; // User ID dari token
  const { borrowId } = req.body; // Borrow ID dari request body

  if (role !== 'user') {
    return res.status(403).json({ msg: 'Access denied. Only users can return books.' });
  }

  try {
    // Cek catatan peminjaman
    const borrow = await Borrow.findOne({
      where: { id: borrowId, UserId: userId, isReturned: false },
    });

    if (!borrow) {
      return res.status(400).json({
        msg: 'Invalid borrow record or book already returned.',
      });
    }

    // Tandai buku telah dikembalikan
    await borrow.update({ isReturned: true, returnDate: new Date() });

    // Perbarui status ketersediaan buku dan tambahkan quantity
    const book = await Book.findByPk(borrow.BookId);
    await book.update({
      quantity: book.quantity + 1, // Menambah jumlah buku setelah dikembalikan
      isAvailable: book.quantity + 1 > 0, // Set isAvailable ke true jika quantity > 0
    });

    res.json({ msg: 'Book returned successfully.', borrow });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

// Endpoint untuk admin melihat data pengguna dan peminjaman buku
export async function getBorrowData(req, res) {
  const { role } = req.user;

  // Cek apakah user adalah admin
  if (role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Only admins can access this data.' });
  }

  const { isReturned } = req.query;

  try {
    const whereCondition = {};
    if (isReturned !== undefined) {
      whereCondition.isReturned = isReturned === 'true'; // pastikan 'true' atau 'false' dalam bentuk string
    }

    // Ambil data peminjaman beserta informasi User dan Book
    const borrowData = await Borrow.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // Pilih hanya kolom yang dibutuhkan dari model User
        },
        {
          model: Book,
          attributes: ['id', 'title', 'author'], // Pilih hanya kolom yang dibutuhkan dari model Book
        },
      ],
    });

     // Periksa statusBorrow berdasarkan dueDate dan borrowDate
     borrowData.forEach(borrow => {
      if (new Date(borrow.borrowDate) > new Date(borrow.dueDate)) {
        borrow.statusBorrow = 'Past Due';
      }
    });

    // Kembalikan hasil dalam format JSON
    res.status(200).json({ msg: 'Borrow data retrieved successfully.', data: borrowData });
  } catch (err) {
    // Tangani error jika ada
    res.status(500).json({ msg: err.message });
  }
}
