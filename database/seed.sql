-- CITYRIDE PostgreSQL / Supabase Seed Data

-- 1. SEED USERS
INSERT INTO users (id, email, password_hash, full_name, phone, role) VALUES
('u1000000-0000-0000-0000-000000000001', 'admin@cityride.com', '$2a$10$wK1gQ/W5Zz/Q.3S', 'Sarah Jenkins', '+1 (555) 019-2834', 'admin'),
('u1000000-0000-0000-0000-000000000002', 'driver.john@cityride.com', '$2a$10$wK1gQ/W5Zz/Q.3S', 'John Mitchell', '+1 (555) 014-9921', 'driver'),
('u1000000-0000-0000-0000-000000000003', 'driver.maria@cityride.com', '$2a$10$wK1gQ/W5Zz/Q.3S', 'Maria Rodriguez', '+1 (555) 018-4412', 'driver'),
('u1000000-0000-0000-0000-000000000004', 'alex.passenger@gmail.com', '$2a$10$wK1gQ/W5Zz/Q.3S', 'Alex Vance', '+1 (555) 012-7788', 'passenger');

-- 2. SEED DRIVERS
INSERT INTO drivers (id, user_id, license_number, status, rating) VALUES
('d1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000002', 'DL-98214-X', 'on_shift', 4.92),
('d1000000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000003', 'DL-55412-M', 'on_shift', 4.88);

-- 3. SEED ROUTES
INSERT INTO routes (id, route_number, route_name, start_stop_name, end_stop_name, total_distance_km, estimated_duration_mins, status) VALUES
('r1000000-0000-0000-0000-000000000001', 'R102', 'Central Express Express Line', 'Central Station', 'International Airport', 14.5, 32, 'active'),
('r1000000-0000-0000-0000-000000000002', 'R204', 'Metro Tech Corridor', 'City Center Park', 'Tech Innovation Hub', 9.8, 22, 'active'),
('r1000000-0000-0000-0000-000000000003', 'R305', 'Harbor & Beach Loop', 'Marina Bay Terminal', 'Ocean Drive Pier', 11.2, 28, 'active');

-- 4. SEED BUSES
INSERT INTO buses (id, bus_number, registration_number, capacity, current_occupancy, status, current_driver_id, current_route_id, current_lat, current_lng, current_speed) VALUES
('b1000000-0000-0000-0000-000000000001', 'BUS-102', 'CR-8892-NY', 50, 32, 'active', 'd1000000-0000-0000-0000-000000000001', 'r1000000-0000-0000-0000-000000000001', 40.7128, -74.0060, 42.5),
('b1000000-0000-0000-0000-000000000002', 'BUS-204', 'CR-3310-NY', 45, 18, 'active', 'd1000000-0000-0000-0000-000000000002', 'r1000000-0000-0000-0000-000000000002', 40.7306, -73.9352, 38.0),
('b1000000-0000-0000-0000-000000000003', 'BUS-305', 'CR-1094-NY', 55, 41, 'delayed', NULL, 'r1000000-0000-0000-0000-000000000003', 40.7589, -73.9851, 15.2);

-- 5. SEED LOST ITEMS
INSERT INTO lost_items (id, passenger_id, item_title, category, description, photo_url, lost_bus_number, lost_date, auto_tags, status) VALUES
('l1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000004', 'Black Leather Wallet', 'Wallets & Bags', 'Black Tommy Hilfiger leather bi-fold wallet containing ID and credit cards.', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', 'BUS-102', NOW() - INTERVAL '1 day', '["black", "wallet", "leather", "tommy"]', 'reported');

-- 6. SEED FOUND ITEMS
INSERT INTO found_items (id, driver_id, item_title, category, description, photo_url, found_bus_number, found_date, auto_tags, status) VALUES
('f1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000002', 'Gentleman Black Leather Wallet', 'Wallets & Bags', 'Found on back seat of BUS-102 near row 12. Contains cards.', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', 'BUS-102', NOW() - INTERVAL '22 hours', '["black", "leather", "wallet", "cards"]', 'reported');
