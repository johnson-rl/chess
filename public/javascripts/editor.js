$(document).ready(()=>{
  let events;
  let videoList = [
    {
      title: '103_GK_Double Attacks_Board_v7',
      hash: 'eu2yodfadf'
    },
    {
      title: '104_GK_Skewers_Board_v7',
      hash: '8xwnkkqkxc'
    },
    {
      title: '105_GK_DiscoveredAttacks_Board_v7',
      hash: 'vsjsugodzx'
    },
    {
      title: '106_GK_Pins_Board_v7',
      hash: 'vuux3jpt5i'
    },
    {
      title: '107_GK_DeflectionAttraction_Board_v7',
      hash: 'uv3rk57e8r'
    },
    {
      title: '108_GK_Interference_Board_v7',
      hash: 'rkh884dbuh'
    },
    {
      title: '109_GK_Overload_Board_v7',
      hash: 'otunyj55s8'
    },
    {
      title: '110_GK_WinningTrades_Board_v7',
      hash: 'anz4s14b4a'
    },
    {
      title: '111_GK_EndGames_Board_v7',
      hash: 'wc23s0sw6y'
    },
    {
      title: '112_GK_Openings_Board_v7',
      hash: '8g4xna0a0g'
    },
    {
      title: '114_GK_Case Studies_Board_Openings_v4',
      hash: 'fjgr7q5hp4'
    },
    {
      title: '116_GK_Case Studies_EndGames_Board_v6',
      hash: 'pb54t3rwan'
    },
    {
      title: '122_GK_BonusSecretNovelty_Board_v6',
      hash: 'p0c2jxbx2w'
    },
    {
      title: '113_GK_Simul_Board_v4',
      hash: '9nfd08l947'
    },
    {
      title: '113A_GK_Simul_Board_v4',
      hash: 'qtvjty3g1n'
    },
    {
      title: '113B_GK_Simul_Board_v4',
      hash: 'bq81ef0itb'
    },
    {
      title: '113C_GK_Simul_Board_v4',
      hash: 'vmwh8lnf1z'
    }
  ]

  $.ajax({
    type: 'GET',
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
    console.log(grouped)
    return grouped
  }

  function loadPgns(events){
    let keys = Object.keys(events).map((key)=>{
      return { key: key, order: parseInt(key.split('Position ')[1].split(' ')[0]) }
    })
    console.log(keys)
    keys.sort(orderPgns)
    keys.forEach((key)=>{
      $('#select-pgn').append(`<option value=${key.key}>${key.key}</option>`)
    })
  }

  videoList.forEach((vid)=>{
    $('#select-vid').append(`<option value=${vid.hash}>${vid.title}</option>`)
  })

  function createMovesForm(moves){
    let inputs = ''
    let sortedMoves = moves.sort(orderMoves)
    sortedMoves.forEach((move)=>{
      inputs+=`<div class="move-input row"><span class="col-md-6">${move.move} - ${move.fen}</span><span class="col-md-3"><input type="text" name="${move.id}" class="timestamp" value="${move.timestamp}"></span></div>`
    })


    return `
    <form id="move-update">
      ${inputs}
      <button class="btn-primary btn-large move-update-button" type="submit">Commit to Database</button>
    </form>`
  }

  function orderMoves(a,b) {
    if (a.timestamp < b.timestamp)
      return -1;
    if (a.timestamp > b.timestamp)
      return 1;
    return 0;
  }

  $('#select-pgn').change(()=>{
    let selected = $('#select-pgn option:selected').text()
    let moves = events[selected]
    console.log(moves)
    let form = createMovesForm(moves)
    $('.pgn-display').html(`<div>${selected}</div>`)
    $('.pgn-form').html(form)
    // #TODO not sure why this is returning the window.
    // $('.timestamp').keyup(()=>{
    //   event.preventDefault();
    //   console.log('keyup', this)
    //
    // })
    $('#move-update').submit((event)=>{
      event.preventDefault();
      let updates = $('#move-update').serializeArray()
      updates.forEach((update)=>{
        $.ajax({
          type: 'PUT',
          data: {timestamp: update.value},
          url: `api/events/${update.name}`,
          success: ()=>{console.log('updated')}
        })
      })
      console.log($('#move-update').serializeArray())
    })
  })

  $('#select-vid').change(()=>{
    let selected = $('#select-vid option:selected').val()
    console.log(selected)
    let content = `<div class="wistia_embed wistia_async_${selected} video" style="width:960px;height:540px;"></div>`
    $('.video-container').html(content)
  })

  function orderPgns(a,b) {
    if (a.order < b.order)
      return -1;
    if (a.order > b.order)
      return 1;
    return 0;
  }

})
