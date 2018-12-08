// Dependencies
var _data = require('./../library/file_operation');
var helpers = require('./../library/util');
var tokenHandler = require('./tokens');

var handlers = {};

// Cart
handlers.cart = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for cart
handlers._cart = {};

// Cart - post
// Required data: email, cart
// Optional data: none
handlers._cart.post = function (data, callback) {
    handlers._cart.put(data, callback);
};

// Required data: email
// Optional data: none
handlers._cart.get = function (data, callback) {
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

// Required data: email, menuitem
handlers._cart.put = function (data, callback) {
    // Check for required field
    var email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var menuitem = typeof (data.payload.menuitem) == 'object' && typeof (data.payload.menuitem.id) == "string" && data.payload.menuitem.id.trim().length > 0 ? data.payload.menuitem : false;

    // Error if email is invalid
    if (email && menuitem) {

        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for given email
        tokenHandler._tokens.verifyToken(token, email, function (isValidToken) {
            if (isValidToken) {
                // Lookup the user
                _data.read('users', email, function (err, userData) {
                    if (!err && userData) {
                        // Update the fields if necessary
                        if (userData.cart) {
                            var found = false;
                            for (var i = 0; i < userData.cart.length; i++) {
                                if (userData.cart[i].id == menuitem.id) {
                                    found = userData.cart[i];
                                    break;
                                }
                            }
                            if (found) {
                                found.quantity += menuitem.quantity;
                            } else {
                                userData.cart.push(menuitem);
                            }
                        } else {
                            userData.cart = [menuitem];
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
            'Error': 'Missing required field.'
        });
    }
};

// Required data: email, menuitem
handlers._cart.delete = function (data, callback) {
    // Check for required field
    var email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var menuitem = typeof (data.payload.menuitem) == 'object' && typeof (data.payload.menuitem.id) == "string" && data.payload.menuitem.id.trim().length > 0 ? data.payload.menuitem : false;

    // Error if email is invalid
    if (email && menuitem) {

        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for given email
        tokenHandler._tokens.verifyToken(token, email, function (isValidToken) {
            if (isValidToken) {
                // Lookup the user
                _data.read('users', email, function (err, userData) {
                    if (!err && userData) {
                        // Update the fields if necessary
                        if (userData.cart) {
                            var found = false;
                            for (var i = 0; i < userData.cart.length; i++) {
                                if (userData.cart[i].id == menuitem.id) {
                                    found = true;
                                    userData.cart[i].quantity -= menuitem.quantity;

                                    // remove from cart if quantity goes 0 or less
                                    if (userData.cart[i].quantity < 1) {
                                        userData.cart.splice(i, 1);
                                    }
                                    break;
                                }
                            }
                            if (found) {
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
                                callback(404, {
                                    'Error': 'Menu item not present in cart'
                                });
                            }
                        } else {
                            callback(404, {
                                'Error': 'Shopping cart is empty, nothing to remove'
                            });
                        }

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
            'Error': 'Missing required field.'
        });
    }
};

module.exports = handlers;