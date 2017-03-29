import React from 'react'
import Map from './Map'
import BuildingButtons from './BuildingButtons'
import BuildingText from './BuildingText'
import Related from './Related'
import api from '../../config'

export default class Building extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      building: {}
    }

    this.getBuilding = this.getBuilding.bind(this)
    this.processBuilding = this.processBuilding.bind(this)
    this.getStyle = this.getStyle.bind(this)
  }

  componentWillMount() {
    this.getBuilding()
  }

  getBuilding() {
    const buildingId = this.props.location.query.id;
    api.get('buildings?buildingId=' + buildingId, this.processBuilding)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.query.id != prevProps.location.query.id) {
      this.getBuilding()
    }
  }

  getStyle() {
    const resources = this.state.building.resources;
    if (resources) {
      return {
        backgroundImage: 'url(' + resources[0].url + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
      }
    }
  }

  processBuilding(err, res) {
    if (err) { console.log(err) } else {
      const building = Object.assign({}, res.body[0])
      this.setState({building: building})
    }
  }

  render() {
    return (
      <div className='building'>
        <div className='building-content'>
          <div className='top'>

            <div className='left'>
              <div className='top-left-top'>
                <Map />
              </div>
              <div className='top-left-bottom'>
                <BuildingButtons />
              </div>
            </div>

            <div className='right'>
              <div className='top-right-top background-image' style={this.getStyle()}></div>
              <div className='top-right-bottom'>
                <BuildingText building={this.state.building} />
              </div>
            </div>

          </div>
          <div className='bottom'>
            <Related />
          </div>
        </div>
      </div>
    )
  }
}