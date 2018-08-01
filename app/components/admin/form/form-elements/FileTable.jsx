import React from 'react';
import FileTableRow from './FileTableRow';

export default class FileTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="file-table">
        <div className="label">{this.props.label}</div>
        <div className="table">
          <div className="table-row">
            <div className="table-header left">File Name</div>
            <div className="table-header right">Document Title</div>
          </div>
          {this.props.files.map((file, i) => (
            <FileTableRow
              key={i}
              file={file}
              index={i}
              selectFileToRelabel={this.props.selectFileToRelabel}
              updateField={this.props.updateField}
            />
          ))}
        </div>
      </div>
    );
  }
}
