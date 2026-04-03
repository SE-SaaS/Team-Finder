/**
 * Custom error classes for the API Wrapper
 */

export class APIError extends Error {
  public readonly statusCode: number;
  public readonly endpoint: string;
  public readonly service: string;

  constructor(message: string, statusCode: number, endpoint: string, service: string) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.service = service;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export class AuthError extends APIError {
  constructor(service: string, endpoint: string) {
    super(`Authentication failed for ${service}. Check your credentials.`, 401, endpoint, service);
    this.name = "AuthError";
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class RateLimitError extends APIError {
  public readonly retryAfter?: number;

  constructor(service: string, endpoint: string, retryAfter?: number) {
    super(
      `Rate limit exceeded for ${service}.${retryAfter ? ` Retry after ${retryAfter}s.` : ""}`,
      429,
      endpoint,
      service
    );
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string, service: string, endpoint: string) {
    super(`Resource not found: ${resource}`, 404, endpoint, service);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class NetworkError extends Error {
  public readonly service: string;

  constructor(service: string, cause: Error) {
    super(`Network error on ${service}: ${cause.message}`);
    this.name = "NetworkError";
    this.service = service;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
