// require("babel-core/register");
// require("babel-polyfill");
import express from "express"
import sqlite3 from 'sqlite3'

import http from 'http'
import socketIO from 'socket.io'
import bodyParser from "body-parser"

import {dbinit} from './controllers/DBHandler'
import routes from "./routes"


const app = express();
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const sqlite = sqlite3.verbose()
const db = new sqlite.Database(':memory:');
dbinit(db);

const server = http.createServer(app)
const io=socketIO(server)

routes(app, db, io);
io.on("connection", socket =>{
    console.log("IO new client connected")    
    socket.on("disconnect", ()=>console.log("IO client disconnected"))
})

const port = process.env.PORT || 8081
server.listen(port, () => console.log(`Running on localhost: ${port}`));
// db.close();