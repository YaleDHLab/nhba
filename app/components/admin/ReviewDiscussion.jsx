import React from 'react';
import Gallery from '../building/BuildingGalleryDiscussion';

import api from '../../../config';

export default class ReviewDiscussion extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			buildings: {},
		}

		this.getDiscussionComments = this.getDiscussionComments.bind(this);
		this.processDiscussionComments = this.processDiscussionComments.bind(this);
	}

	componentDidMount() {
		this.getDiscussionComments();
	}

	getDiscussionComments() {
		api.get(`buildings?comments=${true}`, this.processDiscussionComments);
	}

	processDiscussionComments(err, res) {
		if (err) {
			console.warn(err);
		} else {
			this.setState({ buildings: res.body });
		}
	}

	render() {
		let buildingsToReview = [];
		for (var i = 0; i < this.state.buildings.length; i++) {
			if (this.state.buildings[i].comments.length > 0) {
				buildingsToReview.push(
					<div key={i} className="building">
						<div className="building-content">
			          		<div className="top">
			            		<div className="left">
			            		</div>
			            		<div className="right">
			            			<h1 className="address">{this.state.buildings[i].building_name}</h1>
			                 		 <div className="top-right-top">
			                    		<Gallery 
			                    			building={this.state.buildings[i]} 
			                    			comments={this.state.buildings[i].comments}
			                    		/>
			                  		</div>
				       
			            		</div>
			          		</div>
			        	</div>
			      	</div>
				)
			}
		}

		if (buildingsToReview.length == 0) {
			buildingsToReview = <div>There are no pending comments to review.</div>
		}

		return (
			<div>
				{buildingsToReview}
			</div>
		)
	}

}