import React from "react";
import { Link } from "react-router";

export default class Card extends React.Component {
  constructor(props) {
    super(props);

    this.getStyle = this.getStyle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
  }

  getStyle() {
    const style =
      this.props.building.images && this.props.building.images.length > 0
        ? {
            backgroundImage: `url(/assets/uploads/resized/small/${
              this.props.building.images[0].filename
            })`
          }
        : {
            backgroundColor: "#f1f1f1"
          };
    return style;
  }

  handleClick(e) {
    this.scrollTo(0, 150);
  }

  /**
   * Function to smooth scroll on a page
   *
   * @args:
   *   {int} to: the y position of document to which we should scroll
   *   {int} duration: the duration of the scroll
   * @returns:
   *   none
   **/

  scrollTo(to, duration) {
    const self = this;
    if (duration <= 0) return;
    const doc = document.documentElement;
    const scrolled =
      (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const difference = to - scrolled;
    const perTick = difference / duration * 10;

    setTimeout(function() {
      window.scrollTo(0, scrolled + perTick);
      if (scrolled + perTick === to) return;
      self.scrollTo(to, duration - 10);
    }, 10);
  }

  render() {
    const building = this.props.building;

    // parse out the large and small card text
    let bigtext = "",
      smalltext = "";

    if (building.building_name) {
      bigtext = building.building_name;
      smalltext = building.address;
    } else {
      bigtext = building.address;
      if (bigtext && bigtext.includes(", New Haven")) {
        let splitaddress = bigtext.split(", New Haven");
        bigtext = splitaddress[0];

        // parse out the small text
        if (splitaddress[1].substring(0, 1) == ",") {
          smalltext = "New Haven, " + splitaddress[1].substring(1).trim();
        } else {
          smalltext = "New Haven, " + splitaddress[1].trim();
        }
      }
    }

    return (
      <div className="card" onClick={this.handleClick}>
        <Link to={"/building?id=" + this.props.building._id + "#"}>
          <div className="card-content">
            <div
              className="background-image card-image"
              style={this.getStyle()}
            />
            <div className="card-text">
              <div className="card-name">{bigtext}</div>
              <div className="card-details">{smalltext}</div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}
