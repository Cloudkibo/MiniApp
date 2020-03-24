'use strict'
let globalSocket

// When the user disconnects.. perform this
function onDisconnect (socket) {}

// When the user connects.. perform this
function onConnect (socket) {
  socket.on('message', (data) => {
    if (data.action === 'join_room') {
      console.log('socket joined', data.room_id)
      socket.join(data.room_id)
    }
  })
}

exports.setup = function (socketio) {
  globalSocket = socketio

  socketio.on('connection', function (socket) {
    socket.connectedAt = new Date()

    // Call onDisconnect.
    socket.on('disconnect', function () {
      console.log('On Disconnect Called Server Side')
      onDisconnect(socket)
    })

    // Call onConnect.
    onConnect(socket)
  })
}

exports.sendMessageToClient = function (data) {
  console.log(`Sending message to client using socket.io ${JSON.stringify(data)}`)
  globalSocket.to(data.room_id).emit('message', data.body)
}
