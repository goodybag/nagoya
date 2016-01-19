export function ValidationError(message, details = {}) {
    const {
        columns = {}
    } = details;

    this.message = message;
    this.columns = columns;

    if (message instanceof Error) {
        this.message = message.message;
        this.stack = message.stack;
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
}

ValidationError.prototype = Object.create(Error);
ValidationError.prototype.constructor = ValidationError;

Object.defineProperty(ValidationError, 'name', {
    value: 'ValidationError'
});
