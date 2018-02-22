import React from 'react';
import request from 'superagent';
import _ from 'lodash';

import ImageGrid from './form-elements/ImageGrid';
import FileTable from './form-elements/FileTable';
import FilePicker from './form-elements/FilePicker';
import TextInput from './form-elements/TextInput';
import api from '../../../../config';

export default class MultimediaGallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileToRecaption: {},
      fileToRelabel: {},
    };

    this.handleFile = this.handleFile.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.selectFileToRecaption = this.selectFileToRecaption.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.selectFileToRelabel = this.selectFileToRelabel.bind(this);
  }

  handleImage(e) {
    const self = this;
    e.preventDefault();

    let files = [];
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    _.keys(files).map(k => {
      let req = request.post(api.endpoint + 'upload?resize=true');
      let filename = files[k].name.split(' ').join('-');
      req.attach('attachment', files[k], filename);

      req.end((err, res) => {
        if (err) console.warn(err);

        const doc = {
          filename: res.body.file.name,
          caption: '',
        };

        self.props.updateField('images', doc);
      });
    });
  }

  handleFile(e) {
    // remove the file we were relabelling (if any)
    this.setState({ fileToRelabel: null });

    const self = this;
    e.preventDefault();

    let files = [];
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    _.keys(files).map((k) => {
      let req = request.post(api.endpoint + 'upload');
      let filename = files[k].name.split(' ').join('-');
      req.attach('attachment', files[k], filename);

      req.end((err, res) => {
        if (err) console.warn(err);

        const doc = {
          filename: res.body.file.name,
          label: res.body.file.name,
        };

        self.props.updateField('archive_documents', doc);
      });
    });
  }

  selectFileToRecaption(fileIndex) {
    if (fileIndex !== null) {
      const fileToRecaption = this.props.building.images[fileIndex];
      fileToRecaption.index = fileIndex;
      this.setState({ fileToRecaption });
    } else {
      // allow callers to specify null to remove the file to recaption
      this.setState({ fileToRecaption: null });
    }
  }

  handleCaptionChange(e) {
    const relabelCaptionIndex = this.state.fileToRecaption.index;
    if (relabelCaptionIndex !== 'null') {
      const newCaption = e.target.value;
      const { images } = this.props.building;

      // mutate a copy of the extant archive documents
      const newImages = Object.assign([], images);
      newImages[relabelCaptionIndex].caption = newCaption;

      // use the replaceField method to quash the old archive documents
      this.props.replaceField('images', newImages);
    }
  }

  handleLabelChange(e) {
    const relabelFileIndex = this.state.fileToRelabel.index;
    if (relabelFileIndex !== 'null') {
      const newLabel = e.target.value;
      const archiveDocuments = this.props.building.archive_documents;

      // mutate a copy of the extant archive documents
      const newArchiveDocuments = Object.assign([], archiveDocuments);
      newArchiveDocuments[relabelFileIndex].label = newLabel;

      // use the replaceField method to quash the old archive documents
      this.props.replaceField('archive_documents', newArchiveDocuments);
    }
  }

  selectFileToRelabel(fileIndex) {
    if (fileIndex !== null) {
      const fileToRelabel = this.props.building.archive_documents[fileIndex];
      fileToRelabel.index = fileIndex;
      this.setState({ fileToRelabel });
    } else {
      // allow callers to specify null to remove the file to relabel
      this.setState({ fileToRelabel: null });
    }
  }

  render() {
    return (
      <div className="media-gallery">
        <ImageGrid
          {...this.props}
          label={'Image Gallery'}
          selectFileToRecaption={this.selectFileToRecaption}
        />

        <FilePicker
          {...this.props}
          topLabel={'Select Image'}
          bottomLabel={'Caption'}
          handleFile={this.handleImage}
          file={this.state.fileToRecaption}
          textField={'caption'}
          handleTextChange={this.handleCaptionChange}
        />

        <FileTable
          {...this.props}
          files={this.props.building.archive_documents}
          label={'Archive Documents'}
          selectFileToRelabel={this.selectFileToRelabel}
        />

        <FilePicker
          {...this.props}
          topLabel={'Select File'}
          bottomLabel={'Name'}
          handleFile={this.handleFile}
          file={this.state.fileToRelabel}
          textField={'label'}
          handleTextChange={this.handleLabelChange}
        />

        <TextInput
          {...this.props}
          width={'full-width'}
          label={'Story Maps Url'}
          field={'storymap_url'}
        />
      </div>
    );
  }
}
