import React from 'react'
import Filters from './Filters'
import Cards from './Cards'
import Map from './Map'
import api from '../../config'

export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buildings: []
    }

    this.processBuildings = this.processBuildings.bind(this)
  }

  componentDidMount() {
    api.get('buildings?images=true', this.processBuildings)
  }

  processBuildings(err, res) {
    if (err) { console.warn(err) } else {
      const buildings = res.body;
      this.setState({buildings: buildings})
    }
  }

  render() {
    return (
      <div className='search'>
        <Filters buildings={this.state.buildings} />
        <Cards buildings={this.state.buildings} />
        <Map buildings={this.state.buildings} />
      </div>
    )
  }
}
