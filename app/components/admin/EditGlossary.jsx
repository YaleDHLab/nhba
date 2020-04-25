import React from 'react';
import request from 'superagent';
import _ from 'lodash';

import api from '../../../config';
import GlossaryItem from './GlossaryItem';

export default class EditSimplePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      glossaryItems: [],
      savedUpdates: false,
    };

    // getters and setters for glossary data
    this.handleApiResponse = this.handleApiResponse.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);

    // button callbacks to add new items & save all items
    this.addNewItem = this.addNewItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.saveGlossary = this.saveGlossary.bind(this);

    // helper to sort a list of glossary items alphabetically
    this.sortItems = this.sortItems.bind(this);
  }

  componentWillMount() {
    api.get('glossary', this.handleApiResponse);
  }

  handleApiResponse(err, res) {
    if (err) console.warn(err);
    const glossaryItems = res.body;

    this.setState({
      glossaryItems: this.sortItems(glossaryItems)
    });
  }

  /**
   * Event listeners for text/image changes
   * */

  handleTextChange(value, field, termIndex) {
    const glossaryItems = Object.assign([], this.state.glossaryItems);
    glossaryItems[termIndex][field] = value;
    this.setState({ glossaryItems: glossaryItems, savedUpdates: false });
  }

  handleImageUpload(termIndex, images) {
    const glossaryItems = Object.assign([], this.state.glossaryItems);
    glossaryItems[termIndex]["images"] = images;
    this.setState({ glossaryItems: glossaryItems });
  }

  /**
   * Add a new glossary item
   * */

  addNewItem() {
    const glossaryItems = Object.assign([], this.state.glossaryItems);
    glossaryItems.push({});

    this.setState({ glossaryItems: glossaryItems, savedUpdates: false });
  }

  /**
   * Delete an extant glossary item
   * */

  deleteItem(idx) {
    const glossaryItems = Object.assign([], this.state.glossaryItems);
    const filtered = _.remove(glossaryItems, (d, i) => i != idx);

    this.setState({ glossaryItems: filtered }, () => {
      this.saveGlossary();
    });
  }

  /**
   * Sort a list of glossary items alphabetically by term
   * */

  sortItems(items) {
    return _.sortBy(items, 'term');
  }

  /**
   * Save all glossary items
   * */

  saveGlossary() {
    const glossaryItems = Object.assign([], this.state.glossaryItems);
    this.sortItems(glossaryItems);

    request
      .post(`${api.endpoint}glossary/save`)
      .send(glossaryItems)
      .set('Accept', 'application/json')
      .end(err => {
        if (err) console.warn(err);
      });

    this.setState({ savedUpdates : true })
  }

  render() {
    const savedMessage = this.state.savedUpdates ?
      <div className="saved-message">Changes have been successfully saved.</div>
      : null;

    return (
      <div className="form edit-glossary">
        <div className="form-content">
          <h1>Glossary</h1>
          <div className="instructions">
            {'Add vocabulary, definitions, and illustrative examples here. Make sure every term and definition is filled out or Glossary page will not load properly.'}
          </div>
          {this.state.glossaryItems.map((item, idx) => (
              <GlossaryItem
                key={idx}
                item={item}
                index={idx}
                handleTextChange={this.handleTextChange}
                deleteItem={this.deleteItem}
                handleImageUpload={this.handleImageUpload}
              />
          ))}
          {savedMessage}
          <div className="yellow-button" onClick={this.saveGlossary}>
            Save
          </div>
          <div className="gray-button add-new-button" onClick={this.addNewItem}>
            Add New
          </div>
        </div>
      </div>
    );
  }
}
