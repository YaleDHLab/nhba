import React from 'react';
import api from '../../../config';
import _ from 'lodash';
import getNewlineMarkup from '../lib/getNewlineMarkup';
import Gallery from '../building/BuildingGallery';

export default class SimplePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      paragraphs: [],
      glossaryterms: [],
      layout: {'right' : 'Gallery'},
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
    const bodyText = this.props.flat
      ? this.state.text
      : this.state.glossaryterms.map((t, i) => (
          <div key={i}>
            <div className="term"><b>{t.term}</b></div>
            <div 
              className="definition" 
              dangerouslySetInnerHTML={getNewlineMarkup(t.definition)}
            />
            {t.images && t.images.length > 0 && (
              <div className="building">
                <div className="building-content">
                    <div className="top">
                      <div className="right">
                          <div className="top-right-top-glossary">
                            <Gallery 
                              images={t.images}
                              layout={this.state.layout} 
                              mediaReview={false}
                              disableModal={true}
                              showExpandIcon={false}
                            />
                          </div>
                      </div>
                    </div>
                </div>
              </div>
            )}
            <div className="glossary-divider"></div>
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
