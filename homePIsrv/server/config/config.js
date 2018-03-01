import dotenv from "dotenv"
dotenv.config()

export default {
  modbus: {
        host              : process.env.MODBUS_SERVER,
        port              : process.env.MODBUS_PORT,
        autoReconnect     : true,
        reconnectTimeout  : 1000,
        timeout           : 5000,
        unitId            : 0
  },
}
