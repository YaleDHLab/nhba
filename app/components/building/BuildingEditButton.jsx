import React from 'react';
import { Link } from 'react-router';

export default class SuggestEdit extends React.Component {
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
        <a href="mailto:nhba@yale.edu" target="_top">
          Suggest an Edit
        </a>
        <a href="">
          Add an image
        </a>
        <a href="">
          Add a comment
        </a>
      </div>
    );

    const button =
      this.props.admin || this.props.creator ? adminButton : contributeButton;

    return <span>{button}</span>;
  }
}
