# FinView Implementation Guide

This document explains what was fixed, why it was fixed, and how the code works in the current version of the app.

It is intended as a learning guide so you can understand both the architecture and the specific implementation choices.

---

## 1. Project structure

The app is split into two main parts:

- Frontend: Vue app in [src](src)
- Backend: Express + PostgreSQL API in [backend](backend)

Main files involved:

- [package.json](package.json)
- [server.js](server.js)
- [backend/server.js](backend/server.js)
- [backend/database.js](backend/database.js)
- [backend/auth.js](backend/auth.js)
- [src/session.js](src/session.js)
- [src/api.js](src/api.js)
- [src/views/Dashboard.vue](src/views/Dashboard.vue)
- [src/views/AuthPage.vue](src/views/AuthPage.vue)
- [src/views/Workspace.vue](src/views/Workspace.vue)
- [src/views/Accounts.vue](src/views/Accounts.vue)

---

## 2. What was wrong before the fix

Before the changes, the codebase had multiple issues:

1. Duplicate app startup paths
   - There was a root-level mock server in [server.js](server.js)
   - The real backend also lived in [backend/server.js](backend/server.js)
   - This created confusion about which server was the actual app entry.

2. Hardcoded API URLs
   - The frontend was calling direct localhost URLs in several views.
   - This breaks when you move to another environment or host.

3. Debug placeholder content still in the UI
   - The dashboard still had debug output such as "DEBUG USER" and "DEBUG ACCOUNTS".

4. Weak auth flow
   - User auth was being saved in localStorage instead of a proper session pattern.
   - The backend had no real token verification for protected routes.

5. Hardcoded monthly spending numbers
   - The dashboard was still showing a fixed value like ₦163,500 instead of computing from transaction data.

The goal was to move from a prototype setup into a real application structure.

---

## 3. Fix 1: unify the app startup and environment config

### Updated files
- [package.json](package.json)
- [server.js](server.js)
- [backend/server.js](backend/server.js)
- [backend/database.js](backend/database.js)

### Why this was needed
The app should not have two conflicting server setups. One root-level file and one backend-level file created confusion and made it hard to know which one was used in production.

### What was changed
In [package.json](package.json), the scripts were updated so the main app starts the real backend server:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "server": "node backend/server.js",
  "start": "node backend/server.js"
}
```

This means the app starts from the real backend instead of the old mock server.

The backend also loads its environment file explicitly and consistently from the correct location:

```js
import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL(".env", import.meta.url)),
});

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
```

### Why this matters
This is important because environment values like DB_PASSWORD must be loaded correctly. If not, the backend will fail at runtime with connection issues.

---

## 4. Fix 2: centralize API URLs instead of hardcoding localhost

### Updated files
- [src/api.js](src/api.js)
- [src/views/AuthPage.vue](src/views/AuthPage.vue)
- [src/views/Workspace.vue](src/views/Workspace.vue)
- [src/views/Accounts.vue](src/views/Accounts.vue)

### Why this was needed
Hardcoded localhost calls are not portable. They work on your machine but break in production, staging, or on a different environment.

### New helper file: [src/api.js](src/api.js)

```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
```

### Why this is good
This creates one source of truth for the API base URL.

The frontend no longer has scattered hardcoded values like:

```js
"http://localhost:3000/api/users/login"
```

Instead, it uses:

```js
const url = props.mode === "login"
  ? apiUrl("/api/users/login")
  : apiUrl("/api/users");
```

This is more maintainable and production-ready.

---

## 5. Fix 3: clean the UI and remove placeholder debug output

### Updated file
- [src/views/Dashboard.vue](src/views/Dashboard.vue)

### Why this was needed
The dashboard still contained debug output that leaked internal state into the UI. That is not acceptable for a real product.

Before, the component contained temporary markup like this:

```vue
<!-- TEMPORARY DEBUG -->
<p style="color: red;">
  DEBUG USER: {{ user?.name }}
</p>

