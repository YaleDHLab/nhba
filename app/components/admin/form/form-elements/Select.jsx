import React from 'react';
import Multiselect from '../../../Multiselect';

export default class Select extends React.Component {
  constructor(props) {
    super(props);

    this.getClass = this.getClass.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  getClass() {
    const defaultClass = 'select';
    const width = this.props.width || '';
    const position = this.props.position || '';
    return [defaultClass, width, position].join(' ');
  }

  updateField(field, option) {
    this.props.updateField(field, option);
  }

  render() {
    let values = this.props.building[this.props.field] || [];

    if (this.props.valueMap) {
      values = values.map(v => this.props.valueMap[v]);
    }

    const label = values.join(', ');

    return (
      <div className={this.getClass()}>
        <div className="label">{this.props.label}</div>

        <Multiselect
          label={label}
          field={this.props.field}
          values={values}
          options={this.props.options[this.props.field]}
          allowNewOptions={this.props.allowNewOptions}
          onNewOption={this.props.handleNewOption}
          handleChange={this.updateField}
          className={'custom-select'}
        />
      </div>
    );
  }
}
