import React from 'react';
import api from '../../../config';
import _ from 'lodash';
import getNewlineMarkup from '../lib/getNewlineMarkup';

export default class SimplePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      paragraphs: [],
      glossaryterms: []
    };
  }

  /**
   * Handle eiter flat page (about + contact) or glossary text
   * */

  componentWillMount() {
    api.get(this.props.route, (err, res) => {
      if (err) console.warn(err);

      this.props.flat
        ? this.setState({ text: res.body[0].text })
        : this.setState({ glossaryterms: _.sortBy(res.body, 'term') });
    });
  }

  render() {
    console.log(
      this.state.glossaryterms
        .map((t, i) => (
          <div key={i}>
            <b>{t.term}</b>
            <p>{t.definition}</p>
          </div>
        ))
        .join('')
    );
    const bodyText = this.props.flat
      ? this.state.text
      : this.state.glossaryterms.map((t, i) => (
          <div key={i}>
            <b>{t.term}</b>
            <p>{t.definition}</p>
          </div>
        ));

    return (
      <div className="simple-page">
        <div className="hero">
          <div
            className="background-image"
            style={{ backgroundImage: `url(${this.props.image})` }}
          />
        </div>
        <div className="container">
          <h1 className="title">{this.props.title}</h1>
          {this.props.flat ? (
            <div
              className="body-text"
              dangerouslySetInnerHTML={getNewlineMarkup(bodyText)}
            />
          ) : (
            <div className="body-text">{bodyText}</div>
          )}
        </div>
      </div>
    );
  }
}
