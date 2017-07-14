const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  readline = require('readline'),
  http = require('http'),
  models = require('./server/models'),
  DB = require("./server/models");




function onError(error) { console.log('server error') }
function onListening() { console.log('you are now listening on', (process.env.PORT || 3000)) }

app.use(bodyParser.urlencoded({
  extended : true
}));

app.use(express.static('public'));

const server = require('http').createServer(app);

models.sequelize.sync().then(function () {
  server.listen(process.env.PORT || 3000);
  server.on('error', onError);
  server.on('listening', onListening);
});

app.get('/', function(req, res){
  console.log(__dirname);
  res.sendFile('index.html', {
    root : __dirname
  });
});

app.get('/api/pgns/:id', (req, res)=>{
  let pgnReader = readline.createInterface({
    input: fs.createReadStream(`./public/javascripts/${req.params.id}`)
  })
  let response = []
  pgnReader.on('line', (line)=>{
    let game = {}
    let lineArray = line.split('~')
    game['pgn'] = lineArray[0]
    game['events'] = lineArray[1].split(',')
    response.push(game)
  })
  pgnReader.on('close', ()=>{
    res.send(response)
  })
})
