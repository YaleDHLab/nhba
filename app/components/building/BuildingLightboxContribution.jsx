import React from 'react';
import request from 'superagent';
import _ from 'lodash';

import api from '../../../config';
import ImageGrid from '../admin/form/form-elements/ImageGrid';
import FilePicker from '../admin/form/form-elements/FilePicker';

export default class BuildingLightboxContribution extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      building: this.props.building,
      fileToRecaption: {},
      fileToRelabel: {}
    };

    this.handleImage = this.handleImage.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.selectFileToRecaption = this.selectFileToRecaption.bind(this);
    this.updateField = this.updateField.bind(this);
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
      const req = request.post(`
        ${api.endpoint}upload?buildingId=${
        this.props.building._id
      }&resize=true`);
      const filename = files[k].name.split(' ').join('-');
      req.attach('attachment', files[k], filename);

      req.end((err, res) => {
        if (err) console.warn(err);

        const doc = {
          filename: res.body.file.name,
          caption: ''
        };

        this.updateField('images', doc);
      });
    });
  }

  handleCaptionChange(e) {
    const relabelCaptionIndex = this.state.fileToRecaption.index;
    // TO-DO: Originally, the check was against 'null', why?
    if (relabelCaptionIndex !== 'null' || relabelCaptionIndex !== undefined) {
      const newCaption = e.target.value;
      const { images } = this.props.building;

      // mutate a copy of the extant archive documents
      const newImages = Object.assign([], images);
      newImages[relabelCaptionIndex].caption = newCaption;

      // use the replaceField method to quash the old archive documents
      this.props.replaceField('images', newImages);
    }
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

  updateField(field, value) {
    // use Object.assign to avoid object mutations
    const building = Object.assign({}, this.state.building);

    // remove/add the selected value when users un/select values
    if (Array.isArray(building[field])) {
      _.includes(building[field], value)
        ? _.pull(building[field], value)
        : building[field].push(value);
    } else {
      building[field] = value;
    }

    this.setState({ building: building })
  }

  render() {
    return (
      <div className="building-lightbox dark-modal-backdrop">
        <div className="modal">
          <div className="header">
            <div className="brand modal-header-text">
              Contribute to Multimedia Gallery
            </div>
            <div
              className="close-text modal-header-text"
              onClick={this.props.closeLightbox}
            >
              <div className="close-icon">&times;</div>
              Close
            </div>
          </div>
          <div className="body-contribution">
            <div className="form">
              <div className="form-content">
                <ImageGrid
                  {...this.props}
                  label="Image Gallery"
                  selectFileToRecaption={this.selectFileToRecaption}
                />
                <div className="media-gallery">
                  <FilePicker
                    {...this.props}
                    topLabel="Select Image"
                    bottomLabel="Caption/Attribution (*Required)"
                    handleFile={this.handleImage}
                    file={this.state.fileToRecaption}
                    textField="caption"
                    handleTextChange={this.handleCaptionChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
