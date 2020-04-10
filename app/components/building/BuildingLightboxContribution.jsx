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
      missingFields: false,
      successfulSubmission: false,
      contributorName: '',
      contributorContact: '',
      new_media: [],
    };

    this.handleImage = this.handleImage.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.selectFileToRecaption = this.selectFileToRecaption.bind(this);
    this.updateField = this.updateField.bind(this);
    this.submitForReview = this.submitForReview.bind(this);
    this.replaceField =  this.replaceField.bind(this);
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
        this.state.building._id
      }&resize=true`);
      const filename = files[k].name.split(' ').join('-');
      req.attach('attachment', files[k], filename);

      req.end((err, res) => {
        if (err) console.warn(err);

        const doc = {
          filename: res.body.file.name,
          caption: '',
          contributor_name: this.state.contributorName,
          contributor_contact: this.state.contributorContact,
          decision: null,
          reviewed: false,
          reviewed_at: null,
          submitted_at: Date.now() / 1000,
        };

        this.updateField(doc);
      });
    });
  }

  handleNameChange(e) {
    this.setState({ contributorName: e.target.value });
  }

  handleContactChange(e) {
    this.setState({ contributorContact: e.target.value });
  }

  handleCaptionChange(e) {
    const relabelCaptionIndex = this.state.fileToRecaption.index;

    if (relabelCaptionIndex !== 'null' || relabelCaptionIndex !== undefined) {
      const newCaption = e.target.value;

      // mutate a copy of the extant archive documents
      const newImages = Object.assign([], this.state.new_media);
      newImages[relabelCaptionIndex].caption = newCaption;

      this.setState({ new_media: newImages });
    }
  }

  replaceField(field, value) {
    const building = Object.assign({}, this.state.building);
    building[field] = value;
    this.setState({
      building,
    });
  }


  selectFileToRecaption(fileIndex) {
    if (fileIndex !== null) {
      const fileToRecaption = this.state.new_media[fileIndex];
      fileToRecaption.index = fileIndex;
      this.setState({ fileToRecaption });
    } else {
      // allow callers to specify null to remove the file to recaption
      this.setState({ fileToRecaption: null });
    }
  }

  updateField(value) {
    // use Object.assign to avoid object mutations
    var new_media = Object.assign([], this.state.new_media)

    // remove/add the selected value when users un/select values
    if (Array.isArray(new_media)) {
      _.includes(new_media, value)
        ? _.pull(new_media, value)
        : new_media.push(value);
    } else {
      new_media = value;
    }

    this.setState({ new_media: new_media })
  }

  submitForReview() {
    var missingCaption = false;
    for (var i = 0; i < this.state.new_media.length; i++) {
      if (this.state.new_media[i].caption == "") {
        missingCaption = true;
        break;
      }
    }

    const building = Object.assign({}, this.state.building);
    for (var i = 0; i < this.state.new_media.length; i++) {
      this.state.building.contributed_media.push(this.state.new_media[i]);
    }

    this.setState({ building: building, missingFields: missingCaption }, 
      () => {
        if (this.state.missingFields == false) {
          request
            .post(`${api.endpoint}building/save`)
            .send(this.state.building)
            .set('Accept', 'application/json')
            .end(err => {
              if (err) console.warn(err);
            });
          this.setState({ successfulSubmission: true });
        }
      }
    )
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
              <div className="file-picker file-picker-content file-picker-row">
                <div className="label">Name</div>
                <input
                  className="file-display-name-input"
                  onChange={this.handleNameChange}
                />
              </div>
              <div className="file-picker file-picker-content file-picker-row">
                <div className="label">E-mail</div>
                <input
                  className="file-display-name-input"
                  onChange={this.handleContactChange}
                />
              </div>
                <ImageGrid
                  {...this.props}
                  images={this.state.new_media}
                  label="Image Gallery"
                  selectFileToRecaption={this.selectFileToRecaption}
                />
                <FilePicker
                  {...this.props}
                  topLabel="Select Image"
                  bottomLabel="Caption/Attribution (*Required)"
                  handleFile={this.handleImage}
                  file={this.state.fileToRecaption}
                  textField="caption"
                  handleTextChange={this.handleCaptionChange}
                />
                {this.state.missingFields == true ? (
                  <p className="missing">
                    Please include a caption for every image.
                  </p>
                ) : null}
                {this.state.successfulSubmission == true ? (
                  <p className="successful">
                    Your contribution request has been submitted for review. Thank you.
                  </p>
                ) : null}
                <div 
                  className="review-button yellow-button"
                  onClick={this.submitForReview}
                >
                    Submit for Review
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
