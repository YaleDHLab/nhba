import React from 'react';
import request from 'superagent';
import _ from 'lodash';

import api from '../../../config';
import RichTextArea from '../admin/form/form-elements/RichTextArea';

export default class BuildingLightboxDiscussion extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			building: this.props.building,
			contributorName: '',
			contributorContact: '',
			contributorComment: '',
			missingFields: [],
			errorMessage: false,
			successfulSubmission: false,
		}

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleContactChange = this.handleContactChange.bind(this);
		this.updateField = this.updateField.bind(this);
		this.submitForReview = this.submitForReview.bind(this);
	}

	handleNameChange(e) {
		this.setState({ contributorName: e.target.value });
	}

	handleContactChange(e) {
		this.setState({ contributorContact: e.target.value });
	}

	updateField(field, value) {
		this.setState({ contributorComment: value })
	}

	submitForReview() {
		var missingFields = false;
		if (this.state.contributorName == "" || 
			this.state.contributorContact == "" ||
			this.state.contributorComment == "") {
	      missingFields = true;
	    }

	    const doc = {
	      comment: this.state.contributorComment,
          contributor_name: this.state.contributorName,
          contributor_contact: this.state.contributorContact,
          decision: null,
          reviewed: false,
          reviewed_at: null,
          submitted_at: Date.now() / 1000,
        };

        const building = Object.assign({}, this.state.building);
        if (Array.isArray(building.comments)) {
        	building.comments.push(doc);
        } else {
        	building.comments = doc;
        }

	    this.setState({ building: building, errorMessage: missingFields }, 
	    	() => {
	    		if (this.state.errorMessage == false) {
	    			request
	    				.post(`${api.endpoint}building/save`)
	    				.send(this.state.building)
	    				.set('Accept', 'application/json')
	    				.end(err => {
			              if (err) console.warn(err);
			            });
			        this.setState({ successfulSubmission: true });
	    		}
	    	});
	}

	render() {
	    return (
	      <div className="building-lightbox dark-modal-backdrop">
	        <div className="modal">
	          <div className="header">
	            <div className="brand modal-header-text">
	              Contribute to Discussion Forum
	            </div>
	            <div
	              className="close-text modal-header-text"
	              onClick={this.props.closeLightbox}
	            >
	              <div className="close-icon">&times;</div>
	              Close
	            </div>
	          </div>
	          <div className="body-discussion">
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
	              	<RichTextArea
			          {...this.props}
			          width="full-width"
			          label="Comment (*Required)"
			          missingFields={this.state.missingFields}
			          updateField={this.updateField}
			          placeholder="Enter your comment here."
			          height={250}
			        />
			        {this.state.errorMessage == true ? (
	                  <p className="missing">
	                    Please fill in all required fields.
	                  </p>
	                ) : null}
	                {this.state.successfulSubmission == true ? (
	                  <p className="successful">
	                    Your contribution request has been submitted for review. Thank you.
	                  </p>
	                ) : null}
	                <div 
	                  className="review-button-1 yellow-button"
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