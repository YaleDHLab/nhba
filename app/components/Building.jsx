import React from 'react'
import LayoutToggle from './building/BuildingLayoutToggle'
import BuildingButtons from './building/BuildingButtons'
import BuildingText from './building/BuildingText'
import SuggestEdit from './building/SuggestEdit'
import Related from './building/Related'
import Map from './Map'
import api from '../../config'

const fields = [
  {
    text: {label: 'Description', field: 'overview_description'},
    button: {label: 'Overview', icon: 'overview'},
    href: 'description'
  },
  {
    text: {label: 'Site History', field: 'site_history'},
    button: {label: 'BuildingHistory', icon: 'building'},
    href: 'siteHistory'
  },
  {
    text: {label: 'Physical Description', field: 'physical_description'},
    button: {label: 'Structural Data', icon: 'structure'},
    href: 'physicalDescription'
  },
  {
    text: {label: 'Social History', field: 'social_history'},
    button: {label: 'Community Stories', icon: 'community'},
    href: 'socialHistory'
  }
]

export default class Building extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      building: {},
      layout: {left: 'Map', 'right': 'Gallery'},
      imageIndex: 0
    }

    this.getStyle = this.getStyle.bind(this)
    this.getBuilding = this.getBuilding.bind(this)
    this.toggleLayout = this.toggleLayout.bind(this)
    this.processBuilding = this.processBuilding.bind(this)
    this.incrementImageIndex = this.incrementImageIndex.bind(this)
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

  processBuilding(err, res) {
    if (err) { console.warn(err) } else {
      const building = Object.assign({}, res.body[0])
      this.setState({building: building})
    }
  }

  getStyle() {
    const images = this.state.building.images;
    if (images) {
      const dir = '/assets/uploads/resized/large/'
      const image = dir + images[this.state.imageIndex].filename;
      return {
        backgroundImage: 'url(' + image + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
      }
    }
  }

  incrementImageIndex() {
    const imageIndex = this.state.imageIndex;
    const newIndex = (imageIndex + 1) % this.state.building.images.length;
    this.setState({imageIndex: newIndex})
  }

  toggleLayout() {
    const layout = this.state.layout.left == 'Map' ?
        {left: 'Gallery', right: 'Map'}
      : {left: 'Map',  right: 'Gallery'}
    this.setState({layout: layout})
  }

  render() {
    const style = this.getStyle()

    const gallery = (
      <div className='top-right-top background-image'
        style={style}
        onClick={this.incrementImageIndex} />
    )

    const layout = {
      'Map': <Map />,
      'Gallery': gallery
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
                  <SuggestEdit building={this.state.building} />
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