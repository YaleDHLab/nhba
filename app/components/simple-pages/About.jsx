import React from 'react'
import SimplePage from './SimplePage'

export default class About extends React.Component {
  render() {

    let page = {
      image: '/assets/images/new-haven-hospital-1911.jpg',
      title: 'About',
      route: 'about',
      flat: true
    }

    return (
      <div className='about'>
        <SimplePage {...page} />
      </div>
    )
  }
}