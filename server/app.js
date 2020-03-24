const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')
const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, '../client/build')))
app.use(bodyParser.json())

const socket = require('socket.io').listen(server)
require('./socket').setup(socket)

server.listen(process.env.PORT || 8080, () => {
  console.log('Server started on port 8080')
})

require('./routes')(app)
