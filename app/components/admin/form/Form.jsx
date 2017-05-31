import React from 'react'
import Tabs from './Tabs'
import Overview from './Overview'
import DataAndHistory from './DataAndHistory'
import ImageGallery from './ImageGallery'
import getSelectOptions from '../../lib/getSelectOptions'
import processTours from '../../lib/processTours'
import allSelects from '../../lib/allSelects.js'
import api from '../../../../config'
import request from 'superagent'

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buildings: [],
      options: {},

      building: {},
      activeTab: 'overview',

      tourIdToTitle: {},

      unsavedChanges: false
    }

    // buildling(s) getters and setters
    this.getBuilding = this.getBuilding.bind(this)
    this.getBuildings = this.getBuildings.bind(this)
    this.processBuilding = this.processBuilding.bind(this)
    this.processBuildings = this.processBuildings.bind(this)

    // tour getter and setter
    this.getTours = this.getTours.bind(this)
    this.processTours = processTours.bind(this)

    // getter and setters for new building form
    this.getNewBuilding = this.getNewBuilding.bind(this)
    this.processNewBuilding = this.processNewBuilding.bind(this)

    // setter for the available select options
    this.setSelectOptions = this.setSelectOptions.bind(this)

    // callback triggered when users add a new option to a multiselect
    this.handleNewOption = this.handleNewOption.bind(this)

    // form field navigation
    this.changeTab = this.changeTab.bind(this)

    // methods to update/replace form fields
    this.updateField = this.updateField.bind(this)
    this.replaceField = this.replaceField.bind(this)

    // returns styles that indicate whether the form is dirty
    this.getSaveButtonStyle = this.getSaveButtonStyle.bind(this)

    // upsert a building
    this.saveBuilding = this.saveBuilding.bind(this)
  }

  componentDidMount() {
    // load the requested building data if query params are present
    const buildingId = this.props.location.query.buildingId;
    buildingId ?
        this.getBuilding(buildingId)
      : this.getNewBuilding()

    // fetch all buildings & tours so we can populate dropdowns
    this.getBuildings()
    this.getTours()
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
  * Get a mapping from tour id to tour label
  **/

  getTours() {
    api.get('wptours', this.processTours)
  }

  /**
  * Prepare a new building in the app state. This method ensures
  * that each field for the building has the appropriate data type
  **/

  getNewBuilding() {
    api.get('building/new', this.processNewBuilding)
  }

  processNewBuilding(err, res) {
    if (err) console.warn(err)
    this.setState({building: res.body})
  }

  /**
  * Get available select options
  **/

  setSelectOptions() {
    const buildings = this.state.buildings;
    const tourIdToTitle = this.state.tourIdToTitle;
    const options = getSelectOptions(buildings, allSelects, tourIdToTitle)
    this.setState({options: options})
  }

  /**
  * Callback triggered when users add a new option to a multiselect
  **/

  handleNewOption(field, value) {

    // add this value to the available options
    let options = Object.assign({}, this.state.options)
    options[field] ?
        options[field].push(value)
      : options[field] = [value]
    this.setState({options: options})

    // select this value within this record
    this.updateField(field, value)
  }

  /**
  * Change the tab of the form currently in view
  **/

  changeTab(tab) {
    this.setState({activeTab: tab})
  }

  /**
  * If `value` is missing from `field`, add it to the form, else remove it
  **/

  updateField(field, value) {

    // convert tour_ids back to ints before operating on them
    if (field == 'tour_ids') {
      var value = this.state.tourTitleToId[value];
    }

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

    this.setState({
      building: building,
      unsavedChanges: true
    })
  }

  /**
  * Replace the current value of `field` with `value`
  **/

  replaceField(field, value) {
    let building = Object.assign({}, this.state.building)
    building[field] = value;
    this.setState({building: building})
  }

  /**
  * Save a new or edited building in the db
  **/

  saveBuilding() {
    request.post(api.endpoint + 'building/save')
      .send(this.state.building)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.log(err)
      })
    this.setState({unsavedChanges: false})
  }

  /**
  * Return styles that indicate whether the form is dirty or not
  **/

  getSaveButtonStyle() {
    return this.state.unsavedChanges ?
        'save-button yellow-button unsaved-changes'
      : 'save-button yellow-button no-unsaved-changes'
  }

  render() {
    let view = null;
    switch (this.state.activeTab) {
      case 'overview':
        view = <Overview
          building={this.state.building}
          updateField={this.updateField}
          replaceField={this.replaceField}
          options={this.state.options}
          allowNewOptions={true}
          handleNewOption={this.handleNewOption}
          tourIdToTitle={this.state.tourIdToTitle} />;
        break;

      case 'data-and-history':
        view = <DataAndHistory
          building={this.state.building}
          updateField={this.updateField}
          replaceField={this.replaceField}
          options={this.state.options}
          allowNewOptions={true}
          handleNewOption={this.handleNewOption} />;
        break;

      case 'image-gallery':
        view = <ImageGallery
          building={this.state.building}
          updateField={this.updateField}
          replaceField={this.replaceField}
          options={this.state.options}
          allowNewOptions={true}
          handleNewOption={this.handleNewOption} />;
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
            <div className={this.getSaveButtonStyle()} onClick={this.saveBuilding}>Save</div>
          </div>
          {view}
        </div>
      </div>
    )
  }
}