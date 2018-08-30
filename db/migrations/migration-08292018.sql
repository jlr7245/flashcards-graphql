CREATE TABLE IF NOT EXISTS flashcards (
  id SERIAL PRIMARY KEY,
  question TEXT,
  answer TEXT,
  category VARCHAR(255),
  difficulty INTEGER
);

CREATE INDEX idx_category ON flashcards (category);
CREATE INDEX idx_difficulty ON flashcards (difficulty);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_digest TEXT NOT NULL,
  email VARCHAR(255)
);

CREATE INDEX userid_idx ON users(id);
ALTER TABLE flashcards ADD COLUMN user_id INTEGER REFERENCES users(id);

CREATE TABLE IF NOT EXISTS keywords (
  id SERIAL PRIMARY KEY,
  word VARCHAR(255) UNIQUE,
  counter INTEGER
);

CREATE TABLE IF NOT EXISTS flashcards_keywords (
  id SERIAL PRIMARY KEY,
  fc_id INTEGER REFERENCES flashcards(id),
  kw_id INTEGER REFERENCES keywords(id)
);

CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  user_id INTEGER REFERENCES users(id),
  public BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS quizzes_flashcards (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id),
  fc_id INTEGER REFERENCES flashcards(id)
);