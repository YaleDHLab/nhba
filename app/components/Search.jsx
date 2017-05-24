import React from 'react'
import Filters from './Filters'
import Cards from './Cards'
import Map from './Map'
import api from '../../config'
import processTours from './lib/processTours'
import getBuildingQueryUrl from './lib/getBuildingQueryUrl'
import _ from 'lodash'

const selectFields = [
  'tour_ids',
  'building_types',
  'current_uses',
  'styles',
  'eras',
  'neighborhoods'
]

const getAdminSearchButton = () => {
  return document.querySelector('.admin-search-button');
}

export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buildings: [],
      tourIdToTitle: {},
      tourIdToIndex: {},

      // select fields
      'tour_ids': new Set(),
      'building_types': new Set(),
      'current_uses': new Set(),
      'styles': new Set(),
      'eras': new Set(),
      'neighborhoods': new Set(),
      'sort': null
    }

    // getters and setters for buildings and tours
    this.processBuildings = this.processBuildings.bind(this)
    this.processTours = processTours.bind(this)

    // setters for search components
    this.updateSelect = this.updateSelect.bind(this)

    // method that handles keydown events in input box
    this.handleInputKeys = this.handleInputKeys.bind(this)

    // methods that execute search
    this.runFulltextSearch = this.runFulltextSearch.bind(this)
    this.runSearch = this.runSearch.bind(this)
  }

  componentDidMount() {
    api.get('buildings?images=true', this.processBuildings)
    api.get('wptours', this.processTours)

    // bind an event listener to the admin search button
    var adminSearch = getAdminSearchButton()
    if (adminSearch) adminSearch.addEventListener('click', this.runFulltextSearch)
  }

  componentWillUnmount() {
    var adminSearch = getAdminSearchButton()
    if (adminSearch) adminSearch.removeEventListener('click', this.runFulltextSearch)
  }

  processBuildings(err, res) {
    if (err) { console.warn(err) } else {
      this.setState({buildings: res.body})
    }
  }

  updateSelect(field, option) {
    let state = Object.assign({}, this.state)
    state[field].has(option) ?
        state[field].delete(option)
      : state[field].add(option)

    this.setState(state, () => {
      this.runSearch()
    })
  }

  handleInputKeys(e) {
    if (e.keyCode == 13) this.runFulltextSearch()
  }

  runFulltextSearch() {
    // get the query url containing select filters data
    let url = getBuildingQueryUrl(this.state, selectFields);

    // add the full text search to the query
    const textSearch = document.querySelector('.building-search').value;
    url += 'fulltext=' + encodeURIComponent(textSearch);

    // run the search and process the results
    api.get(url, this.processBuildings);
  }

  runSearch() {
    const url = getBuildingQueryUrl(this.state, selectFields);
    api.get(url, this.processBuildings);
  }

  render() {
    return (
      <div className='search'>
        <Filters {...this.state}
          tourIdToTitle={this.state.tourIdToTitle}
          updateSelect={this.updateSelect}
          updateFulltextSearch={this.updateFulltextSearch}
          runFulltextSearch={this.runFulltextSearch}
          handleInputKeys={this.handleInputKeys} />
        <Cards buildings={this.state.buildings} />
        <Map buildings={this.state.buildings}
          tourIdToIndex={this.state.tourIdToIndex} />
      </div>
    )
  }
}
