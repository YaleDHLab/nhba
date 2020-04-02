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
    };

    this.handleImage = this.handleImage.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
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
          // contributor: req.session.userId,
          approved: false,
          decision: null,
          submitted_at: Date.now() / 1000,
        };

        this.updateField('contributed_media', doc);
      });
    });
  }

  handleCaptionChange(e) {
    const relabelCaptionIndex = this.state.fileToRecaption.index;

    if (relabelCaptionIndex !== 'null' || relabelCaptionIndex !== undefined) {
      const newCaption = e.target.value;
      const { contributed_media } = this.state.building;

      // mutate a copy of the extant archive documents
      const newImages = Object.assign([], contributed_media);
      newImages[relabelCaptionIndex].caption = newCaption;

      // use the replaceField method to quash the old archive documents
      this.replaceField('contributed_media', newImages);
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
      const fileToRecaption = this.state.building.contributed_media[fileIndex];
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

    this.setState({ building: building }, () => {
      console.log("building after: ", this.state.building);
    })
  }

  submitForReview() {
    var missingCaption = false;
    for (var i = 0; i < this.state.building.contributed_media.length; i++) {
      if (this.state.building.contributed_media[i].caption == "") {
        missingCaption = true;
        break;
      }
    }

    this.setState({ missingFields: missingCaption }, 
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
                <ImageGrid
                  {...this.props}
                  images={this.state.building.contributed_media}
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
