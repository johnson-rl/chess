const Chess = require('chess.js').Chess;
const pgnParser = require('pgn-parser');
const fs = require('fs');

// good: Day 2- Position 58 15-33-34.pgn
fs.readFile('./PGN_files/110_Winning_Trades/Day 2- Position 57 15-29-34.pgn', (err, res) => {
  let contents = res.toString().replace(/[\r\n]+/g, '\n\n')
  
  // parse PGN
  pgnParser((err, parser) => {
    const pgn = parser.parse(contents)[0]
    const chess = new Chess(pgn.headers.FEN)
    let fens = [];
    let id = 1;
    pgn.moves.forEach((move, i) => {
      let fenSnapshot = chess.fen()
      chess.move(move.move)
      fens.push({
        move: move.move,
        type: 'move',
        id: id++,
        timestamp: id * 2,
        fen: chess.fen()
      })

      if (move.ravs) {
        move.ravs.forEach((rav) => {
          const chess1 = new Chess(fenSnapshot)
          rav.moves.forEach((move, i) => {
            chess1.move(move.move)
            fens.push({
              move: move.move,
              type: 'alternate',
              id: id++,
              timestamp: id * 2,
              fen: chess1.fen()
            })
          })
        })
      }
    })
    let data = [
      {
        type: 'start',
        id: 0,
        timestamp: 0,
        fen: pgn.headers.FEN
      },
      ...fens,
      {
        type: 'end',
        id: fens.length + 1,
        timestamp: fens.length * 2 + 4
      }
    ]
    console.log(data)
  })
})
