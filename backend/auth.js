import crypto from 'node:crypto';

const SESSION_SECRET = process.env.JWT_SECRET || 'finview-dev-secret';

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
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
