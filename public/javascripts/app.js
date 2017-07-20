$(document).ready(()=>{
  let events;

  $.ajax({
    method: 'GET',
    url: 'api/events',
    success: (data)=>{events = groupEvents(data); loadPgns(events)}
  });

  function groupEvents(events){
    let grouped = {}
    events.forEach((event)=>{
      if(grouped[event.pgn]){
        grouped[event.pgn].push(event)
      } else {
        grouped[event.pgn] = [event]
      }
    })
    console.log(JSON.stringify(grouped))
    return grouped
  }

  function loadPgns(events){
    let keys = Object.keys(events)
    keys.forEach((key)=>{
      $('#select-pgn').append(`<option value=${key}>${key}<option>`)
    })
  }

  function createMovesForm(moves){
    let inputs = ''
    moves.forEach((move)=>{
      inputs+=`<div class="move-input">${move.move} - ${move.fen}<input type="hidden" name="id" val="${move.id}"><input type="text" name="timestamp" val="${move.timestamp}"></div>`
    })


    return `
    <form id="move-update">
      ${inputs}
    </form>`
  }

  $('#select-pgn').change(()=>{
    let selected = $('#select-pgn option:selected').text()
    let moves = events[selected]
    let form = createMovesForm(moves)
    $('.pgn-display').html(`<div>${selected}</div>`)
    $('.pgn-form').html(form)
  })

  // function compare(a,b) {
  //   if (a.pgn < b.pgn)
  //     return -1;
  //   if (a.pgn > b.pgn)
  //     return 1;
  //   return 0;
  // }

})
