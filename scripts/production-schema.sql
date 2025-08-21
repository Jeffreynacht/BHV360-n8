-- BHV360 Production Database Schema
-- Generated for production deployment

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('free', 'basic', 'professional', 'enterprise')),
    price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    max_users INTEGER NOT NULL DEFAULT 1,
    max_locations INTEGER NOT NULL DEFAULT 1,
    features JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Netherlands',
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'suspended', 'cancelled')),
    subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    billing_email VARCHAR(255),
    tax_number VARCHAR(100),
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'customer_admin', 'bhv_coordinator', 'user', 'viewer')),
    permissions JSONB NOT NULL DEFAULT '{}',
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Netherlands',
    floor_count INTEGER DEFAULT 1,
    total_area DECIMAL(10,2),
    building_type VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bhv_personnel table
CREATE TABLE IF NOT EXISTS bhv_personnel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    employee_number VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    bhv_role VARCHAR(50) NOT NULL DEFAULT 'bhv_member' CHECK (bhv_role IN ('bhv_coordinator', 'bhv_member', 'ehbo_member', 'evacuation_leader')),
    certification_date DATE,
    certification_expiry DATE,
    training_status VARCHAR(50) DEFAULT 'up_to_date' CHECK (training_status IN ('up_to_date', 'needs_renewal', 'expired')),
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create safety_equipment table
CREATE TABLE IF NOT EXISTS safety_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    equipment_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    installation_date DATE,
    last_inspection_date DATE,
    next_inspection_date DATE,
    inspection_interval_months INTEGER DEFAULT 12,
    status VARCHAR(50) NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'maintenance_required', 'out_of_order', 'retired')),
    location_description TEXT,
    floor_level INTEGER,
    coordinates_x DECIMAL(10,2),
    coordinates_y DECIMAL(10,2),
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    reported_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
    reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    resolution TEXT,
    resolved_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    resolved_date TIMESTAMP WITH TIME ZONE,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspections table
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    equipment_id UUID REFERENCES safety_equipment(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    inspection_type VARCHAR(100) NOT NULL,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    findings TEXT,
    recommendations TEXT,
    passed BOOLEAN,
    next_inspection_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, plan_type, price_monthly, price_yearly, max_users, max_locations, features) VALUES
('Gratis Plan', 'free', 0.00, 0.00, 3, 1, '{"plotkaart": true, "basic_reporting": true, "email_support": true}'),
('Basis Plan', 'basic', 29.99, 299.99, 10, 3, '{"plotkaart": true, "advanced_reporting": true, "incident_management": true, "email_support": true, "phone_support": true}'),
('Professioneel Plan', 'professional', 79.99, 799.99, 50, 10, '{"plotkaart": true, "advanced_reporting": true, "incident_management": true, "inspection_management": true, "custom_branding": true, "api_access": true, "priority_support": true}'),
('Enterprise Plan', 'enterprise', 199.99, 1999.99, 999, 999, '{"plotkaart": true, "advanced_reporting": true, "incident_management": true, "inspection_management": true, "custom_branding": true, "api_access": true, "white_label": true, "dedicated_support": true, "custom_integrations": true}')
ON CONFLICT DO NOTHING;

-- Insert demo customer
INSERT INTO customers (name, email, contact_person, subscription_status, subscription_plan_id) 
SELECT 
    'Demo Bedrijf BV', 
    'demo@bhv360.nl', 
    'Demo Administrator', 
    'active',
    (SELECT id FROM subscription_plans WHERE plan_type = 'professional' LIMIT 1)
ON CONFLICT (email) DO NOTHING;

-- Insert demo user profile
INSERT INTO user_profiles (customer_id, email, first_name, last_name, role, permissions)
SELECT 
    (SELECT id FROM customers WHERE email = 'demo@bhv360.nl' LIMIT 1),
    'demo@bhv360.nl',
    'Demo',
    'Administrator',
    'customer_admin',
    '{"manage_users": true, "manage_locations": true, "view_reports": true, "manage_incidents": true}'
ON CONFLICT (email) DO NOTHING;

-- Insert demo location
INSERT INTO locations (customer_id, name, address, city, postal_code, floor_count, building_type)
SELECT 
    (SELECT id FROM customers WHERE email = 'demo@bhv360.nl' LIMIT 1),
    'Hoofdkantoor Demo BV',
    'Demostraat 123',
    'Amsterdam',
    '1000 AB',
    3,
    'Kantoorgebouw'
WHERE NOT EXISTS (
    SELECT 1 FROM locations 
    WHERE customer_id = (SELECT id FROM customers WHERE email = 'demo@bhv360.nl' LIMIT 1)
    AND name = 'Hoofdkantoor Demo BV'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_subscription_status ON customers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_customer_id ON user_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_locations_customer_id ON locations(customer_id);
CREATE INDEX IF NOT EXISTS idx_bhv_personnel_customer_id ON bhv_personnel(customer_id);
CREATE INDEX IF NOT EXISTS idx_safety_equipment_customer_id ON safety_equipment(customer_id);
CREATE INDEX IF NOT EXISTS idx_incidents_customer_id ON incidents(customer_id);
CREATE INDEX IF NOT EXISTS idx_inspections_customer_id ON inspections(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_customer_id ON audit_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bhv_personnel_updated_at BEFORE UPDATE ON bhv_personnel FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_equipment_updated_at BEFORE UPDATE ON safety_equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
