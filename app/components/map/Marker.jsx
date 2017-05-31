import React from 'react'
import BuildingOverlay from './BuildingOverlay'
import BuildingCircle from './BuildingCircle'

export default class MapMarker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hovered: false
    }

    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  handleMouseOver() {
    this.setState({hovered: true})
  }

  handleMouseOut() {
    this.setState({hovered: false})
  }

  render() {
    const overlay = this.state.hovered ?
        <BuildingOverlay
          lat={this.props.lat}
          lng={this.props.lng}
          building={this.props.building} />        
      : null;

    return (
      <div className='marker-container'>
        <BuildingCircle
          lat={this.props.lat}
          lng={this.props.lng}
          building={this.props.building}
          handleMouseOver={this.handleMouseOver}
          handleMouseOut={this.handleMouseOut}
          tourIdToIndex={this.props.tourIdToIndex} />
        {overlay}
      </div>
    )
  }
} 
