import React from 'react'
import { browserHistory } from 'react-router';
import { Marker } from 'react-google-maps'

const config = {
  icon: {
    path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.7,
    scale: 0.3
  },

  colors: [ // d3.category20 scale
    '#1f77b4',
    '#aec7e8',
    '#ff7f0e',
    '#ffbb78',
    '#2ca02c',
    '#98df8a',
    '#d62728',
    '#ff9896',
    '#9467bd',
    '#c5b0d5',
    '#8c564b',
    '#c49c94',
    '#e377c2'
  ]
}

const handleMarkerClick = (building) => {
  browserHistory.push('/building?id=' + building._id);
}

// fetch an icon to represent the current building
const getIcon = (building, tourIdToIndex) => {
  const tourId = building.tour_ids && building.tour_ids.length ?
      building.tour_ids[0].toString()
    : (config.colors.length - 1).toString();

  const tourIndex = tourIdToIndex[tourId];
  let color = config.colors[tourIndex % config.colors.length - 1];

  color = color ? color : 'red';

  // set the icon colors
  let markerIcon = Object.assign({}, config.icon);
  markerIcon.strokeColor = color;
  markerIcon.fillColor = color;
  return markerIcon;
}

export default class BuildingCircle extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Marker
        icon={getIcon(this.props.building, this.props.tourIdToIndex)}
        onMouseOver={this.props.handleMouseOver}
        onMouseOut={this.props.handleMouseOut}
        onClick={() => {handleMarkerClick(this.props.building)}}
        position={{
          lat: this.props.lat,
          lng: this.props.lng
        }} />
    )
  }
} 
