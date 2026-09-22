import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Secret for signing session tokens and AES encryption
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'bably-super-secure-encryption-key-32b!'; // 32 chars
const IV_LENGTH = 16;

/**
 * Hash password with PBKDF2 (SHA-512)
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify password against stored hash & salt
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(checkHash), Buffer.from(hash));
}

/**
 * Encrypt sensitive API Secrets (AES-256-GCM)
 */
export function encryptSecret(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypt sensitive API Secrets
 */
export function decryptSecret(text: string): string {
  if (!text || !text.includes(':')) return '';
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    return '***';
  }
}

/**
 * Generate cryptographically secure random token
 */
export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * In-memory rate limiting map
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(windowMs: number = 60000, maxRequests: number = 120) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const key = String(ip);
    const now = Date.now();

    const entry = rateLimitMap.get(key);
    if (!entry || entry.resetTime < now) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a moment before trying again.',
        error_ar: 'تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً.'
      });
    }

    entry.count += 1;
    next();
  };
}
