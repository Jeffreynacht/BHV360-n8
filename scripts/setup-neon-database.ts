import { sql } from "../lib/database"

async function setupDatabase() {
  console.log("🚀 Setting up Neon database...")

  try {
    // Test connection
    console.log("1. Testing database connection...")
    const testResult = await sql`SELECT NOW() as current_time, version() as version`
    console.log("✅ Connected to:", testResult[0].version)

    // Create tables
    console.log("2. Creating database schema...")

    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    console.log("✅ UUID extension enabled")

    // Create customers table
    await sql`
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
      )
    `
    console.log("✅ Customers table created")

    // Create users table
    await sql`
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
      )
    `
    console.log("✅ Users table created")

    // Create other tables
    await sql`
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
        serial_number VARCHAR(100),
        manufacturer VARCHAR(100),
        model VARCHAR(100),
        installation_date DATE,
        notes TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("✅ Facilities table created")

    await sql`
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
      )
    `
    console.log("✅ Incidents table created")

    // Insert demo data
    console.log("3. Inserting demo data...")

    const existingCustomers = await sql`SELECT COUNT(*) as count FROM customers`
    if (existingCustomers[0].count === "0") {
      await sql`
        INSERT INTO customers (name, contact_person, email, phone, address, active, buildings, users, status) VALUES 
        ('Demo Bedrijf BV', 'Jan de Vries', 'jan@demobedrijf.nl', '06-12345678', 'Hoofdstraat 1, 1234 AB Amsterdam', true, 3, 25, 'active'),
        ('Provincie Noord-Brabant', 'Marie van den Berg', 'marie@brabant.nl', '073-1234567', 'Provinciehuis, 5200 AB Den Bosch', true, 5, 50, 'active'),
        ('Ziekenhuis Catharina', 'Dr. Peter Janssen', 'p.janssen@catharina.nl', '040-2345678', 'Michelangelolaan 2, 5623 EJ Eindhoven', true, 2, 75, 'active')
      `
      console.log("✅ Demo customers inserted")
    } else {
      console.log("✅ Demo data already exists")
    }

    // Create indexes
    console.log("4. Creating indexes...")
    await sql`CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_facilities_customer_id ON facilities(customer_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_incidents_customer_id ON incidents(customer_id)`
    console.log("✅ Indexes created")

    console.log("🎉 Database setup completed successfully!")

    // Test data retrieval
    const customers = await sql`SELECT * FROM customers`
    console.log(`📊 Found ${customers.length} customers in database`)
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
}

export { setupDatabase }
