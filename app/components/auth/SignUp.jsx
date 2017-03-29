import React from 'react'

export default class SignUp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='sign-up'>
        <h1>Sign up</h1>
        <input type='text' className='half-width left' placeholder='First Name' />
        <input type='text' className='half-width' placeholder='Last Name' />
        <input type='text' className='full-width' placeholder='E-mail address' />
        <input type='text' className='full-width' placeholder='Password' />
        <div className='agreement'>
          <input type='checkbox' />
          <div className='text'>By submitting this form you agree to the terms and conditions of this website</div>
        </div>
        <div className='modal-button-container'>
          <div className='modal-button'>Sign In</div>
        </div>
      </div>
    )
  }
}