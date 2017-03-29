import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Authenticate from './auth/Authenticate'

export default class AppWrapper extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      authenticate: false
    }

    this.showAuth = this.showAuth.bind(this)
    this.hideAuth = this.hideAuth.bind(this)
  }

  showAuth() {
    this.setState({authenticate: true})
  }

  hideAuth() {
    this.setState({authenticate: false})
  }

  render() {
    const authenticate = this.state.authenticate;

    return (
      <div className='app-container'>
        <div className='app-wrapper'>
          <Header showAuth={this.showAuth} />
          <div className='app-content'>
            {authenticate ? <Authenticate hideAuth={this.hideAuth} /> : null}
            {this.props.children}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}