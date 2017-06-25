
jQuery(function($) {

  window._wq = window._wq || [];

  function loadChessGame(container, options, callback) {
    var chess = $('.board', container).chess(options);

    _wq.push({ id: "1c8q2l4nvy", onReady: function(video) {
      console.log("I got a handle to the video!", video);
      video.bind("timechange", function(t) {
        console.log("the time changed to " + t);
        let current = 16.1
        if (t>=current){
          chess.transitionForward();
          current += 3
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
