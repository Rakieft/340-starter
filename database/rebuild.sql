-- Drop tables if they already exist
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TABLE IF EXISTS account;

-- =========================
-- ACCOUNT TABLE
-- =========================
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50) NOT NULL,
  account_lastname VARCHAR(50) NOT NULL,
  account_email VARCHAR(100) UNIQUE NOT NULL,
  account_password VARCHAR(255) NOT NULL,
  account_type VARCHAR(20) DEFAULT 'Client'
);

-- =========================
-- CLASSIFICATION TABLE
-- =========================
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL
);

-- =========================
-- INVENTORY TABLE
-- =========================
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(50) NOT NULL,
  inv_model VARCHAR(50) NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image VARCHAR(255),
  inv_thumbnail VARCHAR(255),
  classification_id INT REFERENCES classification(classification_id)
);

-- =========================
-- INSERT CLASSIFICATIONS
-- =========================
INSERT INTO classification (classification_name)
VALUES
  ('Sport'),
  ('SUV'),
  ('Truck');

-- =========================
-- INSERT INVENTORY
-- =========================
INSERT INTO inventory (
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  classification_id
)
VALUES
  ('GM', 'Hummer', 'small interiors', '/images/hummer.jpg', '/images/hummer-tn.jpg', 3),
  ('DMC', 'Delorean', 'Time traveling car', '/images/delorean.jpg', '/images/delorean-tn.jpg', 1),
  ('Ferrari', 'Testarossa', 'Fast sport car', '/images/ferrari.jpg', '/images/ferrari-tn.jpg', 1);


-- Assignment 2 – Task 4
UPDATE inventory
SET inv_description = REPLACE(
  inv_description,
  'small interiors',
  'a huge interior'
)
WHERE inv_make = 'GM'
AND inv_model = 'Hummer';

-- Assignment 2 – Task 6
UPDATE inventory
SET
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
