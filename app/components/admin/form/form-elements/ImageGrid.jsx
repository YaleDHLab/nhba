import React from "react";
import request from "superagent";
import update from "react/lib/update";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import ImageGridItem from "./ImageGridItem";
import _ from "lodash";

@DragDropContext(HTML5Backend)
export default class ImageGrid extends React.Component {
  constructor(props) {
    super(props);

    this.moveImage = this.moveImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  moveImage(dragIndex, hoverIndex) {
    const images = this.props.building.images;
    let shuffledImages = Object.assign([], images);
    shuffledImages[dragIndex] = images[hoverIndex];
    shuffledImages[hoverIndex] = images[dragIndex];

    this.props.replaceField("images", shuffledImages);
  }

  deleteImage(imageIndex) {
    const images = this.props.building.images;
    const newImages = _.filter(images, (img, idx) => idx != imageIndex);
    this.props.replaceField("images", newImages);
  }

  render() {
    return (
      <div className="image-grid">
        <div className="label">{this.props.label}</div>
        <div className="image-grid-content">
          {this.props.building.images.map((image, i) => {
            return (
              <ImageGridItem
                key={image.filename}
                index={i}
                id={image.filename}
                image={"/assets/uploads/resized/small/" + image.filename}
                moveImage={this.moveImage}
                selectFileToRecaption={this.props.selectFileToRecaption}
                deleteImage={this.deleteImage}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
