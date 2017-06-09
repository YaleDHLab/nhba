import React from 'react'
import request from 'superagent'
import api from '../../../config'

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      message: ''
    }

    this.updateEmail = this.updateEmail.bind(this)
    this.handleKey = this.handleKey.bind(this)
    this.submit = this.submit.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }

  updateEmail(e) {
    this.setState({email: e.target.value})
  }

  handleKey(e) {
    if (e.charCode == 13) {
      this.submit()
    }
  }

  submit() {
    var packet = {
      email: this.state.email
    }

    request
      .post(api.endpoint + 'forgotPassword')
      .send(packet)
      .set('Accept', 'application/json')
      .end(this.handleResponse)
  }

  handleResponse(err, res) {
    if (err) {console.warn(err)} else {
      if (res.body.message) {
        this.setState({message: res.body.message})
      }
    }
  }

  render() {
    const message = this.state.message

    return (
      <div className='forgot-password'>
        <h1>Forgot Password</h1>
        <div className='body-text'>Enter the email address associated with your account, and we'll email you a link to reset your password</div>
        <input
          className='full-width'
          placeholder='E-mail address'
          type='email'
          value={this.state.email}
          onKeyPress={this.handleKey}
          onChange={this.updateEmail} />
        <div className='modal-button-container'>
          <div className='modal-button'
            onClick={this.submit}>Send Reset Instructions</div>
        </div>

        {message ? <div className='message'>{message}</div> : null}
      </div>
    )
  }
}