export interface ApiIslamConfig {
  baseUrl?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export class ApiException extends Error {
  statusCode?: number;
  details?: any;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.details = details;
  }
}
