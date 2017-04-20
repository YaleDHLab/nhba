import React from 'react'
import request from 'superagent'
import api from '../../../../../config'

export default class FilePicker extends React.Component {
  constructor(props) {
    super(props)

    this.handleFiles = this.handleFiles.bind(this)
  }

  handleFiles(e) {
    var self = this;
    e.preventDefault();

    let files = [];
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    _.keys(files).map((k) => {
      var req = request.post(api.endpoint + 'upload');
      req.attach('image', files[k], files[k].name)

      req.end((err, res) => {
        if (err) console.log(err);

        const doc = {
          filename: res.body.file.name,
          label: 'file-label'
        }

        self.props.updateField('archive_documents', doc)
      })
    })

  }

  render() {
    return (
      <div className='file-picker'>
        <div className='label' />
        <div className='file-picker-content'>
          <div className='file-picker-row'>
            <div className='label'>{this.props.topLabel}</div>
            <input className='file-name-input' />
            <div className='file-name-button-container'>
              <div className='file-name-button'>Select File
                <input onChange={this.handleFiles} type='file' multiple />
              </div>
            </div>
          </div>
          <div className='file-picker-row'>
            <div className='label'>{this.props.bottomLabel}</div>
            <input className='file-display-name-input' />
          </div>
        </div>
      </div>
    )
  }
}