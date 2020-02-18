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
    return (
      <div className={this.getClass()}>
        <div className="label">{this.props.label}</div>
        <ReactQuill
          onChange={this.updateField}
          placeholder={this.props.placeholder || ''}
          value={this.props.building[this.props.field] || ''}
        >
          <div style={{ height: this.props.height }} />
        </ReactQuill>
      </div>
    );
  }
}
