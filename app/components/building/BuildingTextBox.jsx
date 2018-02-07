import React from 'react';
import getNewlineMarkup from '../lib/getNewlineMarkup';

export default class TextBox extends React.Component {
  render() {
    return this.props.title && this.props.text ? (
      <div className="building-overview">
        <h2>{this.props.title}</h2>
        <p dangerouslySetInnerHTML={getNewlineMarkup(this.props.text)} />
      </div>
    ) : (
      <span />
    );
  }
}
