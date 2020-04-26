import React from 'react';
import getNewlineMarkup from '../lib/getNewlineMarkup';
import ReviewContribution from './BuildingReviewContribution';

export default class BuildingGalleryDiscussion extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			commentIndex: 0,
		};

		// pagination buttons for comments
		this.decrementCommentIndex = this.decrementCommentIndex.bind(this);
		this.incrementCommentIndex = this.incrementCommentIndex.bind(this);
	}

	/**
	 * Paginate through building comments
	**/
	decrementCommentIndex(e) {
		e.preventDefault();
	    e.stopPropagation();
	    const commentIndex = this.state.commentIndex;
	    const newIndex =
	      commentIndex > 0 ? commentIndex - 1 : this.props.comments.length - 1;
	    this.setState({ commentIndex: newIndex });

	}

	incrementCommentIndex(e) {
		e.preventDefault();
	    e.stopPropagation();
	    const commentIndex = this.state.commentIndex;
	    const newIndex = (commentIndex + 1) % this.props.comments.length;
	    this.setState({ commentIndex: newIndex });
	}

	render() {
		return(
			<div>
				<ReviewContribution
		        	building={this.props.building}
		        	media={this.props.comments}
		        	images={false}
		        	index={this.state.commentIndex}
		      	/>
				<div
                className="image-index-button-review decrement"
                onClick={this.decrementCommentIndex}
              	/>
              	<div
                className="image-index-button-review increment"
                onClick={this.incrementCommentIndex}
              	/>
				<div className="comment-content" dangerouslySetInnerHTML =
					{getNewlineMarkup(this.props.comments[this.state.commentIndex].comment)} 
				/>
			</div>
		)
	}

}
