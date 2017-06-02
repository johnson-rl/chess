jQuery(function($) {

  function loadChessGame(container, options, callback) {
    var chess = $('.board', container).chess(options);

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
