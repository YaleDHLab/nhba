import React from 'react';
import Lightbox from './BuildingLightboxContribution';
import { Link } from 'react-router';

export default class SuggestEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLightbox: false
    };

    // show/hide the lightbox
    this.toggleLightbox = this.toggleLightbox.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
  }

  /* Show/Hide the lightbox */

  toggleLightbox() {
    const lightbox = this.state.showLightbox;
    this.setState({ showLightbox: !lightbox });
  }

  closeLightbox() {
    this.setState({ showLightbox: false });
  }

  render() {
    const adminButton = (
      <div className="suggest-edit">
        <Link to={`/admin/form?buildingId=${this.props.building._id}`}>
          Edit this building
        </Link>
        <div>
          <b>Want to change something?</b> Click the button above to edit this
          record.
        </div>
      </div>
    );

    const contributeButton = (
      <div className="suggest-edit">
       <div>
          <b>Have something to add?</b> Contribute a fun fact or image to this
          building.
        </div>
        <div className="suggest-edit button">
          <a href="mailto:nhba@yale.edu" target="_top">
            Suggest an Edit
          </a>
        </div>
        <div 
          className="suggest-edit button"
          onClick={this.toggleLightbox}
        >
            Add an Image
        </div>
        <div className="suggest-edit button">
          Add a Comment
        </div>
      </div>
    );

    const button =
      this.props.admin || this.props.creator ? adminButton : contributeButton;

    const lightbox = this.state.showLightbox ? (
      <Lightbox
        building={this.props.building}
        closeLightbox={this.closeLightbox}
      />
    ) : null;

    return <span>{button}{lightbox}</span>;
  }
}
