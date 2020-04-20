import React from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

export default class RichTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.getClass = this.getClass.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  getClass() {
    const width = this.props.width || '';
    const position = this.props.position || '';
    const missing = this.props.missingFields.includes(this.props.field)
      ? 'missing'
      : '';
    return ['rich-text-area', width, position, missing].join(' ');
  }

  updateField(value, delta, source) {
    // Only emit update event if changed by user
    if (source == 'user') {
      this.props.updateField(this.props.field, value);
    }
  }

  render() {
    var defaultValue = '';
    if (this.props.building && this.props.building[this.props.field]) {
      defaultValue = this.props.building[this.props.field];
    } else if (this.props.defaultValue) {
      defaultValue = this.props.defaultValue;
    }
    
    let label = this.props.label ? 
      <div className="label">{this.props.label}</div> : null;

    return (
      <div className={this.getClass()}>
        {label}
        <ReactQuill
          onChange={this.updateField}
          placeholder={this.props.placeholder || ''}
          defaultValue={defaultValue}
        >
          <div style={{ height: this.props.height }} />
        </ReactQuill>
      </div>
    );
  }
}
