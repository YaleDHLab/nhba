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

const getAdminSearchInput = () => {
  return document.querySelector('input.admin-search');
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
      'sort': 'Sort by',

      // store the user location && watcher id
      'userLocation': null,
      'watchId': null
    }

    // getters and setters for buildings and tours
    this.processBuildings = this.processBuildings.bind(this)
    this.processTours = processTours.bind(this)

    // setters for search selects and input
    this.updateSelect = this.updateSelect.bind(this)
    this.updateSort = this.updateSort.bind(this)
    this.handleInputKeys = this.handleInputKeys.bind(this)

    // method to un/follow the user's location
    this.watchUserLocation = this.watchUserLocation.bind(this)
    this.unwatchUserLocation = this.unwatchUserLocation.bind(this)

    // methods that execute search
    this.runFulltextSearch = this.runFulltextSearch.bind(this)
    this.runSearch = this.runSearch.bind(this)
  }

  componentDidMount() {
    api.get('buildings?images=true', this.processBuildings);
    api.get('wptours', this.processTours);
    this.watchUserLocation();
  }

  componentDidUpdate() {
    // bind an event listener to the admin search button
    const adminSearch = getAdminSearchButton(),
        adminInput = getAdminSearchInput();
    if (adminSearch) adminSearch.addEventListener('click', this.runFulltextSearch);
    if (adminInput) adminInput.addEventListener('keydown', this.handleInputKeys);
  }

  componentWillUnmount() {
    const adminSearch = getAdminSearchButton(),
        adminInput = getAdminSearchInput();
    if (adminSearch) adminSearch.removeEventListener('click', this.runFulltextSearch);
    if (adminInput) adminInput.removeEventListener('keydown', this.handleInputKeys);
    this.unwatchUserLocation()
  }

  processBuildings(err, res) {
    if (err) { console.warn(err) } else {
      this.setState({buildings: res.body})
    }
  }

  /**
  * Handle inputs
  **/

  updateSelect(field, option) {
    let state = Object.assign({}, this.state);
    state[field].has(option) ?
        state[field].delete(option)
      : state[field].add(option);

    this.runSearch(state);
    this.setState(state);
  }

  updateSort(e) {
    let state = Object.assign({}, this.state);
    state.sort = e.target.value;

    this.runSearch(state);
    this.setState(state);
  }

  handleInputKeys(e) {
    if (e.keyCode == 13) this.runFulltextSearch()
  }

  /**
  * Follow user location
  **/

  watchUserLocation() {
    const watchId = navigator.geolocation.watchPosition((position) => {
      this.setState({
        'userLocation': {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      })
    })
    this.setState({watchId: watchId})
  }

  unwatchUserLocation() {
    navigator.geolocation.clearWatch(this.state.watchId)
  }

  /**
  * Seach runners
  **/

  runFulltextSearch() {
    // get the query url containing select filters data
    let url = getBuildingQueryUrl(this.state, selectFields);

    // add the full text search to the query
    const textSearch = document.querySelector('.building-search').value;
    url += 'fulltext=' + encodeURIComponent(textSearch);

    // run the search and process the results
    api.get(url, this.processBuildings);
  }

  /**
  * Alow functions to pass a copy of the component state so
  * we can trigger search without waiting for state to trickle down
  **/

  runSearch(state) {
    const url = getBuildingQueryUrl(state, selectFields);
    api.get(url, this.processBuildings);
  }

  /**
  * Render
  **/

  render() {
    return (
      <div className='search'>
        <Filters {...this.state}
          tourIdToTitle={this.state.tourIdToTitle}
          updateSelect={this.updateSelect}
          updateFulltextSearch={this.updateFulltextSearch}
          runFulltextSearch={this.runFulltextSearch}
          handleInputKeys={this.handleInputKeys}
          updateSort={this.updateSort} />
        <Cards buildings={this.state.buildings} />
        <Map buildings={this.state.buildings}
          tourIdToIndex={this.state.tourIdToIndex}
          userLocation={this.state.userLocation} />
      </div>
    )
  }
}
