-- Insert demo customers
INSERT INTO customers (id, name, contact_person, email, phone, address, buildings, users, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Provincie Noord-Brabant', 'Marie van den Berg', 'marie@brabant.nl', '+31-73-681-2345', 'Brabantlaan 1, 5216 TV Den Bosch', 5, 50, 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Demo Bedrijf BV', 'Jan de Vries', 'jan@demobedrijf.nl', '+31-20-123-4567', 'Teststraat 123, 1000 AB Amsterdam', 3, 25, 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'Ziekenhuis Sint Anna', 'Dr. Peters', 'peters@sintanna.nl', '+31-40-789-0123', 'Ziekenhuislaan 45, 5600 PD Eindhoven', 2, 75, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert demo users
INSERT INTO users (id, customer_id, name, email, phone, role, department, bhv_roles, active) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Marie van den Berg', 'marie@brabant.nl', '+31-73-681-2345', 'BHV Coördinator', 'Facilitair', '["coordinator", "evacuation_leader"]', true),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Piet Janssen', 'piet@brabant.nl', '+31-73-681-2346', 'BHV-er', 'ICT', '["fire_warden", "first_aid"]', true),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Jan de Vries', 'jan@demobedrijf.nl', '+31-20-123-4567', 'Hoofd BHV', 'Management', '["coordinator", "evacuation_leader", "fire_warden"]', true),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Dr. Peters', 'peters@sintanna.nl', '+31-40-789-0123', 'BHV Coördinator', 'Medisch', '["coordinator", "first_aid"]', true)
ON CONFLICT (email) DO NOTHING;

-- Insert demo facilities
INSERT INTO facilities (customer_id, name, type, building, floor, zone, status, serial_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Brandblusser Gang A1', 'fire_extinguisher', 'Hoofdgebouw', 'Begane grond', 'Zone A', 'active', 'FB-001'),
('550e8400-e29b-41d4-a716-446655440001', 'Brandslang Trap Noord', 'fire_hose', 'Hoofdgebouw', '1e verdieping', 'Zone B', 'active', 'BS-002'),
('550e8400-e29b-41d4-a716-446655440001', 'AED Receptie', 'aed', 'Hoofdgebouw', 'Begane grond', 'Zone A', 'active', 'AED-001'),
('550e8400-e29b-41d4-a716-446655440002', 'Brandblusser Kantoor', 'fire_extinguisher', 'Kantoorgebouw', 'Begane grond', 'Zone 1', 'active', 'FB-101'),
('550e8400-e29b-41d4-a716-446655440003', 'AED Spoedeisende Hulp', 'aed', 'Ziekenhuis', 'Begane grond', 'SEH', 'active', 'AED-201');

-- Insert demo NFC tags
INSERT INTO nfc_tags (customer_id, name, tag_id, location, building, floor, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'NFC Tag Brandblusser A1', 'NFC-001-FB', 'Gang A1, bij lift', 'Hoofdgebouw', 'Begane grond', 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'NFC Tag AED Receptie', 'NFC-002-AED', 'Receptie, rechts van balie', 'Hoofdgebouw', 'Begane grond', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'NFC Tag Kantoor FB', 'NFC-101-FB', 'Kantoor ingang', 'Kantoorgebouw', 'Begane grond', 'active');

-- Insert demo plotkaart data
INSERT INTO plotkaart_data (customer_id, name, floors, updated_by) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Provincie Brabant Hoofdgebouw', '[
  {
    "id": "floor-0",
    "name": "Begane grond",
    "elements": [
      {"id": "fb-1", "type": "fire_extinguisher", "x": 100, "y": 150, "name": "Brandblusser A1"},
      {"id": "aed-1", "type": "aed", "x": 200, "y": 100, "name": "AED Receptie"},
      {"id": "exit-1", "type": "emergency_exit", "x": 50, "y": 200, "name": "Nooduitgang Noord"}
    ]
  },
  {
    "id": "floor-1", 
    "name": "1e verdieping",
    "elements": [
      {"id": "bs-1", "type": "fire_hose", "x": 150, "y": 120, "name": "Brandslang Noord"},
      {"id": "exit-2", "type": "emergency_exit", "x": 300, "y": 180, "name": "Nooduitgang Zuid"}
    ]
  }
]', 'Marie van den Berg'),
('550e8400-e29b-41d4-a716-446655440002', 'Demo Bedrijf Kantoor', '[
  {
    "id": "floor-0",
    "name": "Begane grond", 
    "elements": [
      {"id": "fb-101", "type": "fire_extinguisher", "x": 120, "y": 80, "name": "Brandblusser Kantoor"}
    ]
  }
]', 'Jan de Vries');
