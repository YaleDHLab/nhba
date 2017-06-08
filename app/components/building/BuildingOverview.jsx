import React from 'react'
import getNewlineMarkup from '../lib/getNewlineMarkup'

export default class BuildingOverview extends React.Component {
  render() {
    return this.props.building ?
      <div className='building-overview'>
        <h2>Overview</h2>
        <p dangerouslySetInnerHTML={
          getNewlineMarkup(this.props.building.overview_description)
        } />
      </div>
    : <span/>
  }
} 
