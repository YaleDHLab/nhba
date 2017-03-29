import React from 'react'
import Submissions from './Submissions'
import Search from './Search'
import Filters from '../../Filters'
import Cards from '../../Cards'
import Map from '../../Map'

export default class Index extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='index'>
        <div className='top-row'>
          <Submissions />
          <Search />
        </div>
        <div className='bottom-row'>
          <Filters />
          <Cards />
          <Map />
        </div>
      </div>
    )
  }
}
