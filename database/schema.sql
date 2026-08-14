-- CITYRIDE PostgreSQL / Supabase Database Schema

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('passenger', 'driver', 'admin')) NOT NULL DEFAULT 'passenger',
    profile_photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PASSENGERS TABLE
CREATE TABLE IF NOT EXISTS passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    favorite_stops JSONB DEFAULT '[]'::jsonb,
    saved_routes JSONB DEFAULT '[]'::jsonb,
    notification_preferences JSONB DEFAULT '{"bus_arrival": true, "delays": true, "lost_found": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('available', 'on_shift', 'off_duty')) DEFAULT 'off_duty',
    assigned_bus_id UUID,
    assigned_route_id UUID,
    rating NUMERIC(3,2) DEFAULT 4.85,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BUSES TABLE
CREATE TABLE IF NOT EXISTS buses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    registration_number VARCHAR(30) UNIQUE NOT NULL,
    capacity INT NOT NULL DEFAULT 40,
    current_occupancy INT DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'maintenance', 'delayed')) DEFAULT 'inactive',
    current_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    current_route_id UUID,
    current_lat NUMERIC(10, 7),
    current_lng NUMERIC(10, 7),
    current_speed NUMERIC(5, 2) DEFAULT 0.0,
    last_gps_update TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ROUTES TABLE
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_number VARCHAR(20) UNIQUE NOT NULL,
    route_name VARCHAR(100) NOT NULL,
    start_stop_name VARCHAR(100) NOT NULL,
    end_stop_name VARCHAR(100) NOT NULL,
    total_distance_km NUMERIC(5, 2) NOT NULL,
    estimated_duration_mins INT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    path_coordinates JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. STOPS TABLE
CREATE TABLE IF NOT EXISTS stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ROUTE_STOPS (Junction Table)
CREATE TABLE IF NOT EXISTS route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    stop_id UUID REFERENCES stops(id) ON DELETE CASCADE,
    stop_order INT NOT NULL,
    estimated_time_from_prev_mins INT DEFAULT 5,
    UNIQUE(route_id, stop_order)
);

-- 8. SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    operating_days VARCHAR(50) DEFAULT 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('in_progress', 'completed', 'cancelled', 'delayed')) DEFAULT 'in_progress',
    delay_mins INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. GPS_LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS gps_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    speed NUMERIC(5, 2) DEFAULT 0.0,
    heading NUMERIC(5, 2) DEFAULT 0.0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'alert',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. LOST_ITEMS TABLE
CREATE TABLE IF NOT EXISTS lost_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passenger_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    lost_route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
    lost_bus_number VARCHAR(20),
    lost_date TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_tags JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) CHECK (status IN ('reported', 'matched', 'claimed', 'closed')) DEFAULT 'reported',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. FOUND_ITEMS TABLE
CREATE TABLE IF NOT EXISTS found_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    item_title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    found_route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
    found_bus_number VARCHAR(20),
    found_date TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_tags JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) CHECK (status IN ('reported', 'matched', 'claimed', 'closed')) DEFAULT 'reported',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. LOST_FOUND_MATCHES TABLE
CREATE TABLE IF NOT EXISTS lost_found_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lost_item_id UUID REFERENCES lost_items(id) ON DELETE CASCADE,
    found_item_id UUID REFERENCES found_items(id) ON DELETE CASCADE,
    match_score NUMERIC(5, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. AI_PREDICTIONS TABLE
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    target_stop_id UUID REFERENCES stops(id) ON DELETE CASCADE,
    predicted_eta_mins INT NOT NULL,
    predicted_delay_mins INT DEFAULT 0,
    confidence_score NUMERIC(4,3) DEFAULT 0.95,
    factors JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_bus_number ON buses(bus_number);
CREATE INDEX IF NOT EXISTS idx_gps_bus_trip ON gps_locations(bus_id, trip_id);
CREATE INDEX IF NOT EXISTS idx_route_number ON routes(route_number);
