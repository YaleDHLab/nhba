import React from 'react'
import BuildingLightboxCircles from './BuildingLightboxCircleButtons'

export default class BuildingLightbox extends React.Component {
  constructor(props) {
    super(props)
  }

  /**
  * Stop propagation of modal clicks
  **/

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const imageDir = '/assets/uploads/resized/large/',
        imageFile = this.props.building.images[this.props.imageIndex].filename,
        image = imageDir + imageFile;

    return (
      <div className='building-lightbox dark-modal-backdrop'
        onClick={this.props.closeLightbox}>
        <div className='modal'
          onClick={this.handleClick}>
          <div className='header'>
            <div className='brand modal-header-text'>New Haven Building Archive</div>
            <div className='close-text modal-header-text'
              onClick={this.props.closeLightbox}>
              <div className='close-icon'>&times;</div>
              Close
            </div>
          </div>
          <div className='body'>
            <img className='lightbox-image' src={image}></img>
            <div className='previous-image image-pagination-button'
              onClick={this.props.decrementImageIndex} />
            <div className='next-image image-pagination-button'
              onClick={this.props.incrementImageIndex} />
            <BuildingLightboxCircles {...this.props} />
          </div>
        </div>
      </div>
    )
  }
} 
