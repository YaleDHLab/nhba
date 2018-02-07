import React from 'react';
import GlossaryItem from './GlossaryItem';
import api from '../../../config';
import request from 'superagent';
import _ from 'lodash';

export default class EditSimplePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      glossaryItems: [],
    };

    // getters and setters for glossary data
    this.handleApiResponse = this.handleApiResponse.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);

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
      glossaryItems: this.sortItems(glossaryItems),
    });
  }

  /**
   * Event listeners for text changes
   **/

  handleTextChange(e, field, termIndex) {
    let glossaryItems = Object.assign([], this.state.glossaryItems);
    glossaryItems[termIndex][field] = e.target.value;
    this.setState({ glossaryItems: this.sortItems(glossaryItems) });
  }

  /**
   * Add a new glossary item
   **/

  addNewItem() {
    let glossaryItems = Object.assign([], this.state.glossaryItems);
    glossaryItems.push({});

    this.setState({ glossaryItems: this.sortItems(glossaryItems) });
  }

  /**
   * Delete an extant glossary item
   **/

  deleteItem(idx) {
    let glossaryItems = Object.assign([], this.state.glossaryItems);
    const filtered = _.remove(glossaryItems, (d, i) => i != idx);

    this.setState({ glossaryItems: this.sortItems(filtered) }, () => {
      this.saveGlossary();
    });
  }

  /**
   * Sort a list of glossary items alphabetically by term
   **/

  sortItems(items) {
    return _.sortBy(items, 'term');
  }

  /**
   * Save all glossary items
   **/

  saveGlossary() {
    const glossaryItems = Object.assign([], this.state.glossaryItems);

    request
      .post(api.endpoint + 'glossary/save')
      .send(glossaryItems)
      .set('Accept', 'application/json')
      .end(err => {
        if (err) console.warn(err);
      });
  }

  render() {
    return (
      <div className="form edit-glossary">
        <div className="form-content">
          <h1>Glossary</h1>
          <div className="instructions">
            {'Add definitions....style guide and directions here.'}
          </div>
          {this.state.glossaryItems.map((item, idx) => {
            return (
              <GlossaryItem
                key={idx}
                item={item}
                index={idx}
                handleTextChange={this.handleTextChange}
                deleteItem={this.deleteItem}
              />
            );
          })}
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
