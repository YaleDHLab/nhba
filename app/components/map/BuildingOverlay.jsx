import React from 'react'
import getBackgroundImageStyle from '../lib/getBackgroundImageStyle'
import { OverlayView } from 'react-google-maps'

const centerOverlay = (width, height) => {
  return { x: -(width / 2), y: -height - 20 };
}

const getBuildingTitle = (building) => {
  let title = 'New Haven Building';
  if (building.address) title = building.address;
  if (building.building_name) title = building.building_name;
  return title;
}

const getBuildingImage = (building) => {
  const imageDir = '/assets/uploads/resized/medium/';
  const buildingImage = building.images && building.images.length ?
      imageDir + building.images[0].filename
    : 'http://via.placeholder.com/400x400';
  return getBackgroundImageStyle(buildingImage);
}

export default class BuildingOverlay extends React.Component {
  render() {
    return (
      <OverlayView
        key={Math.random()}

        position={{
          lat: this.props.lat,
          lng: this.props.lng
        }}

        // render the marker to a mouse-accessible layer of the map
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        defaultMapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}

        // center the marker overlay over the marker
        getPixelPositionOffset={centerOverlay}>

        <div className='marker-overlay'>
          <div className='building-image' style={getBuildingImage(this.props.building)} />
          <h2 className='building-title'>
            {getBuildingTitle(this.props.building)}
          </h2>
        </div>
      </OverlayView>
    )
  }
} 
