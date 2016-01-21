import validator from 'validator';
import each from 'lodash/collection/each';
import map from 'lodash/collection/map';

import {ValidationError} from './errors';

export function assert(condition, message = 'is invalid', type = ValidationError) {
    if (!condition) {
        throw new type(message);
    }
}

export function schema(schema, options = {}) {
    const {
        subset = true,
        nullableColumns = false
    } = options;

    return validate;

    function validate(attrs) {
        let columns = null;

        each(schema, (columnChecker, columnName) => {
            if (nullableColumns ? attrs[columnName] != null : attrs.hasOwnProperty(columnName)) {
                try {
                    columnChecker(attrs[columnName], attrs);
                } catch (err) {
                    if (err instanceof ValidationError) {
                        (columns || (columns = {}))[columnName] = err;
                    } else {
                        throw err;
                    }
                }
            } else if (!subset) {
                (columns || (columns = {}))[columnName] = new ValidationError('is missing');
            }
        });

        if (columns != null) {
            throw new ValidationError(reportColumns(columns), {columns});
        }
    }
}

export function reportColumns(columns) {
    return map(columns, (err, columnName) => {
        return `${columnName}: ${err.message}`;
    }).join(', ');
}

export function isString(value, message, type) {
    return assert(typeof value === 'string', message, type);
}

export function isNumber(value, message, type) {
    return assert(typeof value === 'number', message, type);
}

export function isInt(value, message, type) {
    return assert(validator.isInt(value), message, type);
}

export function isAlpha(value, message, type) {
    return assert(validator.isAlpha(value), message, type);
}

export function isAlphanumeric(value, message, type) {
    return assert(validator.isAlphanumeric(value), message, type);
}

export function isBoolean(value, message, type) {
    return assert(validator.isBoolean(value), message, type);
}

export function isEmail(value, message, type) {
    return assert(validator.isEmail(value), message, type);
}

export function isISO8601(value, message, type) {
    return assert(validator.isISO8601(value), message, type);
}

export function isJSON(value, message, type) {
    return assert(validator.isJSON(value), message, type);
}

export function isLength(value, length, message, type) {
    return assert(value.length === length, message, type);
}

export function isMinLength(value, min, message, type) {
    return assert(validator.isLength(value, {min}), message, type);
}

export function isMaxLength(value, max, message, type) {
    return assert(validator.isLength(value, {max}), message, type);
}

export function isUUID(value, message, type) {
    return assert(validator.isUUID(value), message, type);
}

export function isUppercase(value, message, type) {
    return assert(validator.isUppercase(value), message, type);
}

export function isLowercase(value, message, type) {
    return assert(validator.isLowercase(value), message, type);
}

export function matches(value, regex, message, type) {
    return assert(validator.matches(value, regex), message, type);
}
