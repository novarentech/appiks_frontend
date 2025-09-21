import { NextResponse } from "next/server";

/**
 * Custom API Error class
 */
export class APIError extends Error {
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(message: string, statusCode: number = 500, details?: Record<string, unknown>) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Error types for better categorization
 */
export enum ErrorType {
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  EXTERNAL_API = "EXTERNAL_API",
  CSRF = "CSRF",
  INTERNAL = "INTERNAL",
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  type: ErrorType = ErrorType.INTERNAL,
  details?: Record<string, unknown>
): NextResponse {
  const errorResponse = {
    success: false,
    message,
    type,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  };

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Handle authentication errors
 */
export function handleAuthenticationError(message: string = "Authentication required"): NextResponse {
  return createErrorResponse(message, 401, ErrorType.AUTHENTICATION);
}

/**
 * Handle authorization errors
 */
export function handleAuthorizationError(message: string = "Insufficient permissions"): NextResponse {
  return createErrorResponse(message, 403, ErrorType.AUTHORIZATION);
}

/**
 * Handle validation errors
 */
export function handleValidationError(message: string, details?: Record<string, unknown>): NextResponse {
  return createErrorResponse(message, 400, ErrorType.VALIDATION, details);
}

/**
 * Handle not found errors
 */
export function handleNotFoundError(message: string = "Resource not found"): NextResponse {
  return createErrorResponse(message, 404, ErrorType.NOT_FOUND);
}

/**
 * Handle external API errors
 */
export function handleExternalApiError(message: string, statusCode: number = 500, details?: Record<string, unknown>): NextResponse {
  return createErrorResponse(message, statusCode, ErrorType.EXTERNAL_API, details);
}

/**
 * Handle CSRF errors
 */
export function handleCSRFError(message: string = "CSRF token validation failed"): NextResponse {
  return createErrorResponse(message, 403, ErrorType.CSRF);
}

/**
 * Handle internal server errors
 */
export function handleInternalError(error: unknown, message: string = "Internal server error"): NextResponse {
  console.error("Internal server error:", error);
  
  const details = error instanceof Error 
    ? { 
        stack: error.stack,
        name: error.name,
      }
    : { originalError: error };
    
  return createErrorResponse(message, 500, ErrorType.INTERNAL, details);
}

/**
 * Wrap async handlers with error handling
 */
export function withErrorHandling<T extends Record<string, unknown> = Record<string, unknown>>(
  handler: (req: Request, context?: T) => Promise<Response>
) {
  return async (req: Request, context?: T): Promise<Response> => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof APIError) {
        return createErrorResponse(
          error.message,
          error.statusCode,
          ErrorType.INTERNAL,
          error.details
        );
      }
      
      return handleInternalError(error);
    }
  };
}

/**
 * Validate request body against schema
 */
export function validateRequestBody<T>(body: unknown, schema: Record<string, (value: unknown) => boolean | string>): T {
  const errors: Record<string, string[]> = {};
  
  for (const [key, validator] of Object.entries(schema)) {
    const value = (body as Record<string, unknown>)[key];
    const result = validator(value);
    
    if (result !== true) {
      if (!errors[key]) {
        errors[key] = [];
      }
      errors[key].push(typeof result === "string" ? result : `Invalid ${key}`);
    }
  }
  
  if (Object.keys(errors).length > 0) {
    throw new APIError("Validation failed", 400, { errors });
  }
  
  return body as T;
}