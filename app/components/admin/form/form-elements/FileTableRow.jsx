import React from 'react';

export default class FileTableRow extends React.Component {
  constructor(props) {
    super(props);

    this.removeFile = this.removeFile.bind(this);
    this.selectFileToRelabel = this.selectFileToRelabel.bind(this);
  }

  removeFile() {
    this.props.updateField('archive_documents', this.props.file);
    this.props.selectFileToRelabel(null);
  }

  selectFileToRelabel() {
    this.props.selectFileToRelabel(this.props.index);
  }

  render() {
    const minusIconImage = '/assets/images/minus-icon';
    const minusIcon = (
      <object data={`${minusIconImage}.svg`} type="image/svg+xml">
        <img src={`${minusIconImage}.png`} className="logo" />
      </object>
    );

    return (
      <div className="table-row">
        <div className="table-cell left">
          <div className="minus-icon" onClick={this.removeFile}>
            {minusIcon}
          </div>
          {this.props.file.filename}
        </div>
        <div className="table-cell right" onClick={this.selectFileToRelabel}>
          {this.props.file.label}
        </div>
      </div>
    );
  }
}
