var express = require('express'),
  app = express()

app.use(express.static('public'));

app.get('/', function(req, res){
  console.log(__dirname);
  res.sendFile('index.html', {
    root : __dirname
  });
});

app.listen(process.env.PORT || 3000, function(){

  console.log('express server online on port', 3000)
});
