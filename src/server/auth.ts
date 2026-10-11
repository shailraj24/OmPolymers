// Authentication, Token Verification and Rate Limiting for OM Polymer API

import { Request, Response, NextFunction } from 'express';

// Simulated JWT secret & token utility matching .NET JwtSecurityTokenHandler
const JWT_SECRET = 'A_Very_Secure_And_Long_Secret_Key_For_OMPolymer_2024';

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

export function generateToken(adminId: number, email: string, name: string, role: string = 'Admin'): { token: string; expiry: string } {
  const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1440 minutes (24h)
  const payload: TokenPayload = {
    sub: adminId.toString(),
    email,
    name,
    role,
    exp: Math.floor(expiryDate.getTime() / 1000)
  };
  
  // URL-safe base64 encoded token representation (standard header.payload.signature)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = Buffer.from(`${header}.${body}.${JWT_SECRET}`).toString('base64url');
  
  const token = `${header}.${body}.${signature}`;
  return {
    token,
    expiry: expiryDate.toISOString()
  };
}

export function verifyToken(authHeader?: string): TokenPayload | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf8');
    const payload: TokenPayload = JSON.parse(payloadStr);

    // Check expiry
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Middleware matching [Authorize(Roles = "Admin,SuperAdmin")]
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const user = verifyToken(authHeader);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Valid Bearer JWT token required for administrative access.',
      data: null,
      errors: ['Invalid, missing, or expired token. Authenticate via POST /api/admin/auth/login first.']
    });
  }

  if (user.role !== 'Admin' && user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. The authenticated principal lacks an Administrative role.',
      data: null,
      errors: ['User does not have permission to execute this operation.']
    });
  }

  (req as unknown as { user: TokenPayload }).user = user;
  next();
}

// Middleware matching [Authorize(Roles = "SuperAdmin")]
export function requireSuperAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const user = verifyToken(authHeader);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Valid Bearer JWT token required.',
      data: null,
      errors: ['Invalid, missing, or expired token.']
    });
  }

  if (user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. This action requires SuperAdmin privileges.',
      data: null,
      errors: ['SuperAdmin role is mandatory for this operation.']
    });
  }

  (req as unknown as { user: TokenPayload }).user = user;
  next();
}

// In-Memory Rate Limiting matching ASP.NET Core RateLimiter (LoginPolicy & RequirementPolicy)
interface RateRecord {
  count: number;
  resetAt: number;
}

const rateLimitBuckets = new Map<string, RateRecord>();

export function createRateLimiter(policyName: string, maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${policyName}:${ip}`;
    const now = Date.now();

    const record = rateLimitBuckets.get(key);

    if (!record || now > record.resetAt) {
      rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      return res.status(429).json({
        type: 'https://tools.ietf.org/html/rfc6585#section-4',
        title: 'Too Many Requests',
        status: 429,
        detail: `Rate limit exceeded for policy "${policyName}". Maximum ${maxRequests} requests allowed per window. Please try again in ${retryAfterSec} seconds.`,
        instance: req.originalUrl
      });
    }

    record.count++;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - record.count);
    next();
  };
}
