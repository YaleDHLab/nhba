import React from 'react';
import { Link } from 'react-router';

const gallery = [
  '/assets/images/chapel-street.jpg',
  '/assets/images/lynn-ladder.JPG',
  '/assets/images/park.jpg',
];

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.getStyle = this.getStyle.bind(this);
  }

  getStyle(image) {
    return {
      backgroundImage: 'url(' + image + ')',
    };
  }

  render() {
    return (
      <div className="home">
        <div className="hero-image background-image" />
        <div className="search">
          <input className="search-box" type="text" />
          <div className="search-button">Search</div>
        </div>
        <h1 className="label">What's in the Neighborhood</h1>
        <div className="gallery">
          {gallery.map((image, i) => {
            return (
              <Link to={'/search'} key={i}>
                <div
                  className="gallery-image background-image"
                  style={this.getStyle(image)}
                />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
