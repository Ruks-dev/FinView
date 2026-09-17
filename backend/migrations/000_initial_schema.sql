CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consents (
  consent_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  provider VARCHAR(255),
  status VARCHAR(100) NOT NULL,
  granted_at TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bank_accounts (
  account_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  consent_id INTEGER NOT NULL REFERENCES consents(consent_id) ON DELETE CASCADE,
  bank_name VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  account_number VARCHAR(255),
  account_type VARCHAR(100),
  currency VARCHAR(10) DEFAULT 'NGN',
  external_account_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS balances (
  balance_id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES bank_accounts(account_id) ON DELETE CASCADE,
  available_balance NUMERIC,
  current_balance NUMERIC,
  currency VARCHAR(10) DEFAULT 'NGN',
  retrieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES bank_accounts(account_id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  transaction_type VARCHAR(100),
  description TEXT,
  category VARCHAR(255),
  transaction_date TIMESTAMP,
  currency VARCHAR(10) DEFAULT 'NGN',
  external_transaction_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS spending_patterns (
  pattern_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  total_amount NUMERIC DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL
);