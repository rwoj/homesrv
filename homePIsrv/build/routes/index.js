"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ModbusHandler = require("../controllers/ModbusHandler");

var _ModbusHandler2 = _interopRequireDefault(_ModbusHandler);

var _DBHandler = require("../controllers/DBHandler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = process.cwd() + "/server";

var routes = function routes(app, db, io) {
  var dbHandler = new _DBHandler.DBHandler(db);
  var modHandler = new _ModbusHandler2.default(io);
  modHandler.init();

  app.get("/", function (req, res) {
    res.sendFile(path + "/index.html");
  });

  app.get("/api/ustawienia/konfiguracja", dbHandler.getUstawieniaKonfiguracja);
  app.get("/api/ustawienia/konfiguracjaTemp", dbHandler.getUstawieniaKonfiguracjaTemp);

  app.get("/api/rejestr/currentState", modHandler.getCurrentState);

  app.post("/api/rejestr/wy", modHandler.zmienWy);
  app.post("/api/rejestr/temp", modHandler.zmienTemp);
};
exports.default = routes;