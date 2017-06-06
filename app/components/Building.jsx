import React from 'react'
import LayoutToggle from './building/BuildingLayoutToggle'
import BuildingButtons from './building/BuildingButtons'
import BuildingEditButton from './building/BuildingEditButton'
import Gallery from './building/BuildingGallery'
import Related from './building/Related'
import Loader from './Loader'
import Map from './Map'

// helpers
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
      admin: false,

      // tour data for mapping
      tourNameToIndex: {}
    }

    this.toggleLayout = this.toggleLayout.bind(this)

    // getter for the text fields for a building
    this.getTextFields = this.getTextFields.bind(this)

    // getter and setter for building data
    this.getBuilding = this.getBuilding.bind(this)
    this.processBuilding = this.processBuilding.bind(this)

    // getter and setter for user admin status
    this.checkUserStatus = this.checkUserStatus.bind(this)
    this.processUserStatus = this.processUserStatus.bind(this)
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
  * Allow users to swap building and map positions
  **/

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
    const fields = [
      {
        label: 'Overview',
        button: {label: 'Overview', icon: 'overview'},
        href: 'description',
        component: <BuildingOverview building={this.state.building} />,
        collapsible: false,
        contentFields: [
          'overview_description'
        ]
      },
      {
        label: 'Building History',
        button: {label: 'Building History', icon: 'building'},
        href: 'buildingHistory',
        component: <BuildingHistory building={this.state.building} />,
        collapsible: true,
        contentFields: [
          'physical_description',
          'streetscape',
          'social_history',
          'site_history'
        ]
      },
      {
        label: 'Structural Data',
        button: {label: 'Structural Data', icon: 'structure'},
        href: 'structuralData',
        component: <BuildingStructuralData building={this.state.building} />,
        collapsible: true,
        contentFields: [
          'historic_use',
          'street_visibilities',
          'dimensions',
          'materials',
          'roof_types',
          'structural_conditions',
          'past_tenants',
          'accessibilities',
          'levels',
          'structures',
          'roof_materials'
        ]
      },
      {
        label: 'Resources',
        button: {label: 'Resources', icon: 'community'},
        href: 'resources',
        component: <BuildingResources building={this.state.building} />,
        collapsible: true,
        contentFields: [
          'archive_documents',
          'footnotes'
        ]
      }
    ];

    // only return fields if one or more of their contentFields are populated
    // in the current building
    let extantFields = [];
    if (!this.state.building) return;

    fields.map((field) => {
      let kept = false;
      field.contentFields.map((contentField) => {
        if (this.state.building[contentField] &&
            this.state.building[contentField].length &&
            !kept) {
          extantFields.push(field);
          kept = true;
        }
      })
    })

    return extantFields;
  }

  /**
  * Main render function
  **/

  render() {
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
      this.state.tourNameToIndex && building ?
          <Map buildings={[this.state.building]}
            tourNameToIndex={this.state.tourNameToIndex}
            initialLocation={location} />
        : <Loader />
    )

    const layout = {
      'Map': map,
      'Gallery': <Gallery building={this.state.building} />
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
              <div className='bottom'>
                <h1 className='label'>Related Buildings</h1>
                <Related building={this.state.building} />
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
        </div>
      </div>
    )
  }
}