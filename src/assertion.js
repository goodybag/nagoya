import {merge} from 'lodash';
import {ValidationResultError} from './errors';

export class Assertion {
    constructor(run) {
        this._run = run;
    }

    concat(assertion) {
        const run = this._run;

        return new Assertion(options => {
            const left = run(options);
            const right = assertion.run(options);

            if (left == null && right == null) {
                return null;
            } else {
                return (left || []).concat(right || []);
            }
        });
    }

    and(assertion) {
        const run = this._run;

        return new Assertion(options => {
            const errs = run(options);

            if (errs == null) {
                return assertion.run(options);
            } else {
                return errs;
            }
        });
    }

    set(transform) {
        transform = toExpression(transform);
        const run = this._run;

        return new Assertion(options => {
            return run({...options, ...transform(options)});
        });
    }

    column(...newColumns) {
        return this.set(({columns}) =>
            ({columns: (columns || []).concat(newColumns)}));
    }

    when(expr) {
        expr = toExpression(expr);
        const run = this._run;

        return new Assertion(options => {
            if (expr()) {
                return run(options);
            } else {
                return null;
            }
        });
    }

    run(options = {}) {
        return this._run(options);
    }

    validate(opts) {
        const error = this.error(opts, Assertion.prototype.validate);

        if (error) {
            throw error;
        }
    }

    error(opts, stackFn = Assertion.prototype.error) {
        const result = this.run(opts);

        if (result == null || result.length === 0) {
            return null;
        } else {
            const messages = result.map(err => err.message);

            return new ValidationResultError(`Validation failed: ${messages.join(', ')}`, {
                stackFn, errors: result
            });
        }
    }
}

export function toExpression(value) {
    if (typeof value === 'function') {
        return value;
    }

    return () => value;
}