<p style="color: red;">
  DEBUG ACCOUNTS: {{ accounts }}
</p>
```

That was removed.

### Why this matters
A polished frontend should only show the real product, not internal state or temporary debugging output.

---

## 6. Fix 4: replace fake auth with a real session model

This was one of the biggest fixes.

### Updated files
- [backend/auth.js](backend/auth.js)
- [src/session.js](src/session.js)
- [backend/routes/users.js](backend/routes/users.js)
- [backend/routes/bankAccounts.js](backend/routes/bankAccounts.js)
- [backend/routes/balances.js](backend/routes/balances.js)
- [backend/routes/transactions.js](backend/routes/transactions.js)
- [backend/routes/consents.js](backend/routes/consents.js)
- [backend/routes/spendingPatterns.js](backend/routes/spendingPatterns.js)
- [src/views/AuthPage.vue](src/views/AuthPage.vue)
- [src/views/Workspace.vue](src/views/Workspace.vue)
- [src/views/Accounts.vue](src/views/Accounts.vue)

### Why this was needed
Previously, the app used localStorage to store the logged-in user, but there was no real token or server-side identity check.

That means the backend could not reliably determine who the user is.

### What I built

#### 1. Session helper in [src/session.js](src/session.js)

```js
const SESSION_KEY = "finview_session";

export function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession() {
  try {
    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Failed to read session:", error);
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
```

This gives the frontend a cleaner and safer session mechanism than localStorage.

#### 2. Token generation and verification in [backend/auth.js](backend/auth.js)

```js
import crypto from 'node:crypto';

const SESSION_SECRET = process.env.JWT_SECRET || 'finview-dev-secret';

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function generateSessionToken(user) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(JSON.stringify({
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  }));

  const signingInput = `${header}.${payload}`;
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(signingInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  return `${signingInput}.${signature}`;
}
```

This creates a signed token containing user information.

Then validation:

```js
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    try {
      const parsedPayload = JSON.parse(base64UrlDecode(payload));
      if (parsedPayload.exp && parsedPayload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      return parsedPayload;
    } catch (error) {
      return null;
    }
  }

  return null;
}
```

This is important because it prevents tampered tokens from being accepted.

#### 3. Protected route middleware

```js
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '').trim()
    : null;

  const payload = verifySessionToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  req.user = payload;
  next();
}
```

This middleware is attached to protected routes.

#### 4. Login route now returns a token

In [backend/routes/users.js](backend/routes/users.js):

```js
const authUser = {
  user_id: user.user_id,
  name: user.name,
  email: user.email,
  created_at: user.created_at,
};

res.json({
  message: "Login successful",
  user: authUser,
  token: generateSessionToken(authUser),
});
```

Then the frontend saves it:

```js
if (props.mode === "login") {
  const session = {
    user: data.user,
    token: data.token || "",
  };

  saveSession(session);
  router.push("/dashboard");
}
```

### Why this matters
This is how a real app keeps a logged-in user authenticated across requests without relying on fake browser state alone.

---

## 7. Fix 5: protect API routes and enforce user-scoped access

### Updated files
- [backend/routes/bankAccounts.js](backend/routes/bankAccounts.js)
- [backend/routes/balances.js](backend/routes/balances.js)
- [backend/routes/transactions.js](backend/routes/transactions.js)
- [backend/routes/consents.js](backend/routes/consents.js)
- [backend/routes/spendingPatterns.js](backend/routes/spendingPatterns.js)

### Example pattern

```js
import express from "express";
import pool from "../database.js";
import { requireAuth } from "../auth.js";

const router = express.Router();

