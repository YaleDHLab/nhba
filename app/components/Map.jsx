import { default as React, Component } from 'react'
import {  withGoogleMap, GoogleMap } from 'react-google-maps'
import UserMarker from './map/UserMarker'
import MapMarker from './map/Marker'
import _ from 'lodash'
import MapStyles from './map/MapStyles'

const MapComponent = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={props.mapConfig.zoom}
    center={props.mapConfig.location}
    ref={props.onMapMounted}
    onIdle={props.onIdle}
    defaultOptions={{
      scrollwheel: false,
      styles: MapStyles
    }}>

    <UserMarker userLocation={props.userLocation} />

    {props.buildings.map((building, idx) => {
      const lat = parseFloat(building.latitude);
      const lng = parseFloat(building.longitude);

      return (
        <MapMarker {...props}
          building={building}
          key={idx}
          lat={lat}
          lng={lng}
        />
      )
    })}
  </GoogleMap>
))

const styles = {
  map: {
    height: '100%',
    width: '100%'
  }
}

export default class MapContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hoveredBuildingId: null,
      location: {
        lat: 41.3075931,
        lng: -72.9278493
      }
    }

    this.handleMapMounted = this.handleMapMounted.bind(this)
    this.updateCenter = this.updateCenter.bind(this)
  }

  handleMapMounted(map) {
    this._map = map;
  }

  updateCenter() {
    const center = this._map.getCenter();
    this.setState({
      location: {
        lat: center.lat(),
        lng: center.lng()
      }
    })
  }

  render() {
    const initialLocation = this.props.initialLocation;
    const mapConfig = {
      zoom: 15,
      location: initialLocation ? initialLocation : this.state.location
    };

    return (
      <div className='map'>
        <div className='map-content'>
          <MapComponent
            containerElement={ <div style={styles.map} /> }
            mapElement={ <div style={styles.map} /> }
            buildings={this.props.buildings}
            tourNameToIndex={this.props.tourNameToIndex}
            mapConfig={mapConfig}
            userLocation={this.props.userLocation}
            onMapMounted={this.handleMapMounted}
            onIdle={this.updateCenter}
          />
        </div>
      </div>
    );
  }
}