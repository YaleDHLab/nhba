import React from 'react'
import { Link } from 'react-router'

export default class ViewAddBuildings extends React.Component {

  render() {
    return (
      <div className='view-add-buildings'>
        <div className='darker-shade' />
        <div className='right-container'>
          <h1>View Buildings</h1>
          <div className='admin-search-container'>
            <div className='admin-search-content'>
              <input className='admin-search building-search' placeholder='Search'></input>
              <div className='admin-search-button'/>
            </div>
          </div>
          <Link to='/admin/form'>
            <div className='white-button add-a-building'>Add a Building</div>
          </Link>
        </div>
      </div>
    )
  }
} 
