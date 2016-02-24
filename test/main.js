import {ValidationError, ValidationResultError} from '../src/errors';
import expect from 'expect';
import {assert, nullable} from '../src/helpers';
import {isAlphanumeric, isLength, isEmail} from 'validator';

function schema(user) {
    const {username, password, email} = user;

    const usernameIsValid = usernameSchema(username).column('username');
    const passwordIsValid = passwordSchema(password).column('password');
    const emailIsValid = emailSchema(email).column('email');

    return usernameIsValid.concat(passwordIsValid).concat(emailIsValid);
}

function usernameSchema(username) {
    const notNull = nullable('username', username, 'username is required');

    const alphanumeric = assert(() =>
        isAlphanumeric(username),
        'username must contain only letters and numbers');

    const longEnough = assert(() =>
         isLength(username, 3),
         'username must have at least 3 characters');

    const shortEnough = assert(() =>
         isLength(username, 0, 30),
         'username cannot be more than 30 characters long');

    return notNull.and(alphanumeric.concat(longEnough).concat(shortEnough));
}

function passwordSchema(password) {
    const notNull = nullable('password', password, 'password is required');

    const longEnough = assert(() =>
        isLength(password, 8),
        'password must have at least 8 characters');

    const shortEnough = assert(() =>
        isLength(password, 0, 30),
        'password cannot be more than 30 characters long');

    return notNull.and(longEnough.concat(shortEnough));
}

function emailSchema(emailAddress) {
    const notNull = nullable('email', emailAddress, 'email is required');

    const isValid = assert(() =>
        isEmail(emailAddress),
        'email address is invalid');

    return notNull.and(isValid);
}

describe('assert', () => {
    it('should work with default stuffs', () => {
        const result = schema({
            username: '*asdf^',
            password: 'foo321',
            email: 'bob@@foo.com'
        }).run();

        expect(result.length).toBe(3);

        expect(result[0].message).toBe('username must contain only letters and numbers');
        expect(result[0].columns).toEqual(['username']);

        expect(result[1].message).toBe('password must have at least 8 characters');
        expect(result[1].columns).toEqual(['password']);

        expect(result[2].message).toBe('email address is invalid');
        expect(result[2].columns).toEqual(['email']);
    });
});

describe('nullable', () => {
    it('should work with partial columns', () => {
        const result = schema({
            username: null
        }).run({nullableColumns: ['username', 'password']});

        expect(result.length).toBe(1);
        expect(result[0].message).toBe('email is required');
        expect(result[0].columns).toEqual(['email']);
    });

    it('should work with all columns', () => {
        const result = schema({}).run({nullableColumns: true});

        expect(result.length).toBe(0);
    });
});

describe('validate', () => {
    it('should work', () => {
        expect(() => schema({}).validate())
            .toThrow(ValidationResultError);

        expect(() => schema({}).validate({nullableColumns: true}))
            .toNotThrow();
    });
});
