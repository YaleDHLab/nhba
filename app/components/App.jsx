import React from 'react';
import Header from './Header';
import MobileFooter from './MobileFooter';
import Authenticate from './auth/Authenticate';
import MobileSearch from './MobileSearch';
import Shield from './Shield';
import request from 'superagent';
import api from '../../config';

export default class AppWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: null, // {'login','validate','reset-password'}
      authenticated: false, // {true, false} is the user authenticated
      lastquery: null, // the last observed query params
      isMobile: false,
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.hideAuth = this.hideAuth.bind(this);
    this.checkForAuth = this.checkForAuth.bind(this);
    this.processAuth = this.processAuth.bind(this);
    this.processLogout = this.processLogout.bind(this);
    this.getSessionData = this.getSessionData.bind(this);
    this.processSession = this.processSession.bind(this);
    this.checkWidth = this.checkWidth.bind(this);
  }

  /**
   * Initialize the authentication modal if necessary
   **/

  componentDidMount() {
    this.checkForAuth();
    window.addEventListener('resize', this.checkWidth);
    this.checkWidth();
  }

  componentDidUpdate() {
    this.checkForAuth();
  }

  checkWidth() {
    if (window.innerWidth < 1150 && this.state.isMobile === false) {
      this.setState({ isMobile: true });
    } else if (window.innerWidth >= 1150 && this.state.isMobile === true) {
      this.setState({ isMobile: false });
    }
  }

  /**
   * Check to see if we need to run an authentication prompt
   **/

  checkForAuth() {
    const query = this.props.location.query;
    if (query !== this.state.lastquery) {
      this.setState({ lastquery: query });
      this.processAuth(query);
    }
  }

  /**
   * Main method for processing authentication updates
   **/

  processAuth(query) {
    if (query.login && query.login === 'true') {
      this.setState({ modal: 'login' });
    }
    if (query.token) {
      this.setState({ modal: 'validate' });
    }
    if (query.resetPassword) {
      this.setState({ modal: 'reset-password' });
    }
    if (query.authenticated && query.authenticated === 'false') {
      this.setState({ modal: 'unauthorized' });
    }
    this.getSessionData();
  }

  /**
   * Show/hide the authentication modal
   **/

  login() {
    this.setState({ modal: 'login' });
  }

  hideAuth() {
    this.setState({ modal: null });
  }

  /**
   * Fetch user authentication status from server
   **/

  getSessionData() {
    request
      .get(api.endpoint + 'session')
      .set('Accept', 'application/json')
      .end(this.processSession);
  }

  processSession(err, res) {
    if (err) console.warn(err);
    this.setState({
      admin: res.body.session.admin,
      authenticated: res.body.session.authenticated,
      session: res.body.session,
    });
  }

  /**
   * Handle logout
   **/

  logout() {
    request
      .get(api.endpoint + 'logout')
      .set('Accept', 'application/json')
      .end(this.processLogout);
  }

  processLogout(err) {
    err ? console.warn(err) : this.setState({ authenticated: false });
  }

  /**
   * Render
   **/

  render() {
    const isMobile = this.state.isMobile;
    const isBuilding = this.props.location.pathname.includes('building');
    var child = React.Children.only(this.props.children);
    var content = React.cloneElement(child, {
      admin: this.state.admin,
      authenticated: this.state.authenticated,
    });

    const modal = this.state.modal ? (
      <Authenticate
        {...this.props}
        hideAuth={this.hideAuth}
        view={this.state.modal}
        getSessionData={this.getSessionData}
      />
    ) : null;

    const routeView =
      isMobile && !isBuilding ? <MobileSearch {...this.props} /> : content;

    const footer = isMobile ? (
      <MobileFooter location={this.props.location} />
    ) : (
      <Shield />
    );

    return (
      <div className="app-container">
        <div className="app-wrapper">
          <Header
            login={this.login}
            logout={this.logout}
            authenticated={this.state.authenticated}
          />
          <div className="app-content">
            {modal}
            {routeView}
          </div>
        </div>
        {footer}
      </div>
    );
  }
}
