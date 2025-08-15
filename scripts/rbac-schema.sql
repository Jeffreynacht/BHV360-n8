-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'super_admin',
        'partner_admin', 'partner_manager',
        'customer_owner', 'customer_admin', 'customer_manager',
        'bhv_coordinator', 'bhv_ploegleider', 'bhv_member', 'ehbo_member', 'ontruimer',
        'employee', 'visitor'
    )),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partners table for white-label functionality
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    branding JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    contact_person JSONB NOT NULL,
    billing JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'bedrijf', 'overheid', 'zorginstelling', 'onderwijsinstelling', 'non-profit'
    )),
    address JSONB NOT NULL,
    contact_person JSONB NOT NULL,
    settings JSONB DEFAULT '{}',
    billing JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments for organizational structure
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role assignments with audit trail
CREATE TABLE IF NOT EXISTS role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    assigned_by UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    reason TEXT
);

-- Permissions table for granular access control
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource VARCHAR(100) NOT NULL,
    actions TEXT[] NOT NULL,
    scope VARCHAR(50) DEFAULT 'customer',
    granted_by UUID NOT NULL REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Audit log for security tracking
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_partner_id ON users(partner_id);
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_partner_id ON customers(partner_id);
CREATE INDEX IF NOT EXISTS idx_departments_customer_id ON departments(customer_id);
CREATE INDEX IF NOT EXISTS idx_role_assignments_user_id ON role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_user_id ON permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see users in their scope
CREATE POLICY users_access_policy ON users
    FOR ALL
    USING (
        -- Super admins see everything
        EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'super_admin')
        OR
        -- Partner admins see their partner's users
        (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('partner_admin', 'partner_manager') AND u.partner_id = users.partner_id))
        OR
        -- Customer admins see their customer's users
        (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('customer_owner', 'customer_admin', 'customer_manager') AND u.customer_id = users.customer_id))
        OR
        -- Users can see themselves
        (auth.uid() = users.id)
    );

-- RLS Policy: Customer access based on role
CREATE POLICY customers_access_policy ON customers
    FOR ALL
    USING (
        -- Super admins see everything
        EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'super_admin')
        OR
        -- Partner users see their partner's customers
        EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.partner_id = customers.partner_id)
        OR
        -- Customer users see their own customer
        EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.customer_id = customers.id)
    );

-- Insert demo data
INSERT INTO partners (id, name, domain, contact_person, billing) VALUES
    ('partner-1', 'Safety First Consultancy', 'safetyfirst', 
     '{"name": "John Safety", "email": "john@safetyfirst.nl", "phone": "020-1234567"}',
     '{"plan": "enterprise", "monthly_fee": 500, "per_user_fee": 5}')
ON CONFLICT (domain) DO NOTHING;

INSERT INTO customers (id, partner_id, name, type, address, contact_person, billing) VALUES
    ('customer-1', NULL, 'Demo Bedrijf BV', 'bedrijf',
     '{"street": "Hoofdstraat 123", "city": "Amsterdam", "postal_code": "1234 AB", "country": "Nederland"}',
     '{"name": "Jan de Vries", "email": "jan@demobedrijf.nl", "phone": "020-1234567", "position": "Facility Manager"}',
     '{"plan": "professional", "monthly_fee": 200, "per_user_fee": 3}'),
    ('customer-2', 'partner-1', 'Ziekenhuis Sint Anna', 'zorginstelling',
     '{"street": "Ziekenhuislaan 100", "city": "Geldrop", "postal_code": "5664 EH", "country": "Nederland"}',
     '{"name": "Dr. Anna Pietersen", "email": "a.pietersen@sintanna.nl", "phone": "040-2345678", "position": "Veiligheidscoördinator"}',
     '{"plan": "enterprise", "monthly_fee": 500, "per_user_fee": 5}')
ON CONFLICT (id) DO NOTHING;

-- Insert demo users with proper password hashing (in production, use proper bcrypt)
INSERT INTO users (id, email, name, password_hash, role, partner_id, customer_id) VALUES
    ('super-admin-1', 'admin@bhv360.nl', 'BHV360 Super Admin', '$2b$10$demo123hash', 'super_admin', NULL, NULL),
    ('partner-admin-1', 'admin@safetyfirst.nl', 'Safety First Admin', '$2b$10$demo123hash', 'partner_admin', 'partner-1', NULL),
    ('customer-admin-1', 'admin@demobedrijf.nl', 'Demo Bedrijf Admin', '$2b$10$demo123hash', 'customer_admin', NULL, 'customer-1'),
    ('bhv-coordinator-1', 'bhv@demobedrijf.nl', 'Jan de BHV Coördinator', '$2b$10$demo123hash', 'bhv_coordinator', NULL, 'customer-1'),
    ('employee-1', 'medewerker@demobedrijf.nl', 'Marie Medewerker', '$2b$10$demo123hash', 'employee', NULL, 'customer-1')
ON CONFLICT (email) DO NOTHING;
