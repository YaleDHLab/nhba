import React from 'react'

export default class FilePicker extends React.Component {
  constructor(props) {
    super(props)

    this.changeFileLabel = this.changeFileLabel.bind(this)
  }

  changeFileLabel(e) {
    const relabelFileIndex = this.props.relabelFileIndex;
    const newFileName = e.target.value;

    if (relabelFileIndex != 'null') {
      this.props.changeFileLabel(relabelFileIndex, newFileName)
    }
  }

  render() {
    // identify the file to relabel (if any)
    const archiveDocuments = this.props.building.archive_documents;
    const fileToRelabel = archiveDocuments[this.props.relabelFileIndex];

    // if there's a file to label, pull out its attributes
    const filename = fileToRelabel ? fileToRelabel.filename : '';
    const filelabel = fileToRelabel ? fileToRelabel.label : '';

    return (
      <div className='file-picker'>
        <div className='label' />
        <div className='file-picker-content'>

          <div className='file-picker-row'>
            <div className='label'>{this.props.topLabel}</div>
            <input
              className='file-name-input'
              value={filename} />
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
              value={filelabel}
              onChange={this.changeFileLabel} />
          </div>

        </div>
      </div>
    )
  }
}