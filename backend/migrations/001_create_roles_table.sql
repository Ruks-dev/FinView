CREATE TABLE IF NOT EXISTS roles (
  role_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles (name, description)
VALUES
  ('admin', 'Full access to the platform and all financial data'),
  ('manager', 'Can manage accounts, users, and oversight for a tenant'),
  ('member', 'Standard user with access to their own financial data')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(role_id);

UPDATE users
SET role_id = (
  SELECT role_id FROM roles WHERE name = 'member'
)
WHERE role_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
