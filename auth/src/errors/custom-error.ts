export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): { message: string; field?: string }[];

  constructor(message: string) {
    super(message);
    // only when you extend a build-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
