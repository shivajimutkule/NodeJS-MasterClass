// Dependencies
var _data = require('./../library/file_operation');
var helpers = require('./../library/util');
var tokenHandler = require('./tokens');

// menu card handler
var handlers = {};

handlers.menu = function (data, callback) {
    var acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._menu[data.method](data, callback);
    } else {
        callback(405);
    }
};

// container for menu
handlers._menu = {};

// Required: email
// Optional: id 
handlers._menu.get = function (data, callback) {
    // Check that email is valid
    var email = typeof (data.queryParams.email) == 'string' && data.queryParams.email.trim().length > 0 ? data.queryParams.email.trim() : false;
    if (email) {
        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for given email
        tokenHandler._tokens.verifyToken(token, email, function (isValidToken) {
            if (isValidToken) {
                // Lookup menucard
                _data.read('menu', "menucard", function (err, data) {
                    if (!err && data) {
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

// Internal purpose not exposed to API
handlers._menu.getSingleItem = function (id, callback) {
    id = typeof (id) == "string" && id.trim().length > 0 ? id.trim() : false;
    var found = false;

    if (id) {
        // Lookup menucard
        _data.read('menu', "menucard", function (err, data) {
            if (!err && data) {
                data = JSON.parse(data);

                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == id) {
                        found = data[i];
                        break;
                    }
                }
                if (found) {
                    callback(200, found);
                } else {
                    callback(404);
                }

            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required field'
        });
    }

};

module.exports = handlers;