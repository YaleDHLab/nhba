import React from 'react';
import { browserHistory } from 'react-router';
import MobileFooterIcon from './MobileFooterIcon';

export default class MobileFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRoute: 'search',
    };

    this.toggleView = this.toggleView.bind(this);
    this.showAuth = this.showAuth.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location != this.props.location) {
      let route = this.props.location.pathname;
      route = route[0] === '/' && route.length > 1 ? route.substring(1) : route;
      this.toggleView(route);
    }
  }

  toggleView(currentRoute) {
    this.setState({ currentRoute: currentRoute });

    const elems = [
      {
        elem: document.querySelectorAll('.building'),
        route: 'building',
      },
      {
        elem: document.querySelectorAll('.map'),
        route: '/',
      },
      {
        elem: document.querySelectorAll('.cards'),
        route: 'cards',
      },
    ];

    elems.map(d => {
      if (d.elem) {
        for (var i = 0; i < d.elem.length; i++) {
          d.elem[i].style.display = d.route !== currentRoute ? 'none' : 'block';
        }
      }
    });
  }

  showAuth() {
    const location = Object.assign({}, window.location);
    const route = location.pathname.substring(1);
    if (location.search.includes('login')) {
      browserHistory.push(route + location.search);
    } else {
      if (location.search.length) {
        browserHistory.push('&login=true');
      } else {
        browserHistory.push('?login=true');
      }
    }
  }

  render() {
    return (
      <div className="mobile-footer">
        <div className="mobile-footer-icon-container">
          <MobileFooterIcon
            {...this.state}
            filename="icon-map"
            label="Map"
            route="/"
            handleClick={() => {
              browserHistory.push('/');
            }}
          />
          <MobileFooterIcon
            {...this.state}
            filename="icon-list"
            label="List"
            route="cards"
            handleClick={() => {
              browserHistory.push('/cards');
            }}
          />
          <MobileFooterIcon
            {...this.state}
            filename="icon-login"
            label="Login"
            route="auth"
            handleClick={this.showAuth}
          />
        </div>
      </div>
    );
  }
}
