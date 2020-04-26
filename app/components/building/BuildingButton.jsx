import React from 'react';

export default class BuildingButton extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToElem = this.scrollToElem.bind(this);
  }

  scrollToElem() {
    const elem = document.getElementById(this.props.field.href);
    window.scrollTo(0, elem.offsetTop - 20);
    
    this.props.expandLabels(this.props.field.label)
  }

  render() {
    return (
      <div className="building-button" onClick={this.scrollToElem}>
        <div className="building-button-content">
          <div className="label">{this.props.field.button.label}</div>
        </div>
      </div>
    );
  }
}
