import React from 'react';
import request from 'superagent';

import api from '../../../config';

export default class BuildingReviewContribution extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			building: this.props.building,
		}

		this.acceptSubmission = this.acceptSubmission.bind(this);
		this.rejectSubmission = this.rejectSubmission.bind(this);
	}

	acceptSubmission() {
		const building = Object.assign({}, this.state.building);
		this.props.media[this.props.index].decision = true;
		this.props.media[this.props.index].reviewed = true;
		this.props.media[this.props.index].reviewed_at = Date.now() / 1000;
		const submission_date = new Date(this.props.media[this.props.index].submitted_at * 1000).toDateString();

		if (this.props.images) {
			var caption = building["contributed_media"][this.props.index].caption 
							+ " Image contributed by "
							+ this.props.media[this.props.index].contributor_name
							+ " ("
							+ this.props.media[this.props.index].contributor_contact
							+ ")"
							+ " on "
							+ submission_date
							+ ".";
			building["images"].push({
				filename: building["contributed_media"][this.props.index].filename,
				caption: caption,
			})
		}

		this.setState({ building: building }, () => {
			request
	            .post(`${api.endpoint}building/save`)
	            .send(this.state.building)
	            .set('Accept', 'application/json')
	            .end(err => {
	              if (err) console.warn(err);
	            });
		});
	}

	rejectSubmission() {
		const building = Object.assign({}, this.state.building);
		this.props.media[this.props.index].decision = false;
		this.props.media[this.props.index].reviewed = true;
		this.props.media[this.props.index].reviewed_at = Date.now() / 1000;

		this.setState({ building: building }, () => {
			request
	            .post(`${api.endpoint}building/save`)
	            .send(this.state.building)
	            .set('Accept', 'application/json')
	            .end(err => {
	              if (err) console.warn(err);
	            });
		});
	}

	render () {
		// Dates of Submission / Review
		let submitted_date = new Date(this.props.media[this.props.index].submitted_at * 1000).toDateString();
		let reviewed_time = this.props.media[this.props.index].reviewed_at;
		let reviewed_date = (reviewed_time == null) ? 
			"N/A" : 
			new Date(reviewed_time * 1000).toDateString();

		// Status of Review 
		let reviewed_state = this.props.media[this.props.index].reviewed;
		let active_button_style = reviewed_state ? 'button-accept-unactive' : 'button-accept-active ';
		let reject_button_style = reviewed_state ? 'button-reject-unactive' : 'button-reject-active ';
		let status = 'Not Yet Reviewed'
		if (reviewed_state) {
			status = this.props.media[this.props.index].decision ? 
				'Accepted' : 
				'Rejected';
		}

		return (
			<div className="review-contribution">
				<div className="row"> 
					<div className="title">Contributor: </div>
					{this.props.media[this.props.index].contributor_name}
				</div>
				<div className="row"> 
					<div className="title">Contact: </div>
					{this.props.media[this.props.index].contributor_contact}
				</div>
				<div className="row"> 
					<div className="title">Date: </div>
					{submitted_date}
				</div>
				<div className={active_button_style} onClick={reviewed_state ? null : this.acceptSubmission }>
					Accept
				</div>
				<div className="row"> 
					<div className={reject_button_style} onClick={reviewed_state ? null : this.rejectSubmission}>
						Reject
					</div>
				</div>
				<div className="row"> 
					<div className="title">Status: </div>
					{status}
				</div>
				<div className="title">Reviewed On: </div>
				{reviewed_date}
			</div>
		)
	}
}