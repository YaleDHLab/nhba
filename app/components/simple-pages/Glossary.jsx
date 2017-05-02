import React from 'react'
import SimplePage from './SimplePage'

export default class Glossary extends React.Component {
  render() {

    let page = {
      image: '/assets/images/jeffrey-kerekes.jpg',
      title: 'Glossary',
      route: 'glossary',
      flat: false
    }

    return (
      <div className='glossary'>
        <SimplePage {...page} />
      </div>
    )
  }
}