
jQuery(function($) {

  window._wq = window._wq || [];

  function loadChessGame(container, options, callback) {
    var chess = $('.board', container).chess(options);

    _wq.push({ id: "6qsebhq6qg", onReady: function(video) {
      console.log("I got a handle to the video!", video);
      let i = 0
      let time = [300.5, 305.17, 308.03, 331.2, 347.17, 356.06, 358.06, 371.05, 372.02, 372.2, 373.2]
      video.bind("timechange", function(t) {
        console.log("the time changed to " + t, time[i]);
        if (t>=time[i]){
          chess.transitionForward();
          i++
        }
      });
    }});

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

  $('.pgn-load').click(function(){

    $('.ctrl-buttons').removeClass('hidden');
    $('.pgn-form').addClass('hidden');

    var currentPgn = $('.pgn-field').val().replace(/\(/g,'{').replace(/\)/g,'}').replace('*','')
    var currentFEN = currentPgn.substring(currentPgn.lastIndexOf("[FEN")+4,currentPgn.lastIndexOf("]")).replace(/"/g,'');

    loadChessGame('#game3', { fen: currentFEN, pgn : currentPgn });

  });

  $('.load-new-game').click(function(){
    $('.pgn-form').removeClass('hidden');
    $('.ctrl-buttons').addClass('hidden');
    $('.board').html('');
    // $('.fen-field').val(null);
    $('.pgn-field').val(null);
  })

});
