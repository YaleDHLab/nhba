import React from 'react'

export default class Footer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <footer className='footer'>
        <img className='dh-lab-logo' src='/assets/images/dh-wordmark.png' />
      </footer>
    )
  }
}