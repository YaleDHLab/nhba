import React from 'react';
import { OverlayView } from 'react-google-maps';

const centerOverlay = (width, height) => ({
  x: width / 2 - 9,
  y: height / 2 - 9
});

export default class UserMarker extends React.Component {
  render() {
    const marker = this.props.userLocation ? (
      <OverlayView
        key={Math.random()}
        position={{
          lat: this.props.userLocation.latitude,
          lng: this.props.userLocation.longitude
        }}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={centerOverlay}
      >
        <div className="user-marker-container">
          <div className="user-marker-circle">
            <div className="user-marker-ripple" />
          </div>
        </div>
      </OverlayView>
    ) : null;

    return <div className="user-marker">{marker}</div>;
  }
}
