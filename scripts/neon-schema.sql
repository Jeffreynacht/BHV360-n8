-- BHV360 Schema for Neon Database
-- Run this in your Neon SQL Console

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    active BOOLEAN DEFAULT true,
    buildings INTEGER DEFAULT 0,
    users INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(100),
    department VARCHAR(100),
    bhv_roles JSONB DEFAULT '[]',
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    photo_url TEXT,
    emergency_contact JSONB,
    certificates JSONB DEFAULT '[]',
    accessibility JSONB DEFAULT '{}',
    work_schedule JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facilities table
CREATE TABLE IF NOT EXISTS facilities (
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
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFC Tags table
CREATE TABLE IF NOT EXISTS nfc_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    uid VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50),
    location VARCHAR(255),
    building VARCHAR(100),
    floor VARCHAR(50),
    zone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    battery_level INTEGER DEFAULT 100,
    last_seen TIMESTAMP WITH TIME ZONE,
    last_scanned TIMESTAMP WITH TIME ZONE,
    assigned_to VARCHAR(255),
    notes TEXT,
    tag_type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plotkaart Data table
CREATE TABLE IF NOT EXISTS plotkaart_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT 'Hoofdgebouw',
    floors JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by VARCHAR(255),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
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
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo data
INSERT INTO customers (name, contact_person, email, phone, address, active, buildings, users, status) VALUES 
('Demo Bedrijf BV', 'Jan de Vries', 'jan@demobedrijf.nl', '06-12345678', 'Hoofdstraat 1, 1234 AB Amsterdam', true, 3, 25, 'active'),
('Provincie Noord-Brabant', 'Marie van den Berg', 'marie@brabant.nl', '073-1234567', 'Provinciehuis, 5200 AB Den Bosch', true, 5, 50, 'active'),
('Ziekenhuis Catharina', 'Dr. Peter Janssen', 'p.janssen@catharina.nl', '040-2345678', 'Michelangelolaan 2, 5623 EJ Eindhoven', true, 2, 75, 'active')
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
CREATE INDEX IF NOT EXISTS idx_facilities_customer_id ON facilities(customer_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_customer_id ON nfc_tags(customer_id);
CREATE INDEX IF NOT EXISTS idx_incidents_customer_id ON incidents(customer_id);
