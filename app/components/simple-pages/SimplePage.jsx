import React from "react";
import api from "../../../config";
import request from "superagent";
import _ from "lodash";

export default class SimplePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paragraphs: [],
      glossaryterms: [],
    };
  }

  /**
   * Handle eiter flat page (about + contact) or glossary text
   **/

  componentWillMount() {
    api.get(this.props.route, (err, res) => {
      if (err) console.warn(err);

      this.props.flat
        ? this.setState({ paragraphs: res.body[0].text.split("\n\n") })
        : this.setState({ glossaryterms: _.sortBy(res.body, "term") });
    });
  }

  render() {
    const bodyText = this.props.flat
      ? this.state.paragraphs.map((p, i) => {
          return <p key={i}>{p}</p>;
        })
      : this.state.glossaryterms.map((t, i) => {
          return (
            <div key={i}>
              <b>{t.term}</b>
              <p>{t.definition}</p>
            </div>
          );
        });

    return (
      <div className="simple-page">
        <div className="hero">
          <div
            className="background-image"
            style={{ backgroundImage: "url(" + this.props.image + ")" }}
          />
        </div>
        <div className="container">
          <h1 className="title">{this.props.title}</h1>
          <div className="body-text">{bodyText}</div>
        </div>
      </div>
    );
  }
}
