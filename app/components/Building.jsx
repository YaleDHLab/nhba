import React from 'react'
import BuildingButtons from './building/BuildingButtons'
import BuildingText from './building/BuildingText'
import LayoutToggle from './building/BuildingLayoutToggle'
import Related from './building/Related'
import Map from './Map'
import api from '../../config'

const fields = [
  {
    text: {label: 'Description', field: 'description'},
    button: {label: 'Overview', icon: 'overview'},
    href: 'description'
  },
  {
    text: {label: 'Site History', field: 'siteHistory'},
    button: {label: 'BuildingHistory', icon: 'building'},
    href: 'siteHistory'
  },
  {
    text: {label: 'Physical Description', field: 'physicalDescription'},
    button: {label: 'Structural Data', icon: 'structure'},
    href: 'physicalDescription'
  },
  {
    text: {label: 'Social History', field: 'socialHistory'},
    button: {label: 'Community Stories', icon: 'community'},
    href: 'socialHistory'
  }
]

export default class Building extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      building: {},
      layout: {left: 'Map', 'right': 'Gallery'}
    }

    this.getStyle = this.getStyle.bind(this)
    this.getBuilding = this.getBuilding.bind(this)
    this.toggleLayout = this.toggleLayout.bind(this)
    this.processBuilding = this.processBuilding.bind(this)
  }

  componentDidMount() {
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
    if (err) { console.warn(err) } else {
      const building = Object.assign({}, res.body[0])
      this.setState({building: building})
    }
  }

  toggleLayout() {
    const layout = this.state.layout.left == 'Map' ?
        {left: 'Gallery', right: 'Map'}
      : {left: 'Map',  right: 'Gallery'}
    this.setState({layout: layout})
  }

  render() {
    const style = this.getStyle()

    const layout = {
      'Map': <Map />,
      'Gallery': <div className='top-right-top background-image' style={style} />
    }

    return (
      <div className='building'>
        <div className='building-content'>
          <div className='top'>

            <div className='left'>
              <div className='left-content'>
                <div className='top-left-top'>
                  {layout[this.state.layout.left]}
                </div>
                <div className='top-left-bottom'>
                  <LayoutToggle toggleLayout={this.toggleLayout}
                    layout={this.state.layout} />
                  <BuildingButtons fields={fields} {...this.props} />
                </div>
              </div>
            </div>

            <div className='right'>
              {layout[this.state.layout.right]}
              <div className='top-right-bottom'>
                <BuildingText building={this.state.building} fields={fields} />
              </div>
            </div>

          </div>
          <div className='bottom'>
            <h1 className='label'>Related Buildings</h1>
            <Related />
          </div>
        </div>
      </div>
    )
  }
}