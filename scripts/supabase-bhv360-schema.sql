-- BHV360 Complete Database Schema voor Supabase
-- Voer dit uit in de Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for clean install)
DROP TABLE IF EXISTS performance_metrics CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS plotkaart_data CASCADE;
DROP TABLE IF EXISTS nfc_tags CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notification_logs CASCADE;

-- Customers table (hoofdtabel)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true,
    buildings INTEGER DEFAULT 0,
    users INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    max_users INTEGER DEFAULT 10,
    max_buildings INTEGER DEFAULT 1,
    features JSONB DEFAULT '[]',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address JSONB,
    billing_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(100) DEFAULT 'employee',
    department VARCHAR(100),
    bhv_roles JSONB DEFAULT '[]',
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    photo_url TEXT,
    emergency_contact JSONB,
    certificates JSONB DEFAULT '[]',
    accessibility JSONB DEFAULT '{}',
    work_schedule JSONB DEFAULT '{}',
    location_permissions JSONB DEFAULT '[]',
    notification_preferences JSONB DEFAULT '{"push": true, "email": true, "sms": false}',
    password_hash TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions table (voor authentication)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facilities table (voorzieningen)
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    building VARCHAR(100),
    floor VARCHAR(50),
    zone VARCHAR(50),
    nfc_tag_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    last_inspection TIMESTAMP WITH TIME ZONE,
    next_inspection TIMESTAMP WITH TIME ZONE,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE,
    serial_number VARCHAR(100),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    installation_date DATE,
    coordinates JSONB, -- {x: number, y: number}
    properties JSONB DEFAULT '{}',
    inspection_history JSONB DEFAULT '[]',
    maintenance_history JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFC Tags table
CREATE TABLE nfc_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    uid VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) DEFAULT 'facility',
    location VARCHAR(255),
    building VARCHAR(100),
    floor VARCHAR(50),
    zone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    battery_level INTEGER DEFAULT 100,
    last_seen TIMESTAMP WITH TIME ZONE,
    last_scanned TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES users(id),
    facility_id UUID REFERENCES facilities(id),
    scan_count INTEGER DEFAULT 0,
    properties JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plotkaart Data table
CREATE TABLE plotkaart_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT 'Hoofdplotkaart',
    floors JSONB DEFAULT '[]',
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    change_log JSONB DEFAULT '[]',
    backup_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    location VARCHAR(255),
    building VARCHAR(100),
    floor VARCHAR(50),
    coordinates JSONB,
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    response_time INTEGER, -- in minutes
    resolution_time INTEGER, -- in minutes
    actions_taken JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',
    notifications_sent JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics table
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metric_type VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Preferences table
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- 'push', 'email', 'sms', 'webhook'
    category VARCHAR(100) NOT NULL, -- 'emergency', 'maintenance', 'inspection', etc.
    enabled BOOLEAN DEFAULT true,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    emergency_bypass BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, channel, category)
);

-- Notification Logs table
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo data
INSERT INTO customers (name, active, buildings, users, status, contact_email) VALUES 
('Demo Bedrijf BV', true, 3, 25, 'active', 'demo@bhv360.nl'),
('Test Organisatie', true, 1, 10, 'active', 'test@bhv360.nl'),
('Provincie Noord-Brabant', true, 5, 50, 'active', 'info@brabant.nl')
ON CONFLICT DO NOTHING;

-- Get the customer IDs for demo data
DO $$
DECLARE
    demo_customer_id UUID;
    test_customer_id UUID;
    admin_user_id UUID;
    coordinator_user_id UUID;
