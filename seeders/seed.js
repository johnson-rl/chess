const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  readline = require('readline'),
  http = require('http'),
  models = require('../server/models'),
  Event = models.Event,
  Video = models.Video,
  Pgn = models.Pgn,
  timestampParse = require('timestamps');

const pgnParser = require('pgn-parser');

const Chess = require('chess.js').Chess;

let timestampData = {}
let number = 1

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
}

var lineReader = readline.createInterface({
  input: fs.createReadStream(`./seeders/${process.argv[2]}/seed.csv`)
});

lineReader.on('line', function (line) {
  // console.log('line', line)
  let lineArray = line.split(',')
  if(!timestampData[lineArray[0]]){
    timestampData[lineArray[0]] = []
  }
  let data = {move: lineArray[2].split('.')[1], time: lineArray[1], videoHash: lineArray[3]}
  timestampData[lineArray[0]].push(data)
  // console.log('timestampData',timestampData)
});

function onError(err){
  console.log('on noes!', err)
}

lineReader.on('close',()=>{
  // console.log(timestampData)
  readFiles(`./seeders/${process.argv[2]}/pgns/`, function(filename, content) {
    // console.log(filename)
    createFens(filename, content)
  }, function(err) {
    throw err;
  });
})

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
  let fileArray = filename.split('.');
  fileArray.pop()
  let file = fileArray.join('.')
  let times = timestampData[file]
  // console.log('times',timestampData,'file',file)
  time = times.filter((obj)=>{return obj.move == move.move})
  // if (filename){
    // console.log('file',file,'times',times,'time',time)
  // }
  let timestamp = ''
  let chapter = null
  if(time != 0){
    let i = 0;
    if (time.length > 1) {
      let index = timestampData[file].indexOf(time[0]);
      timestampData[file].splice(index, 1)
    }
    chapter = time[0].videoHash
    timestamp = time[i].time || ''
  }
  if (timestamp != null){

    timestampArray = timestamp.split(':').map((str)=>{return parseInt(str)})
    let calc = ((3+(((timestampArray[0]-1)*60)+timestampArray[1])*60 + timestampArray[2])*24 + timestampArray[3])/23.98 * 1000
    // console.log(timestampArray, calc)


    let data =  {
      move: move.move,
      fen: chess.fen(),
      type: type,
      chessMove: chessMove,
      // timestamp: timestampParse.parse(toParse)
      timestamp: calc,
      videoHash: chapter
    }
    // console.log('data',data)
    fenArray.push(data)
    return [].concat.apply([], [].concat.apply([], fenArray))
  }
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


  // #TODO Delete this code after debugging submoves
  // pgn.moves.forEach((move)=> {
  //   if(move.ravs){
  //     move.ravs.forEach((rav)=>{
  //       console.log(rav)
  //     })
  //
  //   }
  // })

    // console.log('filename',filename, pgn)

  let fens = parseMoveData(pgn.headers.FEN, pgn.moves, 'move', filename)
  let merged = [].concat.apply([], fens);
  console.log('merged',merged.sort(orderMoves))
  merged.forEach((fen)=>{
    fen['pgn'] = filename
    if(seed){
      Event.create(fen).then((event, err)=>{
        if(err){console.log(err)}
        // console.log(`created ${number} entrie(s)`)
        number++
      })
    }
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
