import React, { Component } from 'react'
import { withAlert } from 'react-alert'
import { joinRoom, registerCallback } from './socket'
import callApi from './global/callApi'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      number: '',
      text: '',
      incomingMessage: false,
      incomingMessagePayload: {}
    }
    this.onNumberChange = this.onNumberChange.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.onReset = this.onReset.bind(this)
    this.onSend = this.onSend.bind(this)
    this.handleIncomingMessage = this.handleIncomingMessage.bind(this)

    joinRoom('7wi1i073s7in9c0visminiapp')
    registerCallback(this.handleIncomingMessage)
  }

  onNumberChange (e) {
    this.setState({number: e.target.value})
  }

  onTextChange (e) {
    this.setState({text: e.target.value})
  }

  onReset () {
    this.setState({number: '', text: ''})
  }

  onSend () {
    // eslint-disable-next-line
    const regexp = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,14})$/g
    if (regexp.test(this.state.number)) {
      callApi('twilio/sendMessage', 'post', {number: this.state.number, text: this.state.text})
        .then(response => {
          if (response.status === 'success') {
            this.onReset()
            this.props.alert.success(response.description)
          } else {
            this.props.alert.error(response.description)
          }
        })
        .catch(err => {
          console.log('sendMessage error', err)
          this.props.alert.error('An unexpected error occured. Please try again later.')
        })
    } else {
      this.props.alert.error('Please provide a valid number of format E.164')
    }
  }

  handleIncomingMessage (payload) {
    this.props.alert.info(`A new message came from ${payload.From}`)
    this.setState({incomingMessagePayload: payload, incomingMessage: true})
  }

  render () {
    return (
      <div style={{padding: '20px'}} className="container">
        <h3>Covid-19 Mini App</h3>
        <div style={{marginTop: '35px'}} />
        <div className='row'>
          <div className='col-6'>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">
                Recipient Number
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="_input_number"
                  placeholder='Enter number here...'
                  value={this.state.number}
                  onChange={this.onNumberChange}
                />
              </div>
            </div>
            <div className="md-form">
              <textarea
                id="_text_area"
                className="md-textarea form-control"
                rows="3"
                placeholder='Type your message here...'
                value={this.state.text}
                onChange={this.onTextChange}
              />
            </div>
            <div style={{padding: '20px 0px'}}>
              <button
                style={{float: 'right'}}
                type="button"
                className="btn btn-primary"
                onClick={this.onSend}
                disabled={!this.state.number || !this.state.text}
              >
                Send
              </button>
              <button
                style={{float: 'right', marginRight: '10px'}}
                type="button"
                className="btn btn-light"
                onClick={this.onReset}
                disabled={!this.state.number || !this.state.text}
              >
                Reset
              </button>
            </div>
          </div>
          {
            this.state.incomingMessage &&
            <div className='col-6'>
              <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">Message from {this.state.incomingMessagePayload.From}</h4>
                <p>{this.state.incomingMessagePayload.Body}</p>
                <hr />
                <p className="mb-0">Country: {this.state.incomingMessagePayload.FromCountry}</p>
                <p className="mb-0">City: {this.state.incomingMessagePayload.FromCity}</p>
                <p className="mb-0">State: {this.state.incomingMessagePayload.FromState}</p>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default withAlert()(App)
