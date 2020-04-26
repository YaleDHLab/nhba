import React from 'react';
import ContributionLightbox from './BuildingLightboxContribution';
import DiscussionLightbox from './BuildingLightboxDiscussion';
import { Link } from 'react-router';

export default class SuggestEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showContributionLightbox: false,
      showDiscussionLightbox: false
    };

    // show/hide the lightbox
    this.toggleContributionLightbox = this.toggleContributionLightbox.bind(this);
    this.toggleDiscussionLightbox = this.toggleDiscussionLightbox.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
  }

  /* Show/Hide the lightbox */
  toggleContributionLightbox() {
    const lightbox = this.state.showContributionLightbox;
    this.setState({ showContributionLightbox: !lightbox });
  }

  toggleDiscussionLightbox() {
    const lightbox = this.state.showDiscussionLightbox;
    this.setState({ showDiscussionLightbox: !lightbox });
  }

  closeLightbox() {
    this.setState({ showContributionLightbox: false, showDiscussionLightbox: false });
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
          onClick={this.toggleContributionLightbox}
        >
            Add an Image
        </div>
        <div 
          className="suggest-edit button"
          onClick={this.toggleDiscussionLightbox}
        >
          Add a Comment
        </div>
      </div>
    );

    const button =
      this.props.admin || this.props.creator ? adminButton : contributeButton;

    var lightbox = null;
    if (this.state.showContributionLightbox) {
      lightbox = <ContributionLightbox
                  building={this.props.building}
                  closeLightbox={this.closeLightbox}
                />;
    } else if (this.state.showDiscussionLightbox) {
      lightbox = <DiscussionLightbox
                building={this.props.building}
                closeLightbox={this.closeLightbox}
              />;
    }

    return <span>{button}{lightbox}</span>;
  }
}
