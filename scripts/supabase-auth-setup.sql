-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM (
  'super-admin',
  'partner-admin', 
  'customer-admin',
  'bhv-coordinator',
  'employee'
);

CREATE TYPE customer_status AS ENUM (
  'active',
  'inactive',
  'suspended',
  'trial'
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  contact_person VARCHAR(255),
  status customer_status DEFAULT 'active',
  subscription_tier VARCHAR(50) DEFAULT 'starter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role user_role DEFAULT 'employee',
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  partner_id UUID,
  avatar_url TEXT,
  phone VARCHAR(50),
  department VARCHAR(100),
  position VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partners table (for white-label partners)
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  contact_person VARCHAR(255),
  domain VARCHAR(255),
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3b82f6',
  secondary_color VARCHAR(7) DEFAULT '#64748b',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_modules table (tracks which modules are enabled per customer)
CREATE TABLE IF NOT EXISTS customer_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  module_id VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activated_by UUID REFERENCES profiles(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, module_id)
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'open',
  location VARCHAR(255),
  building VARCHAR(100),
  floor VARCHAR(50),
  reported_by UUID REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Customers policies
CREATE POLICY "Super admins can view all customers" ON customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super-admin'
    )
  );

CREATE POLICY "Partner admins can view their customers" ON customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'partner-admin'
      AND profiles.partner_id IS NOT NULL
    )
  );

CREATE POLICY "Users can view their own customer" ON customers
  FOR SELECT USING (
    id IN (
      SELECT customer_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Super admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role = 'super-admin'
    )
  );

CREATE POLICY "Customer admins can view profiles in their customer" ON profiles
  FOR SELECT USING (
    customer_id IN (
      SELECT customer_id FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('customer-admin', 'bhv-coordinator')
    )
  );

-- Customer modules policies
CREATE POLICY "Users can view modules for their customer" ON customer_modules
  FOR SELECT USING (
    customer_id IN (
      SELECT customer_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Incidents policies
CREATE POLICY "Users can view incidents for their customer" ON incidents
  FOR SELECT USING (
    customer_id IN (
      SELECT customer_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can create incidents for their customer" ON incidents
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT customer_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Audit logs policies
CREATE POLICY "Super admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super-admin'
    )
  );

CREATE POLICY "Users can view audit logs for their customer" ON audit_logs
  FOR SELECT USING (
    customer_id IN (
      SELECT customer_id FROM profiles 
      WHERE profiles.id = auth.uid()
    )
  );

-- Create functions and triggers

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_modules_updated_at
  BEFORE UPDATE ON customer_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data

-- Insert default customer
INSERT INTO customers (id, name, email, contact_person, status) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Organisatie',
  'demo@bhv360.nl',
  'Demo Beheerder',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Insert default partner
INSERT INTO partners (id, name, email, contact_person, domain, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'BHV360 Direct',
  'info@bhv360.nl',
  'BHV360 Team',
  'bhv360.nl',
  true
) ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_customer_id ON profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_incidents_customer_id ON incidents(customer_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_customer_modules_customer_id ON customer_modules(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_customer_id ON audit_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE customer_modules;

COMMIT;
