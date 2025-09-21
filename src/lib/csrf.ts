import crypto from 'crypto';
import { CSRF_SECRET } from './config';

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a CSRF token with HMAC signature
 */
export function createCSRFToken(): string {
  const token = generateCSRFToken();
  const hmac = crypto.createHmac('sha256', CSRF_SECRET as string);
  hmac.update(token);
  const signature = hmac.digest('hex');
  
  return `${token}.${signature}`;
}

/**
 * Verify a CSRF token
 */
export function verifyCSRFToken(token: string): boolean {
  try {
    const [tokenValue, signature] = token.split('.');
    
    if (!tokenValue || !signature) {
      return false;
    }
    
    const hmac = crypto.createHmac('sha256', CSRF_SECRET as string);
    hmac.update(tokenValue);
    const expectedSignature = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('CSRF token verification error:', error);
    return false;
  }
}

import { NextRequest } from 'next/server';

interface RouteContext<T = Record<string, string | string[]>> {
  params: Promise<T>;
}

/**
 * Middleware to check CSRF token for API routes
 */
export function withCSRFProtection<T = Record<string, string | string[]>>(
  handler: (req: NextRequest, context: RouteContext<T>) => Promise<Response>
) {
  return async (req: NextRequest, context: RouteContext<T>): Promise<Response> => {
    // Skip CSRF check for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return handler(req, context);
    }
    
    // Get CSRF token from headers
    const csrfToken = req.headers.get('x-csrf-token') || req.headers.get('x-xsrf-token');
    
    if (!csrfToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'CSRF token missing' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!verifyCSRFToken(csrfToken)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid CSRF token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return handler(req, context);
  };
}

/**
 * Wrapper for routes that don't have dynamic parameters
 */
export function withCSRFProtectionNoParams(
  handler: (req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest): Promise<Response> => {
    // Skip CSRF check for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return handler(req);
    }
    
    // Get CSRF token from headers
    const csrfToken = req.headers.get('x-csrf-token') || req.headers.get('x-xsrf-token');
    
    if (!csrfToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'CSRF token missing' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!verifyCSRFToken(csrfToken)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid CSRF token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return handler(req);
  };
}