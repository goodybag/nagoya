export function ValidationError(message, details = {}) {
    const {
        columns = [],
        stackFn = this.constructor
    } = details;

    this.message = message;
    this.columns = columns;

    if (message instanceof Error) {
        this.message = message.message;
        this.stack = message.stack;
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, stackFn);
    }
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

Object.defineProperty(ValidationError.prototype, 'name', {
    value: 'ValidationError'
});

export function ValidationResultError(message, details = {}) {
    const {
        errors = [],
        stackFn = this.constructor
    } = details;

    this.message = message;
    this.errors = errors;

    if (message instanceof Error) {
        this.message = message.message;
        this.stack = message.stack;
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, stackFn);
    }
}

ValidationResultError.test = function test(error) {
    return error instanceof ValidationResultError;
}

ValidationResultError.prototype = Object.create(Error.prototype);
ValidationResultError.prototype.constructor = ValidationResultError;

ValidationResultError.prototype.byColumn = function byColumn(columnName) {
    return this.errors.filter(err => err instanceof ValidationError && err.columns.indexOf(columnName) !== -1);
};

Object.defineProperty(ValidationResultError.prototype, 'name', {
    value: 'ValidationResultError'
});
