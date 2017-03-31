import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Authenticate from './auth/Authenticate'
import request from 'superagent'
import api from '../../config'
import _ from 'lodash'

export default class AppWrapper extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: null, // {'login','validate','reset-password'}
      authenticated: false // {true, false} is the user authenticated
    }

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.hideAuth = this.hideAuth.bind(this)
    this.processLogout = this.processLogout.bind(this)
    this.getSessionData = this.getSessionData.bind(this)
    this.processSession = this.processSession.bind(this)
  }

  /***
  *
  * Initialize the authentication modal if necessary
  *
  ***/

  componentDidMount() {
    const query = this.props.location.query
    if (query.token) this.setState({modal: 'validate'})
    if (query.resetPassword) this.setState({modal: 'reset-password'})

    this.getSessionData()
  }

  /***
  *
  * Show/hide the authentication modal
  *
  ***/

  login() {
    this.setState({modal: 'login'})
  }

  hideAuth() {
    this.setState({modal: null})
  }

  /***
  *
  * Fetch user authentication status from server
  *
  ***/

  getSessionData() {
    request
      .get(api.endpoint + 'session')
      .set('Accept', 'application/json')
      .end(this.processSession)
  }

  processSession(err, res) {
    if (err) console.warn(err)
    res.body.session.authenticated == true ?
        this.setState({authenticated: true})
      : this.setState({authenticated: false})
  }

  /***
  *
  * Handle logout
  *
  ***/

  logout() {
    request
      .get(api.endpoint + 'logout')
      .set('Accept', 'application/json')
      .end(this.processLogout)
  }

  processLogout(err, res) {
    err ? console.warn(err) : this.setState({authenticated: false})
  }

  /***
  *
  * Render
  *
  ***/

  render() {
    const modal = this.state.modal ?
        <Authenticate
          {...this.props}
          hideAuth={this.hideAuth}
          view={this.state.modal}
          getSessionData={this.getSessionData} />
      : null

    return (
      <div className='app-container'>
        <div className='app-wrapper'>
          <Header
            login={this.login}
            logout={this.logout}
            authenticated={this.state.authenticated} />
          <div className='app-content'>
            {modal}
            {this.props.children}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}