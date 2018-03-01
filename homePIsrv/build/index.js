'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _sqlite = require('sqlite3');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _DBHandler = require('./controllers/DBHandler');

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(); // require("babel-core/register");
// require("babel-polyfill");

app.use(_bodyParser2.default.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

var sqlite = _sqlite2.default.verbose();
var db = new sqlite.Database(':memory:');
(0, _DBHandler.dbinit)(db);

var server = _http2.default.createServer(app);
var io = (0, _socket2.default)(server);

(0, _routes2.default)(app, db, io);
io.on("connection", function (socket) {
    console.log("IO new client connected");
    socket.on("disconnect", function () {
        return console.log("IO client disconnected");
    });
});

var port = process.env.PORT || 8081;
server.listen(port, function () {
    return console.log('Running on localhost: ' + port);
});
// db.close();