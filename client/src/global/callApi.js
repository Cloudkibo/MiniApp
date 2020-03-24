import fetch from 'isomorphic-fetch'

export default function callApi (endpoint, method = 'get', body) {
  console.log('body before sending', body)
  const headers = {'content-type': 'application/json'}
  const fetchUrl = `/api/${endpoint}`

  return fetch(fetchUrl, {
    headers,
    method,
    body: JSON.stringify(body)
  }).then(response => {
    return response
  }).then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      return json
    })
    .then(
      response => response,
      error => error
    )
}
