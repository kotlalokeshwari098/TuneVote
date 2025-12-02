CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    socketid VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jamsessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    jamname VARCHAR(225) NOT NULL,
    songslist jsonb,
    qrcodeurl VARCHAR(255),
    uniqueroomjamid VARCHAR(255) UNIQUE NOT NULL,
    qrcodepublicid VARCHAR(255) UNIQUE NOT NULL,
    expires BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);