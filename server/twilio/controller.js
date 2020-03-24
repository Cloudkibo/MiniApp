const { callApi } = require('../global/callApi')

exports.sendMessage = (req, res) => {
  console.log('body', req.body)
  const number = req.body.number
  const text = req.body.text
  if (!number) {
    return res.status(400).json({ status: 'failed', description: 'Parameter number is missing' })
  } else if (!text) {
    return res.status(400).json({ status: 'failed', description: 'Parameter text is missing' })
  } else {
    callApi('twilio/sendSMS', 'post', { numbers: [number], template_code: text })
      .then(result => {
        return res.status(200).json({ status: 'success', description: 'Message sent successfully!' })
      })
      .catch(err => {
        console.log(err)
        return res.status(500).json({ status: 'failed', description: 'Failed to send message' })
      })
  }
}

exports.receiveMessage = (req, res) => {
  console.log('incomingMessage', req.body)
  require('../socket').sendMessageToClient({
    room_id: '7wi1i073s7in9c0visminiapp',
    body: {
      action: 'new_message',
      payload: req.body
    }
  })
  return res.status(200).json({ status: 'success' })
}
