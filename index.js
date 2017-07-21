const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  readline = require('readline'),
  http = require('http'),
  models = require('./server/models'),
  Event = models.Event,
  Video = models.Video,
  Pgn = models.Pgn;

const pgnParser = require('pgn-parser');

const Chess = require('chess.js').Chess;

// let fen = '1k6/4r2p/1P5P/8/8/8/8/K5R1 w - - 0 1'
// let pgn = [
//     '[Event "?"]',
//     '[Site "?"]',
//     '[Date "????.??.??"]',
//     '[Round "?"]',
//     '[White "?"]',
//     '[Black "?"]',
//     '[Result "*"]',
//     '1.Rg8+ Kb7 2.Rg7 Rxg7 3.hxg7 *'
//   ]
//
// let pgnDos = '[Event "?"][Site "?"][Date "????.??.??"][Round "?"][White "?"][Black "?"][Result "*"][SetUp "1"][FEN "1k6/4r2p/1P5P/8/8/8/8/K5R1 w - - 0 1"]1.Rg8+ Kb7 2.Rg7 Rxg7 3.hxg7 *'
// let pgnTres = '[Event "?"]\n[Site "?"]\n[Date "????.??.??"]\n[Round "?"]\n[White "?"]\n\[Black "?"]\n[Result "*"]\n[FEN "8/2p2p2/q1P1p3/p7/4Q3/2K5/2P5/k7 w - - 0 1"]\n[SetUp "1"]\n1.Qa4+ Kb1 2.Qb3+ Kc1 3.Qb2+ Kd1 4.Qb1+ Ke2 5.Qb7 Qxb7 6.cxb7 *'
// let chess = new Chess("8/2p2p2/q1P1p3/p7/4Q3/2K5/2P5/k7 w - - 0 1");
// chess.load_pgn(pgnTres)
// let moves = chess.history()
// console.log(chess.ascii())
  // moves.forEach((move)=>{
  //   chess.move(move)
  //   console.log(chess.ascii(),chess.fen())
  // })




function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

function onError(err){
  console.log('on noes!', err)
}

function fenCreator(fen, moves, type){
  const chess = new Chess(fen)
  return moves.map((move)=>{
    let fenArray = [];
    if (move.ravs){
      console.log('ravs')
      move.ravs.forEach((rav)=>{
        fenArray.push(fenCreator(chess.fen(), rav.moves, 'alternate'))
      })
    }
    let chessMove = chess.move(move.move);
    let data =  {
      move: move.move,
      fen: chess.fen(),
      type: type,
      chessMove: chessMove
    }
    fenArray.push(data)
    return [].concat.apply([], [].concat.apply([], fenArray))
  })
}


function createFens (filename, res) {
  let contents = res.toString().replace(/[\r\n]+/g, '\n\n')
  // console.log(contents)
  // parse PGN
  pgnParser((err, parser) => {
    const pgn = parser.parse(contents)[0]
    let fens = fenCreator(pgn.headers.FEN, pgn.moves, 'move')
    let merged = [].concat.apply([], fens);
    console.log(merged)
    merged.forEach((fen)=>{
      fen['pgn'] = filename
      Event.create(fen).then((event, err)=>{
        if(err){console.log(err)}
        console.log(event)
      })
    })
  })
}

// // Commented section used to populate moves into db
readFiles('PGN_files/GK_Masterclass/', function(filename, content) {
  createFens(filename, content)
}, function(err) {
  throw err;
});

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

app.get('/editor', function(req, res){
  console.log(__dirname);
  res.sendFile('editor.html', {
    root : __dirname
  });
});

// Create a PGN
app.post('/api/pgns', (req, res)=>{
  Pgn.create(req.body).then((data, err)=>{
    if(err){console.log(err)}
    res.json(data)
  })
})

// Get all of the PGNs
app.get('/api/pgns', (req, res)=>{
  Pgn.findAll().then((pgns, err)=>{
    if(err){console.log(err)}
    res.json(pgns)
  })
})

// Get one of the pgns
app.get('/api/pgns/:id', (req, res)=>{
  Pgn.findById(req.params.id).then((pgn, err)=>{
    if(err){console.log(err)}
    res.json(pgn)
  })
})

// Delete a PGN
app.delete('/api/pgns/:id', (req, res)=>{
  Pgn.findById(req.params.id).then((pgn, err)=>{
    if(err){console.log(err)}
    pgn.destroy()
    res.json(pgn)
  })
})

// Create a video
app.post('/api/videos', (req, res)=>{
  Video.create(req.body).then((data, err)=>{
    if(err){console.log(err)}
    res.json(data)
  })
})

// Get all videos
app.get('/api/videos', (req, res)=>{
  Video.findAll().then((videos, err)=>{
    if(err){console.log(err)}
    res.json(videos)
  })
})

// Get one of the videos
app.get('/api/videos/:id', (req, res)=>{
  Video.findById(req.params.id).then((video, err)=>{
    if(err){console.log(err)}
    res.json(video)
  })
})

app.get('/api/events', (req, res)=>{
  Event.findAll().then((events, err)=>{
    if(err){console.log(err)}
    res.json(events)
  })
})

// Create an Event
app.post('/api/videos/:video_id/pgns/:pgn_id/events', (req, res)=>{
  Event.create(req.body).then((event, err)=>{
    if(err){console.log(err)}
    Pgn.findById(req.params.pgn_id).then((pgn, err)=>{
      if(err){console.log(err)}
      Video.findById(req.params.video_id).then((video, err)=>{
        console.log(pgn)
        // event.addPgns(pgn)
        pgn.addEvent(event)
        video.addEvent(event)
        // event.addVideo(video)
        pgn.save()
        video.save()
        event.save()
        res.json(event)
      })
    })
  })
})

// Update an Event
app.put('/api/events/:id', (req, res)=>{
  Event.findById(req.params.id).then((event, err)=>{
    if(err){console.log(err)}
    event.update(req.body)
    res.json(event)
  })
})

// Delete an event
app.delete('/api/events/:id', (req, res)=>{
  Event.findById(req.params.id).then((event, err)=>{
    if(err){console.log(err)}
    event.destroy()
    res.json(event)
  })
})

// Get one of the events
app.get('/api/events/:id', (req, res)=>{
  Event.findById(req.params.id).then((video, err)=>{
    if(err){console.log(err)}
    res.json(video)
  })
})

// Get a video and all of its events
app.get('/api/video/:id/events', (req, res)=>{
  Video.findById(req.params.id).then((video, err)=>{
    if(err){console.log(err)}
    Event.findAll({ where: { VideoId: req.params.id } }).then((events, err)=>{
      if(err){console.log(err)}
      let data = {
        video: video,
        events: events
      }
      res.json(data)
    })
  })
})
