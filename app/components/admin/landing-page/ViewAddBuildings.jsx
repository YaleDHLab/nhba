import React from 'react';
import { Link } from 'react-router';

export default class ViewAddBuildings extends React.Component {
  render() {
    return (
      <div className="view-add-buildings">
        <div className="darker-shade" />
        <div className="right-container">
          <Link to="/admin/form">
            <div className="white-button add-a-building">Add a Building</div>
          </Link>
        </div>
      </div>
    );
  }
}
