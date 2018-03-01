'use strict';

var _sqlite = require('sqlite3');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _konfiguracja = require('./konfiguracja');

var _konfiguracja2 = _interopRequireDefault(_konfiguracja);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sqlite = _sqlite2.default.verbose();
var db = new sqlite.Database(':memory:');

// r.tableCreate('konfig').run()
// {id: 1, rodzaj: 'swiatlo', idWy : 16911, idWySter : 16511, nazwa : 'Jadalnia kinkiet', idLokalu : 1, nazwaLokalu : 'Salon', poziom : 'parter'},
// r.tableCreate('konfigTemp').run()
// {id: 1, rodzaj: 'ogrzewanie', idTempWy : 0, idTempNast : 0, idGrzanie : 16943, idGrzanieSter : 16543, nazwa : 'Salon kanałowy', idLokalu : 1, nazwaLokalu : 'Salon', poziom : 'calyDom'}
db.serialize(function () {
  db.run("CREATE TABLE konfig (id INT(3), rodzaj VARCHAR(25), idWy INT(5), idWySter INT(5), nazwa VARCHAR(50), idLokalu INT(5), nazwaLokalu VARCHAR(50), poziom VARCHAR(25))");
  db.run("CREATE TABLE konfigTemp (id INT(3), rodzaj VARCHAR(25), idTempWy INT(5), idTempNast INT(5), idGrzanie INT(5), idGrzanieSter INT(5), nazwa VARCHAR(50), idLokalu INT(3), nazwaLokalu VARCHAR(25), poziom VARCHAR(25))");

  var stmt1 = db.prepare("INSERT INTO konfig (id, rodzaj, idWy, idWySter, nazwa, idLokalu, nazwaLokalu, poziom) VALUES ($id, $rodzaj, $idWy, $idWySter, $nazwa, $idLokalu, $nazwaLokalu, $poziom)");
  _konfiguracja2.default.konfig.forEach(function (x) {
    stmt1.run(x.id, x.rodzaj, x.idWy, x.idWySter, x.nazwa, x.idLokalu, x.nazwaLokalu, x.poziom);
  });
  stmt1.finalize();

  var stmt2 = db.prepare("INSERT INTO konfigTemp (id, rodzaj, idTempWy, idTempNast, idGrzanie, idGrzanieSter, nazwa, idLokalu, nazwaLokalu, poziom) VALUES ($id, $rodzaj, $idTempWy, $idTempNast, $idGrzanie, $idGrzanieSter, $nazwa, $idLokalu, $nazwaLokalu, $poziom)");
  _konfiguracja2.default.konfigTemp.forEach(function (x) {
    stmt2.run(x.id, x.rodzaj, x.idTempWy, x.idTempNast, x.idGrzanie, x.idGrzanieSter, x.nazwa, x.idLokalu, x.nazwaLokalu, x.poziom);
  });
  stmt2.finalize();
});

db.close();