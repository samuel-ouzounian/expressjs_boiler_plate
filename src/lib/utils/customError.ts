export class CustomError extends Error {
  data: any;

  constructor(message: string, data: Record<string, any> = {}) {
    super(message);
    this.data = data;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
