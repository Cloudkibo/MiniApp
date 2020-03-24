const requestPromise = require('request-promise')
const config = require('../config')

exports.callApi = (endpoint, method = 'get', body, type = 'kibopush') => {
  const headers = {
    'content-type': 'application/json',
    'is_kibo_product': true
  }
  const apiUrl = config.api_urls[type]
  const options = {
    method: method.toUpperCase(),
    uri: `${apiUrl}/${endpoint}`,
    headers,
    body,
    json: true
  }
  return requestPromise(options).then(response => {
    return new Promise((resolve, reject) => {
      if (response.status === 'success') {
        resolve(response.payload)
      } else {
        reject(response.payload)
      }
    })
  })
}
