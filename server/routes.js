const path = require('path')

module.exports = function (app) {
  app.use('/api/twilio', require('./twilio'))

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
  })

  app.route('/:url(api|auth)/*').get((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` })
  }).post((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` })
  })

  app.route('/*').get((req, res) => {
    res.redirect('/')
  }).post((req, res) => {
    res.redirect('/')
  })
}
