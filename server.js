const express = require('express')
const serveStatic = require('serve-static') 
const path = require("path")

app = express()

app.use("/", serveStatic(path.join(__dirname + '/dist'))) 

const puerto = process.env.PORT || 5000; 
app.listen(puerto) 

console.log ('servidor iniciado' + puerto);