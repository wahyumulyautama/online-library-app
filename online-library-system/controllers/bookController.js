import Book from '../models/bookModel.js';
import { validateNonEmptyString } from '../utils/validation.js';

export async function addBook(req, res) {
  const { role } = req.user;
  const { title, author, quantity } = req.body;

  if (role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Only admins can add books.' });
  }

  if (!validateNonEmptyString(title) || !validateNonEmptyString(author) || !quantity || quantity < 1) {
    return res.status(400).json({ msg: 'Title, author, and quantity are required, and quantity must be greater than 0.' });
  }

  try {
    const existingBook = await Book.findOne({ where: { title, author } });

    if (existingBook) {
      const updatedQuantity = existingBook.quantity + parseInt(quantity, 10);
      await existingBook.update({ quantity: updatedQuantity, isAvailable: updatedQuantity > 0 });
      return res.status(200).json({ msg: 'Book quantity updated successfully.', book: existingBook });
    }

    const newBook = await Book.create({ title, author, quantity });
    res.status(201).json({ msg: 'Book added successfully.', book: newBook });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

export async function updateBook(req, res) {
  const { role } = req.user;
  const { bookId } = req.params;
  const { title, author, quantity } = req.body;

  if (role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Only admins can update books.' });
  }

  if (!validateNonEmptyString(title) && !validateNonEmptyString(author) && quantity == null) {
    return res.status(400).json({ msg: 'At least one of title, author, or quantity must be provided.' });
  }

  try {
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found.' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (author) updates.author = author;
    if (quantity != null) {
      if (quantity < 0) {
        return res.status(400).json({ msg: 'Quantity cannot be negative.' });
      }
      updates.quantity = quantity;
      updates.isAvailable = quantity > 0;
    }

    await book.update(updates);
    res.status(200).json({ msg: 'Book updated successfully.', book });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

export async function removeBook(req, res) {
  const { role } = req.user;
  const { bookId } = req.params;

  if (role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Only admins can remove books.' });
  }

  try {
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found.' });
    }

    await book.destroy();
    res.status(200).json({ msg: 'Book removed successfully.' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

export async function getBooks(req, res) {
  try {
    const books = await Book.findAll({
      attributes: ['id', 'title', 'author', 'quantity', 'isAvailable'],
    });

    if (!books.length) {
      return res.status(404).json({ msg: 'No books found.' });
    }

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
