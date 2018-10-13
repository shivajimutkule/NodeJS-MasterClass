var http = require("http");
var url = require("url");
var strDecoder = require("string_decoder").StringDecoder;

var server = http.createServer(function (req, res) {

    var pathObject = url.parse(req.url, true);
    var urlPath = pathObject.pathname;
    var trimmedPath = urlPath.replace(/^\/+|\/+$/g, '');

    var buffer = "";
    var decoder = new strDecoder("utf-8");

    req.on("data", function (data) {
        buffer += decoder.write(data);
    });

    //send respose back
    req.on("end", function () {
        buffer += decoder.end();

        var selectedRoute = router[trimmedPath] ? router[trimmedPath] : handlers.notFoundHandler;

        var data = {
            path: trimmedPath,
            queryParams: urlPath.query,
            method: req.method,
            headers: req.headers,
            payload: buffer
        };
        console.log(data.method + " " + req.url);
        console.log("Request body:" + data.payload + "\n");

        selectedRoute(data, function (statusCode, payload) {
            res.setHeader("content-type", "application/json");
            res.writeHead(statusCode);
            res.end(JSON.stringify(payload));
        });

    });

});

server.listen(3000, function () {
    console.log("server started on port: " + 3000);
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
    "hello": handlers.helloHandler
};