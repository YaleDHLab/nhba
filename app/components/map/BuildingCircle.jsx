import React from 'react';
import { browserHistory } from 'react-router';
import { Marker } from 'react-google-maps';

const config = {
  icon: {
    path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.7,
    scale: 0.3,
  },

  colors: [
    // d3.category20b scale
    '#393b79',
    '#5254a3',
    '#6b6ecf',
    '#9c9ede',
    '#637939',
    '#8ca252',
    '#b5cf6b',
    '#cedb9c',
    '#8c6d31',
    '#bd9e39',
    '#e6550d',
    '#fd8d3c',
    '#fdae6b',
    '#fdd0a2',
    '#e7ba52',
    '#e7cb94',
    '#843c39',
    '#ad494a',
    '#d6616b',
    '#e7969c',
  ],
};

const handleMarkerClick = building => {
  browserHistory.push('/building?id=' + building._id);
};

// fetch an icon to represent the current building
const getIcon = (building, tourNameToIndex) => {
  if (!tourNameToIndex) return;

  const tourIndex =
    building.tours && building.tours.length
      ? tourNameToIndex[building.tours[0]]
      : config.colors.length - 1;

  let color = config.colors[tourIndex % config.colors.length - 1];
  color = color ? color : '#a55194';

  // set the icon colors
  let markerIcon = Object.assign({}, config.icon);
  markerIcon.strokeColor = color;
  markerIcon.fillColor = color;
  return markerIcon;
};

export default class BuildingCircle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Marker
        icon={getIcon(this.props.building, this.props.tourNameToIndex)}
        onMouseOver={this.props.handleMouseOver}
        onMouseOut={this.props.handleMouseOut}
        onClick={() => {
          handleMarkerClick(this.props.building);
        }}
        position={{
          lat: this.props.lat,
          lng: this.props.lng,
        }}
      />
    );
  }
}
