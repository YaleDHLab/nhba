import React from 'react';
import Filters from './Filters';
import Cards from './Cards';
import Map from './Map';
import api from '../../config';
import getTourNameToIndex from './lib/getTourNameToIndex';
import getBuildingQueryUrl from './lib/getBuildingQueryUrl';

const selectFields = [
  'tours',
  'building_types',
  'current_uses',
  'styles',
  'eras',
  'neighborhoods'
];

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buildings: [],
      tourNameToIndex: null,

      // select fields
      tours: new Set(),
      building_types: new Set(),
      current_uses: new Set(),
      styles: new Set(),
      eras: new Set(),
      neighborhoods: new Set(),
      sort: 'updated_at',

      // store the user location && watcher id
      userLocation: null,
      watchId: null
    };

    // getters and setters for buildings and tour color mappings
    this.processBuildings = this.processBuildings.bind(this);
    this.getTourNameToIndex = getTourNameToIndex.bind(this);

    // setters for search selects and input
    this.updateSelect = this.updateSelect.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.handleInputKeys = this.handleInputKeys.bind(this);

    // method to un/follow the user's location
    this.watchUserLocation = this.watchUserLocation.bind(this);
    this.unwatchUserLocation = this.unwatchUserLocation.bind(this);

    // method that executes search
    this.runSearch = this.runSearch.bind(this);
  }

  componentDidMount() {
    this.runSearch(this.state);
    this.watchUserLocation();
  }

  componentWillUnmount() {
    this.unwatchUserLocation();
  }

  processBuildings(err, res) {
    if (err) {
      console.warn(err);
    } else {
      this.setState({ buildings: res.body });
      if (!this.state.tourNameToIndex) {
        this.setState({ tourNameToIndex: this.getTourNameToIndex(res.body) });
      }
    }
  }

  // Handle inputs
  updateSelect(field, option) {
    const state = Object.assign({}, this.state);
    if (state[field].has(option)) {
      state[field].delete(option);
    } else {
      state[field].add(option);
    }

    this.runSearch(state);
    this.setState(state);
  }

  updateSort(e) {
    const state = Object.assign({}, this.state);
    state.sort = e.target.value;

    this.runSearch(state);
    this.setState(state);
  }

  handleInputKeys(e) {
    if (e.keyCode === 13) {
      this.runSearch(this.state);
    }
  }

  // Follow user location
  watchUserLocation() {
    const watchId = navigator.geolocation.watchPosition(position => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });
    });
    this.setState({ watchId });
  }

  unwatchUserLocation() {
    navigator.geolocation.clearWatch(this.state.watchId);
  }

  // Alow functions to pass a copy of the component state so
  // we can trigger search without waiting for state to trickle down
  runSearch(state) {
    let url = getBuildingQueryUrl(state, selectFields);
    if (this.props.admin) {
      url += '&creator=true';
    }
    // add search terms (if any)
    const textSearch = document.querySelector('.building-search').value;
    if (textSearch) url += `fulltext=${encodeURIComponent(textSearch)}`;
    api.get(url, this.processBuildings);
  }

  render() {
    return (
      <div className="search">
        <Filters
          {...this.state}
          updateSelect={this.updateSelect}
          updateFulltextSearch={this.updateFulltextSearch}
          runSearch={this.runSearch}
          handleInputKeys={this.handleInputKeys}
          updateSort={this.updateSort}
        />
        <Cards buildings={this.state.buildings} />
        <Map
          buildings={this.state.buildings}
          tourNameToIndex={this.state.tourNameToIndex}
          userLocation={this.state.userLocation}
        />
      </div>
    );
  }
}
