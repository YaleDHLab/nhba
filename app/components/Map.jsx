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
    fillColor: '#FF0000',
    strokeColor: '#ff7b00',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#ff7b00',
    fillOpacity: 0.5,
    scale: 0.3
  }
}

const MapComponent = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={config.map.zoom}
    defaultCenter={config.map.location}
    onZoomChanged={props.onZoomChanged}
  >
    {props.buildings.map((building, idx) => (
      <Marker
        icon={config.icon}
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
      }],
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