import React from 'react';
import { Link } from 'react-router';

export default class Pages extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="pages">
        <div className="table">
          {this.props.pages.map((page, i) => (
            <Link to={page.route} key={i}>
              <div className="row">
                <div className="edit-icon" />
                {page.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
