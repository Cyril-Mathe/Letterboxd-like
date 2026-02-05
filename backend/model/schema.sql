-- model pour la bdd
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS directors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE,
  death_date DATE,
  place_of_birth TEXT,
  nationnality TEXT,
  img_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS actors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE,
  death_date DATE,
  place_of_birth TEXT,
  nationality TEXT,
  img_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  year SMALLINT,
  director_id INTEGER NOT NULL REFERENCES directors(id) ON DELETE CASCADE,
  actor_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  synopsis TEXT,
  poster_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  rating SMALLINT CHECK (rating BETWEEN 0 AND 10),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);