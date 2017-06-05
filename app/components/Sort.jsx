import React from 'react'

export default class Sort extends React.Component {
  render() {
    const proximity = this.props.userLocation ?
        <option value='proximity'>Proximity to me</option>
      : null;

    return (
      <select value={this.props.sort}
        onChange={this.props.updateSort}
        className='sortby custom-select'>
        <option disabled>Sort by</option>
        <option value='updated_at'>Last Updated</option>
        {proximity}
      </select>
    )
  }
} 
