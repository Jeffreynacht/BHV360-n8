-- BHV360 Database Schema Update v2
-- Add missing contact_person column to customers table

-- Check if the column exists before adding it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'customers' 
        AND column_name = 'contact_person'
    ) THEN
        ALTER TABLE customers ADD COLUMN contact_person VARCHAR(255);
        RAISE NOTICE 'Added contact_person column to customers table';
    ELSE
        RAISE NOTICE 'contact_person column already exists in customers table';
    END IF;
END $$;

-- Update existing customers with default contact person if null
UPDATE customers 
SET contact_person = COALESCE(contact_person, 'Contactpersoon')
WHERE contact_person IS NULL;

-- Add other missing columns that might be needed
DO $$ 
BEGIN
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'customers' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE customers ADD COLUMN phone VARCHAR(50);
        RAISE NOTICE 'Added phone column to customers table';
    END IF;

    -- Add address column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'customers' 
        AND column_name = 'address'
    ) THEN
        ALTER TABLE customers ADD COLUMN address TEXT;
        RAISE NOTICE 'Added address column to customers table';
    END IF;

    -- Add email column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'customers' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE customers ADD COLUMN email VARCHAR(255);
        RAISE NOTICE 'Added email column to customers table';
    END IF;
END $$;

-- Insert demo customers if they don't exist
INSERT INTO customers (name, contact_person, email, phone, address, created_at, updated_at)
VALUES 
    ('Demo Bedrijf B.V.', 'Jan de Vries', 'jan@demobedrijf.nl', '06-12345678', 'Demostraat 1, 1234 AB Demostad', NOW(), NOW()),
    ('Test Organisatie', 'Marie Janssen', 'marie@testorg.nl', '06-87654321', 'Testweg 2, 5678 CD Teststad', NOW(), NOW()),
    ('Voorbeeld Kantoor', 'Piet de Tester', 'piet@voorbeeldkantoor.nl', '06-11223344', 'Voorbeeldlaan 3, 9876 EF Voorbeeldstad', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

COMMIT;
