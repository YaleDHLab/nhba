import React from 'react'
import Lightbox from './BuildingLightbox'
import getBackgroundImageStyle from '../lib/getBackgroundImageStyle'

export default class BuildingGallery extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      imageIndex: 0,
      showLightbox: false
    }

    // pagination buttons for images
    this.decrementImageIndex = this.decrementImageIndex.bind(this)
    this.incrementImageIndex = this.incrementImageIndex.bind(this)
    this.setImageIndex = this.setImageIndex.bind(this)

    // fetch style for images
    this.getStyle = this.getStyle.bind(this)

    // show/hide the lightbox
    this.toggleLightbox = this.toggleLightbox.bind(this)
    this.closeLightbox = this.closeLightbox.bind(this)
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

  /**
  * Paginate through images
  **/

  incrementImageIndex(e) {
    e.preventDefault();
    e.stopPropagation();
    const imageIndex = this.state.imageIndex;
    const newIndex = (imageIndex + 1) % this.props.building.images.length;
    this.setState({imageIndex: newIndex})
  }

  decrementImageIndex(e) {
    e.preventDefault();
    e.stopPropagation();
    const imageIndex = this.state.imageIndex;
    const newIndex = imageIndex > 0 ?
        imageIndex-1
      : this.props.building.images.length-1;
    this.setState({imageIndex: newIndex})
  }

  setImageIndex(idx) {
    this.setState({imageIndex: idx})
  }

  /**
  * Show/hide the lightbox
  **/

  toggleLightbox() {
    const lightbox = this.state.showLightbox;
    this.setState({showLightbox: !lightbox})
  }

  closeLightbox() {
    this.setState({showLightbox: false})
  }

  /**
  * Render
  **/

  render() {
    const caption = this.props.building.images &&
      this.props.building.images[this.state.imageIndex].caption ?
        <div className='image-caption'>
          {this.props.building.images[this.state.imageIndex].caption}
        </div>
      : null;

    const gallery = this.props.building.images &&
      this.props.building.images.length > 1 ?
        <div className='background-image'
          style={this.getStyle()}
          onClick={this.toggleLightbox}>
          <div className='image-index-button decrement'
          onClick={this.decrementImageIndex}/>
          <div className='image-index-button increment'
            onClick={this.incrementImageIndex}/>
          {caption}
        </div>
      : <div className='background-image'
          style={this.getStyle()}
          onClick={this.toggleLightbox}>
          {caption}
        </div>

    const lightbox = this.state.showLightbox ?
        <Lightbox
          building={this.props.building}
          closeLightbox={this.closeLightbox}
          imageIndex={this.state.imageIndex}
          incrementImageIndex={this.incrementImageIndex}
          decrementImageIndex={this.decrementImageIndex}
          setImageIndex={this.setImageIndex} />
      : null;

    return (
      <div className='building-gallery'>
        {gallery}
        {lightbox}
      </div>
    )
  }
} 
