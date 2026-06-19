import { Router } from 'express';
import pool from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        a.*,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
        COUNT(r.review_id) AS review_count
      FROM apartments a
      LEFT JOIN reviews r ON a.apartment_id = r.apartment_id
      GROUP BY a.apartment_id
      ORDER BY avg_rating DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /apartments error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [apartments] = await pool.query('SELECT * FROM apartments WHERE apartment_id = ?', [id]);
    if (apartments.length === 0) {
      return res.status(404).json({ error: 'Apartment not found.' });
    }
    const apartment = apartments[0];

    const [reviews] = await pool.query(`
      SELECT r.*, u.full_name AS user_name, u.email AS user_email
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.apartment_id = ?
      ORDER BY r.created_at DESC
    `, [id]);

    const reviewIds = reviews.map((r) => r.review_id);
    let comments = [];
    if (reviewIds.length > 0) {
      const [rows] = await pool.query(`
        SELECT c.*, u.full_name AS user_name, u.email AS user_email
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.review_id IN (?)
        ORDER BY c.created_at ASC
      `, [reviewIds]);
      comments = rows;
    }

    const reviewsWithComments = reviews.map((r) => ({
      ...r,
      comments: comments.filter((c) => c.review_id === r.review_id),
    }));

    res.json({ ...apartment, reviews: reviewsWithComments });
  } catch (err) {
    console.error('GET /apartments/:id error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
