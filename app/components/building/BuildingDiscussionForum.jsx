import React from 'react';
import getNewlineMarkup from '../lib/getNewlineMarkup';
import DiscussionLightbox from './BuildingLightboxDiscussion';

export default class BuildingDiscussionForum extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
	      showDiscussionLightbox: false
	    };

		this.toggleDiscussionLightbox = this.toggleDiscussionLightbox.bind(this);
		this.closeLightbox = this.closeLightbox.bind(this);

	}

	toggleDiscussionLightbox() {
		const lightbox = this.state.showDiscussionLightbox;
		this.setState({ showDiscussionLightbox: !lightbox });
	}

	closeLightbox() {
		this.setState({ showDiscussionLightbox: false });
	}

	render() {
		let lightbox = this.state.showDiscussionLightbox ? 
			<DiscussionLightbox
                building={this.props.building}
                closeLightbox={this.closeLightbox}
             /> : null;
		const thread = []
		if (this.props.building.comments && this.props.building.comments.length > 0) {
			for (var i = 0; i < this.props.building.comments.length; i++) {
				if (this.props.building.comments[i].decision == true) {
					let submitted_date = new Date(this.props.building.comments[i].submitted_at * 1000).toDateString();
					thread.push(
						<div key={i} className="comment-row">
							<div className="contact">
								<div className="name"> {this.props.building.comments[i].contributor_name} </div>
								<div className="details"> {submitted_date} </div>
								<div className="details"> {this.props.building.comments[i].contributor_contact} </div>
							</div>
							<div className="content" dangerouslySetInnerHTML={getNewlineMarkup(
								this.props.building.comments[i].comment)
							} />
						</div>
					)
				}
			}
		}
		return (
			<div>
				<div className="forum-header">
					<div className="title">Comments ({thread.length})</div>
					<div 
			          className="comment-button"
			          onClick={this.toggleDiscussionLightbox}
			        >
			          Add a Comment
					</div>
				</div>
				{thread}
				{lightbox}
			</div>
		);
	}
}