import React from 'react'
import { browserHistory } from 'react-router'
import MobileFooterIcon from './MobileFooterIcon'

export default class MobileFooter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentRoute: 'search'
    }

    this.toggleView = this.toggleView.bind(this)
    this.showAuth = this.showAuth.bind(this)
    this.showSearch = this.showSearch.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location != this.props.location) {
      let route = this.props.location.pathname;
      route = route[0] === '/' && route.length > 1 ? route.substring(1) : route;
      this.toggleView(route)
    }
  }

  toggleView(currentRoute) {
    this.setState({currentRoute: currentRoute})

    const elems = [
      {
        elem: document.querySelectorAll('.building'),
        route: 'building'
      },
      {
        elem: document.querySelectorAll('.map'),
        route: '/'
      },
      {
        elem: document.querySelectorAll('.cards'),
        route: 'cards'
      },
    ]

    elems.map((d) => {
      if (d.elem) {
        for (var i=0; i<d.elem.length; i++) {
          const e = d.elem[i];
          if (d.route !== currentRoute) {
            e.style.display = 'none'
          } else {
            e.style.display = 'block'
          }
        }
      }
    })
  }

  showAuth() {
    const route = window.location.pathname.substring(1);
    const queryParam = window.location.search ? 
        window.location.search + '&login=true'
      : '?login=true';
    browserHistory.push(route + queryParam);
  }

  showSearch() {
    browserHistory.push('/');
  }

  showCards() {
    browserHistory.push('/cards');
  }

  render() {
    return (
      <div className='mobile-footer'>
        <div className='mobile-footer-icon-container'>
          <MobileFooterIcon {...this.state}
            filename='icon-map'
            label='Map'
            route='/'
            handleClick={this.showSearch} />
          <MobileFooterIcon {...this.state}
            filename='icon-list'
            label='List'
            route='cards'
            handleClick={this.showCards} />
          <MobileFooterIcon {...this.state}
            filename='icon-login'
            label='Login'
            route='auth'
            handleClick={this.showAuth} />
        </div>
      </div>
    )
  }
} 
