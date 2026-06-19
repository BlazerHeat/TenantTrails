import { Router } from 'express';
import pool from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/apartments/:id/reviews', verifyToken, async (req, res) => {
  try {
    const apartmentId = req.params.id;
    const { rating, text, image_url } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Review text is required.' });
    }

    const [apts] = await pool.query('SELECT apartment_id FROM apartments WHERE apartment_id = ?', [apartmentId]);
    if (apts.length === 0) {
      return res.status(404).json({ error: 'Apartment not found.' });
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (apartment_id, user_id, rating, review_text, image_url) VALUES (?, ?, ?, ?, ?)',
      [apartmentId, req.user.userId, rating, text.trim(), image_url || null]
    );

    const [rows] = await pool.query(`
      SELECT r.*, u.full_name AS user_name, u.email AS user_email
      FROM reviews r JOIN users u ON r.user_id = u.user_id
      WHERE r.review_id = ?
    `, [result.insertId]);

    res.status(201).json({ ...rows[0], comments: [] });
  } catch (err) {
    console.error('POST review error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/reviews/:reviewId/comments', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required.' });
    }

    const [reviews] = await pool.query('SELECT review_id FROM reviews WHERE review_id = ?', [reviewId]);
    if (reviews.length === 0) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    const [result] = await pool.query(
      'INSERT INTO comments (review_id, user_id, comment_text) VALUES (?, ?, ?)',
      [reviewId, req.user.userId, text.trim()]
    );

    const [rows] = await pool.query(`
      SELECT c.*, u.full_name AS user_name, u.email AS user_email
      FROM comments c JOIN users u ON c.user_id = u.user_id
      WHERE c.comment_id = ?
    `, [result.insertId]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST comment error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
