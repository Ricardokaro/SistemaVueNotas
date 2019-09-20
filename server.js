const express = require ('express');
const serveStatic = require ('serve-static'); 
const path = require("path");

aplicación = express (); 

app.use ("/", serveStatic (path.join(__dirname + '/dist'))); 

const puerto = proceso.env.PORT || 8080; 
app.listen (puerto); 

console.log ('servidor iniciado' + puerto);