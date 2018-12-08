// Dependencies
var _data = require('./../library/file_operation');
var helpers = require('./../library/util');
var tokenHandler = require('./tokens');

var handlers = {};

// Users
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for users
handlers._users = {};

// Users - post
// Required data: fullName, email, address, password
// Optional data: none
handlers._users.post = function (data, callback) {
    // Check that all required fields are filled out
    var fullName = typeof (data.payload.fullName) == 'string' && data.payload.fullName.trim().length > 0 ? data.payload.fullName.trim() : false;
    var email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var address = typeof (data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (fullName && email && address && password) {
        // Make sure the user doesn't already exist
        _data.read('users', email, function (err, data) {
            if (err) {
                // Hash the password
                var hashedPassword = helpers.hash(password);

                // Create the user object
                if (hashedPassword) {
                    var userObject = {
                        'fullName': fullName,
                        'email': email,
                        'address': address,
                        'hashedPassword': hashedPassword
                    };

                    // Store the user
                    _data.create('users', email, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {
                                'Error': 'Could not create the new user'
                            });
                        }
                    });
                } else {
                    callback(500, {
                        'Error': 'Could not hash the user\'s password.'
                    });
                }

            } else {
                // User alread exists
                callback(400, {
                    'Error': 'A user with that email already exists'
                });
            }
        });

    } else {
        callback(400, {
            'Error': 'Missing required fields'
        });
    }

};

// Required data: email
// Optional data: none
handlers._users.get = function (data, callback) {
    // Check that email is valid
    var email = typeof (data.queryParams.email) == 'string' && data.queryParams.email.trim().length > 0 ? data.queryParams.email.trim() : false;
    if (email) {
        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for given email
        tokenHandler._tokens.verifyToken(token, email, function (isValidToken) {
            if (isValidToken) {
                // Lookup the user
                _data.read('users', email, function (err, data) {
                    if (!err && data) {
                        // Remove the hashed password
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, {
                    "Error": "Missing required token in header, or token is invalid."
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
};

// Required data: email
// Optional data: fullName, address, password (at least one must be specified)
handlers._users.put = function (data, callback) {
    // Check for required field
    var email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;

    // Check for optional fields
    var fullName = typeof (data.payload.fullName) == 'string' && data.payload.fullName.trim().length > 0 ? data.payload.fullName.trim() : false;
    var address = typeof (data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if email is invalid
    if (email) {
        // Error if nothing is sent to update
        if (fullName || address || password) {

            // Get token from headers
            var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
            // Verify that the given token is valid for given email
            tokenHandler._tokens.verifyToken(token, email, function (isValidToken) {
                if (isValidToken) {
                    // Lookup the user
                    _data.read('users', email, function (err, userData) {
                        if (!err && userData) {
                            // Update the fields if necessary
                            if (fullName) {
                                userData.fullName = fullName;
                            }
                            if (address) {
                                userData.address = address;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            // Store the new updates
                            _data.update('users', email, userData, function (err) {
                                if (!err) {
                                    callback(200);
                                } else {
                                    console.log(err);
                                    callback(500, {
                                        'Error': 'Could not update the user.'
                                    });
                                }
                            });
                        } else {
                            callback(400, {
                                'Error': 'Specified user does not exist.'
                            });
                        }
                    });
                } else {
                    callback(403, {
                        "Error": "Missing required token in header, or token is invalid."
                    });
                }
            });
        } else {
            callback(400, {
                'Error': 'Missing fields to update.'
            });
        }
    } else {
        callback(400, {
            'Error': 'Missing required field.'
        });
    }
};

// Required data: email
handlers._users.delete = function (data, callback) {
    // Check that email is valid
    var email = typeof (data.queryParams.email) == 'string' && data.queryParams.email.trim().length > 0 ? data.queryParams.email.trim() : false;
    if (email) {
        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for given email
        tokenHandler._tokens.verifyToken(token, email, function (isValidToken) {
            if (isValidToken) {
                // Lookup the user
                _data.read('users', email, function (err, data) {
                    if (!err && data) {
                        _data.delete('users', email, function (err) {
                            if (!err) {
                                callback(200);
                            } else {
                                callback(500, {
                                    'Error': 'Could not delete the specified user'
                                });
                            }
                        });
                    } else {
                        callback(400, {
                            'Error': 'Could not find the specified user.'
                        });
                    }
                });
            } else {
                callback(403, {
                    "Error": "Missing required token in header, or token is invalid."
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }
};



module.exports = handlers;