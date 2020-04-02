import React from 'react';
import Gallery from '../building/BuildingGallery';

import api from '../../../config';

export default class ReviewContributedMedia extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			buildings: {},
			layout: {'right' : 'Gallery'},
		}

		this.getContributedMedia = this.getContributedMedia.bind(this);
		this.processContributedMedia = this.processContributedMedia.bind(this);
	}

	componentDidMount() {
		this.getContributedMedia();
	}

	getContributedMedia() {
		api.get(`buildings?contributedMedia=${true}`, this.processContributedMedia);
	}

	processContributedMedia(err, res) {
		if (err) {
			console.warn(err);
		} else {
			// To-do: Set to all buildings of res.body
			this.setState({ buildings: res.body});
		}
	}

	render() {

		const buildingsToReview = [];
		for (var i = 0; i < this.state.buildings.length; i++) {
			buildingsToReview.push(
				<div className="building">
					<div className="building-content">
		          		<div className="top">
		            		<div className="left">
		            		</div>
		            		<div className="right">
		            			<h1 className="address">{this.state.buildings[i].building_name}</h1>
		              			{this.state.buildings[i].images &&
		               			 this.state.buildings[i].images.length > 0 && (
		                 		 <div className="top-right-top">
		                    		<Gallery 
		                    			building={this.state.buildings[i]} 
		                    			images={this.state.buildings[i].contributed_media}
		                    			layout={this.state.layout} 
		                    		/>
		                  		</div>
		                  		)}
		            		</div>
		          		</div>
		        	</div>
		      	</div>
			)
		}

		return (
			<div>
				{buildingsToReview}
			</div>
		);
	}
}