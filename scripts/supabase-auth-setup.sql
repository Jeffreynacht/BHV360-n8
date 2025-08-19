-- BHV360 Supabase Authentication Setup
-- This script sets up the complete authentication system with RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types for better type safety
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'bhv_coordinator', 'employee', 'security', 'partner_admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'suspended');

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;

-- Create customers table
CREATE TABLE public.customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    users_count INTEGER DEFAULT 0,
    buildings_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    active BOOLEAN DEFAULT true,
    modules JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table (extends auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    status user_status NOT NULL DEFAULT 'active',
    company VARCHAR(255),
    department VARCHAR(100),
    phone VARCHAR(50),
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

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customers
CREATE POLICY "Users can view their own customer" ON public.customers
    FOR SELECT USING (
        id IN (
            SELECT customer_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Super admins can view all customers" ON public.customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view users in their customer" ON public.user_profiles
    FOR SELECT USING (
        customer_id IN (
            SELECT customer_id FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can manage users in their customer" ON public.user_profiles
    FOR ALL USING (
        customer_id IN (
            SELECT customer_id FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    customer_uuid UUID;
BEGIN
    -- Get or create customer based on email domain or provided customer_id
    IF NEW.raw_user_meta_data->>'customer_id' IS NOT NULL THEN
        customer_uuid := (NEW.raw_user_meta_data->>'customer_id')::UUID;
    ELSE
        -- Create a default customer for new users
        INSERT INTO public.customers (name, contact_person, email)
        VALUES (
            COALESCE(NEW.raw_user_meta_data->>'company', 'Default Company'),
            COALESCE(NEW.raw_user_meta_data->>'name', ''),
            NEW.email
        )
        ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
        RETURNING id INTO customer_uuid;
    END IF;

    -- Create user profile
    INSERT INTO public.user_profiles (
        id,
        customer_id,
        email,
        name,
        role,
        company,
        department,
        phone
    ) VALUES (
        NEW.id,
        customer_uuid,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'employee'),
        NEW.raw_user_meta_data->>'company',
        NEW.raw_user_meta_data->>'department',
        NEW.raw_user_meta_data->>'phone'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_customer_id ON public.user_profiles(customer_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(status);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_status ON public.customers(status);

-- Insert sample customers and admin users
INSERT INTO public.customers (id, name, contact_person, email, phone, address, city, postal_code, users_count, buildings_count, status, active, modules, settings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Demo Bedrijf BV', 'Jan de Vries', 'jan@demobedrijf.nl', '+31 20 123 4567', 'Hoofdstraat 123', 'Amsterdam', '1000 AB', 5, 2, 'active', true, '{"bhv_management": true, "incident_reporting": true, "facility_management": true}', '{"notifications": true, "email_alerts": true}'),
('550e8400-e29b-41d4-a716-446655440002', 'Veiligheid Eerst', 'Maria Jansen', 'maria@veiligheideerst.nl', '+31 30 234 5678', 'Veiligheidsweg 45', 'Utrecht', '3500 CD', 12, 3, 'active', true, '{"bhv_management": true, "incident_reporting": true, "nfc_tags": true}', '{"notifications": true, "sms_alerts": true}'),
('550e8400-e29b-41d4-a716-446655440003', 'BHV360 Admin', 'System Administrator', 'admin@bhv360.nl', '+31 20 000 0000', 'Admin Street 1', 'Amsterdam', '1000 AA', 1, 1, 'active', true, '{"all_modules": true}', '{"super_admin": true}');

-- Create authentication helper functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM public.user_profiles 
        WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_customer_id(user_id UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT customer_id FROM public.user_profiles 
        WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role IN ('admin', 'super_admin') 
        FROM public.user_profiles 
        WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.customers TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_customer_id TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO anon, authenticated;

-- Create email templates for authentication
INSERT INTO auth.email_templates (template_name, subject, body) VALUES
('confirmation', 'Bevestig je BHV360 account', 
'<h2>Welkom bij BHV360!</h2>
<p>Klik op de onderstaande link om je account te bevestigen:</p>
<p><a href="{{ .ConfirmationURL }}">Bevestig Account</a></p>
<p>Deze link is 24 uur geldig.</p>'),

('recovery', 'Reset je BHV360 wachtwoord',
'<h2>Wachtwoord Reset</h2>
<p>Je hebt een wachtwoord reset aangevraagd voor je BHV360 account.</p>
<p><a href="{{ .ConfirmationURL }}">Reset Wachtwoord</a></p>
<p>Deze link is 1 uur geldig.</p>'),

('invite', 'Uitnodiging voor BHV360',
'<h2>Je bent uitgenodigd voor BHV360!</h2>
<p>Je bent uitgenodigd om deel te nemen aan het BHV360 platform.</p>
<p><a href="{{ .ConfirmationURL }}">Accepteer Uitnodiging</a></p>');

-- Final message
DO $$
BEGIN
    RAISE NOTICE 'BHV360 Supabase authentication setup completed successfully!';
    RAISE NOTICE 'Sample customers and admin structure created.';
    RAISE NOTICE 'You can now register users through the application.';
END $$;
