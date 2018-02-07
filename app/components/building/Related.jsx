import React from 'react';
import _ from 'lodash';

import Card from '../Card';
import api from '../../../config';

export default class Related extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buildings: [],
      nearbyBuildings: [],
    };

    this.processBuildings = this.processBuildings.bind(this);
    this.findNearBuildings = this.findNearBuildings.bind(this);
  }

  componentDidMount() {
    api.get('buildings?images=true', this.processBuildings);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !_.isEqual(prevState.buildings, this.state.buildings) ||
      !_.isEqual(prevProps.building, this.props.building)
    ) {
      this.findNearBuildings();
    }
  }

  processBuildings(err, res) {
    if (err) {
      console.warn(err);
    } else {
      const buildings = res.body;
      this.setState({ buildings: buildings });
    }
  }

  /**
   * Find the n closest buildings to the currently displayed
   * building, as measured by the Euclidean distance between
   * the currently displayed building and all others (n=~200)
   **/

  findNearBuildings() {
    let nearbyBuildings = [];
    let distances = [];
    const buildings = this.state.buildings;

    if (!this.state.buildings.length || !this.props.building) return;

    const targetLat = parseFloat(this.props.building.latitude);
    const targetLng = parseFloat(this.props.building.longitude);

    buildings.map((building, idx) => {
      if (building._id !== this.props.building._id) {
        const lat = parseFloat(building.latitude);
        const lng = parseFloat(building.longitude);

        const dx = Math.abs(targetLng - lng);
        const dy = Math.abs(targetLat - lat);
        const distance = Math.pow(dx + dy, 0.5);

        distances.push({
          distance: distance,
          idx: idx,
          building: building,
        });
      }
    });

    const nearby = _.chain(distances)
      .sortBy('distance')
      .take(8)
      .value();

    nearby.map(building => {
      nearbyBuildings.push(buildings[building.idx]);
    });

    this.setState({ nearbyBuildings: nearbyBuildings });
  }

  render() {
    return (
      <div className="related">
        <div className="related-buildings">
          {this.state.nearbyBuildings.length > 0
            ? this.state.nearbyBuildings.map((building, i) => {
              return <Card building={building} key={i} label={'address'} />;
            })
            : null}
        </div>
      </div>
    );
  }
}
