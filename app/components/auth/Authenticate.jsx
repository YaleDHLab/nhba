import React from 'react'
import SignUp from './SignUp'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import ValidateAccount from './ValidateAccount'
import ResetPassword from './ResetPassword'

export default class Authenticate extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: 'login'
    }

    this.signUp = this.signUp.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
  }

  componentDidMount() {
    if (this.props.view && this.props.view != this.state.view) {
      this.setState({view: this.props.view})
    }
  }

  signUp(e) {
    this.setState({view: 'sign-up'})
  }

  forgotPassword(e) {
    this.setState({view: 'forgot-password'})
  }

  render() {
    let view = null;
    switch(this.state.view) {
      case 'login':
        view = <Login {...this.props}
          forgotPassword={this.forgotPassword} />;
        break;

      case 'sign-up':
        view = <SignUp {...this.props} />;
        break;

      case 'forgot-password':
        view = <ForgotPassword {...this.props} />;
        break;

      case 'validate':
        view = <ValidateAccount {...this.props} />
        break;

      case 'reset-password':
        view = <ResetPassword {...this.props} />
        break;
    }

    return (
      <div className='authenticate'>
        <div className='modal'>
          <div className='header'>
            <div className='left'>New Haven Building Archive</div>
            <div className='middle' onClick={this.signUp}>Sign up</div>
            <div className='right' onClick={this.props.hideAuth}>
              <div className='x'>&times;</div>
              Close
            </div>
          </div>
          <div className='body'>
            {view}
          </div>
        </div>
      </div>
    )
  }
}