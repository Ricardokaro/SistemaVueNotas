import express from 'express'
import serveStatic from 'serve-static' 
import { join } from "path"

app = express()

app.use("/", serveStatic(join(__dirname + '/dist'))) 

const puerto = process.env.PORT || 5000; 
app.listen(puerto) 

console.log ('servidor iniciado' + puerto);