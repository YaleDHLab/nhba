import React from 'react'
import request from 'superagent'
import api from '../../../config'

export default class ValidateAccount extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      password: '',
      message: null
    }

    this.handleKey = this.handleKey.bind(this)
    this.updatePassword = this.updatePassword.bind(this)
    this.submit = this.submit.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }

  handleKey(e) {
    if (e.charCode == 13) {
      this.submit()
    }
  }

  updatePassword(e) {
    this.setState({password: e.target.value})
  }

  submit() {
    var packet = {
      email: this.props.location.query.email,
      token: this.props.location.query.token,
      password: this.state.password
    }

    request
      .post(api.endpoint + 'validate')
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

    this.props.getSessionData()
  }

  render() {
    const message = this.state.message;

    return (
      <div className='validate-account'>
        <h1>Validate Account</h1>
        <div className='authenticate-input-container'>
          <div className='body-text'>Please enter your password below to validate your account:</div>
          <input
            type='password'
            className='full-width'
            onKeyPress={this.handleKey}
            onChange={this.updatePassword}
            placeholder='Password'
            value={this.state.password} />
        </div>

        <div className='modal-button-container'>
          <div className='modal-button' onClick={this.submit}>Submit</div>
        </div>

        {message ? <div className='message'>{message}</div> : null}
      </div>
    )
  }
}