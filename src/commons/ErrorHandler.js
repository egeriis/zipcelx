class ErrorHandler extends Error {
  constructor(message, prop) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.prop = prop;
    this.message = message;
  }
}

export default ErrorHandler;
