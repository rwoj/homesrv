"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var sprawdzZmianyAndUpdate = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(rejestr, socket) {
    var resp, i;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return client.readHoldingRegisters(rejestr.adres, rejestr.howMany);

          case 2:
            resp = _context.sent;

            for (i = 0; i < resp.register.length; i += 1) {
              if (rejestr.rej_last[i] !== resp.register[i]) {
                socket.emit('zmiana', _defineProperty({
                  tabela: rejestr.table
                }, rejestr.table, _defineProperty({}, i, { id: rejestr.adres + i, value: resp.register[i] })));
                console.log("zmiana " + (rejestr.adres + i) + ": " + resp.register[i]);
              }
            }
            return _context.abrupt("return", resp.register);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function sprawdzZmianyAndUpdate(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var sprawdzZmianyAndUpdateTemp = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(rejestr) {
    var resp;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return client.readHoldingRegisters(rejestr.adres, rejestr.howMany * 2);

          case 2:
            resp = _context2.sent;
            return _context2.abrupt("return", resp.payload);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function sprawdzZmianyAndUpdateTemp(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _jsmodbus = require("jsmodbus");

var _jsmodbus2 = _interopRequireDefault(_jsmodbus);

var _config = require("../config/config");

var _config2 = _interopRequireDefault(_config);

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var client = _jsmodbus2.default.client.tcp.complete(_config2.default.modbus).connect();

function updateTemp(temperatures, rejestr, socket) {
  var j = 0;
  for (var i = 0; i < temperatures.length; i += 1) {
    if (temperatures[i] !== rejestr.rej_last1[i] && temperatures[i] !== rejestr.rej_last2[i] && temperatures[i] !== rejestr.rej_last3[i]) {
      socket.emit('zmiana', _defineProperty({
        tabela: rejestr.table
      }, rejestr.table, _defineProperty({}, i, { id: rejestr.adres + j, value: temperatures[i] })));
      // console.log(`zmiana ${rejestr.adres+j}: ${temperatures[i]} : ${rejestr.rej_last1[i]} : ${rejestr.rej_last2[i]} : ${rejestr.rej_last3[i]}`)
    }
    j += 2;
  }
}
function updateTempNast(temperatures, rejestr, socket) {
  var j = 0;
  for (var i = 0; i < temperatures.length; i += 1) {
    if (temperatures[i] !== rejestr.rej_last1[i]) {
      socket.emit('zmiana', _defineProperty({
        tabela: rejestr.table
      }, rejestr.table, _defineProperty({}, i, { id: rejestr.adres + j, value: temperatures[i] })));
      console.log("zmiana tempNast " + (rejestr.adres + j) + ": " + temperatures[i] + " : " + rejestr.rej_last1[i]);
    }
    j += 2;
  }
}

function registersTempParser(response) {
  var result = [];
  for (var i = 0; i < response.length; i += 4) {
    result.push((0, _helpers.readIEEE754LEW)(response, i, 23, 4).toFixed(1));
    // console.log(ieee754.read(response, i, true, 23, 4))
  }
  return result;
}

function ModbusHandler(socket) {
  var _this = this;

  this.wyjscia = {
    table: 'wyjscia',
    adres: 16901,
    howMany: 100,
    rej_first: [],
    rej_last: new Array(100).fill(0)
  };
  this.wySatel = {
    table: 'wySatel',
    adres: 17100,
    howMany: 40,
    rej_first: [],
    rej_last: new Array(40).fill(0)
  };
  this.wyTemp = {
    table: 'wyTemp',
    adres: 17197,
    howMany: 16,
    rej_first: [],
    rej_last1: new Array(16).fill(0),
    rej_last2: new Array(16).fill(0),
    rej_last3: new Array(16).fill(0)
  };
  this.tempNast = {
    table: 'wyTempNast',
    adres: 16389,
    howMany: 10,
    rej_first: [],
    rej_last1: new Array(10).fill(0)
  };

  this.init = function () {
    _this.getInitRegisters();
    // client.on('error', (err)=>console.error(err))
    // client.on('connect', ()=>setInterval(this.modbusPooling, 1000))
  };

  this.modbusPooling = function () {
    sprawdzZmianyAndUpdate(_this.wyjscia, socket).then(function (res) {
      _this.wyjscia.rej_last = [].concat(_toConsumableArray(res));
    });
    sprawdzZmianyAndUpdate(_this.wySatel, socket).then(function (res) {
      _this.wySatel.rej_last = [].concat(_toConsumableArray(res));
    });
    sprawdzZmianyAndUpdateTemp(_this.tempNast).then(function (res) {
      return registersTempParser(res);
    }).then(function (temperatures) {
      updateTempNast(temperatures, _this.tempNast, socket);
      _this.tempNast.rej_last1 = [].concat(_toConsumableArray(temperatures));
    });
    sprawdzZmianyAndUpdateTemp(_this.wyTemp).then(function (res) {
      return registersTempParser(res);
    }).then(function (temperatures) {
      updateTemp(temperatures, _this.wyTemp, socket);
      _this.wyTemp.rej_last1 = [].concat(_toConsumableArray(temperatures));
      _this.wyTemp.rej_last2 = [].concat(_toConsumableArray(_this.wyTemp.rej_last1));
      _this.wyTemp.rej_last3 = [].concat(_toConsumableArray(_this.wyTemp.rej_last2));
    });
  };
  // ustawienia 
  this.getInitRegisters = function () {
    for (var i = 0; i < _this.wyjscia.howMany; i += 1) {
      _this.wyjscia.rej_first.push({ id: _this.wyjscia.adres + i, value: 0 });
    }
    socket.emit('init', _defineProperty({}, _this.wyjscia.table, _this.wyjscia.rej_first));

    for (var _i = 0; _i < _this.wySatel.howMany; _i += 1) {
      _this.wySatel.rej_first.push({ id: _this.wySatel.adres + _i, value: 0 });
    }
    socket.emit('init', _defineProperty({}, _this.wySatel.table, _this.wySatel.rej_first));
    var j = 0;
    for (var _i2 = 0; _i2 < _this.wyTemp.howMany; _i2 += 1) {
      _this.wyTemp.rej_first.push({ id: _this.wyTemp.adres + j, value: 0 });
      j += 2;
    }
    socket.emit('init', _defineProperty({}, _this.wyTemp.table, _this.wyTemp.rej_first));
    j = 0;
    for (var _i3 = 0; _i3 < _this.tempNast.howMany; _i3 += 1) {
      _this.tempNast.rej_first.push({ id: _this.tempNast.adres + j, value: 0 });
      j += 2;
    }
    socket.emit('init', _defineProperty({}, _this.tempNast.table, _this.tempNast.rej_first));
  };

  // zapisy
  this.zmienWy = function (req, res) {
    var _req$body = req.body,
        adres = _req$body.adres,
        value = _req$body.value;

    console.log(adres, value);
    client.writeSingleRegister(adres, value).then(function (response) {
      return res.json({ response: response });
    }).catch(function (err) {
      return console.log(err);
    });
  };
  this.zmienTemp = function (req, res) {
    var _req$body2 = req.body,
        adres = _req$body2.adres,
        value = _req$body2.value;

    console.log(adres, value);
    var buf = Buffer.alloc(4);
    (0, _helpers.writeIEEE754LEW)(buf, value, 0, 23, 4);
    client.writeMultipleRegisters(adres, buf).then(function (response) {
      console.log(response);
      res.json({ response: response });
    }).catch(function (err) {
      return console.log(err);
    });
  };
}

exports.default = ModbusHandler;