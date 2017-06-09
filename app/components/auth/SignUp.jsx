import React from 'react'
import request from 'superagent'
import api from '../../../config'

export default class SignUp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      terms: false,
      message: null
    }

    this.updateFirstName = this.updateFirstName.bind(this)
    this.updateLastName = this.updateLastName.bind(this)
    this.updateEmail = this.updateEmail.bind(this)
    this.updatePassword = this.updatePassword.bind(this)
    this.submit = this.submit.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.handleKey = this.handleKey.bind(this)
  }

  updateFirstName(e) {
    this.setState({firstname: e.target.value})
  }

  updateLastName(e) {
    this.setState({lastname: e.target.value})
  }

  updateEmail(e) {
    this.setState({email: e.target.value})
  }

  updatePassword(e) {
    this.setState({password: e.target.value})
  }

  submit() {
    var user = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      password: this.state.password
    }

    request
      .post(api.endpoint + 'register')
      .send(user)
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

  handleKey(e) {
    if (e.charCode == 13) {
      this.submit()
    }
  }

  render() {
    const message = this.state.message;

    return (
      <div className='sign-up'>
        <h1>Sign up</h1>

        <input
          type='text'
          className='half-width left'
          placeholder='First Name'
          value={this.state.firstname}
          onKeyPress={this.handleKey}
          onChange={this.updateFirstName} />

        <input
          type='text'
          className='half-width'
          placeholder='Last Name'
          value={this.state.lastname}
          onKeyPress={this.handleKey}
          onChange={this.updateLastName} />

        <input type='text'
          className='full-width'
          placeholder='E-mail address'
          value={this.state.email}
          onKeyPress={this.handleKey}
          onChange={this.updateEmail} />

        <input type='password'
          className='full-width'
          placeholder='Password'
          value={this.state.password}
          onKeyPress={this.handleKey}
          onChange={this.updatePassword} />

        <div className='agreement'>
          <input type='checkbox' />
          <div className='text'>By submitting this form you agree to the terms and conditions of this website</div>
        </div>

        <div className='modal-button-container'>
          <div className='modal-button' onClick={this.submit}>Sign Up</div>
        </div>

        {message ? <div className='message'>{message}</div> : null}
      </div>
    )
  }
}