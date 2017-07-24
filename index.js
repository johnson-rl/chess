const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  readline = require('readline'),
  http = require('http'),
  models = require('./server/models'),
  Event = models.Event,
  Video = models.Video,
  Pgn = models.Pgn,
  timestampParse = require('timestamps');

const pgnParser = require('pgn-parser');

const Chess = require('chess.js').Chess;

let timestampData = {}

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

let seed = false;

seed = true // uncomment this line to seed the db

if (seed){
  Event.findAll().then((events)=>{
    events.forEach((event)=>{
      event.destroy()
    })
  })
  var lineReader = readline.createInterface({
    input: fs.createReadStream('jtan-edits.csv')
  });

  lineReader.on('line', function (line) {
    // console.log('line', line)
    let lineArray = line.split(',')
    if(!timestampData[lineArray[0]]){
      timestampData[lineArray[0]] = []
    }
    let data = {move: lineArray[2].split('.')[1], time: lineArray[1]}
    timestampData[lineArray[0]].push(data)
    console.log('timestampData',timestampData)
  });

  function onError(err){
    console.log('on noes!', err)
  }

  lineReader.on('close',()=>{
    console.log(timestampData)
    readFiles('PGN_files/103/', function(filename, content) {
      console.log(filename)
      createFens(filename, content)
    }, function(err) {
      throw err;
    });
  })
}

function parseMoveData(fen, moves, type, filename){
  const chess = new Chess(fen)
  let mappedMoves = moves.map((move)=>{
    let fenArray = [];
    if (move.ravs){
      // fenArray.push({move: 'reset',type:'reset', fen: chess.fen()})
      // console.log('ravs',move.ravs[0].moves)
      move.ravs.forEach((rav)=>{
        fenArray.push(parseMoveData(chess.fen(),[{move: 'reset'}], 'reset',filename))
        fenArray.push(parseMoveData(chess.fen(), rav.moves, 'alternate', filename))
      })
    }

    let chessMove
    if (move.move != 'start' || 'end' || 'reset'){
      chessMove = chess.move(move.move);
    }

    let time = 0
    let file = filename.split('.')[0]
    let times = timestampData[file]
    time = times.filter((obj)=>{return obj.move == move.move})
    // if (filename){
      // console.log('file',file,'times',times,'time',time)
    // }
    let timestamp = ''
    if(time != 0){
      let i = 0;
      if (time.length > 1) {
        let index = timestampData[file].indexOf(time[0]);
        timestampData[file].splice(index, 1)
      }
      timestamp = time[i].time || ''
    }
    timestampArray = timestamp.split(':').map((str)=>{return parseInt(str)})
    // toParse = 0 + ':' + timestampArray[1] + ':' + timestampArray[2] + '.' + timestampArray[3]
    // let calc = (((((timestampArray[0]-1) * 60 +timestampArray[1]) * 60) + 3 + timestampArray[2])*24 + timestampArray[3])/23.98 * 60
    let calc = ((3+(((timestampArray[0]-1)*60)+timestampArray[1])*60 + timestampArray[2])*24 + timestampArray[3])/23.98 * 1000
    // 1. Add 3 seconds to account for the video intro (+00:00:03:00)
    // 3. Convert hh:mm:ss into seconds (ignore ff)
    // 4. Multiply seconds by 24 fps
    // 5. Add in the frames (ff)
    // 6. Divide by 23.98 to get to the number of seconds in standard time
    // 7. (optional) multiply by 60 to get milliseconds
    console.log(timestampArray, calc)



    let data =  {
      move: move.move,
      fen: chess.fen(),
      type: type,
      chessMove: chessMove,
      // timestamp: timestampParse.parse(toParse)
      timestamp: calc
    }
    // console.log('data',data)
    fenArray.push(data)
    return [].concat.apply([], [].concat.apply([], fenArray))
  })
  if (type=='move'){
    mappedMoves.push(parseMoveData(fen,[{move: 'start'}], 'start',filename)[0])
    mappedMoves.push(parseMoveData('',[{move: 'end'}], 'end',filename)[0])
  }
  return mappedMoves
}

function createFens (filename, res) {
  let contents = res.toString().replace(/[\r\n]+/g, '\n\n')
  // parse PGN
  pgnParser((err, parser) => {
    const pgn = parser.parse(contents)[0]

    let fens = parseMoveData(pgn.headers.FEN, pgn.moves, 'move', filename)
    let merged = [].concat.apply([], fens);
    console.log('merged',merged.sort(orderMoves))
    merged.forEach((fen)=>{
      fen['pgn'] = filename
      Event.create(fen).then((event, err)=>{
        if(err){console.log(err)}
        console.log(event)
      })
    })
  })
}

function orderMoves(a,b) {
  if (a.timestamp < b.timestamp)
    return -1;
  if (a.timestamp > b.timestamp)
    return 1;
  return 0;
}

function onError(error) { console.log('server error') }
function onListening() { console.log('you are now listening on', (process.env.PORT || 3000)) }

app.use(bodyParser.urlencoded({
  extended : true
}));

app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/@masterclass/mc-chess/dist'))
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

// Batch update events
app.put('/api/batch/events/', (req, res)=>{
  console.log(req.body)
  req.body.forEach((eventData)=>{
    Event.findById(eventData.name).then((event, err)=>{
      if(err){console.log(err)}
      event.update({timestamp: eventData.value})
    })
    res.send(200)
  })

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
