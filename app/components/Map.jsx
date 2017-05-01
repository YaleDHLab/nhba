import { default as React, Component } from 'react'
import {  withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import _ from 'lodash';

const config = {
  map: {
    zoom: 15,
    location: {
      lat: 41.3075931,
      lng: -72.9278493
    },
  },

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

// given a buliding, find the index position of its first tour id
const getTourIdx = (building, tourIds) => {
  try {
    return tourIds.indexOf(building.tour_ids[0].toString());
  } catch(err) {
    return tourIdx = config.colors.length - 1;
  }
}

// fetch an icon to represent the current building
const getIcon = (building, tourIds) => {
  let tourIdx = getTourIdx(building, tourIds);
  let color = config.colors[tourIdx % config.colors.length - 1];

  color = color ? color : 'red';

  // set the icon colors
  let markerIcon = Object.assign({}, config.icon);
  markerIcon.strokeColor = color;
  markerIcon.fillColor = color;
  return markerIcon;
}

const MapComponent = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={config.map.zoom}
    defaultCenter={config.map.location}
    onZoomChanged={props.onZoomChanged}
  >
    {props.buildings.map((building, idx) => (
      <Marker
        icon={getIcon(building, props.tourIds)}
        key={idx}
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

    this.state = {
      markers: [{
        position: config.map.location,
        key: 'new-haven',
        defaultAnimation: 2,
      }]
    }

    this.handleZoom = this.handleZoom.bind(this)
  }

  /**
  * Resize markers on zoom
  **/

  handleZoom() {
    console.log('zoomed')
  }

  render() {
    return (
      <div className='map'>
        <div className='map-content'>
          <MapComponent
            containerElement={ <div style={styles.map} /> }
            mapElement={ <div style={styles.map} /> }
            onZoomChanged={this.handleZoom}
            buildings={this.props.buildings}
            tourIds={_.keys(this.props.tourIdToTitle)}
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