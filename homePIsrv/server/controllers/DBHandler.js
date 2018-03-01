import konfiguracja from '../seed/konfiguracja'

export const dbinit = (db) => {
    db.serialize(() => {
        db.run("CREATE TABLE konfig (id INT(3), rodzaj VARCHAR(25), idWy INT(5), idWySter INT(5), nazwa VARCHAR(50), idLokalu INT(5), nazwaLokalu VARCHAR(50), poziom VARCHAR(25))");
        db.run("CREATE TABLE konfigTemp (id INT(3), rodzaj VARCHAR(25), idTempWy INT(5), idTempNast INT(5), idGrzanie INT(5), idGrzanieSter INT(5), nazwa VARCHAR(50), idLokalu INT(3), nazwaLokalu VARCHAR(25), poziom VARCHAR(25))");
    
        const stmt1 = db.prepare("INSERT INTO konfig (id, rodzaj, idWy, idWySter, nazwa, idLokalu, nazwaLokalu, poziom) VALUES ($id, $rodzaj, $idWy, $idWySter, $nazwa, $idLokalu, $nazwaLokalu, $poziom)");
        konfiguracja.konfig.forEach((x)=>{
        stmt1.run(x.id, x.rodzaj, x.idWy, x.idWySter, x.nazwa, x.idLokalu, x.nazwaLokalu, x.poziom);
        })
        stmt1.finalize()
    
        const stmt2 = db.prepare("INSERT INTO konfigTemp (id, rodzaj, idTempWy, idTempNast, idGrzanie, idGrzanieSter, nazwa, idLokalu, nazwaLokalu, poziom) VALUES ($id, $rodzaj, $idTempWy, $idTempNast, $idGrzanie, $idGrzanieSter, $nazwa, $idLokalu, $nazwaLokalu, $poziom)");
        konfiguracja.konfigTemp.forEach((x)=>{
        stmt2.run(x.id, x.rodzaj, x.idTempWy, x.idTempNast, x.idGrzanie, x.idGrzanieSter, x.nazwa, x.idLokalu, x.nazwaLokalu, x.poziom);
        })
        stmt2.finalize()      
    });  
}
    
export function DBHandler(db) {
    this.getUstawieniaKonfiguracja=(req, res)=>{
        db.serialize(()=>{
            db.all("SELECT * FROM konfig ORDER BY id", (err, row)=>
                res.json({ustawienia: {konfig: row}})
            );  
        })
    }
    this.getUstawieniaKonfiguracjaTemp=(req, res)=>{
        db.serialize(()=>{
            db.all("SELECT * FROM konfigTemp ORDER BY id", (err, row)=>
                res.json({ustawienia: {konfigTemp: row}})
            );  
        })
    }
}


