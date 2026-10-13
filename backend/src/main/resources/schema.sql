-- Copied from schema.sql for Spring Boot H2 / MySQL auto initialization
CREATE TABLE IF NOT EXISTS pandals (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    bengali_name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    neighbourhood VARCHAR(80) NOT NULL,
    nearest_metro VARCHAR(120) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    description TEXT,
    category VARCHAR(40) NOT NULL,
    year_established INT,
    photo_url VARCHAR(500),
    source_url VARCHAR(500),
    crowd_level VARCHAR(30) DEFAULT 'moderate',
    crowd_freshness_minutes INT DEFAULT 15,
    crowd_report_count INT DEFAULT 0,
    rating DOUBLE DEFAULT 4.8,
    review_count INT DEFAULT 100,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
