import React from 'react'
import Search from './Search'

export default class MobileSearch extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props)
    return (
      <div className='mobile-search'>
        <Search />
      </div>
    )
  }
} 