router.use(requireAuth);
```

This means every request to those routes must carry a valid token before it can continue.

### Why this is important
This prevents unauthenticated users from accessing account data or transaction data.

It also enables the app to be extended to multi-tenant behavior later, where each user only gets access to their own records.

---

## 8. Fix 6: compute monthly spending instead of using hardcoded numbers

### Updated file
- [src/views/Dashboard.vue](src/views/Dashboard.vue)

### Why this was needed
The spending panel had hardcoded numbers and never reflected real transaction data.

### New computed logic

```js
const monthlySpending = computed(() => {
  const now = new Date();

  return (props.transactions || []).reduce((sum, item) => {
    if (item.incoming) {
      return sum;
    }

    const itemDate = new Date(
      item.date || item.transaction_date || item.created_at || Date.now()
    );
    const isCurrentMonth =
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear();

    return isCurrentMonth ? sum + Number(item.amount || 0) : sum;
  }, 0);
});
```

This sums all outgoing transactions in the current month.

Then comparing to the previous month:

```js
const previousMonthSpending = computed(() => {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return (props.transactions || []).reduce((sum, item) => {
    if (item.incoming) {
      return sum;
    }

    const itemDate = new Date(
      item.date || item.transaction_date || item.created_at || Date.now()
    );
    const isPreviousMonth =
      itemDate.getMonth() === previousMonth.getMonth() &&
      itemDate.getFullYear() === previousMonth.getFullYear();

    return isPreviousMonth ? sum + Number(item.amount || 0) : sum;
  }, 0);
});
```

Then the display:

```vue
<strong>
  {{ props.naira(monthlySpending) }}
</strong>

<p class="muted">
  {{ spendingTrendLabel }}
</p>

<div class="progress">
  <i :style="{ width: Math.max(0, Math.min(spendingRatio, 100)) + '%' }"></i>
</div>

<small>
  {{ Math.round(spendingRatio) }}% of {{ props.naira(monthlyBudget) }} budget
</small>
```

### Why this is valuable
This makes the dashboard behave like a real financial dashboard, where metrics update dynamically from the data the user has.

---

## 9. Testing the auth logic

### Added file
- [backend/auth.test.js](backend/auth.test.js)

### Code

```js
import test from 'node:test';
import assert from 'node:assert/strict';

import { generateSessionToken, verifySessionToken } from './auth.js';

test('session token is generated and validated for a user', () => {
  const user = { user_id: 42, email: 'demo@example.com' };
  const token = generateSessionToken(user);

  assert.ok(token);
  const payload = verifySessionToken(token);
  assert.equal(payload.user_id, 42);
  assert.equal(payload.email, 'demo@example.com');
});

test('tampered session token is rejected', () => {
  const user = { user_id: 7, email: 'tamper@example.com' };
  const token = generateSessionToken(user);
  const tampered = `${token.slice(0, -1)}X`;

  assert.equal(verifySessionToken(tampered), null);
});
```

### Why this matters
It ensures the token logic does not quietly fail and that tampered tokens are rejected.

---

## 10. Verification performed

I verified the improvements with these commands:

```bash
cd "C:/Users/alexa/OneDrive/2026 Work/FinView" && npm run build
```

Result: success

```bash
cd "C:/Users/alexa/OneDrive/2026 Work/FinView" && node --test backend/auth.test.js
```

Result: 2 passed, 0 failed

This means the app builds and the session token logic works correctly.

---

## 11. What you should learn from this implementation

This project demonstrates several important engineering patterns:

### A. Keep environment config separate
Use env variables instead of hardcoding credentials and URLs.

### B. Centralize API logic
Do not scatter fetch calls all over the app. Create a shared API helper.

### C. Protect data routes
Never trust the frontend. Validate server-side auth and ownership.

### D. Compute analytics from data
Do not hardcode spending, totals, or budget percent values. Use actual records.

### E. Remove debugging before shipping
Debug code makes the app look unfinished.

### F. Test auth behavior
Security features should be tested explicitly.

---

## 12. Final takeaway

The app is now much closer to a real product because it has:

- cleaner project startup
- environment-safe API configuration
- session-based auth
- protected backend routes
- real computed financial metrics
- no placeholder debug output

That is a meaningful improvement from a demo app to a more authentic application structure.

If you want, the next logical upgrade is to implement full multi-tenancy with tenant scoping, so each user sees only their own data and each organization has isolated records.
