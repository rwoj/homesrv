import ModbusHandler from "../controllers/ModbusHandler"
import {DBHandler} from '../controllers/DBHandler'

const path=`${process.cwd()}/server`;

const routes=(app, db, io)=>{
  const dbHandler = new DBHandler(db)
  const modHandler =  new ModbusHandler(io)
  modHandler.init()

  app.get("/", (req, res) => {
    res.sendFile(`${path}/index.html`);
  })

  app.get("/api/ustawienia/konfiguracja", dbHandler.getUstawieniaKonfiguracja);
  app.get("/api/ustawienia/konfiguracjaTemp", dbHandler.getUstawieniaKonfiguracjaTemp);

  app.get("/api/rejestr/currentState", modHandler.getCurrentState)

  app.post("/api/rejestr/wy", modHandler.zmienWy)
  app.post("/api/rejestr/temp", modHandler.zmienTemp)
}
export default routes
