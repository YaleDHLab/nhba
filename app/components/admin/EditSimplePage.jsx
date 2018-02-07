import React from 'react';
import api from '../../../config';
import request from 'superagent';

export default class EditSimplePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      title: '',
    };

    // getters for simple page data
    this.getRoute = this.getRoute.bind(this);
    this.handleApiResponse = this.handleApiResponse.bind(this);

    // setters for simple page fields
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);

    // save new page data
    this.savePage = this.savePage.bind(this);
  }

  componentWillMount() {
    const route = this.getRoute();
    api.get(route, this.handleApiResponse);
  }

  handleApiResponse(err, res) {
    if (err) console.warn(err);
    const route = this.getRoute();
    const page = res.body[0];

    this.setState({
      title: route.charAt(0).toUpperCase() + route.slice(1),
      text: page.text,
    });
  }

  getRoute() {
    return this.props.location.pathname.replace('/admin/', '');
  }

  /**
   * Event listeners for text changes
   **/

  handleTitleChange() {
    // pass, as this should be static
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  /**
   * Post the page data to the db
   **/

  savePage() {
    let page = Object.assign({}, this.state);

    request
      .post(api.endpoint + this.getRoute() + '/save')
      .send(page)
      .set('Accept', 'application/json')
      .end(err => {
        if (err) console.warn(err);
      });
  }

  render() {
    return (
      <div className="form edit-simple-page">
        <div className="form-content">
          <h1>{this.state.title}</h1>
          <div className="instructions">
            {'Edit page content here. For headings, use <b> tags.'}
          </div>
          <div className={'text-input full-width'}>
            <div className="label">Page Title</div>
            <input
              type="text"
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
          </div>
          <div className={'full-width text-area'}>
            <div className="label">Body Text</div>
            <textarea
              className="custom-textarea"
              onChange={this.handleTextChange}
              rows={35}
              placeholder="(200 words) Style guide..."
              value={this.state.text}
            />
          </div>

          <div className="center-save-button">
            <div className="yellow-button" onClick={this.savePage}>
              Save
            </div>
          </div>
        </div>
      </div>
    );
  }
}
