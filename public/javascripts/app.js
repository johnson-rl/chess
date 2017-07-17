jQuery(function($) {

  window._wq = window._wq || [];

  let videoId = 1
  let pgnFiles,
    events,
    chess,
    videoData,
    active = {},
    time = [],
    orderedEvents,
    activePgn

  $.ajax({
    method: 'GET',
    url: 'api/pgns',
    success: (data)=>{pgnFiles = data; loadPgnsIntoEditor(data)}
  })

  $.ajax({
    method: 'GET',
    url: '/api/video/' + videoId + '/events',
    success: (data)=>{videoData = data; loadVideo()}
  })

  $.ajax({
    type: 'GET',
    url: '/api/videos',
    success: storeVideos
  })

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

  function loadVideo(){
    _wq.push({ id: videoData.video.videoHash, onReady: function(video) {
      console.log("I got a handle to the video!", video);
      console.log('videoData',videoData)
      //   loadMoveIntoEditor(result[0])
      orderedEvents = videoData.events.sort((a, b)=>{return a.timestamp - b.timestamp})
      let i = 0
      loadActivePgns()
      // loadMovesIntoEditor(orderedEvents)

      video.bind("timechange", function(t) {
        console.log("the time changed to " + t, orderedEvents[i].timestamp);
        if (t>=orderedEvents[i].timestamp){
          switch (orderedEvents[i].type){
            case 'start':
              console.log('start of a new pgn');
              loadPgn(active[orderedEvents[i].PgnId].content)
              break;
            case 'move':
              console.log('move that piece!');
              chess.transitionForward();
              break;
            case 'end':
              console.log('remove the chess view')
              $('.board').html('')
              break;
          }
          i++
        }
      });
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
    console.log(active)
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
      data: data
    })
  })

});
