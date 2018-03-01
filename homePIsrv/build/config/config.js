"use strict";

Object.defineProperty(exports, "__esModule", {
      value: true
});

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

exports.default = {
      modbus: {
            host: process.env.MODBUS_SERVER,
            port: process.env.MODBUS_PORT,
            autoReconnect: true,
            reconnectTimeout: 1000,
            timeout: 5000,
            unitId: 0
      }
};