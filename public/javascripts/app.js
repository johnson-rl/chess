jQuery(function($) {

  window._wq = window._wq || [];

  let videoId = 1
  let pgnFiles,
    events,
    chess,
    videoData = {"video":{"id":1,"title":"110_Winning Trades","videoHash":"6qsebhq6qg","createdAt":"2017-07-18T20:19:42.146Z","updatedAt":"2017-07-18T20:19:42.146Z"},"events":[{"id":8,"timestamp":120,"order":null,"type":"start","createdAt":"2017-07-18T20:23:38.451Z","updatedAt":"2017-07-18T20:23:38.471Z","VideoId":1,"PgnId":1},{"id":9,"timestamp":40,"order":null,"type":"start","createdAt":"2017-07-18T20:30:29.409Z","updatedAt":"2017-07-18T20:30:29.427Z","VideoId":1,"PgnId":4},{"id":10,"timestamp":63,"order":null,"type":"move","createdAt":"2017-07-18T20:30:45.245Z","updatedAt":"2017-07-18T20:30:45.255Z","VideoId":1,"PgnId":4},{"id":11,"timestamp":66,"order":null,"type":"move","createdAt":"2017-07-18T20:30:49.823Z","updatedAt":"2017-07-18T20:30:49.835Z","VideoId":1,"PgnId":4},{"id":12,"timestamp":68,"order":null,"type":"move","createdAt":"2017-07-18T20:30:54.635Z","updatedAt":"2017-07-18T20:30:54.644Z","VideoId":1,"PgnId":4},{"id":13,"timestamp":79,"order":null,"type":"move","createdAt":"2017-07-18T20:31:01.044Z","updatedAt":"2017-07-18T20:31:01.053Z","VideoId":1,"PgnId":4},{"id":14,"timestamp":80,"order":null,"type":"move","createdAt":"2017-07-18T20:31:04.839Z","updatedAt":"2017-07-18T20:31:04.850Z","VideoId":1,"PgnId":4},{"id":15,"timestamp":100,"order":null,"type":"end","createdAt":"2017-07-18T20:31:12.824Z","updatedAt":"2017-07-18T20:31:12.833Z","VideoId":1,"PgnId":4},{"id":16,"timestamp":137,"order":null,"type":"move","createdAt":"2017-07-18T20:31:30.414Z","updatedAt":"2017-07-18T20:31:30.429Z","VideoId":1,"PgnId":1},{"id":17,"timestamp":152,"order":null,"type":"move","createdAt":"2017-07-18T20:31:38.761Z","updatedAt":"2017-07-18T20:31:38.771Z","VideoId":1,"PgnId":1},{"id":18,"timestamp":156,"order":null,"type":"move","createdAt":"2017-07-18T20:31:45.281Z","updatedAt":"2017-07-18T20:31:45.291Z","VideoId":1,"PgnId":1},{"id":19,"timestamp":158,"order":null,"type":"move","createdAt":"2017-07-18T20:31:53.083Z","updatedAt":"2017-07-18T20:31:53.094Z","VideoId":1,"PgnId":1},{"id":20,"timestamp":161,"order":null,"type":"move","createdAt":"2017-07-18T20:32:00.419Z","updatedAt":"2017-07-18T20:32:00.428Z","VideoId":1,"PgnId":1},{"id":21,"timestamp":165,"order":null,"type":"move","createdAt":"2017-07-18T20:32:05.413Z","updatedAt":"2017-07-18T20:32:05.420Z","VideoId":1,"PgnId":1},{"id":22,"timestamp":168,"order":null,"type":"move","createdAt":"2017-07-18T20:32:13.299Z","updatedAt":"2017-07-18T20:32:13.306Z","VideoId":1,"PgnId":1},{"id":23,"timestamp":194,"order":null,"type":"move","createdAt":"2017-07-18T20:32:19.356Z","updatedAt":"2017-07-18T20:32:19.367Z","VideoId":1,"PgnId":1},{"id":24,"timestamp":195,"order":null,"type":"move","createdAt":"2017-07-18T20:32:26.185Z","updatedAt":"2017-07-18T20:32:26.193Z","VideoId":1,"PgnId":1}]},
    active = {"1":{"id":1,"title":"Day 2- Position 56 15-26-46.pgn","content":"[Event \"?\"]\n[Site \"?\"]\n[Date \"????.??.??\"]\n[Round \"?\"]\n[White \"?\"]\n[Black \"?\"]\n[Result \"*\"]\n[FEN \"r3r1k1/2p2ppp/8/pnP5/Q7/5P2/P3qBPP/R2R2K1 w - - 0 1\"]\n\n1.Re1 Qd3 \n    ( 1...Nc3 2.Qc6 Qc4 3.Qxc7 )\n2.Rxe8+ Rxe8 3.Rd1 Qe2 4.Re1 Qd3 5.Rxe8# *","createdAt":"2017-07-18T20:08:36.535Z","updatedAt":"2017-07-18T20:08:36.535Z"},"4":{"id":4,"title":"Day 2- Position 55 15-25-18.pgn","content":"[Event \"?\"]\n[Site \"?\"]\n[Date \"????.??.??\"]\n[Round \"?\"]\n[White \"?\"]\n[Black \"?\"]\n[Result \"*\"]\n[FEN \"1k6/4r2p/1P5P/8/8/8/8/K5R1 w - - 0 1\"]\n\n1.Rg8+ Kb7 2.Rg7 Rxg7 3.hxg7 *","createdAt":"2017-07-18T20:09:15.493Z","updatedAt":"2017-07-18T20:09:15.493Z"}},
    newEvents = [ { type: 'start',
    id: 0,
    timestamp: 0,
    fen: '8/8/8/5p2/8/3R4/P7/1k1K1N1r w - - 0 3' },
  { move: 'a3',
    type: 'move',
    id: 1,
    timestamp: 4,
    fen: '8/8/8/5p2/8/P2R4/8/1k1K1N1r b - - 0 3' },
  { move: 'Ke2',
    type: 'alternate',
    id: 2,
    timestamp: 6,
    fen: '8/8/8/5p2/8/3R4/P3K3/1k3N1r b - - 1 3' },
  { move: 'Kxa2',
    type: 'alternate',
    id: 3,
    timestamp: 8,
    fen: '8/8/8/5p2/8/3R4/k3K3/5N1r w - - 0 4' },
  { move: 'Rxf1+',
    type: 'move',
    id: 4,
    timestamp: 10,
    fen: '8/8/8/5p2/8/P2R4/8/1k1K1r2 w - - 0 4' },
  { move: 'Ke2',
    type: 'move',
    id: 5,
    timestamp: 12,
    fen: '8/8/8/5p2/8/P2R4/4K3/1k3r2 b - - 1 4' },
  { move: 'Rf4',
    type: 'move',
    id: 6,
    timestamp: 14,
    fen: '8/8/8/5p2/5r2/P2R4/4K3/1k6 w - - 2 5' },
  { move: 'Rh1',
    type: 'alternate',
    id: 7,
    timestamp: 16,
    fen: '8/8/8/5p2/8/P2R4/4K3/1k5r w - - 2 5' },
  { move: 'Rd1+',
    type: 'alternate',
    id: 8,
    timestamp: 18,
    fen: '8/8/8/5p2/8/P7/4K3/1k1R3r b - - 3 5' },
  { move: 'Rxd1',
    type: 'alternate',
    id: 9,
    timestamp: 20,
    fen: '8/8/8/5p2/8/P7/4K3/1k1r4 w - - 0 6' },
  { move: 'Kxd1',
    type: 'alternate',
    id: 10,
    timestamp: 22,
    fen: '8/8/8/5p2/8/P7/8/1k1K4 b - - 0 6' },
  { move: 'Rb3+',
    type: 'move',
    id: 11,
    timestamp: 24,
    fen: '8/8/8/5p2/5r2/PR6/4K3/1k6 b - - 3 5' },
  { move: 'Kc2',
    type: 'move',
    id: 12,
    timestamp: 26,
    fen: '8/8/8/5p2/5r2/PR6/2k1K3/8 w - - 4 6' },
  { move: 'Rb4',
    type: 'move',
    id: 13,
    timestamp: 28,
    fen: '8/8/8/5p2/1R3r2/P7/2k1K3/8 b - - 5 6' },
  { move: 'Re4+',
    type: 'move',
    id: 14,
    timestamp: 30,
    fen: '8/8/8/5p2/1R2r3/P7/2k1K3/8 w - - 6 7' },
  { move: 'Rxb4',
    type: 'alternate',
    id: 15,
    timestamp: 32,
    fen: '8/8/8/5p2/1r6/P7/2k1K3/8 w - - 0 7' },
  { move: 'axb4',
    type: 'alternate',
    id: 16,
    timestamp: 34,
    fen: '8/8/8/5p2/1P6/8/2k1K3/8 b - - 0 7' },
  { move: 'Rg4',
    type: 'alternate',
    id: 17,
    timestamp: 36,
    fen: '8/8/8/5p2/1R4r1/P7/2k1K3/8 w - - 6 7' },
  { move: 'Rxg4',
    type: 'alternate',
    id: 18,
    timestamp: 38,
    fen: '8/8/8/5p2/6R1/P7/2k1K3/8 b - - 0 7' },
  { move: 'fxg4',
    type: 'alternate',
    id: 19,
    timestamp: 40,
    fen: '8/8/8/8/6p1/P7/2k1K3/8 w - - 0 8' },
  { move: 'a4',
    type: 'alternate',
    id: 20,
    timestamp: 42,
    fen: '8/8/8/8/P5p1/8/2k1K3/8 b - - 0 8' },
  { move: 'Rxe4',
    type: 'move',
    id: 21,
    timestamp: 44,
    fen: '8/8/8/5p2/4R3/P7/2k1K3/8 b - - 0 7' },
  { move: 'fxe4',
    type: 'move',
    id: 22,
    timestamp: 46,
    fen: '8/8/8/8/4p3/P7/2k1K3/8 w - - 0 8' },
  { move: 'a4',
    type: 'move',
    id: 23,
    timestamp: 48,
    fen: '8/8/8/8/P3p3/8/2k1K3/8 b - - 0 8' },
  { type: 'end', id: 24, timestamp: 50 } ],
    time = [],
    orderedEvents,
    activeEventId = -1,
    previousTime = 0,
    activePgn

  // $.ajax({
  //   method: 'GET',
  //   url: 'api/pgns',
  //   success: (data)=>{pgnFiles = data; loadPgnsIntoEditor(data)}
  // })

  // $.ajax({
  //   method: 'GET',
  //   url: '/api/video/' + videoId + '/events',
  //   success: (data)=>{videoData = data; loadVideo()}
  // })

  // $.ajax({
  //   type: 'GET',
  //   url: '/api/videos',
  //   success: storeVideos
  // })

  loadVideo()

  function storeVideos(data){
    console.log(data)
    data.forEach((video)=>{
      $('#select-video').append(`<option value="${video.videoHash}">${video.title}</option>`)
    })
  }

  function addEvent(pgn, data){
    $.ajax({
      type: 'POST',
      url: '/api/videos/' + videoData.video.id + '/pgns/' + pgn + '/events',
      data: data,
      success: (data)=>{console.log('event added', data)}
    })
  }

  const boards = {};
  const newBoard = (fen) => {
    let name = 'board';
    boards[name] = new McChess({
      id: name,
      showNotation: true,
      position: fen
    })
  }
  const eventTypes = {
    start: (event) => {
      if (!boards.board) {
        newBoard(event.fen)
      } else {
        boards.board.position(event.fen, { animate: false })
      }
    },
    reset: (event) => {
      if (!boards.board) {
        newBoard(event.fen)
      } else {
        boards.board.position(event.fen, { animate: false })
      }
    },
    move: (event, animate) => {
      if (!boards.board) {
        newBoard(event.fen)
      } else {
        boards.board.position(event.fen, { animate })
      }
    },
    alternate: (event, animate) => {
      if (!boards.board) {
        newBoard(event.fen)
      } else {
        boards.board.position(event.fen, {
          animate,
          isAlternate: true
        })
      }
    },
    end: (event) => {
      boards.board.destroy()
      delete boards.board
    }
  }

  function handleTimeChange (t) {
    let isSeek = Math.abs(previousTime - t) > 1
    let events = newEvents.filter((event) => t >= event.timestamp)

    if (events.length) {
      let event = events.pop()

      if (activeEventId != event.id) {
        // do stuff
        if (eventTypes[event.type]) {
          eventTypes[event.type](event, !isSeek)
        }
        activeEventId = event.id
      }
    }

    previousTime = t
  }

  function loadVideo(){
    _wq.push({ id: videoData.video.videoHash, onReady: function(video) {
      console.log('videoData',videoData)
      //   loadMoveIntoEditor(result[0])
      orderedEvents = videoData.events.sort((a, b)=>{return a.timestamp - b.timestamp})
      loadActivePgns()
      // loadMovesIntoEditor(orderedEvents)

      video.bind('timechange', (t) => handleTimeChange(t));
    }});
  }

  function loadMovesIntoEditor(pgnId){
    $('#moves-in-editor').html('')
    activePgn = pgnId
    let moves = ($.grep(orderedEvents, function(e){ return e.PgnId == pgnId; }))
    console.log(moves)
    moves.forEach((move)=>{
      $('#moves-in-editor').append(`<label class="col-md-3">${move.type}</label><input class="col-md-9" type="text" value="${move.timestamp}" name="${move.id}">`)
    })
  }

  function loadPgnsIntoEditor(pgns){
    pgns.forEach((pgn)=>{
      $('#select-pgn').append(`<option value="${pgn.id}">${pgn.title}</option>`)
    })
  }

  function loadActivePgns(){
      $('#active-pgn').html('')
    videoData.events.forEach((event)=>{
      if(!(event.PgnId in active)){
        active[event.PgnId] = ($.grep(pgnFiles, function(e){ return e.id == event.PgnId; }))[0]
      }
    })
    console.log(JSON.stringify(active))
    Object.values(active).forEach((pgn)=>{
      appendPgn(pgn)
    })
  }


  function appendPgn(pgn){
    $('#active-pgn').append(`<form id="pgn-${pgn.id}"><span class="button-group"><button type="submit">Edit</button><input type="hidden" name="pgn-id" val="${pgn.id}"></form>${pgn.title}</span>`)
    $(`#pgn-${pgn.id}`).submit((event)=>{
      event.preventDefault()

      loadMovesIntoEditor(pgn.id)
    })
  }


  function loadChessGame(container, options, callback) {
    chess = $('.board', container).chess(options);

    $('.back', container).click(function() {
      chess.transitionBackward();
      $('.annot', container).text( chess.annotation() );
      return false;
    });

    $('.next', container).click(function() {
      chess.transitionForward();
      $('.annot', container).text( chess.annotation() );
      return false;
    });

    $('.flip', container).click(function() {
      chess.flipBoard();
      return false;
    });

    if ( typeof callback != "undefined" ) { callback(chess) };
  }

  let current = 0

  function loadPgn(pgn){
    $('.board').html('');
    chess = null
    let scrubbedPgn = pgn.replace(/\(/g,'{').replace(/\)/g,'}').replace('*','')
    let parsedPgn = scrubbedPgn.substring(scrubbedPgn.lastIndexOf("]") + 1, (scrubbedPgn.length -1) )
    let currentFEN = scrubbedPgn.substring(scrubbedPgn.lastIndexOf("[FEN")+4,scrubbedPgn.lastIndexOf("]")).replace(/"/g,'');
    current++
    loadChessGame('#game', { fen: currentFEN, pgn : parsedPgn });
  }

  $('.pgn-load').click(function(){

    $('.ctrl-buttons').removeClass('hidden');
    $('.pgn-form').addClass('hidden');
    loadPgn($('.pgn-field').val())
  });

  $('.load-new-game').click(function(){
    $('.pgn-form').removeClass('hidden');
    $('.ctrl-buttons').addClass('hidden');
    $('.board').html('');
    // $('.fen-field').val(null);
    $('.pgn-field').val(null);
    chess = null
  })

  $('#move-edit').submit((event)=>{
    let times = $('#move-edit').serializeArray()
    console.log(times)
    event.preventDefault()
    times.forEach((time)=>{
      $.ajax({
        type:'PUT',
        url: `/api/events/${time.name}`,
        data: {timestamp: time.value},
        success: onSuccess
      })
    })
    function onSuccess(data){
      console.log(data)
    }
    // TODO handle the video/pgn/event reloading
    location.reload()
  })

  $('#pgn-add').submit((event)=>{
    let newPgn = $('#pgn-add').serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
    event.preventDefault()
    newPgn['type'] = 'start'
    console.log(newPgn)
    $.ajax({
      type: 'POST',
      url: `/api/videos/${videoData.video.id}/pgns/${newPgn.PgnId}/events`,
      data: newPgn,
      success: (data)=>{console.log('new pgn data:', data); videoData.events.push(data); loadActivePgns()}
    })
  })

  $('#add-timestamp').submit((event)=>{
    event.preventDefault()
    $.ajax({
      type: 'POST',
      url: `/api/videos/${videoId}/pgns/${activePgn}/events`,
      data: $('#add-timestamp').serialize()
    })
  })

});
