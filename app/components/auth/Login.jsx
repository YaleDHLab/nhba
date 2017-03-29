import React from 'react'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='login'>
        <h1>Welcome</h1>
        <input type='text' className='full-width' placeholder='Username' />
        <input type='text' className='full-width' placeholder='Password' />
        <div className='forgot-password-button'
          onClick={this.props.forgotPassword}>Forgot password?</div>
        <div className='modal-button-container'>
          <div className='modal-button'>Sign In</div>
        </div>
      </div>
    )
  }
}