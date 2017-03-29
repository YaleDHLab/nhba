import React from 'react'

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='forgot-password'>
        <h1>Forgot Password</h1>
        <div className='forgot-password-text'>Enter the email address associated with your account, and we'll email you a link to reset your password</div>
        <input className='full-width' placeholder='E-mail address' />
        <div className='modal-button-container'>
          <div className='modal-button'>Send Reset Instructions</div>
        </div>
      </div>
    )
  }
}