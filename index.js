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
