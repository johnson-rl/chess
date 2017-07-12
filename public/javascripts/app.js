jQuery(function($) {

  window._wq = window._wq || [];

  let videoId = '110_pgn.csv'
  let pgnFiles,
    events,
    chess

  $.ajax({
    method: 'GET',
    url: '/api/pgns/' + videoId,
    success: storePgn,
  })


  function storePgn (data){
    pgnFiles = data
    events = data[0].events
    $('.ctrl-buttons').removeClass('hidden');
    $('.pgn-form').addClass('hidden');
    loadPgn(data[0].pgn)
  }


  _wq.push({ id: "6qsebhq6qg", onReady: function(video) {
    console.log("I got a handle to the video!", video);
    let i = 0
    // let time = [300.5, 305.17, 308.03, 331.2, 347.17, 356.06, 358.06, 371.05, 372.02, 372.2, 373.2]

    video.bind("timechange", function(t) {
      console.log("the time changed to " + t, events[i]);

      if (!events[i]){i = 0; loadPgn(pgnFiles[current].pgn)}
      if (t>=events[i]){
        chess.transitionForward();
        i++
      }
    });
  }});

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
    events = pgnFiles[current].events
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

});
