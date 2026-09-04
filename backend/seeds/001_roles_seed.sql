INSERT INTO roles (name, description)
VALUES
  ('admin', 'Full access to the platform and all financial data'),
  ('manager', 'Can manage accounts, users, and oversight for a tenant'),
  ('member', 'Standard user with access to their own financial data')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (name, email, password_hash, role_id)
VALUES
  ('Alexander', 'alex@example.com', NULL, (SELECT role_id FROM roles WHERE name = 'member')),
  ('Test User', 'testuser@example.com', '$2b$10$dxl5kJACIqk2eDyZPC1x0.SFTy0pfCkuUjW1yzzQg24nxOdlasJ2u', (SELECT role_id FROM roles WHERE name = 'member')),
  ('Ruqayya yusuf', 'ruksdev@test.com', '$2b$10$uxFsnZb4q0p81BVwh83XNOynyobqPYUpuS2wOdvWAsqEqcRupy/M.', (SELECT role_id FROM roles WHERE name = 'member')),
  ('Adebayo Muh''sin', 'muhsindev@test.com', '$2b$10$OM1BmaeJcFsoJVqmUsBkkehEM4/buOXRj9xsYq/34owm0bLwyLGui', (SELECT role_id FROM roles WHERE name = 'member')),
  ('silas', 'silas@gmail.com', '$2b$10$Rvtjf0vORYzZXQhyE/m8xOnimpRYLDifTbXT3qXvsd5MORy/baN2e', (SELECT role_id FROM roles WHERE name = 'member'))
ON CONFLICT (email) DO UPDATE
SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role_id = EXCLUDED.role_id;
