var http = require("http");
var url = require("url");
var strDecoder = require("string_decoder").StringDecoder;
var userHandler = require("./collections/users");
var tokenHandler = require("./collections/tokens");
var menuHandler = require("./collections/menu");
var cartHandler = require("./collections/cart");

var config = require("./config");

var server = http.createServer(function (req, res) {

    var pathObject = url.parse(req.url, true);
    var urlPath = pathObject.pathname;
    var trimmedPath = urlPath.replace(/^\/+|\/+$/g, '');

    var buffer = "";
    var bufferJSON = {};

    var decoder = new strDecoder("utf-8");

    req.on("data", function (data) {
        buffer += decoder.write(data);
    });

    //send respose back
    req.on("end", function () {
        buffer += decoder.end();

        if (buffer) {
            bufferJSON = JSON.parse(buffer);
        }

        var selectedRoute = router[trimmedPath] ? router[trimmedPath] : handlers.notFoundHandler;

        var data = {
            path: trimmedPath,
            queryParams: pathObject.query,
            method: req.method.toLowerCase(),
            headers: req.headers,
            payload: bufferJSON
        };
        console.log(data.method + " " + req.url);
        console.log("Request:" + JSON.stringify(data) + "\n");

        selectedRoute(data, function (statusCode, payload) {
            res.setHeader("content-type", "application/json");
            res.writeHead(statusCode);
            res.end(JSON.stringify(payload));
        });

    });

});

server.listen(config.httpPort, function () {
    console.log("server started on port: " + config.httpPort);
});


var handlers = {};
handlers.helloHandler = function (data, callback) {
    callback(200, {
        "message": "Hello world"
    });
};

handlers.notFoundHandler = function (data, callback) {
    callback(404, {
        "message": "Not Found"
    });
};

var router = {
    "hello": handlers.helloHandler,
    "users": userHandler.users,
    "tokens": tokenHandler.tokens,
    "menu": menuHandler.menu,
    "cart": cartHandler.cart
};