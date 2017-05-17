import React from 'react'
import LayoutToggle from './building/BuildingLayoutToggle'
import BuildingButtons from './building/BuildingButtons'
import BuildingText from './building/BuildingText'
import BuildingEditButton from './building/BuildingEditButton'
import Related from './building/Related'
import Loader from './Loader'
import Map from './Map'
import processTours from './lib/processTours'
import api from '../../config'

const fields = [
  {
    text: {label: 'Overview', field: 'overview_description'},
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
      imageIndex: 0,
      admin: false,

      // tour data for mapping
      tourIdToIndex: {}
    }

    this.getStyle = this.getStyle.bind(this)
    this.toggleLayout = this.toggleLayout.bind(this)

    // pagination buttons for images
    this.decrementImageIndex = this.decrementImageIndex.bind(this)
    this.incrementImageIndex = this.incrementImageIndex.bind(this)

    // getter and setter for building data
    this.getBuilding = this.getBuilding.bind(this)
    this.processBuilding = this.processBuilding.bind(this)

    // getter and setter for user admin status
    this.checkUserStatus = this.checkUserStatus.bind(this)
    this.processUserStatus = this.processUserStatus.bind(this)

    // setter for mappings from building to tour Id for mapping
    this.processTours = processTours.bind(this)
  }

  componentDidMount() {
    this.getBuilding()
    this.checkUserStatus()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.query.id != prevProps.location.query.id) {
      this.getBuilding()
    }
  }

  /**
  * Getters and setters for the requested building
  **/

  getBuilding() {
    const buildingId = this.props.location.query.id;
    api.get('buildings?buildingId=' + buildingId, this.processBuilding)
  }

  processBuilding(err, res) {
    if (err) { console.warn(err) } else {
      const building = Object.assign({}, res.body[0])
      this.setState({building: building})
    }
  }

  /**
  * Check whether the user is an admin or not
  **/

  checkUserStatus() {
    api.get('session', this.processUserStatus)
  }

  processUserStatus(err, res) {
    if (err) console.warn(err)
    if (res.body.session.authenticated === true) {
      this.setState({admin: true})
    }
  }

  /**
  * Layout and style-related functions
  **/

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

  decrementImageIndex() {
    const imageIndex = this.state.imageIndex;
    const newIndex = imageIndex > 0 ?
        imageIndex-1
      : this.state.building.images.length-1;
    this.setState({imageIndex: newIndex})
  }

  toggleLayout() {
    const layout = this.state.layout.left == 'Map' ?
        {left: 'Gallery', right: 'Map'}
      : {left: 'Map',  right: 'Gallery'}
    this.setState({layout: layout})
  }

  /**
  * Main render function
  **/

  render() {
    const caption = this.state.building.images ?
        <div className='image-caption'>
          {this.state.building.images[this.state.imageIndex].caption}
        </div>
      : null;

    const gallery = (
      <div className='background-image'
        style={this.getStyle()}>
        <div className='image-index-button decrement'
          onClick={this.decrementImageIndex}/>
        <div className='image-index-button increment'
          onClick={this.incrementImageIndex}/>
        {caption}
      </div>
    )

    const building = this.state.building;
    const location = building &&
      building.latitude &&
      building.longitude ?
        {
          lat: parseFloat(building.latitude),
          lng: parseFloat(building.longitude)
        }
      : null

    const map = (
      this.state.tourIdToIndex && building ?
          <Map buildings={[this.state.building]}
            tourIdToIndex={this.state.tourIdToIndex}
            initialLocation={location} />
        : <Loader />
    )

    const layout = {
      'Map': map,
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
                  <LayoutToggle
                    toggleLayout={this.toggleLayout}
                    layout={this.state.layout} />
                  <BuildingButtons
                    fields={fields} {...this.props} />
                  <BuildingEditButton
                    admin={this.state.admin}
                    building={this.state.building} />
                </div>
              </div>
            </div>

            <div className='right'>
              <div className='top-right-top'>
                {layout[this.state.layout.right]}
              </div>
              <div className='top-right-bottom'>
                <BuildingText
                  building={this.state.building}
                  fields={fields} />
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