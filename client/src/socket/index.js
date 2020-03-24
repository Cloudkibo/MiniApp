import io from 'socket.io-client'
const socket = io('')

export function initiateSocket () {
  socket.connect()
}

let joined = false
let myId = ''
let callback

export function registerCallback (cb) {
  callback = cb
}

export function joinRoom (data) {
  console.log('Trying to join room socket', data)
  myId = data
  if (joined) {
    return
  }
  socket.emit('message', {
    action: 'join_room',
    room_id: data
  })
  joined = true
}

socket.on('connect', () => {
  console.log('Setting Socket Status to true')
  if (myId !== '') {
    joinRoom(myId)
  }
})

socket.on('disconnect', () => {
  joined = false
})

socket.on('message', (data) => {
  console.log('socket event received', data)
  callback(data.payload)
})
