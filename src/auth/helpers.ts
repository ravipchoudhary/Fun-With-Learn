import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

export function signAccessToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret', { expiresIn: REFRESH_TOKEN_TTL });
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function makeRandomToken() {
  return crypto.randomBytes(32).toString('hex');
}
