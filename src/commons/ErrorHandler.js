function ErrorHandler(message) {
  this.name = 'Error';
  this.message = message;
  this.stack = (new Error()).stack;
}

export default ErrorHandler;
