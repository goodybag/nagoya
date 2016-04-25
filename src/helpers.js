import {ValidationError, ValidationResultError} from './errors';
import {mapValues} from 'lodash';

import {toExpression, Assertion} from './assertion';

export function assert(expression, details = []) {
    return makeAssertion(toExpression(expression), toDetails(details));
}

export function always(expr) {
    expr = toExpression(expr);

    return new Assertion(options => {
        return expr(options);
    });
}

export function empty() {
    return always(null);
}

export function concat(assertions) {
    return assertions.reduce((a, b) => a.concat(b), empty());
}

export function nullable(columnName = null, expr, details = []) {
    expr = toExpression(expr)
    const assertion = makeAssertion(opts => expr(opts) != null,
                                    toDetails(details));

    return new Assertion(options => {
        const {nullableColumns} = options;


        if (isNullable(nullableColumns)) {
            return [];
        } else {
            return assertion.run(options);
        }
    });


    function isNullable(nullableColumns) {
        if (nullableColumns instanceof Array) {
            return nullableColumns.indexOf(columnName) !== -1;
        } else {
            return !!nullableColumns;
        }
    }
}

function makeAssertion(expression, details) {
    return new Assertion(options => {
        const result = expression(options);

        if (result instanceof Assertion) {
            return result.run(options);
        } else if (!result) {
            return details().map(detail => {
                return toError(detail, options);
            });
        } else {
            return null;
        }
    });
}

function toDetails(value) {
    if (typeof value === 'function') {
        return options => toDetails(value(options))(options);
    }

    if (value instanceof Array) {
        return options => value.map(d => toDetail(d)(options));
    }

    return options => [toDetail(value)(options)];
}

function toError({message, columns}, options) {
    return new ValidationError(message, {
        columns: (columns || []).concat(options.columns || []),
        stackFn: Assertion.prototype.run
    });
}

function toDetail(value) {
    if (typeof value === 'string') {
        return () => {
            return {message: value};
        };
    }

    if (typeof value === 'function') {
        return options => toDetail(value(options));
    }

    if (typeof value === 'object') {
        return options => mapValues(value, prop => toExpression(prop)(options));
    }

    return () => value;
}
