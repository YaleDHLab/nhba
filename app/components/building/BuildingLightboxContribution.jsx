import React from 'react';

export default class BuildingLightboxContribution extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Stop propagation of modal clicks
   * */
   
  handleClick(e) {
    if (!e.target.className === 'lightbox-image') {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    return (
      <div
        className="building-lightbox dark-modal-backdrop"
        onClick={this.props.closeLightbox}
      >
        <div className="modal" onClick={this.handleClick}>
          <div className="header">
            <div className="brand modal-header-text">
              Contribute to Multimedia Gallery
            </div>
            <div
              className="close-text modal-header-text"
              onClick={this.props.closeLightbox}
            >
              <div className="close-icon">&times;</div>
              Close
            </div>
          </div>
          <div className="body-contribution">
          Inside the body div
          </div>
        </div>
      </div>
    );
  }
}
