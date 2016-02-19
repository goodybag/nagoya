export function ValidationError(message, details = {}) {
    const {
        columns = {},
        value = null
    } = details;

    this.message = message;
    this.columns = columns;
    this.value = value;

    if (message instanceof Error) {
        this.message = message.message;
        this.stack = message.stack;
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

Object.defineProperty(ValidationError.prototype, 'name', {
    value: 'ValidationError'
});
