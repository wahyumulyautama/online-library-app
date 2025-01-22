import Borrow from '../models/borrowModel.js';
import Book from '../models/bookModel.js';
import User from '../models/userModel.js'; // Pastikan Anda mengimport model User

export async function getUserDetails(req, res) {
  const { id: userId } = req.user; // User ID dari token

  try {
    // Ambil data user berdasarkan userId
    const user = await User.findByPk(userId, {
      attributes: ['name', 'role'], // Mengambil nama dan role
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Jika user adalah admin, kembalikan respons tanpa borrowedBooks dan totalBorrowedBooks
    if (user.role === 'admin') {
      return res.status(200).json({
        msg: 'User details fetched successfully.',
        user: {
          name: user.name,
          role: user.role,
        },
      });
    }

    // Ambil data peminjaman buku oleh user jika bukan admin
    const borrows = await Borrow.findAll({
      where: { UserId: userId, isReturned: false },
      include: {
        model: Book,
        attributes: ['id', 'title', 'author'],
      },
    });

    // Hitung jumlah total buku yang dipinjam
    const totalBorrowedBooks = borrows.length;

    // Ambil detail peminjaman (bookId, borrowDate, etc.)
    const borrowedBooks = borrows.map(borrow => ({
      borrowId: borrow.id,
      book: borrow.Book,
      borrowDate: borrow.createdAt,
    }));

    res.status(200).json({
      msg: 'User details fetched successfully.',
      user: {
        name: user.name,
        role: user.role,
        borrowedBooks,
        totalBorrowedBooks,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

export async function removeUser(req, res) {
    const { role } = req.user; // Ambil role dari pengguna yang sedang login
    const { userId } = req.params; // Ambil userId dari parameter URL
  
    if (role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Only admins can remove users.' });
    }
  
    try {
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found.' });
      }
  
      // Tidak boleh menghapus diri sendiri
      if (user.id === req.user.id) {
        return res.status(400).json({ msg: 'You cannot delete your own account.' });
      }
  
      await user.destroy(); // Hapus user dari database
      res.status(200).json({ msg: 'User removed successfully.' });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
