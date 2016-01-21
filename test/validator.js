import {ValidationError} from '../src/errors';
import expect from 'expect';
import * as nagoya from '../src/validator';

const schema = {
    username(username) {
        nagoya.isString(username, 'not a string', TypeError);
        nagoya.isAlphanumeric(username, 'must contain only letters and numbers');
        // alternatively nagoya.matches(username, /^\w*$/)
        nagoya.isMinLength(username, 3, 'must be at least 3 characters long');
        nagoya.isMaxLength(username, 30, 'cannot be more than 30 characters long');
    },

    password(password) {
        nagoya.isString(password, 'not a string', TypeError);
        nagoya.isMinLength(password, 8, 'must be at least 8 characters long');
        nagoya.isMaxLength(password, 30, 'cannot be more than 30 characters long');
    },

    email(emailAddress) {
        nagoya.isEmail(emailAddress, 'must be a valid email address');
    }
};

describe('schema', () => {
    it('should work with default stuffs', () => {
        const validate = nagoya.schema(schema);

        expect(testValidator).toThrow(ValidationError, [
            'username must contain only letters and numbers',
            'password must be at least 8 characters long',
            'email must be a valid email address'
        ].join(', '));

        function testValidator() {
            validate({
                username: '*asdf^',
                password: 'foo321',
                email: 'bob@@foo.com'
            });
        }
    });

    it('should work with nullable columns', () => {
        const validate = nagoya.schema(schema, {nullableColumns: true});

        expect(testValidator).toNotThrow();

        function testValidator() {
            validate({
                username: null,
                password: null,
                email: null
            });
        }
    });
});
