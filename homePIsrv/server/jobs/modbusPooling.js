
import modbus from "jsmodbus"

import config from "../config/config"
import {readIEEE754LEW, writeIEEE754LEW} from './helpers'

const client = modbus.client.tcp.complete(config.modbus).connect()



async function sprawdzZmianyAndUpdate(rejestr, socket){
  const resp=await client.readHoldingRegisters(rejestr.adres, rejestr.howMany)
  for(let i = 0; i< resp.register.length; i+=1){
    if (rejestr.rej_last[i]!==resp.register[i]) {
      socket.emit('zmiana', 
      {
        tabela: rejestr.table, 
        [rejestr.table]: 
          {
            [i]: {id: rejestr.adres+i, value: resp.register[i]}
          }
      })
      console.log(`zmiana ${rejestr.adres+i}: ${resp.register[i]}`)
    }
  }
  return resp.register
}

async function sprawdzZmianyAndUpdateTemp(rejestr){
  const resp=await client.readHoldingRegisters(rejestr.adres, rejestr.howMany*2)
  return resp.payload
}

function updateTemp(temperatures, rejestr, socket){
  let j=0
  for(let i = 0; i< temperatures.length; i+=1){
    if (temperatures[i]!==rejestr.rej_last1[i] 
      && temperatures[i]!==rejestr.rej_last2[i]
      && temperatures[i]!==rejestr.rej_last3[i]) {
        socket.emit('zmiana', 
        {
          tabela: rejestr.table, 
          [rejestr.table]: 
            {
              [i]: {id: rejestr.adres+j, value: temperatures[i]}
            }
        })
       // console.log(`zmiana ${rejestr.adres+j}: ${temperatures[i]} : ${rejestr.rej_last1[i]} : ${rejestr.rej_last2[i]} : ${rejestr.rej_last3[i]}`)
      } 
      j+=2
  }
}
function updateTempNast(temperatures, rejestr, socket){
  let j=0
  for(let i = 0; i< temperatures.length; i+=1){
    if (temperatures[i]!==rejestr.rej_last1[i]) {
      socket.emit('zmiana', 
      {
        tabela: rejestr.table, 
        [rejestr.table]: 
          {
            [i]: {id: rejestr.adres+j, value: temperatures[i]}
          }
      })
        console.log(`zmiana tempNast ${rejestr.adres+j}: ${temperatures[i]} : ${rejestr.rej_last1[i]}`)
      } 
      j+=2
  }

}

function registersTempParser(response) {
  const result = [];   
  for (let i = 0; i < response.length; i+=4) {
    result.push(readIEEE754LEW(response, i, 23, 4).toFixed(1));
    // console.log(ieee754.read(response, i, true, 23, 4))
  }
  return result;
}


function ModbusHandler(socket) {
  this.wyjscia={
    table: 'wyjscia',
    adres: 16901,
    howMany: 100,
    rej_first:[],
    rej_last: new Array(100).fill(0)
  }
  this.wySatel={
    table: 'wySatel',
    adres: 17100,
    howMany: 40,
    rej_first:[],
    rej_last: new Array(40).fill(0)
  }
  this.wyTemp={
    table: 'wyTemp',
    adres: 17197,
    howMany: 16,
    rej_first:[],
    rej_last1: new Array(16).fill(0), 
    rej_last2: new Array(16).fill(0),
    rej_last3: new Array(16).fill(0)
  }
  this.tempNast={
    table: 'wyTempNast',
    adres: 16389,
    howMany: 10,
    rej_first:[],
    rej_last1: new Array(10).fill(0),
  }

  this.init = ()=>{
    this.getInitRegisters();
    // client.on('error', (err)=>console.error(err))
    // client.on('connect', ()=>setInterval(this.modbusPooling, 1000))
  }

  this.modbusPooling=()=>{
    sprawdzZmianyAndUpdate(this.wyjscia, socket)
      .then(res => {
        this.wyjscia.rej_last=[...res]
      })
    sprawdzZmianyAndUpdate(this.wySatel, socket)
      .then(res => {
        this.wySatel.rej_last=[...res]
      })
    sprawdzZmianyAndUpdateTemp(this.tempNast)
    .then(res => registersTempParser(res))
    .then(temperatures => {
      updateTempNast(temperatures, this.tempNast, socket)
      this.tempNast.rej_last1=[...temperatures]
    })
    sprawdzZmianyAndUpdateTemp(this.wyTemp)
      .then(res => registersTempParser(res))
      .then(temperatures => {
        updateTemp(temperatures, this.wyTemp, socket)
        this.wyTemp.rej_last1=[...temperatures]
        this.wyTemp.rej_last2=[...this.wyTemp.rej_last1]
        this.wyTemp.rej_last3=[...this.wyTemp.rej_last2]
      })
  }
  // ustawienia 
  this.getInitRegisters=()=>{
    for (let i=0; i<this.wyjscia.howMany; i+=1){
      this.wyjscia.rej_first.push({id: this.wyjscia.adres+i, value: 0})
    }
    socket.emit('init', {[this.wyjscia.table]: this.wyjscia.rej_first})

    for (let i=0; i<this.wySatel.howMany; i+=1){
      this.wySatel.rej_first.push({id: this.wySatel.adres+i, value: 0})
    }
    socket.emit('init', {[this.wySatel.table]: this.wySatel.rej_first})
    let j=0
    for (let i=0; i<this.wyTemp.howMany; i+=1){
      this.wyTemp.rej_first.push({id: this.wyTemp.adres+j, value: 0})
      j+=2
    }
    socket.emit('init', {[this.wyTemp.table]: this.wyTemp.rej_first})
    j=0
    for (let i=0; i<this.tempNast.howMany; i+=1){
      this.tempNast.rej_first.push({id: this.tempNast.adres+j, value: 0})
      j+=2
    }
    socket.emit('init', {[this.tempNast.table]: this.tempNast.rej_first})
  }

  // zapisy
  this.zmienWy = (req, res)=>{
    const {adres, value} = req.body
    console.log(adres, value)
    client.writeSingleRegister(adres, value)
      .then(response=>res.json({response}))
      .catch(err=>console.log(err))
  }
  this.zmienTemp = (req, res)=>{
    const {adres, value} = req.body
    console.log(adres, value)
    const buf=Buffer.alloc(4)
    writeIEEE754LEW(buf, value, 0, 23, 4)
    client.writeMultipleRegisters(adres, buf)
      .then(response=>{
        console.log(response)
        res.json({response})
      })
      .catch(err=>console.log(err)) 
  }
}

export default ModbusHandler
