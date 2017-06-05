import React from 'react'
import getNewlineMarkup from '../lib/getNewlineMarkup'

export default class BuildingOverview extends React.Component {
  render() {
    return this.props.building ?
      <div className='building-overview'>
        <h1>Overview</h1>
        <p dangerouslySetInnerHTML={
          getNewlineMarkup(this.props.building.overview_description)
        } />
      </div>
    : <span/>
  }
} 
