-- ASTRO Movie Review Database Schema
-- MySQL Database Structure with Role-based Access Control

-- Drop existing tables
DROP TABLE IF EXISTS watch_party_messages;

DROP TABLE IF EXISTS watch_party_participants;

DROP TABLE IF EXISTS watch_parties;

DROP TABLE IF EXISTS review_likes;

DROP TABLE IF EXISTS reviews;

DROP TABLE IF EXISTS watchlist;

DROP TABLE IF EXISTS favorites;

DROP TABLE IF EXISTS user_sessions;

DROP TABLE IF EXISTS users;

-- Users table with 3 roles: admin, user, vtuber
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    role ENUM('admin', 'user', 'vtuber') NOT NULL DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

-- VTuber specific fields
vtuber_name VARCHAR(100),
vtuber_avatar VARCHAR(500),
vtuber_debut_date DATE,
vtuber_agency VARCHAR(100),
vtuber_social_links JSON,
vtuber_is_live BOOLEAN DEFAULT FALSE,
vtuber_followers_count INT DEFAULT 0,

-- Timestamps
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_vtuber_live (vtuber_is_live)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User sessions for authentication
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    refresh_token VARCHAR(500) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_token (token (255)),
    INDEX idx_expires (expires_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Favorites (bookmarked movies)
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tmdb_id INT NOT NULL,
    media_type ENUM('movie', 'tv') NOT NULL DEFAULT 'movie',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, tmdb_id, media_type),
    INDEX idx_user_favorites (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Watchlist
CREATE TABLE watchlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tmdb_id INT NOT NULL,
    media_type ENUM('movie', 'tv') NOT NULL DEFAULT 'movie',
    priority INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY unique_watchlist (user_id, tmdb_id, media_type),
    INDEX idx_user_watchlist (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Reviews
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tmdb_id INT NOT NULL,
    media_type ENUM('movie', 'tv') NOT NULL DEFAULT 'movie',
    rating DECIMAL(3, 1) NOT NULL CHECK (
        rating >= 0
        AND rating <= 10
    ),
    title VARCHAR(200),
    content TEXT NOT NULL,
    is_spoiler BOOLEAN DEFAULT FALSE,
    status ENUM(
        'pending',
        'approved',
        'rejected'
    ) DEFAULT 'pending',
    rejection_reason TEXT,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (user_id, tmdb_id, media_type),
    INDEX idx_tmdb (tmdb_id),
    INDEX idx_status (status),
    INDEX idx_rating (rating)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Review likes
CREATE TABLE review_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (review_id, user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Watch parties (Nonton Bareng) - including VTuber events
CREATE TABLE watch_parties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    host_id INT NOT NULL,
    tmdb_id INT,
    movie_title VARCHAR(255) NOT NULL,
    movie_poster VARCHAR(500),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),

-- Scheduling
scheduled_at TIMESTAMP NOT NULL,
started_at TIMESTAMP NULL,
ended_at TIMESTAMP NULL,
duration_minutes INT DEFAULT 120,

-- Settings
max_participants INT DEFAULT 50,
is_vtuber_event BOOLEAN DEFAULT FALSE,
is_public BOOLEAN DEFAULT TRUE,
requires_login BOOLEAN DEFAULT TRUE,
chat_enabled BOOLEAN DEFAULT TRUE,
reactions_enabled BOOLEAN DEFAULT TRUE,

-- Status
status ENUM('scheduled', 'live', 'ended', 'cancelled') DEFAULT 'scheduled',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_scheduled (scheduled_at),
    INDEX idx_vtuber (is_vtuber_event),
    INDEX idx_host (host_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Watch party participants
CREATE TABLE watch_party_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    party_id INT NOT NULL,
    user_id INT NOT NULL,
    is_co_host BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    FOREIGN KEY (party_id) REFERENCES watch_parties (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY unique_participant (party_id, user_id),
    INDEX idx_party (party_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Watch party chat messages
CREATE TABLE watch_party_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    party_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('text', 'reaction', 'system') DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (party_id) REFERENCES watch_parties (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_party_messages (party_id, created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- VTuber followers
CREATE TABLE vtuber_followers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vtuber_id INT NOT NULL,
    follower_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vtuber_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (vtuber_id, follower_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Reports (for moderation)
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    report_type ENUM(
        'user',
        'review',
        'party',
        'message'
    ) NOT NULL,
    target_id INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM(
        'pending',
        'resolved',
        'dismissed'
    ) DEFAULT 'pending',
    resolved_by INT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_type (report_type)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_user_unread (user_id, is_read)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
INSERT INTO
    users (
        uuid,
        email,
        username,
        display_name,
        password_hash,
        role,
        is_verified,
        is_active
    )
VALUES (
        UUID(),
        'admin@astro.id',
        'admin',
        'Administrator',
        '$2b$10$rQj1Hb3m0KvmPR6JlAuPXeR5Z4U.8Y6Xqf2Kd1HnKkP8VtZwXy4Vy',
        'admin',
        TRUE,
        TRUE
    );

-- Insert sample VTuber accounts (password: vtuber123)
INSERT INTO
    users (
        uuid,
        email,
        username,
        display_name,
        password_hash,
        role,
        is_verified,
        is_active,
        vtuber_name,
        vtuber_agency,
        vtuber_debut_date
    )
VALUES (
        UUID(),
        'sakura@astro.id',
        'sakura_vtuber',
        'Sakura Hana',
        '$2b$10$rQj1Hb3m0KvmPR6JlAuPXeR5Z4U.8Y6Xqf2Kd1HnKkP8VtZwXy4Vy',
        'vtuber',
        TRUE,
        TRUE,
        'Sakura Hana',
        'ASTRO VTuber',
        '2024-01-15'
    ),
    (
        UUID(),
        'yuki@astro.id',
        'yuki_vtuber',
        'Yuki Shirogane',
        '$2b$10$rQj1Hb3m0KvmPR6JlAuPXeR5Z4U.8Y6Xqf2Kd1HnKkP8VtZwXy4Vy',
        'vtuber',
        TRUE,
        TRUE,
        'Yuki Shirogane',
        'ASTRO VTuber',
        '2024-03-20'
    ),
    (
        UUID(),
        'luna@astro.id',
        'luna_vtuber',
        'Luna Celestia',
        '$2b$10$rQj1Hb3m0KvmPR6JlAuPXeR5Z4U.8Y6Xqf2Kd1HnKkP8VtZwXy4Vy',
        'vtuber',
        TRUE,
        TRUE,
        'Luna Celestia',
        'ASTRO VTuber',
        '2024-06-01'
    );