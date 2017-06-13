import React from 'react'
import { Link } from 'react-router'

export default class Header extends React.Component {
  constructor(props) {
    super(props)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  login() {
    this.props.login()
  }

  logout() {
    this.props.logout()
  }

  render() {
    const logo = '/assets/images/NHBA-logo'
    const link = this.props.authenticated ?
        <a href='#logout' onClick={this.logout}>Log out</a>
      : <a href='#login' onClick={this.login}>Login</a>

    return (
      <header className='header'>
        <a href='/' className='app-name'>
          NEW HAVEN BUILDING ARCHIVE
        </a>
        <div className='links'>
          <Link to='/about'>About</Link>
          <Link to='/glossary'>Glossary</Link>
          <Link to='/contact'>Contact</Link>

          {/* Use a tag to trigger server request & auth check */}
          <a href='/admin'>Admin</a>
          {link}
        </div>
      </header>
    )
  }
}