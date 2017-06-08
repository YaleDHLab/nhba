import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Authenticate from './auth/Authenticate'
import request from 'superagent'
import api from '../../config'
import MobileSearch from './MobileSearch'
import _ from 'lodash'

export default class AppWrapper extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: null,          // {'login','validate','reset-password'}
      authenticated: false, // {true, false} is the user authenticated
      lastquery: null,      // the last observed query params
      innerWidth: Infinity // the width of the client device
    }

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.hideAuth = this.hideAuth.bind(this)
    this.checkForAuth = this.checkForAuth.bind(this)
    this.processAuth = this.processAuth.bind(this)
    this.processLogout = this.processLogout.bind(this)
    this.getSessionData = this.getSessionData.bind(this)
    this.processSession = this.processSession.bind(this)
    this.updateWidth = this.updateWidth.bind(this)
  }

  /**
  * Initialize the authentication modal if necessary
  **/

  componentDidMount() {
    this.updateWidth();
    this.checkForAuth();
    window.addEventListener('resize', this.updateWidth);
  }

  componentDidUpdate() {
    this.checkForAuth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }

  /**
  * Check to see if we need to run an authentication prompt
  **/

  checkForAuth() {
    const query = this.props.location.query;
    if (query !== this.state.lastquery) {
      this.setState({lastquery: query})
      this.processAuth(query);
    }
  }

  /**
  * Main method for processing authentication updates
  **/

  processAuth(query) {
    if (query.login && query.login === 'true') {
      this.setState({modal: 'login'})
    }
    if (query.token) {
      this.setState({modal: 'validate'})
    }
    if (query.resetPassword) {
      this.setState({modal: 'reset-password'})
    }
    if (query.authenticated && query.authenticated === 'false') {
      this.setState({modal: 'unauthorized'})
    }
    this.getSessionData()
  }

  /**
  * Show/hide the authentication modal
  **/

  login() {
    this.setState({modal: 'login'})
  }

  hideAuth() {
    this.setState({modal: null})
  }

  /**
  * Fetch user authentication status from server
  **/

  getSessionData() {
    request
      .get(api.endpoint + 'session')
      .set('Accept', 'application/json')
      .end(this.processSession)
  }

  processSession(err, res) {
    if (err) console.warn(err)
    res.body.session.authenticated == true ?
        this.setState({authenticated: true, session: res.body.session})
      : this.setState({authenticated: false, session: res.body.session})
  }

  /**
  * Handle logout
  **/

  logout() {
    request
      .get(api.endpoint + 'logout')
      .set('Accept', 'application/json')
      .end(this.processLogout)
  }

  processLogout(err, res) {
    err ? console.warn(err) : this.setState({authenticated: false})
  }

  /**
  * Check the device width
  **/

  updateWidth() {
    this.setState({innerWidth: window.innerWidth});
  }

  /**
  * Render
  **/

  render() {
    const modal = this.state.modal ?
        <Authenticate
          {...this.props}
          hideAuth={this.hideAuth}
          view={this.state.modal}
          getSessionData={this.getSessionData} />
      : null

    const isMobile = window.innerWidth < 1150,
        isBuilding = this.props.location.pathname.includes('building'),
        routeView = isMobile && !isBuilding ?
          <MobileSearch {...this.props} />
        : this.props.children;

    return (
      <div className='app-container'>
        <div className='app-wrapper'>
          <Header
            login={this.login}
            logout={this.logout}
            authenticated={this.state.authenticated} />
          <div className='app-content'>
            {modal}
            {routeView}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}