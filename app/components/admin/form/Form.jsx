import React from 'react'
import Tabs from './Tabs'
import Overview from './Overview'
import DataAndHistory from './DataAndHistory'
import ImageGallery from './ImageGallery'
import api from '../../../../config'

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      building: {},
      activeTab: 'overview'
    }

    this.getBuilding = this.getBuilding.bind(this)
    this.processBuilding = this.processBuilding.bind(this)
    this.changeTab = this.changeTab.bind(this)
  }

  componentDidMount() {
    if (this.props.location.query.buildingId) {
      this.getBuilding(this.props.location.query.buildingId)
    }
  }

  getBuilding(buildingId) {
    api.get('buildings?buildingId=0', this.processBuilding)
  }

  processBuilding(err, res) {
    if (err) {console.warn(err)} else {
      this.setState({building: res.body[0]})
    }
  }

  changeTab(tab) {
    this.setState({activeTab: tab})
  }

  updateField(field, value) {
    let building = Object.assign({}, this.state.building)
    building[field] = value;
    this.setState({building: building})
  }

  render() {
    let view = null;
    switch (this.state.activeTab) {
      case 'overview':
        view = <Overview building={this.state.building} />;
        break;

      case 'data-and-history':
        view = <DataAndHistory building={this.state.building} />;
        break;

      case 'image-gallery':
        view = <ImageGallery building={this.state.building} />;
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