import React from 'react';
import BuildingButton from './BuildingButton';

export default class BuildingButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="building-buttons">
        {this.props.fields.map((field, i) => (
          <BuildingButton 
            field={field} 
            key={i}
            expandedLabels={this.props.expandedLabels}
            expandLabels={this.props.expandLabels}
          />
        ))}
      </div>
    );
  }
}
