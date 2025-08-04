export class ValidationError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.isOperational = true;
  }
}

export class NotFoundError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.isOperational = true;
  }
}

export class UnauthorizedError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.isOperational = true;
  }
}

export class ForbiddenError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.isOperational = true;
  }
}

export class DatabaseError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
    this.isOperational = true;
  }
}

export class ExternalServiceError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'ExternalServiceError';
    this.statusCode = 502;
    this.isOperational = true;
  }
}
