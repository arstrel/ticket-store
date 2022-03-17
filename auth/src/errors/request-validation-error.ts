import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    // message here is just for logging purposes
    super('Invalid request parameters');

    // only in TS when extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    const formattedErrors = this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));

    return formattedErrors;
  }
}
