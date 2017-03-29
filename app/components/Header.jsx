import React from 'react'
import { Link } from 'react-router'

export default class Header extends React.Component {
  constructor(props) {
    super(props)

    this.showAuth = this.showAuth.bind(this)
  }

  showAuth() {
    this.props.showAuth()
  }

  render() {
    return (
      <header className='header'>
        <div className='logo-container'>
          <Link to='/#' className='app-name'>
            <img className='logo' src={'/assets/images/NHBA-logo.png'} />
          </Link>
        </div>
        <div className='links'>
          <Link to='/about'>About</Link>
          <Link to='/glossary'>Glossary</Link>
          <Link to='/contact'>Contact</Link>
          <a href='#login' onClick={this.showAuth}>Login</a>
        </div>
      </header>
    )
  }
}