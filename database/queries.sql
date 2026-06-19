USE tenant_trails;

SELECT name, address, neighbourhood
FROM apartments;

SELECT full_name, email, created_at
FROM users
ORDER BY created_at;

SELECT review_id, rating, review_text, created_at
FROM reviews
ORDER BY created_at DESC;

SELECT name, address
FROM apartments
WHERE neighbourhood = 'South End';

SELECT review_id, rating, review_text
FROM reviews
WHERE rating >= 4;

SELECT full_name, email
FROM users
WHERE email LIKE '%@dal.ca';

SELECT name, year_built, units
FROM apartments
WHERE year_built < 1990;

SELECT review_id, review_text, created_at
FROM reviews
WHERE created_at BETWEEN '2026-03-01' AND '2026-03-31';

SELECT a.name           AS apartment_name,
       u.full_name      AS reviewer,
       r.rating,
       r.review_text,
       r.created_at
FROM reviews r
JOIN apartments a ON r.apartment_id = a.apartment_id
JOIN users u      ON r.user_id      = u.user_id
ORDER BY r.created_at DESC;

SELECT r.review_id,
       LEFT(r.review_text, 60)  AS review_snippet,
       u.full_name              AS commenter,
       c.comment_text,
       c.created_at
FROM comments c
JOIN reviews r ON c.review_id = r.review_id
JOIN users u   ON c.user_id   = u.user_id
ORDER BY c.created_at;

SELECT a.name            AS apartment_name,
       COUNT(r.review_id) AS total_reviews,
       ROUND(AVG(r.rating), 1) AS avg_rating
FROM apartments a
LEFT JOIN reviews r ON a.apartment_id = r.apartment_id
GROUP BY a.apartment_id, a.name
ORDER BY avg_rating DESC;

SELECT DISTINCT a.name AS apartment_name
FROM apartments a
JOIN reviews r  ON a.apartment_id = r.apartment_id
JOIN comments c ON r.review_id    = c.review_id;

SELECT u.full_name,
       u.email,
       COUNT(r.review_id) AS review_count
FROM users u
LEFT JOIN reviews r ON u.user_id = r.user_id
GROUP BY u.user_id, u.full_name, u.email
ORDER BY review_count DESC;

SELECT a.name            AS apartment_name,
       u.full_name       AS reviewer,
       r.rating,
       r.created_at,
       COUNT(c.comment_id) AS comment_count
FROM reviews r
JOIN apartments a ON r.apartment_id = a.apartment_id
JOIN users u      ON r.user_id      = u.user_id
LEFT JOIN comments c ON r.review_id = c.review_id
GROUP BY r.review_id, a.name, u.full_name, r.rating, r.created_at
ORDER BY comment_count DESC, r.created_at DESC;
