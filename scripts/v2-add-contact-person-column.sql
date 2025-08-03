-- Add the contact_person column to the customers table if it doesn't exist
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255);
