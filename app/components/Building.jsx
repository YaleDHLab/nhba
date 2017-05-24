import React from 'react'
import LayoutToggle from './building/BuildingLayoutToggle'
import BuildingButtons from './building/BuildingButtons'
import BuildingEditButton from './building/BuildingEditButton'
import Related from './building/Related'
import Loader from './Loader'
import Map from './Map'
import processTours from './lib/processTours'
import api from '../../config'

// Building Text components
import BuildingText from './building/BuildingText'
import BuildingOverview from './building/BuildingOverview'
import BuildingHistory from './building/BuildingHistory'
import BuildingStructuralData from './building/BuildingStructuralData'
import BuildingResources from './building/BuildingResources'

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

    // getter for the text fields for a building
    this.getTextFields = this.getTextFields.bind(this)

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
  * Retrieve the fields required for creating building table and action buttons
  **/

  getTextFields() {
    return [
      {
        label: 'Overview',
        button: {label: 'Overview', icon: 'overview'},
        href: 'description',
        component: <BuildingOverview building={this.state.building} />,
        collapsible: false
      },
      {
        label: 'Building History',
        button: {label: 'Building History', icon: 'building'},
        href: 'buildingHistory',
        component: <BuildingHistory building={this.state.building} />,
        collapsible: true
      },
      {
        label: 'Structural Data',
        button: {label: 'Structural Data', icon: 'structure'},
        href: 'structuralData',
        component: <BuildingStructuralData building={this.state.building} />,
        collapsible: true
      },
      {
        label: 'Resources',
        button: {label: 'Resources', icon: 'community'},
        href: 'resources',
        component: <BuildingResources building={this.state.building} />,
        collapsible: true
      }
    ]
  }

  /**
  * Main render function
  **/

  render() {
    const gallery = this.state.building.images &&
      this.state.building.images.length > 1 ?
        <div className='background-image' style={this.getStyle()}>
          <div className='image-index-button decrement'
          onClick={this.decrementImageIndex}/>
          <div className='image-index-button increment'
            onClick={this.incrementImageIndex}/>
        </div>
      : <div className='background-image' style={this.getStyle()} />

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
                    fields={this.getTextFields()} {...this.props} />
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
                  fields={this.getTextFields()} />
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