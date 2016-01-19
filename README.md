nagoya [![Build Status](http://img.shields.io/travis/goodybag/nagoya.svg?style=flat)](https://travis-ci.org/goodybag/nagoya) [![NPM Version](http://img.shields.io/npm/v/nagoya.svg?style=flat)](https://npmjs.org/package/nagoya) [![License](http://img.shields.io/npm/l/nagoya.svg?style=flat)](https://github.com/goodybag/nagoya/blob/master/LICENSE)
=========

Nagoya is a validation library for writing cool and arbitrary validation
schemas and producing user-friendly validation error messages.

Usage
-----

```js
import * as nagoya from 'nagoya';

const schema = {
    username(username) {
        nagoya.isString(username, 'not a string', TypeError);
        nagoya.isAlphanumeric(username, 'must contain only letters and numbers');
        // alternatively nagoya.matches(username, /^\w*$/)
        nagoya.isMinLength(username, 3, 'must be at least 3 characters long');
        nagoya.isMaxLength(username, 30, 'cannot be more than 30 characters long');
    },

    password(password) {
        nagoya.isString(username, 'not a string', TypeError);
        nagoya.isMinLength(username, 8, 'must be at least 8 characters long');
        nagoya.isMaxLength(username, 30, 'cannot be more than 30 characters long');
    },

    email(emailAddress) {
        nagoya.isEmail(emailAddress, 'must be a valid email address');
    }
};

const validate = nagoya.schema(schema);

try {
    validate({
        username: '*asdf^',
        password: 'foo321',
        email: 'bob@@foo.com'
    });
} catch (err) {
    console.log(err.message);
    console.log(err.columns);
}

// ValidationError: username must contain only letters and numbers,
//                  password must be at least 8 characters long,
//                  email must be a valid email address

// {
//     username: [ValidationError: must contain only letters and numbers],
//     password: [ValidationError: must be at least 8 characters long],
//     email: [ValidationError: must be a valid email address]
// }
```

Documentation
-------------

TODO
