import React from 'react';
import ImageGrid from './form-elements/ImageGrid';
import FileTable from './form-elements/FileTable';
import FilePicker from './form-elements/FilePicker';
import TextInput from './form-elements/TextInput';
import api from '../../../../config';
import request from 'superagent';
import _ from 'lodash';

export default class MultimediaGallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileToRecaption: {}, // the file we're recaptioning
    };

    this.handleFile = this.handleFile.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.selectFileToRecaption = this.selectFileToRecaption.bind(this);
  }

  handleFile(e) {
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

  selectFileToRecaption(fileIndex) {
    if (fileIndex != null) {
      let fileToRecaption = this.props.building.images[fileIndex];
      fileToRecaption.index = fileIndex;
      this.setState({ fileToRecaption: fileToRecaption });
    } else {
      // allow callers to specify null to remove the file to recaption
      this.setState({ fileToRecaption: null });
    }
  }

  handleCaptionChange(e) {
    const relabelCaptionIndex = this.state.fileToRecaption.index;
    if (relabelCaptionIndex != 'null') {
      const newCaption = e.target.value;
      const images = this.props.building.images;

      // mutate a copy of the extant archive documents
      let newImages = Object.assign([], images);
      newImages[relabelCaptionIndex].caption = newCaption;

      // use the replaceField method to quash the old archive documents
      this.props.replaceField('images', newImages);
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
          topLabel={'Select File'}
          bottomLabel={'Caption'}
          handleFile={this.handleFile}
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
          topLabel={'Upload'}
          bottomLabel={'Display Title'}
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
