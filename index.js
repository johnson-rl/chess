const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  readline = require('readline');

app.use(bodyParser.urlencoded({
  extended : true
}));

app.use(express.static('public'));

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

app.listen(process.env.PORT || 3000, function(){

  console.log('express server online on port', 3000)
});
