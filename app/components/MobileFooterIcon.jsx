import React from "react";

export default class MobileFooterIcon extends React.Component {
  render() {
    const className =
      this.props.currentRoute === this.props.route
        ? "mobile-footer-icon active"
        : "mobile-footer-icon";

    return (
      <div
        className={className}
        onClick={() => {
          this.props.handleClick(this.props.label);
        }}
      >
        <object
          data={"/assets/images/" + this.props.filename + ".svg"}
          type="image/svg+xml"
          className={this.props.filename}
        >
          <img src={"/assets/images/" + this.props.filename + ".png"} />
        </object>
        <div>{this.props.label}</div>
      </div>
    );
  }
}
