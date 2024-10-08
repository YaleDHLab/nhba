import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

import Confirm from '../../Confirm';

const imageSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const imageTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveImage(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

@DropTarget('image', imageTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('image', imageSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class ImageGridItem extends React.Component {
  constructor(props) {
    super(props);

    this.getStyle = this.getStyle.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.selectFileToRecaption = this.selectFileToRecaption.bind(this);
  }

  getStyle(image) {
    return {
      backgroundImage: `url(${image})`
    };
  }

  deleteImage(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.deleteImage(this.props.index);
  }

  selectFileToRecaption() {
    this.props.selectFileToRecaption(this.props.index);
  }

  render() {
    const { connectDragSource, connectDropTarget } = this.props;

    const deleteButton = this.props.hideDeleteButton ?
      <div></div> : 
      <div className="grid-item-delete-button">
          <div className="grid-item-delete-icon" />
      </div>;

    return connectDragSource(
      connectDropTarget(
        <div className="image-grid-item" onClick={this.selectFileToRecaption}>
          <Confirm
            title="Confirm Delete"
            bodyText="Are you sure you want to delete this image?"
            confirmText="Delete"
            onConfirm={this.deleteImage}
          >
            {deleteButton}
          </Confirm>
          <div
            className="grid-item background-image"
            style={this.getStyle(this.props.image)}
          />
        </div>
      )
    );
  }
}
