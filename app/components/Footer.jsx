import React from 'react'
import MobileFooter from './MobileFooter'

export default class Footer extends React.Component {

  render() {
    const logo = '/assets/images/dh-wordmark'
    const className = window.location.pathname === '/admin' ?
        'footer hidden'
      : 'footer'

    const mobileFooter = window.innerWidth < 1150 ?
        <MobileFooter location={this.props.location} />
      : null;

    return (
      <footer className={className}>
        <object data={logo + '.svg'} type='image/svg+xml' className='dh-lab-logo'>
          <img src={logo + '.png'} className='logo' />
        </object>
        {mobileFooter}
      </footer>
    )
  }
}