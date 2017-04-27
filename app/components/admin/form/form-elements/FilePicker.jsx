import React from 'react'

export default class FilePicker extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // if there's a file to label, pull out its attributes
    const filename = this.props.file ? this.props.file.filename : '';
    const filelabel = this.props.file ? this.props.file.label : '';

    return (
      <div className='file-picker'>
        <div className='label' />
        <div className='file-picker-content'>

          <div className='file-picker-row'>
            <div className='label'>{this.props.topLabel}</div>
            <input
              className='file-name-input'
              value={filename || ''} />
            <div className='file-name-button-container'>
              <div className='file-name-button'>
                <span>Select File</span>
                <input
                  onChange={this.props.handleFile}
                  type='file'
                  multiple />
              </div>
            </div>
          </div>
          <div className='file-picker-row'>
            <div className='label'>{this.props.bottomLabel}</div>
            <input
              className='file-display-name-input'
              value={filelabel || ''}
              onChange={this.props.handleLabelChange} />
          </div>

        </div>
      </div>
    )
  }
}