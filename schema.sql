-- =====================================================================
-- PujaPath Database Schema (MySQL 8.0+)
-- Durga Puja Pandal Hopping Navigator
-- =====================================================================

CREATE DATABASE IF NOT EXISTS pujapath_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE pujapath_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(80) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Pandals Directory Table
CREATE TABLE IF NOT EXISTS pandals (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    bengali_name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    neighbourhood VARCHAR(80) NOT NULL,
    nearest_metro VARCHAR(120) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    description TEXT,
    category VARCHAR(40) NOT NULL, -- heritage, traditional, theme, famous
    year_established INT,
    photo_url VARCHAR(500),
    source_url VARCHAR(500),
    crowd_level VARCHAR(30) DEFAULT 'moderate', -- low, moderate, high, very_high, unknown
    crowd_freshness_minutes INT DEFAULT 15,
    crowd_report_count INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 4.8,
    review_count INT DEFAULT 100,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pandals_coords (latitude, longitude),
    INDEX idx_pandals_category (category),
    INDEX idx_pandals_neighbourhood (neighbourhood)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Live Crowd Reports Table
CREATE TABLE IF NOT EXISTS crowd_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pandal_id VARCHAR(64) NOT NULL,
    pandal_name VARCHAR(150) NOT NULL,
    crowd_level VARCHAR(30) NOT NULL,
    wait_time_minutes INT NOT NULL,
    reporter_name VARCHAR(80),
    comment VARCHAR(300),
    timestamp BIGINT NOT NULL,
    source VARCHAR(20) DEFAULT 'community',
    INDEX idx_crowd_pandal_time (pandal_id, timestamp),
    CONSTRAINT fk_crowd_pandal FOREIGN KEY (pandal_id) REFERENCES pandals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User Saved Itineraries
CREATE TABLE IF NOT EXISTS itineraries (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    start_point_name VARCHAR(150),
    start_lat DECIMAL(10, 7),
    start_lng DECIMAL(10, 7),
    end_point_name VARCHAR(150),
    end_lat DECIMAL(10, 7),
    end_lng DECIMAL(10, 7),
    time_budget_hours INT DEFAULT 5,
    budget_per_person INT DEFAULT 500,
    transport_mode VARCHAR(20) DEFAULT 'WALKING',
    total_distance_km DECIMAL(6, 2),
    total_time_minutes INT,
    is_realistic BOOLEAN DEFAULT TRUE,
    warning_message VARCHAR(500),
    created_at BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Stops on Itinerary
CREATE TABLE IF NOT EXISTS itinerary_stops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id VARCHAR(64) NOT NULL,
    pandal_id VARCHAR(64) NOT NULL,
    stop_order INT NOT NULL,
    estimated_arrival VARCHAR(30),
    visit_duration_minutes INT,
    travel_time_minutes INT,
    travel_distance_km DECIMAL(6, 2),
    completed BOOLEAN DEFAULT FALSE,
    INDEX idx_stops_itin_order (itinerary_id, stop_order),
    CONSTRAINT fk_stops_itin FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE,
    CONSTRAINT fk_stops_pandal FOREIGN KEY (pandal_id) REFERENCES pandals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Groups / Puja Squads
CREATE TABLE IF NOT EXISTS group_squads (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    meeting_point VARCHAR(200),
    emergency_contact VARCHAR(50) DEFAULT '100 / 112',
    created_at BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Group Members with Opt-in Location Sharing
CREATE TABLE IF NOT EXISTS group_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    squad_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(80) NOT NULL,
    avatar VARCHAR(10),
    is_sharing_location BOOLEAN DEFAULT FALSE,
    last_lat DECIMAL(10, 7),
    last_lng DECIMAL(10, 7),
    last_location_update BIGINT,
    accuracy DECIMAL(6, 2),
    INDEX idx_members_squad (squad_id),
    CONSTRAINT fk_members_squad FOREIGN KEY (squad_id) REFERENCES group_squads(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Squad Hopper Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(64) PRIMARY KEY,
    squad_id VARCHAR(64) NOT NULL,
    category VARCHAR(30) NOT NULL,
    description VARCHAR(200) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    paid_by_member_id VARCHAR(64) NOT NULL,
    paid_by_name VARCHAR(80) NOT NULL,
    timestamp BIGINT NOT NULL,
    INDEX idx_expenses_squad (squad_id),
    CONSTRAINT fk_expenses_squad FOREIGN KEY (squad_id) REFERENCES group_squads(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
