import React from 'react'
import getBackgroundImageStyle from '../lib/getBackgroundImageStyle'

export default class BuildingGallery extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      imageIndex: 0
    }

    // pagination buttons for images
    this.decrementImageIndex = this.decrementImageIndex.bind(this)
    this.incrementImageIndex = this.incrementImageIndex.bind(this)

    // fetch style for images
    this.getStyle = this.getStyle.bind(this)
  }

  /**
  * Layout and style-related functions
  **/

  getStyle() {
    const images = this.props.building.images;
    if (images) {
      const dir = '/assets/uploads/resized/large/'
      const image = dir + images[this.state.imageIndex].filename;
      return getBackgroundImageStyle(image);
    }
  }

  incrementImageIndex() {
    const imageIndex = this.state.imageIndex;
    const newIndex = (imageIndex + 1) % this.props.building.images.length;
    this.setState({imageIndex: newIndex})
  }

  decrementImageIndex() {
    const imageIndex = this.state.imageIndex;
    const newIndex = imageIndex > 0 ?
        imageIndex-1
      : this.props.building.images.length-1;
    this.setState({imageIndex: newIndex})
  }

  render() {
    const caption = this.props.building.images &&
      this.props.building.images[this.state.imageIndex].caption ?
        <div className='image-caption'>
          {this.props.building.images[this.state.imageIndex].caption}
        </div>
      : null;

    const gallery = this.props.building.images &&
      this.props.building.images.length > 1 ?
        <div className='background-image' style={this.getStyle()}>
          <div className='image-index-button decrement'
          onClick={this.decrementImageIndex}/>
          <div className='image-index-button increment'
            onClick={this.incrementImageIndex}/>
          {caption}
        </div>
      : <div className='background-image' style={this.getStyle()}>
          {caption}
        </div>

    return (
      <div className='building-gallery'>
        {gallery}
      </div>
    )
  }
} 
