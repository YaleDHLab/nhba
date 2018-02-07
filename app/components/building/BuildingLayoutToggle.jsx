import React from 'react';

const buttons = ['Gallery', 'Map'];

export default class LayoutToggle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="building-layout-toggle" onClick={this.props.toggleLayout}>
        {buttons.map((option, i) => {
          return this.props.layout.right == option ? (
            <div className="layout-option active" key={i}>
              {option}
            </div>
          ) : (
            <div className="layout-option" key={i}>
              {option}
            </div>
          );
        })}
      </div>
    );
  }
}
