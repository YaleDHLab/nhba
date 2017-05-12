import React from 'react'

export default class Footer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      style: {
        display: 'table'
      }
    }
  }

  componentWillUpdate() {
    if (window.location.pathname === '/admin') {
      if (this.state.style.display != 'table') {
        const style = {display: 'none'}
        this.setState({style, style})
      }
    }
  }

  render() {
    const logo = '/assets/images/dh-wordmark'

    return (
      <footer className='footer' style={this.state.style}>
        <object data={logo + '.svg'} type='image/svg+xml' className='dh-lab-logo'>
          <img src={logo + '.png'} className='logo' />
        </object>
      </footer>
    )
  }
}