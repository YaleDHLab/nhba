import React from 'react'
import { browserHistory } from 'react-router'
import MobileIcon from './MobileIcon'

export default class MobileIcons extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: 'Map'
    }

    this.toggleView = this.toggleView.bind(this)
    this.handleAuth = this.handleAuth.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  toggleView(label) {
    this.setState({view: label})

    const elems = [
      {
        elem: document.querySelectorAll('.building'),
        label: 'Building'
      },
      {
        elem: document.querySelectorAll('.map'),
        label: 'Map'
      },
      {
        elem: document.querySelectorAll('.cards'),
        label: 'List'
      },
    ]

    elems.map((d) => {
      if (d.elem) {
        d.elem.forEach((e) => {
          if (d.label !== label) {
            e.style.display = 'none'
          } else {
            e.style.display = 'block'
          }
        })
      }
    })
  }

  handleAuth(label) {
    const route = window.location.pathname.substring(1);
    const queryParam = window.location.search ? 
        window.location.search + '&login=true'
      : '?login=true';
    browserHistory.push(route + queryParam);
  }

  handleSearch(label) {
    if (window.location.pathname.substring(1) !== 'search') {
      browserHistory.push('/search')
    }
    this.toggleView(label)
  }

  render() {
    return (
      <div className='mobile-icons'>
        <div className='mobile-icon-container'>
          <MobileIcon {...this.state}
            filename='icon-map'
            label='Map'
            handleClick={this.handleSearch} />
          <MobileIcon {...this.state}
            filename='icon-list'
            label='List'
            handleClick={this.handleSearch} />
          <MobileIcon {...this.state}
            filename='icon-login'
            label='Login'
            handleClick={this.handleAuth} />
        </div>
      </div>
    )
  }
} 
