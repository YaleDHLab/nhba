import React from 'react';

export default class BuildingCollapsible extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
    };

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const containerClass = this.state.collapsed
      ? 'building-collapsible collapsed'
      : 'building-collapsible';

    return (
      <div className={containerClass}>
        <div
          className="building-collapsible-header"
          onClick={this.toggleCollapsed}
        >
          <hr />
          <h2>{this.props.label}</h2>
          <img src="/assets/images/caret.png" className="expand-icon" />
          <hr className="push" />
        </div>
        {this.props.childComponent}
        <div className="building-collapsible-push" />
      </div>
    );
  }
}
