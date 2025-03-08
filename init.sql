CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  age INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  following_user_id INTEGER NOT NULL,
  followed_user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_following FOREIGN KEY (following_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_followed FOREIGN KEY (followed_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_from_user FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_to_user FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for faster lookups
CREATE INDEX idx_follows_following ON follows (following_user_id);
CREATE INDEX idx_follows_followed ON follows (followed_user_id);
CREATE INDEX idx_requests_from ON requests (from_user_id);
CREATE INDEX idx_requests_to ON requests (to_user_id);
