import React from 'react'
import Tabs from './Tabs'
import Overview from './Overview'
import DataAndHistory from './DataAndHistory'
import ImageGallery from './ImageGallery'
import getSelectOptions from '../../lib/getSelectOptions'
import processTours from '../../lib/processTours'
import selects from '../../lib/selects.js'
import api from '../../../../config'

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buildings: [],
      options: {},

      building: {},
      activeTab: 'overview'
    }

    // buildling(s) getters and setters
    this.getBuilding = this.getBuilding.bind(this)
    this.getBuildings = this.getBuildings.bind(this)
    this.processBuilding = this.processBuilding.bind(this)
    this.processBuildings = this.processBuildings.bind(this)
    this.processTours = processTours.bind(this)

    // getter and setters for new building form
    this.getNewBuilding = this.getNewBuilding.bind(this)
    this.processNewBuilding = this.processNewBuilding.bind(this)

    // setter for the available select options
    this.setSelectOptions = this.setSelectOptions.bind(this)

    // form field navigation
    this.changeTab = this.changeTab.bind(this)

    // state setter
    this.updateField = this.updateField.bind(this)
  }

  componentDidMount() {
    // load the requested building data if query params are present
    const buildingId = this.props.location.query.buildingId;
    buildingId ?
        this.getBuilding(buildingId)
      : this.getNewBuilding()

    // fetch all available buildings so we can populate dropdowns
    this.getBuildings()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.state.buildings, prevState.buildings) ||
        !_.isEqual(this.state.tourIdToTitle, prevState.tourIdToTitle)) {
      this.setSelectOptions()
    }
  }

  /**
  * Building & Buildings getters and setters
  **/

  getBuilding(buildingId) {
    const url = 'buildings?buildingId=' + buildingId;
    api.get(url, this.processBuilding)
  }

  getBuildings() {
    api.get('buildings?images=true', this.processBuildings)
    api.get('wptours', this.processTours)
  }

  processBuilding(err, res) {
    if (err) {console.warn(err)} else {
      this.setState({building: res.body[0]})
    }
  }

  processBuildings(err, res) {
    if (err) { console.warn(err) } else {
      this.setState({buildings: res.body})
    }
  }

  /**
  * Prepare a new building in the app state. This method ensures
  * that each field for the building has the appropriate data type
  **/

  getNewBuilding() {
    api.get('buildings', this.processNewBuilding)
  }

  processNewBuilding(err, res) {
    if (err) console.warn(err)

    let building = res.body[0];
    _.keys(building).map((key) => {
      if (typeof building[key] === 'string') {
        building[key] = ''
      }
      if (typeof building[key] === 'number') {
        building[key] = null
      }
      if (Array.isArray(building[key])) {
        building[key] = []
      }
      delete building._id;
    })
    this.setState({building: res.body[0]})
  }

  /**
  * Get available select options
  **/

  setSelectOptions() {
    const buildings = this.state.buildings;
    const tourIdToTitle = this.state.tourIdToTitle;
    const options = getSelectOptions(buildings, selects, tourIdToTitle)
    this.setState({options: options})
  }

  /**
  * Change the tab of the form currently in view
  **/

  changeTab(tab) {
    this.setState({activeTab: tab})
  }

  /**
  * Update a given field in the form
  **/

  updateField(field, value) {

    // use Object.assign to avoid object mutations
    let building = Object.assign({}, this.state.building)

    // if the user has clicked or unclicked an option, update
    // the appropriate array accordingly
    if (Array.isArray(building[field])) {
      _.includes(building[field], value) ?
          _.pull(building[field], value)
        : building[field].push(value)
    } else {
      building[field] = value;
    }

    this.setState({building: building})
  }

  render() {
    let view = null;
    switch (this.state.activeTab) {
      case 'overview':
        view = <Overview
          building={this.state.building}
          updateField={this.updateField}
          options={this.state.options} />;
        break;

      case 'data-and-history':
        view = <DataAndHistory
          building={this.state.building}
          updateField={this.updateField}
          options={this.state.options} />;
        break;

      case 'image-gallery':
        view = <ImageGallery
          building={this.state.building}
          updateField={this.updateField}
          options={this.state.options} />;
        break;
    }

    const building = this.state.building;

    return (
      <div className='form'>
        <div className='form-content'>
          <h1>{building.address || 'New Building'}</h1>
          <div className='instructions'>Edit record for this building. General guidelines here...</div>
          <div>
            <Tabs activeTab={this.state.activeTab} changeTab={this.changeTab} />
            <div className='save-button'>Save</div>
          </div>
          {view}
        </div>
      </div>
    )
  }
}