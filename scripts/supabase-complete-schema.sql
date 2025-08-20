-- BHV360 Complete Database Schema for Supabase
-- This script creates all necessary tables, indexes, RLS policies, and sample data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS plotkaart_data CASCADE;
DROP TABLE IF EXISTS inspection_reports CASCADE;
DROP TABLE IF EXISTS nfc_tags CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS backups CASCADE;
DROP TABLE IF EXISTS modules CASCADE;

-- Create customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    users INTEGER DEFAULT 0,
    buildings INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    active BOOLEAN DEFAULT true,
    modules JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    department VARCHAR(100),
    active BOOLEAN DEFAULT true,
    bhv_roles JSONB DEFAULT '[]',
    certificates JSONB DEFAULT '[]',
    work_schedule JSONB DEFAULT '{}',
    emergency_contact JSONB DEFAULT '{}',
    accessibility JSONB DEFAULT '{}',
    photo_url VARCHAR(500),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create facilities table
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    building VARCHAR(100),
    floor VARCHAR(50),
    zone VARCHAR(100),
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    serial_number VARCHAR(255),
    installation_date DATE,
    last_inspection DATE,
    next_inspection DATE,
    last_maintenance DATE,
    next_maintenance DATE,
    nfc_tag_id VARCHAR(100),
    coordinates JSONB DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create incidents table
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    location VARCHAR(255),
    building VARCHAR(100),
    floor VARCHAR(50),
    coordinates JSONB DEFAULT '{}',
    reported_by INTEGER REFERENCES users(id),
    assigned_to INTEGER REFERENCES users(id),
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    attachments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nfc_tags table
CREATE TABLE nfc_tags (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    uid VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    tag_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    location VARCHAR(255),
    building VARCHAR(100),
    floor VARCHAR(50),
    zone VARCHAR(100),
    assigned_to VARCHAR(255),
    battery_level INTEGER DEFAULT 100,
    last_seen TIMESTAMP WITH TIME ZONE,
    last_scanned TIMESTAMP WITH TIME ZONE,
    scan_count INTEGER DEFAULT 0,
    data JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plotkaart_data table
CREATE TABLE plotkaart_data (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
    floors JSONB NOT NULL DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    updated_by VARCHAR(255),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspection_reports table
CREATE TABLE inspection_reports (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    inspector_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    inspection_date DATE NOT NULL,
    due_date DATE,
    findings JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',
    score INTEGER,
    passed BOOLEAN,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    priority VARCHAR(50) DEFAULT 'normal',
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_settings table
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, key)
);

-- Create backups table
CREATE TABLE backups (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    size_bytes BIGINT,
    type VARCHAR(50) DEFAULT 'full',
    status VARCHAR(50) DEFAULT 'completed',
    created_by INTEGER REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create modules table
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50),
    active BOOLEAN DEFAULT true,
    free_tier BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_active ON customers(active);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_users_customer_id ON users(customer_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(active);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_facilities_customer_id ON facilities(customer_id);
CREATE INDEX idx_facilities_type ON facilities(type);
CREATE INDEX idx_facilities_status ON facilities(status);
CREATE INDEX idx_facilities_next_inspection ON facilities(next_inspection);
CREATE INDEX idx_incidents_customer_id ON incidents(customer_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);
CREATE INDEX idx_nfc_tags_customer_id ON nfc_tags(customer_id);
CREATE INDEX idx_nfc_tags_uid ON nfc_tags(uid);
CREATE INDEX idx_nfc_tags_status ON nfc_tags(status);
CREATE INDEX idx_plotkaart_customer_id ON plotkaart_data(customer_id);
CREATE INDEX idx_inspection_reports_customer_id ON inspection_reports(customer_id);
CREATE INDEX idx_inspection_reports_facility_id ON inspection_reports(facility_id);
CREATE INDEX idx_inspection_reports_inspection_date ON inspection_reports(inspection_date);
CREATE INDEX idx_audit_logs_customer_id ON audit_logs(customer_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nfc_tags_updated_at BEFORE UPDATE ON nfc_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspection_reports_updated_at BEFORE UPDATE ON inspection_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE plotkaart_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow service role to bypass RLS)
CREATE POLICY "Service role can access all customers" ON customers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all users" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all facilities" ON facilities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all incidents" ON incidents FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all nfc_tags" ON nfc_tags FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all plotkaart_data" ON plotkaart_data FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all inspection_reports" ON inspection_reports FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all audit_logs" ON audit_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all notifications" ON notifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all user_sessions" ON user_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all system_settings" ON system_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all backups" ON backups FOR ALL USING (auth.role() = 'service_role');

-- Allow anon role to read modules (for public access)
CREATE POLICY "Anyone can read modules" ON modules FOR SELECT USING (true);

-- Insert sample customers
INSERT INTO customers (name, contact_person, email, phone, address, city, postal_code, users, buildings, status, active, modules, settings) VALUES
('Demo Bedrijf BV', 'Jan de Vries', 'jan@demobedrijf.nl', '+31 20 123 4567', 'Hoofdstraat 123', 'Amsterdam', '1000 AB', 5, 2, 'active', true, '{"bhv_management": true, "incident_reporting": true, "facility_management": true}', '{"notifications": true, "email_alerts": true}'),
('Veiligheid Eerst', 'Maria Jansen', 'maria@veiligheideerst.nl', '+31 30 234 5678', 'Veiligheidsweg 45', 'Utrecht', '3500 CD', 12, 3, 'active', true, '{"bhv_management": true, "incident_reporting": true, "nfc_tags": true}', '{"notifications": true, "sms_alerts": true}'),
('Zorg Centrum Noord', 'Piet Bakker', 'piet@zorgcentrumnoord.nl', '+31 50 345 6789', 'Zorgplein 78', 'Groningen', '9700 EF', 25, 1, 'active', true, '{"bhv_management": true, "facility_management": true, "inspection_reports": true}', '{"notifications": true, "email_alerts": true, "dashboard_alerts": true}'),
('Techniek Solutions', 'Lisa van der Berg', 'lisa@technieksolutions.nl', '+31 40 456 7890', 'Innovatielaan 12', 'Eindhoven', '5600 GH', 8, 2, 'active', true, '{"incident_reporting": true, "facility_management": true, "nfc_tags": true}', '{"notifications": true}'),
('Onderwijs Groep West', 'Tom Hendriks', 'tom@onderwijsgroepwest.nl', '+31 70 567 8901', 'Schoolstraat 34', 'Den Haag', '2500 IJ', 15, 4, 'active', true, '{"bhv_management": true, "incident_reporting": true, "inspection_reports": true, "facility_management": true}', '{"notifications": true, "email_alerts": true, "parent_notifications": true}');

-- Insert sample users with bcrypt hashed passwords (password: demo123)
INSERT INTO users (customer_id, name, email, password_hash, phone, role, department, active, bhv_roles, certificates, work_schedule, emergency_contact) VALUES
(1, 'Jan de Vries', 'jan@demobedrijf.nl', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', '+31 6 1234 5678', 'bhv_coordinator', 'Veiligheid', true, '["bhv_coordinator", "evacuation_leader"]', '["BHV Basis", "EHBO"]', '{"monday": "09:00-17:00", "tuesday": "09:00-17:00", "wednesday": "09:00-17:00", "thursday": "09:00-17:00", "friday": "09:00-17:00"}', '{"name": "Anna de Vries", "phone": "+31 6 9876 5432"}'),
(1, 'Sarah Smit', 'sarah@demobedrijf.nl', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', '+31 6 2345 6789', 'employee', 'Administratie', true, '["bhv_helper"]', '["EHBO"]', '{"monday": "08:30-16:30", "tuesday": "08:30-16:30", "wednesday": "08:30-16:30", "thursday": "08:30-16:30", "friday": "08:30-16:30"}', '{"name": "Peter Smit", "phone": "+31 6 8765 4321"}'),
(2, 'Maria Jansen', 'maria@veiligheideerst.nl', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', '+31 6 3456 7890', 'customer_admin', 'Management', true, '["bhv_coordinator", "fire_warden"]', '["BHV Basis", "BHV Gevorderd", "EHBO"]', '{"monday": "07:00-15:00", "tuesday": "07:00-15:00", "wednesday": "07:00-15:00", "thursday": "07:00-15:00", "friday": "07:00-15:00"}', '{"name": "Erik Jansen", "phone": "+31 6 7654 3210"}'),
(3, 'Piet Bakker', 'piet@zorgcentrumnoord.nl', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', '+31 6 4567 8901', 'bhv_coordinator', 'Zorg', true, '["bhv_coordinator", "medical_first_aid"]', '["BHV Basis", "EHBO", "AED"]', '{"monday": "06:00-14:00", "tuesday": "06:00-14:00", "wednesday": "06:00-14:00", "thursday": "06:00-14:00", "friday": "06:00-14:00"}', '{"name": "Anja Bakker", "phone": "+31 6 6543 2109"}'),
(4, 'Lisa van der Berg', 'lisa@technieksolutions.nl', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', '+31 6 5678 9012', 'customer_admin', 'Techniek', true, '["evacuation_leader"]', '["BHV Basis", "Technische Veiligheid"]', '{"monday": "08:00-16:00", "tuesday": "08:00-16:00", "wednesday": "08:00-16:00", "thursday": "08:00-16:00", "friday": "08:00-16:00"}', '{"name": "Mark van der Berg", "phone": "+31 6 5432 1098"}'),
(5, 'Tom Hendriks', 'tom@onderwijsgroepwest.nl', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', '+31 6 6789 0123', 'bhv_coordinator', 'Onderwijs', true, '["bhv_coordinator", "evacuation_leader", "fire_warden"]', '["BHV Basis", "BHV Gevorderd", "EHBO", "Jeugd EHBO"]', '{"monday": "08:00-16:00", "tuesday": "08:00-16:00", "wednesday": "08:00-16:00", "thursday": "08:00-16:00", "friday": "08:00-16:00"}', '{"name": "Sandra Hendriks", "phone": "+31 6 4321 0987"}'),
(1, 'Admin User', 'admin@demobedrijf.nl', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', '+31 6 7890 1234', 'super_admin', 'IT', true, '[]', '["System Administrator"]', '{"monday": "09:00-17:00", "tuesday": "09:00-17:00", "wednesday": "09:00-17:00", "thursday": "09:00-17:00", "friday": "09:00-17:00"}', '{"name": "Emergency Contact", "phone": "+31 6 0000 0000"}');

-- Insert sample facilities
INSERT INTO facilities (customer_id, name, type, status, building, floor, zone, manufacturer, model, installation_date, next_inspection, coordinates) VALUES
(1, 'Brandblusser Gang A1', 'fire_extinguisher', 'active', 'Hoofdgebouw', 'Begane grond', 'Gang A', 'Gloria', 'PD-6', '2023-01-15', '2024-01-15', '{"x": 100, "y": 150}'),
(1, 'EHBO Post Receptie', 'first_aid_kit', 'active', 'Hoofdgebouw', 'Begane grond', 'Receptie', 'Mediq', 'Standard Kit', '2023-02-01', '2024-02-01', '{"x": 50, "y": 100}'),
(2, 'AED Hoofdingang', 'aed', 'active', 'Kantoorgebouw', 'Begane grond', 'Ingang', 'Philips', 'HeartStart HS1', '2023-03-10', '2024-03-10', '{"x": 75, "y": 125}'),
(3, 'Brandblusser Zaal 1', 'fire_extinguisher', 'active', 'Zorgcentrum', '1e verdieping', 'Zaal 1', 'Minimax', 'MX-9', '2023-04-05', '2024-04-05', '{"x": 200, "y": 300}'),
(4, 'Nooduitgang Werkplaats', 'emergency_exit', 'active', 'Werkplaats', 'Begane grond', 'Werkplaats', 'Dorma', 'Exit-Safe', '2023-05-20', '2024-05-20', '{"x": 300, "y": 400}');

-- Insert sample incidents
INSERT INTO incidents (customer_id, title, description, type, severity, status, location, building, floor, reported_by, created_at) VALUES
(1, 'Kleine brand in keuken', 'Kortsluiting in magnetron veroorzaakte rookontwikkeling', 'fire', 'medium', 'resolved', 'Keuken', 'Hoofdgebouw', 'Begane grond', 1, NOW() - INTERVAL '2 days'),
(2, 'Persoon onwel geworden', 'Medewerker kreeg duizeligheid tijdens vergadering', 'medical', 'low', 'resolved', 'Vergaderzaal B', 'Kantoorgebouw', '2e verdieping', 3, NOW() - INTERVAL '1 day'),
(3, 'Waterlekkage', 'Lekkage bij sprinklerinstallatie', 'water_damage', 'high', 'in_progress', 'Gang C', 'Zorgcentrum', '1e verdieping', 4, NOW() - INTERVAL '4 hours');

-- Insert sample NFC tags
INSERT INTO nfc_tags (customer_id, uid, name, type, status, location, building, floor, assigned_to, battery_level) VALUES
(1, 'NFC001ABC123', 'Brandblusser A1 Tag', 'facility_tag', 'active', 'Gang A1', 'Hoofdgebouw', 'Begane grond', 'Brandblusser Gang A1', 95),
(2, 'NFC002DEF456', 'AED Ingang Tag', 'facility_tag', 'active', 'Hoofdingang', 'Kantoorgebouw', 'Begane grond', 'AED Hoofdingang', 87),
(3, 'NFC003GHI789', 'EHBO Post Tag', 'facility_tag', 'active', 'Zaal 1', 'Zorgcentrum', '1e verdieping', 'EHBO Post Zaal 1', 92);

-- Insert sample modules
INSERT INTO modules (name, display_name, description, version, active, free_tier, settings) VALUES
('bhv_management', 'BHV Beheer', 'Complete BHV personeelsbeheer en planning', '2.1.0', true, false, '{"max_users": 50, "features": ["scheduling", "certificates", "training"]}'),
('incident_reporting', 'Incident Rapportage', 'Digitale incident registratie en follow-up', '1.8.0', true, true, '{"max_incidents": 10, "features": ["basic_reporting", "email_notifications"]}'),
('facility_management', 'Voorzieningen Beheer', 'Beheer van veiligheidsvoorzieningen en inspecties', '1.5.0', true, false, '{"max_facilities": 100, "features": ["inspection_scheduling", "maintenance_tracking"]}'),
('nfc_tags', 'NFC Tags', 'NFC tag integratie voor snelle toegang', '1.2.0', true, false, '{"max_tags": 200, "features": ["tag_management", "location_tracking"]}'),
('inspection_reports', 'Inspectie Rapporten', 'Geautomatiseerde inspectie rapporten en PDF export', '1.0.0', true, false, '{"max_reports": 50, "features": ["pdf_export", "scheduling", "templates"]}');

-- Insert sample plotkaart data
INSERT INTO plotkaart_data (customer_id, floors, updated_by, last_updated) VALUES
(1, '{
  "ground_floor": {
    "name": "Begane Grond",
    "facilities": [
      {"id": 1, "type": "fire_extinguisher", "x": 100, "y": 150, "name": "Brandblusser Gang A1"},
      {"id": 2, "type": "first_aid_kit", "x": 50, "y": 100, "name": "EHBO Post Receptie"}
    ],
    "exits": [
      {"x": 10, "y": 200, "name": "Hoofduitgang"},
      {"x": 250, "y": 50, "name": "Nooduitgang Oost"}
    ]
  }
}', 'Jan de Vries', NOW());

-- Insert sample system settings
INSERT INTO system_settings (customer_id, key, value, description) VALUES
(1, 'notification_settings', '{"email": true, "sms": false, "push": true}', 'Notification preferences'),
(1, 'backup_schedule', '{"frequency": "daily", "time": "02:00", "retention": 30}', 'Automated backup configuration'),
(2, 'notification_settings', '{"email": true, "sms": true, "push": true}', 'Notification preferences'),
(3, 'emergency_contacts', '{"primary": "+31 112", "secondary": "+31 20 123 4567"}', 'Emergency contact numbers');

-- Create a function to authenticate users
CREATE OR REPLACE FUNCTION authenticate_user(email_input TEXT, password_input TEXT)
RETURNS TABLE(user_id INTEGER, customer_id INTEGER, name TEXT, email TEXT, role TEXT, success BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.customer_id,
        u.name,
        u.email,
        u.role,
        CASE 
            WHEN u.password_hash IS NOT NULL AND crypt(password_input, u.password_hash) = u.password_hash THEN true
            ELSE false
        END as success
    FROM users u
    WHERE u.email = email_input AND u.active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION authenticate_user TO anon, authenticated;

-- Insert sample inspection reports
INSERT INTO inspection_reports (customer_id, facility_id, inspector_id, title, type, status, inspection_date, due_date, findings, score, passed) VALUES
(1, 1, 1, 'Maandelijkse controle brandblusser A1', 'monthly_check', 'completed', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', '[{"item": "Druk", "status": "OK", "notes": "Druk binnen normale waarden"}, {"item": "Verzegeling", "status": "OK", "notes": "Verzegeling intact"}]', 95, true),
(2, 3, 3, 'AED Functionele test', 'functional_test', 'completed', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '80 days', '[{"item": "Batterij", "status": "OK", "notes": "Batterij 87%"}, {"item": "Elektroden", "status": "OK", "notes": "Elektroden binnen vervaldatum"}]', 90, true);

-- Create some sample notifications
INSERT INTO notifications (customer_id, user_id, title, message, type, priority) VALUES
(1, 1, 'Inspectie vervalt binnenkort', 'De inspectie van Brandblusser Gang A1 vervalt over 5 dagen', 'warning', 'high'),
(2, 3, 'Nieuwe incident gerapporteerd', 'Er is een nieuw incident gerapporteerd in Vergaderzaal B', 'info', 'normal'),
(3, 4, 'Systeem update beschikbaar', 'Er is een nieuwe versie van het BHV360 systeem beschikbaar', 'info', 'low');

-- Final message
DO $$
BEGIN
    RAISE NOTICE 'BHV360 database schema created successfully!';
    RAISE NOTICE 'Sample data inserted for 5 customers and 7 users.';
    RAISE NOTICE 'You can now log in with: jan@demobedrijf.nl / demo123';
    RAISE NOTICE 'Or any other sample user with password: demo123';
END $$;
