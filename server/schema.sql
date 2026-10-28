-- PlaceTrack tables (created automatically when the server starts)

CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  college      VARCHAR(150) DEFAULT '',
  branch       VARCHAR(100) DEFAULT '',
  grad_year    VARCHAR(10)  DEFAULT '',
  target_role  VARCHAR(100) DEFAULT '',
  company_type VARCHAR(30)  DEFAULT 'Product Based',
  level        VARCHAR(30)  DEFAULT 'Beginner',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS problems (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  name       VARCHAR(200) NOT NULL,
  topic      VARCHAR(50)  NOT NULL,
  difficulty VARCHAR(20)  NOT NULL,
  status     VARCHAR(20)  NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name    VARCHAR(100) NOT NULL,
  done    INT NOT NULL DEFAULT 0,
  total   INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS aptitude (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  user_id   INT NOT NULL,
  category  VARCHAR(100) NOT NULL,
  attempted INT NOT NULL DEFAULT 0,
  correct   INT NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS planner (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id  INT NOT NULL,
  day      VARCHAR(15)  NOT NULL,
  subject  VARCHAR(100) NOT NULL,
  duration VARCHAR(30)  NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS goals (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id  INT NOT NULL,
  title    VARCHAR(200) NOT NULL,
  period   VARCHAR(50)  NOT NULL,
  progress VARCHAR(50)  NOT NULL DEFAULT 'Pending',
  done     BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  text    VARCHAR(200) NOT NULL,
  done    BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS resources (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(200) NOT NULL,
  category    VARCHAR(50) NOT NULL DEFAULT 'DSA',
  resource_type VARCHAR(30) NOT NULL DEFAULT 'Website',
  url         VARCHAR(1000) NOT NULL,
  description VARCHAR(500) DEFAULT '',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
