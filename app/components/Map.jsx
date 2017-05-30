import { default as React, Component } from 'react'
import {  withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { browserHistory } from 'react-router';
import _ from 'lodash';

const config = {
  icon: {
    path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.5,
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

const handleMarkerClick = (building) => {
  const buildingId = building._id;
  browserHistory.push('/building?id=' + buildingId);
}

const MapComponent = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={props.mapConfig.zoom}
    center={props.mapConfig.location}
    defaultCenter={props.mapConfig.location}
    defaultOptions={{
      scrollwheel: false,
    }}
  >
    {props.buildings.map((building, idx) => (
      <Marker
        icon={getIcon(building, props.tourIdToIndex)}
        key={idx}
        onClick={() => {handleMarkerClick(building)}}
        position={{
          lat: parseFloat(building.latitude),
          lng: parseFloat(building.longitude)
        }} />
    ))}
  </GoogleMap>
));

export default class MapContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const initialLocation = this.props.initialLocation;

    const defaultLocation = {
      lat: 41.3075931,
      lng: -72.9278493
    }

    const mapConfig = {
      zoom: 15,
      location: initialLocation ? initialLocation : defaultLocation
    }

    return (
      <div className='map'>
        <div className='map-content'>
          <MapComponent
            containerElement={ <div style={styles.map} /> }
            mapElement={ <div style={styles.map} /> }
            buildings={this.props.buildings}
            tourIdToIndex={this.props.tourIdToIndex}
            mapConfig={mapConfig}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  map: {
    height: '100%',
    width: '100%'
  }
}