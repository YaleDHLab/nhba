import React from 'react'

export default class Footer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const logo = '/assets/images/dh-wordmark'

    return (
      <footer className='footer'>
        <object data={logo + '.svg'} type='image/svg+xml' className='dh-lab-logo'>
          <img src={logo + '.png'} className='logo' />
        </object>
      </footer>
    )
  }
}