import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';

import ImageGridItem from './ImageGridItem';

@DragDropContext(HTML5Backend)
export default class ImageGrid extends React.Component {
  constructor(props) {
    super(props);

    this.moveImage = this.moveImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  moveImage(dragIndex, hoverIndex) {
    const { images } = this.props.building;
    const shuffledImages = Object.assign([], images);
    shuffledImages[dragIndex] = images[hoverIndex];
    shuffledImages[hoverIndex] = images[dragIndex];

    this.props.replaceField('images', shuffledImages);
  }

  deleteImage(imageIndex) {
    const { images } = this.props.building;
    const newImages = _.filter(images, (img, idx) => idx !== imageIndex);
    this.props.replaceField('images', newImages);
  }

  render() {
    return (
      <div className="image-grid">
        <div className="label">{this.props.label}</div>
        <div className="image-grid-content">
          {this.props.images.map((image, i) => (
            <ImageGridItem
              key={image.filename}
              index={i}
              id={image.filename}
              image={`/assets/uploads/resized/small/${image.filename}`}
              moveImage={this.moveImage}
              selectFileToRecaption={this.props.selectFileToRecaption}
              deleteImage={this.props.deleteImage ? this.props.deleteImage : this.deleteImage}
              hideDeleteButton={this.props.hideDeleteButton ? true : false}
            />
          ))}
        </div>
      </div>
    );
  }
}
