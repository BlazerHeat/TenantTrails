DROP DATABASE IF EXISTS tenant_trails;
CREATE DATABASE tenant_trails;
USE tenant_trails;

CREATE TABLE users (
    user_id     INT             AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO users (user_id, full_name, email, password, created_at) VALUES
(1, 'Alex Mitchell',   'alex@dal.ca',        'password123', '2025-12-01 09:00:00'),
(2, 'Sam Patel',       'sam@example.com',     'pass456',     '2025-12-05 10:30:00'),
(3, 'Mei Chen',        'mei@example.com',     'mei2025',     '2025-12-10 14:15:00'),
(4, 'James Chen',      'james@example.com',   'james!99',    '2026-01-02 11:00:00'),
(5, 'Priya Singh',     'priya@example.com',   'priyaS1',     '2026-01-08 08:45:00'),
(6, 'Derek Lowe',      'derek@example.com',   'derekL0we',   '2026-01-15 16:20:00'),
(7, 'Tomi Adeyemi',    'tomi@example.com',    'tomi2026',    '2026-01-10 12:00:00'),
(8, 'Kate O''Brien',   'kate@example.com',    'kateOB!',     '2025-12-20 17:30:00');

CREATE TABLE apartments (
    apartment_id    INT             AUTO_INCREMENT PRIMARY KEY,
    slug            VARCHAR(50)     NOT NULL UNIQUE,
    name            VARCHAR(120)    NOT NULL,
    address         VARCHAR(200)    NOT NULL,
    neighbourhood   VARCHAR(80)     NOT NULL,
    description     TEXT,
    landlord        VARCHAR(120),
    units           INT             DEFAULT 0,
    year_built      YEAR,
    image_url       VARCHAR(500)
) ENGINE=InnoDB;

INSERT INTO apartments (apartment_id, slug, name, address, neighbourhood, description, landlord, units, year_built, image_url) VALUES
(1, 'marlstone',          'The Marlstone',          '5540 Spring Garden Rd',  'Spring Garden',  'Boutique low-rise off Spring Garden Road, walking distance to shops and parks.',         'Marlstone Holdings',    32,  2018, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80'),
(2, 'park-victoria',      'Park Victoria',          '1496 Carlton St',        'South End',      'Mid-rise in the South End with on-site management and underground parking.',              'Templeton Properties',  110, 1992, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
(3, 'le-marchant-towers', 'Le Marchant Towers',     '1585 Le Marchant St',    'West End',       'High-rise tower in a quiet residential neighbourhood.',                                   'Killam Properties',     88,  1975, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'),
(4, 'fenwick-tower',      'Fenwick Tower',          '5599 Fenwick St',        'Downtown',       'Iconic downtown high-rise with panoramic harbour views.',                                 'Templeton Properties',  220, 1971, 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80'),
(5, 'southpoint',         'Southpoint Apartments',  '1050 South Park St',     'South End',      'Family-friendly low-rise across from the Public Gardens.',                                'Southpoint Realty',     64,  1988, 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80');

CREATE TABLE reviews (
    review_id       INT             AUTO_INCREMENT PRIMARY KEY,
    apartment_id    INT             NOT NULL,
    user_id         INT             NOT NULL,
    rating          TINYINT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text     TEXT            NOT NULL,
    image_url       VARCHAR(500)    DEFAULT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (apartment_id) REFERENCES apartments(apartment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)      REFERENCES users(user_id)           ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO reviews (review_id, apartment_id, user_id, rating, review_text, created_at) VALUES
(1,  1, 2, 5, 'Brand new building, professional management, easy walk to everything on Spring Garden.',                                                                                         '2026-02-12 00:00:00'),
(2,  2, 1, 5, 'Quietest building I have ever lived in. Walls are thick and the staff respond same-day.',                                                                                        '2026-03-02 00:00:00'),
(3,  2, 3, 4, 'Great place if you can stomach the rent. Underground parking is a real perk in winter.',                                                                                         '2026-01-20 00:00:00'),
(4,  3, 4, 4, 'Good building overall. Management is professional and responsive within 48 hours for most issues. The parking situation is genuinely bad though. I waited five months for a spot.', '2026-04-01 00:00:00'),
(5,  3, 1, 4, 'Lived here for two years. Quiet neighbours, solid construction, and the Quinpool Road location is extremely convenient. Elevator breaks down about once a month but they fix it within the day.', '2026-03-19 00:00:00'),
(6,  3, 5, 3, 'Carpets in the hallway are tired and the laundry room has long waits on weekends. Unit itself is fine.',                                                                         '2026-02-08 00:00:00'),
(7,  4, 1, 4, 'The view from the 28th floor is incredible. You can see the harbour, Dartmouth, and McNabs Island. Location is unbeatable for downtown.',                                        '2026-03-10 00:00:00'),
(8,  4, 1, 4, 'Rent is very reasonable for downtown Halifax. The unit itself is fine, nothing fancy but functional. Laundry facilities are dated but they work.',                                 '2026-02-22 00:00:00'),
(9,  4, 6, 2, 'Elevators are constantly broken and the lobby door lock failed twice this year. Views are great but the building feels neglected.',                                               '2026-01-30 00:00:00'),
(10, 5, 1, 3, 'Decent location near the park but the building has issues. Heater in my unit broke during winter and it took four days to fix. Deposit was returned in full though, which I appreciated.', '2026-03-05 00:00:00'),
(11, 5, 1, 3, 'Average experience overall. The laundry room is always busy and half the machines are broken. Common areas are cleaned only weekly.',                                             '2026-02-14 00:00:00'),
(12, 5, 7, 2, 'Walls are thin, neighbours noisy, and the front entrance lock has been broken for weeks. Looking to move out at end of lease.',                                                  '2026-01-18 00:00:00'),
(13, 5, 8, 2, 'Rent is below market for South End, which is the only redeeming feature. Pest issues in summer and management is slow.',                                                         '2026-01-04 00:00:00');

CREATE TABLE comments (
    comment_id      INT             AUTO_INCREMENT PRIMARY KEY,
    review_id       INT             NOT NULL,
    user_id         INT             NOT NULL,
    comment_text    TEXT            NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)   REFERENCES users(user_id)     ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO comments (comment_id, review_id, user_id, comment_text, created_at) VALUES
(1, 4, 1, 'How long was the parking waitlist when you moved in?',                                           '2026-04-04 00:00:00'),
(2, 6, 1, 'Did you ever raise the laundry issue with management? Curious if they responded.',                '2026-02-12 00:00:00'),
(3, 9, 1, 'Same experience here with the elevators. Did building management offer any timeline for fixes?',  '2026-02-02 00:00:00');
