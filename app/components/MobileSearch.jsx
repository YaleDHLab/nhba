import React from 'react'
import Search from './Search'

export default class MobileSearch extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='mobile-search'>
        <Search />
      </div>
    )
  }
} 
