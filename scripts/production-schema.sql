-- BHV360 Production Database Schema
-- Fixed version with proper table creation order

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types first
CREATE TYPE user_role AS ENUM ('super_admin', 'partner_admin', 'customer_admin', 'bhv_coordinator', 'employee', 'security_receptionist');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'trial');
CREATE TYPE plan_type AS ENUM ('starter', 'professional', 'enterprise', 'custom');
CREATE TYPE module_status AS ENUM ('active', 'inactive', 'pending_approval');

-- Drop existing tables in correct order (if they exist)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS safety_equipment CASCADE;
DROP TABLE IF EXISTS floors CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS customer_modules CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS partners CASCADE;

-- 1. Create partners table first (no foreign keys)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Netherlands',
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    white_label_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create subscription plans table (no foreign keys)
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    plan_type plan_type NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
    max_users INTEGER DEFAULT NULL,
    max_locations INTEGER DEFAULT NULL,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create customers table (references subscription_plans and partners)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Netherlands',
    contact_person VARCHAR(255),
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    partner_id UUID REFERENCES partners(id),
    subscription_status subscription_status DEFAULT 'trial',
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create user profiles table (references customers)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    role user_role DEFAULT 'employee',
    department VARCHAR(100),
    employee_number VARCHAR(50),
    is_bhv_certified BOOLEAN DEFAULT false,
    certification_expires_at TIMESTAMP WITH TIME ZONE,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    medical_info TEXT,
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create locations table (references customers)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    floor_count INTEGER DEFAULT 1,
    total_capacity INTEGER,
    building_type VARCHAR(100),
    emergency_procedures TEXT,
    evacuation_plan_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create floors table (references locations)
CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    floor_number INTEGER NOT NULL,
    layout_image_url TEXT,
    emergency_exits JSONB DEFAULT '[]',
    safety_equipment JSONB DEFAULT '[]',
    capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create safety equipment table (references floors)
CREATE TABLE safety_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_id UUID NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location_description TEXT,
    coordinates JSONB,
    last_inspection_date DATE,
    next_inspection_date DATE,
    status VARCHAR(50) DEFAULT 'operational',
    notes TEXT,
    qr_code VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create incidents table (references customers and user_profiles)
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES user_profiles(id),
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) DEFAULT 'medium',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location_description TEXT,
    coordinates JSONB,
    status VARCHAR(50) DEFAULT 'open',
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES user_profiles(id),
    resolution_notes TEXT,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create inspections table (references safety_equipment and user_profiles)
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES safety_equipment(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES user_profiles(id),
    inspection_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'passed',
    notes TEXT,
    issues_found TEXT,
    corrective_actions TEXT,
    next_inspection_date DATE,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create modules table (no dependencies)
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price_monthly DECIMAL(10,2) DEFAULT 0,
    price_yearly DECIMAL(10,2) DEFAULT 0,
    features JSONB DEFAULT '[]',
    requirements JSONB DEFAULT '{}',
    is_core_module BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Create customer modules table (references customers and modules)
CREATE TABLE customer_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    status module_status DEFAULT 'active',
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deactivated_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, module_id)
);

-- 12. Create notifications table (references user_profiles)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    priority VARCHAR(50) DEFAULT 'normal',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Create audit logs table (references user_profiles and customers)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_customer_id ON user_profiles(customer_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_locations_customer_id ON locations(customer_id);
CREATE INDEX idx_floors_location_id ON floors(location_id);
CREATE INDEX idx_safety_equipment_floor_id ON safety_equipment(floor_id);
CREATE INDEX idx_incidents_customer_id ON incidents(customer_id);
CREATE INDEX idx_inspections_equipment_id ON inspections(equipment_id);
CREATE INDEX idx_customer_modules_customer_id ON customer_modules(customer_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_audit_logs_customer_id ON audit_logs(customer_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, plan_type, price_monthly, price_yearly, max_users, max_locations, features) VALUES
('Starter Plan', 'starter', 49.00, 490.00, 25, 1, '{"plotkaart": true, "basic_reporting": true, "email_support": true}'),
('Professional Plan', 'professional', 99.00, 990.00, 100, 5, '{"plotkaart": true, "advanced_reporting": true, "incident_management": true, "mobile_app": true, "priority_support": true}'),
('Enterprise Plan', 'enterprise', 199.00, 1990.00, null, null, '{"plotkaart": true, "advanced_reporting": true, "incident_management": true, "mobile_app": true, "api_access": true, "custom_integrations": true, "dedicated_support": true}')
ON CONFLICT DO NOTHING;

-- Insert core modules
INSERT INTO modules (name, description, category, price_monthly, price_yearly, is_core_module, features) VALUES
('BHV Plotkaart', 'Interactive floor plans with safety equipment locations', 'core', 0, 0, true, '["floor_plans", "equipment_tracking", "evacuation_routes"]'),
('Incident Management', 'Report and track safety incidents', 'safety', 19.00, 190.00, false, '["incident_reporting", "workflow_management", "analytics"]'),
('Equipment Inspections', 'Schedule and track safety equipment inspections', 'maintenance', 29.00, 290.00, false, '["inspection_scheduling", "qr_codes", "compliance_tracking"]'),
('Mobile App', 'Mobile access to all BHV360 features', 'mobile', 15.00, 150.00, false, '["mobile_access", "offline_mode", "push_notifications"]'),
('Advanced Reporting', 'Detailed analytics and custom reports', 'reporting', 25.00, 250.00, false, '["custom_reports", "analytics_dashboard", "export_options"]'),
('API Access', 'Integration with external systems', 'integration', 49.00, 490.00, false, '["rest_api", "webhooks", "data_sync"]')
ON CONFLICT DO NOTHING;

-- Insert demo customer
INSERT INTO customers (name, email, contact_person, subscription_plan_id, subscription_status) 
SELECT 
    'Demo Bedrijf BV', 
    'demo@bhv360.nl', 
    'Demo Gebruiker',
    id,
    'active'
FROM subscription_plans 
WHERE plan_type = 'professional'
LIMIT 1
ON CONFLICT (email) DO NOTHING;

-- Insert demo user profile
INSERT INTO user_profiles (customer_id, email, first_name, last_name, role, is_bhv_certified, password_hash)
SELECT 
    c.id,
    'admin@demo.bhv360.nl',
    'Demo',
    'Administrator',
    'customer_admin',
    true,
    '$2a$10$example.hash.for.demo.user.only'
FROM customers c
WHERE c.email = 'demo@bhv360.nl'
ON CONFLICT (email) DO NOTHING;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_floors_updated_at BEFORE UPDATE ON floors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_equipment_updated_at BEFORE UPDATE ON safety_equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_modules_updated_at BEFORE UPDATE ON customer_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'BHV360 production database schema created successfully!';
    RAISE NOTICE 'Tables created: %, %, %, %, %, %, %, %, %, %, %, %, %', 
        'subscription_plans', 'partners', 'customers', 'user_profiles', 'locations', 
        'floors', 'safety_equipment', 'incidents', 'inspections', 'modules', 
        'customer_modules', 'notifications', 'audit_logs';
END $$;
