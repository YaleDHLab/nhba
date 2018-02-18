import React from 'react';
import { browserHistory } from 'react-router';
import Tabs from './Tabs';
import Overview from './Overview';
import DataAndHistory from './DataAndHistory';
import MultimediaGallery from './MultimediaGallery';
import Confirm from '../Confirm';
import getSelectOptions from '../../lib/getSelectOptions';
import allSelects from '../../lib/allSelects';
import api from '../../../../config';
import Loader from '../../Loader';
import request from 'superagent';
import _ from 'lodash';

export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      admin: false,
      buildings: [],
      options: {},
      building: {},
      activeTab: 'overview',
      unsavedChanges: false,
      saveButtonText: 'Save',
      autoSaveInterval: null,
      missingFields: [],
    };

    // buildling(s) getters and setters
    this.getBuilding = this.getBuilding.bind(this);
    this.getEmptyBuilding = this.getEmptyBuilding.bind(this);
    this.getBuildings = this.getBuildings.bind(this);

    // getters and setters for select options
    this.setSelectOptions = this.setSelectOptions.bind(this);
    this.handleNewOption = this.handleNewOption.bind(this);

    // form field navigation
    this.changeTab = this.changeTab.bind(this);

    // methods to update/replace form fields
    this.updateField = this.updateField.bind(this);
    this.replaceField = this.replaceField.bind(this);

    // method to request lat long data
    this.geocode = this.geocode.bind(this);

    // upsert or delete buildings
    this.getSaveButtonStyle = this.getSaveButtonStyle.bind(this);
    this.saveBuilding = this.saveBuilding.bind(this);
    this.deleteBuilding = this.deleteBuilding.bind(this);
  }

  componentDidMount() {
    // load the requested building data if query params are present
    const buildingId = this.props.location.query.buildingId;
    buildingId ? this.getBuilding(buildingId) : this.getEmptyBuilding();

    // fetch all buildings so we can populate dropdowns
    this.getBuildings();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.state.buildings, prevState.buildings)) {
      this.setSelectOptions();
    }
  }

  /**
   * Building & Buildings getters and setters
   **/

  getEmptyBuilding() {
    api.get('building/empty', (err, res) => {
      if (err) {
        console.warn(err);
      } else {
        this.setState({ building: res.body });
      }
    });
  }

  getBuilding(buildingId) {
    const self = this;
    const url = 'buildings?buildingId=' + buildingId;
    api.get(url, (err, res) => {
      if (err) {
        console.warn(err);
      } else {
        self.setState({ building: res.body[0] });
      }
    });
  }

  getBuildings() {
    const self = this;
    api.get('buildings', (err, res) => {
      if (err) {
        console.warn(err);
      } else {
        self.setState({ buildings: res.body });
      }
    });
  }

  /**
   * Get available select options
   **/

  setSelectOptions() {
    const buildings = this.state.buildings;
    const options = getSelectOptions(buildings, allSelects);
    this.setState({ options: options });
  }

  /**
   * Callback triggered when users add a new option to a multiselect
   **/

  handleNewOption(field, value) {
    // add this value to the available options
    let options = Object.assign({}, this.state.options);
    options[field] ? options[field].push(value) : (options[field] = [value]);
    this.setState({ options: options });

    // select this value within this record
    this.updateField(field, value);
  }

  /**
   * Change the tab of the form currently in view
   **/

  changeTab(tab) {
    this.setState({ activeTab: tab });
  }

  /**
   * If `value` is missing from `field`, add it to the form, else remove it
   **/

  updateField(field, value) {
    // use Object.assign to avoid object mutations
    let building = Object.assign({}, this.state.building);

    // remove/add the selected value when users un/select values
    if (Array.isArray(building[field])) {
      _.includes(building[field], value)
        ? _.pull(building[field], value)
        : building[field].push(value);
    } else {
      building[field] = value;
    }

    // sets autosave interval if no missing fields
    const requiredFields = ['address', 'current_uses', 'researcher'];
    if (requiredFields.every(field => this.state.building[field])) {
      // checks if an autosave interval already exists, if not, set 5 second autosave interval
      let autoSaveInterval =
        this.state.autoSaveInterval || setInterval(this.saveBuilding, 5000);
      this.setState({ autoSaveInterval });
    } else {
      clearInterval(this.state.autoSaveInterval);
    }

    this.setState({
      building: building,
      unsavedChanges: true,
      saveButtonText: 'Save',
    });
  }

  /**
   * Replace the current value of `field` with `value`
   **/

  replaceField(field, value) {
    let building = Object.assign({}, this.state.building);
    building[field] = value;
    this.setState({
      building: building,
      unsavedChanges: true,
    });
  }

  /**
   * Fetch lat,lng coordinates for a building
   **/

  geocode() {
    request
      .post(api.endpoint + 'geocode')
      .send(this.state.building)
      .set('Accept', 'application/json')
      .end((err, res) => {
        const result = res.body,
          latitude = result.latitude,
          longitude = result.longitude;
        if (latitude && longitude) {
          this.updateField('latitude', latitude);
          this.updateField('longitude', longitude);
        }
        if (err) console.warn(err);
      });
  }

  /**
   * Save a new or edited building in the db
   **/

  saveBuilding() {
    if (this.state.unsavedChanges) {
      const requiredFields = ['address', 'current_uses', 'researcher'];
      this.setState(
        {
          missingFields: requiredFields.filter(
            field =>
              !this.state.building[field] ||
              (Array.isArray(this.state.building[field]) &&
                this.state.building[field].length === 0)
          ),
        },
        () => {
          if (this.state.missingFields.length === 0) {
            request
              .post(api.endpoint + 'building/save')
              .send(this.state.building)
              .set('Accept', 'application/json')
              .end((err, res) => {
                if (err) {
                  console.warn(err);
                } else {
                  // check if created new building
                  if (!this.state.building._id) {
                    this.setState({ building: res.body });
                  }
                }
              });
            clearInterval(this.state.autoSaveInterval);
            this.setState({
              unsavedChanges: false,
              saveButtonText: 'Saved',
              autoSaveInterval: null,
            });
          }
        }
      );
    }
  }

  /**
   * Delete the current building and return the admin to the admin page
   **/

  deleteBuilding() {
    request
      .post(api.endpoint + 'building/delete')
      .send(this.state.building)
      .set('Accept', 'application/json')
      .end(err => {
        if (err) console.warn(err);
      });
    browserHistory.push('/admin');
  }

  /**
   * Return styles that indicate whether the form is dirty or not
   **/

  getSaveButtonStyle() {
    return this.state.unsavedChanges
      ? 'save-button yellow-button unsaved-changes'
      : 'save-button yellow-button no-unsaved-changes';
  }

  render() {
    let view = null;

    if (this.state.building) {
      switch (this.state.activeTab) {
        case 'overview':
          view = (
            <Overview
              building={this.state.building}
              updateField={this.updateField}
              replaceField={this.replaceField}
              options={this.state.options}
              allowNewOptions={this.props.admin}
              handleNewOption={this.handleNewOption}
              geocode={this.geocode}
              missingFields={this.state.missingFields}
            />
          );
          break;

        case 'data-and-history':
          view = (
            <DataAndHistory
              building={this.state.building}
              updateField={this.updateField}
              replaceField={this.replaceField}
              options={this.state.options}
              allowNewOptions={this.props.admin}
              handleNewOption={this.handleNewOption}
            />
          );
          break;

        case 'multimedia-gallery':
          view = (
            <MultimediaGallery
              building={this.state.building}
              updateField={this.updateField}
              replaceField={this.replaceField}
              options={this.state.options}
              allowNewOptions={this.props.admin}
              handleNewOption={this.handleNewOption}
            />
          );
          break;
      }
    } else {
      view = <Loader />;
    }

    const building = this.state.building;
    const address =
      building && building.address ? building.address : 'New Building';

    const header = this.state.building._id ? (
      <a href={'/building?id=' + this.state.building._id}>
        <h1>{address}</h1>
      </a>
    ) : (
      <h1>{address}</h1>
    );

    return (
      <div className="form">
        <div className="form-content">
          {header}
          <div className="instructions">
            <p>Edit record for this building.</p>
            {this.state.missingFields.length > 0 ? (
              <p className="missing">
                You are missing the following fields:{' '}
                {this.state.missingFields.join(', ')}
              </p>
            ) : null}
          </div>
          <div>
            <Tabs activeTab={this.state.activeTab} changeTab={this.changeTab} />
            <div
              className={this.getSaveButtonStyle()}
              onClick={this.saveBuilding}
            >
              {this.state.saveButtonText}
            </div>
            <Confirm
              title="Confirm Delete"
              bodyText="Are you sure you want to delete this building?"
              confirmText="Delete"
              onConfirm={this.deleteBuilding}
            >
              <div className="delete-button red-button">Delete</div>
            </Confirm>
          </div>
          {view}
        </div>
      </div>
    );
  }
}
