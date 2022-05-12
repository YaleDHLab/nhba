import React from 'react';
import request from 'superagent';
import _ from 'lodash';

import api from '../../../config';
import ImageGrid from '../admin/form/form-elements/ImageGrid';
import FilePicker from '../admin/form/form-elements/FilePicker';
import Reaptcha from "reaptcha";

const RECAPTCHA_SITE_KEY = "6Le9-usUAAAAALzdWPHiloLB5BRE1asZOqX2__J6";

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
      contributorConfirmContact: '',
      new_media: [],
      verifiedRecaptcha: false,
    };

    this.handleImage = this.handleImage.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleConfirmContactChange = this.handleConfirmContactChange.bind(this);
    this.selectFileToRecaption = this.selectFileToRecaption.bind(this);
    this.updateField = this.updateField.bind(this);
    this.submitForReview = this.submitForReview.bind(this);
    this.replaceField =  this.replaceField.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.onVerifyRecaptcha = this.onVerifyRecaptcha.bind(this);
  }

  onVerifyRecaptcha() {
    this.setState({ verifiedRecaptcha: true });
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

  deleteImage(imageIndex) {
    const images = Object.assign([], this.state.new_media);
    const newImages = _.filter(images, (img, idx) => idx !== imageIndex);
    this.setState({ new_media: newImages })  }

  handleNameChange(e) {
    this.setState({ contributorName: e.target.value });
  }

  handleContactChange(e) {
    this.setState({ contributorContact: e.target.value });
  }

  handleConfirmContactChange(e) {
    this.setState({ contributorConfirmContact: e.target.value });
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
    var missingFields = false;
    // Check every uploaded image has caption
    for (var i = 0; i < this.state.new_media.length; i++) {
      if (this.state.new_media[i].caption == "") {
        missingFields = true;
        break;
      }
    }
    // Check at least one image is uploaded
    if (this.state.new_media.length == 0) {
      missingFields = true;
    }
    // Check every field is filled in
    if (this.state.contributorName == "" || 
        this.state.contributorContact == "" ||
        this.state.contributorConfirmContact == "") {
        missingFields = true;
    }
    // Check contact information matches
    if (this.state.contributorContact != this.state.contributorConfirmContact) {
      missingFields = true;
    }
    // Check recaptcha is verified
    if (this.state.verifiedRecaptcha == false) {
      missingFields = true;
    }

    this.setState({ missingFields: missingFields }, 
      () => {
        if (this.state.missingFields == false) {
          // Append images in new_media to building's contributed_media
          const building = Object.assign({}, this.state.building);
          for (var i = 0; i < this.state.new_media.length; i++) {
            if (this.state.new_media[i].contributor_name == "") {
              this.state.new_media[i].contributor_name = this.state.contributorName;
            }
            if (this.state.new_media[i].contributor_contact == "") {
              this.state.new_media[i].contributor_contact = this.state.contributorContact;
            }
            this.state.building.contributed_media.push(this.state.new_media[i]);
          }
          // Send request
          request
            .post(`${api.endpoint}building/save`)
            .send(this.state.building)
            .set('Accept', 'application/json')
            .end(err => {
              if (err) console.warn(err);
            });
          this.setState({ building: building, successfulSubmission: true });
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
                <div className="label">Name (*Required)</div>
                <input
                  className="file-display-name-input"
                  onChange={this.handleNameChange}
                />
              </div>
              <div className="file-picker file-picker-content file-picker-row">
                <div className="label">E-mail (*Required)</div>
                <input
                  className="file-display-name-input"
                  onChange={this.handleContactChange}
                />
              </div>
              <div className="file-picker file-picker-content file-picker-row">
                <div className="label">Confirm E-mail (*Required)</div>
                <input
                  className="file-display-name-input"
                  onChange={this.handleConfirmContactChange}
                />
              </div>
                <ImageGrid
                  {...this.props}
                  images={this.state.new_media}
                  label="Image Gallery"
                  selectFileToRecaption={this.selectFileToRecaption}
                  deleteImage={this.deleteImage}
                  hideDeleteButton={true}
                />
                <p>Once uploaded, click on the image that you would like to submit.</p>

                <FilePicker
                  {...this.props}
                  topLabel="Select Image"
                  bottomLabel="Caption/Attribution (*Required)"
                  handleFile={this.handleImage}
                  file={this.state.fileToRecaption}
                  textField="caption"
                  handleTextChange={this.handleCaptionChange}
                />
                <div className="recaptcha">
                  <Reaptcha
                    sitekey={RECAPTCHA_SITE_KEY}
                    onVerify={this.onVerifyRecaptcha}
                  />
                </div>
                {this.state.missingFields == true ? (
                  <p className="missing">
                    Please fill in all required fields. Every image must include a caption. Ensure the e-mails entered match.
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
