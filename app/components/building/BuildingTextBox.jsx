import React from 'react';
import getNewlineMarkup from '../lib/getNewlineMarkup';

export default class TextBox extends React.Component {
  render() {
    return this.props.title && this.props.text ? (
      <div className="building-overview">
        <p dangerouslySetInnerHTML={getNewlineMarkup(this.props.text)} />
      </div>
    ) : (
      <span />
    );
  }
}