BEGIN
    -- Get customer IDs
    SELECT id INTO demo_customer_id FROM customers WHERE name = 'Demo Bedrijf BV' LIMIT 1;
    SELECT id INTO test_customer_id FROM customers WHERE name = 'Test Organisatie' LIMIT 1;
    
    -- Insert demo users
    INSERT INTO users (customer_id, name, email, phone, role, department, bhv_roles, active, password_hash) VALUES
    (demo_customer_id, 'Jan de Vries', 'jan@demobedrijf.nl', '06-12345678', 'admin', 'IT', '["Coordinator BHV"]', true, crypt('demo123', gen_salt('bf'))),
    (demo_customer_id, 'Marie Jansen', 'marie@demobedrijf.nl', '06-87654321', 'bhv-coordinator', 'HR', '["Ploegleider", "EHBO"]', true, crypt('demo123', gen_salt('bf'))),
    (demo_customer_id, 'Piet Bakker', 'piet@demobedrijf.nl', '06-11223344', 'bhv', 'Facilitair', '["BHV", "Ontruimer"]', true, crypt('demo123', gen_salt('bf'))),
    (demo_customer_id, 'Lisa van Dam', 'lisa@demobedrijf.nl', '06-55667788', 'employee', 'Marketing', '[]', true, crypt('demo123', gen_salt('bf'))),
    (demo_customer_id, 'Tom Hendriks', 'tom@demobedrijf.nl', '06-99887766', 'ehbo', 'Verkoop', '["EHBO"]', true, crypt('demo123', gen_salt('bf')))
    ON CONFLICT (email) DO NOTHING;
    
    -- Get user IDs for further demo data
    SELECT id INTO admin_user_id FROM users WHERE email = 'jan@demobedrijf.nl' LIMIT 1;
    SELECT id INTO coordinator_user_id FROM users WHERE email = 'marie@demobedrijf.nl' LIMIT 1;
    
    -- Insert demo facilities
    INSERT INTO facilities (customer_id, name, type, building, floor, zone, status, coordinates) VALUES
    (demo_customer_id, 'Brandblusser A1-01', 'Brandblusser', 'Hoofdgebouw', 'Begane grond', 'A1', 'active', '{"x": 100, "y": 150}'),
    (demo_customer_id, 'EHBO-post Receptie', 'EHBO-post', 'Hoofdgebouw', 'Begane grond', 'Receptie', 'active', '{"x": 200, "y": 100}'),
    (demo_customer_id, 'Nooduitgang Oost', 'Nooduitgang', 'Hoofdgebouw', 'Begane grond', 'Oost', 'active', '{"x": 400, "y": 200}'),
    (demo_customer_id, 'AED Kantine', 'AED', 'Hoofdgebouw', '1e verdieping', 'Kantine', 'active', '{"x": 250, "y": 180}'),
    (demo_customer_id, 'Brandmelder Gang', 'Brandmelder', 'Hoofdgebouw', '1e verdieping', 'Gang', 'active', '{"x": 150, "y": 120}')
    ON CONFLICT DO NOTHING;
    
    -- Insert demo plotkaart data
    INSERT INTO plotkaart_data (customer_id, name, floors, updated_by) VALUES
    (demo_customer_id, 'Hoofdgebouw Plotkaart', '[
        {
            "id": "ground-floor",
            "name": "Begane Grond",
            "facilities": [
                {"id": "1", "type": "Brandblusser", "x": 100, "y": 150, "name": "Brandblusser A1-01"},
                {"id": "2", "type": "EHBO-post", "x": 200, "y": 100, "name": "EHBO-post Receptie"},
                {"id": "3", "type": "Nooduitgang", "x": 400, "y": 200, "name": "Nooduitgang Oost"}
            ]
        },
        {
            "id": "first-floor", 
            "name": "1e Verdieping",
            "facilities": [
                {"id": "4", "type": "AED", "x": 250, "y": 180, "name": "AED Kantine"},
                {"id": "5", "type": "Brandmelder", "x": 150, "y": 120, "name": "Brandmelder Gang"}
            ]
        }
    ]', admin_user_id)
    ON CONFLICT DO NOTHING;
    
    -- Insert demo notification preferences
    INSERT INTO notification_preferences (user_id, channel, category, enabled, emergency_bypass) VALUES
    (admin_user_id, 'push', 'emergency', true, true),
    (admin_user_id, 'email', 'emergency', true, true),
    (admin_user_id, 'push', 'maintenance', true, false),
    (coordinator_user_id, 'push', 'emergency', true, true),
    (coordinator_user_id, 'email', 'emergency', true, true),
    (coordinator_user_id, 'sms', 'emergency', true, true)
    ON CONFLICT DO NOTHING;
    
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_facilities_customer_id ON facilities(customer_id);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(type);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_customer_id ON nfc_tags(customer_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_uid ON nfc_tags(uid);
CREATE INDEX IF NOT EXISTS idx_incidents_customer_id ON incidents(customer_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE plotkaart_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - customize based on your auth needs)
-- Allow all operations for now (you can restrict later)
CREATE POLICY "Enable all access for authenticated users" ON customers FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON facilities FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON nfc_tags FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON plotkaart_data FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON incidents FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON notification_preferences FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON notification_logs FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON user_sessions FOR ALL USING (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nfc_tags_updated_at BEFORE UPDATE ON nfc_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for password verification
CREATE OR REPLACE FUNCTION verify_password(email_input TEXT, password_input TEXT)
RETURNS TABLE(user_id UUID, customer_id UUID, name TEXT, role TEXT, verified BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.customer_id, u.name, u.role, (u.password_hash = crypt(password_input, u.password_hash)) as verified
    FROM users u
    WHERE u.email = email_input AND u.active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'BHV360 Supabase database schema successfully created! 🎉' as message,
       'Demo users created with password: demo123' as login_info,
       'You can now connect your application!' as next_step;
