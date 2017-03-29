import { default as React, Component } from 'react'
import {  withGoogleMap, GoogleMap, Circle } from 'react-google-maps';
import _ from 'lodash';

const config = {
  map: {
    zoom: 15,
    location: {
      lat: 41.3075931,
      lng: -72.9278493
    },
  },
  circle: {
    strokeColor: '#ff7b00',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#ff7b00',
    fillOpacity: 0.35,
  }
}

const MapComponent = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={config.map.zoom}
    defaultCenter={config.map.location}
    onClick={props.onMapClick}
  >
    {props.markers.map(marker => (
      <Circle {...marker}
        center={marker.position}
        radius={30}
        options={config.circle}
        onRightClick={() => props.onMarkerRightClick(marker)} />
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

    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
  }

  handleMapLoad(map) {

  }

  /***
  * Append a new marker to the state onclick
  ***/

  handleMapClick(event) {
    const nextMarkers = [
      ...this.state.markers,
      {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now(),
      },
    ];
    this.setState({markers: nextMarkers});
  }

  /***
  * Remove a marker on rightclick
  ***/

  handleMarkerRightClick(targetMarker) {
    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({markers: nextMarkers});
  }

  render() {
    return (
      <div className='map'>
        <div className='map-content'>
          <MapComponent
            containerElement={ <div style={styles.map} /> }
            mapElement={ <div style={styles.map} /> }
            onMapLoad={this.handleMapLoad}
            onMapClick={this.handleMapClick}
            markers={this.state.markers}
            onMarkerRightClick={this.handleMarkerRightClick}
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