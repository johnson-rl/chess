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

    var scrubbedPgn = $('.pgn-field').val().replace(/\(/g,'{').replace(/\)/g,'}').replace('*','')
    var parsedPgn = scrubbedPgn.substring(scrubbedPgn.lastIndexOf("]") + 1, (scrubbedPgn.length -1) )
    console.log(parsedPgn)
    var currentFEN = scrubbedPgn.substring(scrubbedPgn.lastIndexOf("[FEN")+4,scrubbedPgn.lastIndexOf("]")).replace(/"/g,'');

    loadChessGame('#game3', { fen: currentFEN, pgn : parsedPgn });

  });

  $('.load-new-game').click(function(){
    $('.pgn-form').removeClass('hidden');
    $('.ctrl-buttons').addClass('hidden');
    $('.board').html('');
    // $('.fen-field').val(null);
    $('.pgn-field').val(null);
  })

});
