import React from "react";
import CircleButton from "./BuildingLightboxCircleButton";

export default class BuildingLightboxCircleButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="building-lightbox-circle-buttons">
        <div className="circle-container">
          {this.props.building.images.map((image, index) => {
            return <CircleButton {...this.props} key={index} index={index} />;
          })}
        </div>
      </div>
    );
  }
}
