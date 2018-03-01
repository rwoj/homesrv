"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dbinit = undefined;
exports.DBHandler = DBHandler;

var _konfiguracja = require("../seed/konfiguracja");

var _konfiguracja2 = _interopRequireDefault(_konfiguracja);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbinit = exports.dbinit = function dbinit(db) {
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
};

function DBHandler(db) {
    this.getUstawieniaKonfiguracja = function (req, res) {
        db.serialize(function () {
            db.all("SELECT * FROM konfig ORDER BY id", function (err, row) {
                return res.json({ ustawienia: { konfig: row } });
            });
        });
    };
    this.getUstawieniaKonfiguracjaTemp = function (req, res) {
        db.serialize(function () {
            db.all("SELECT * FROM konfigTemp ORDER BY id", function (err, row) {
                return res.json({ ustawienia: { konfigTemp: row } });
            });
        });
    };
}