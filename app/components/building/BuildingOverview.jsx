import React from 'react'

export default class BuildingOverview extends React.Component {
  constructor(props) {
    super(props)

    this.getMarkup = this.getMarkup.bind(this)
  }

  getMarkup(text) {
    return {__html: text.replace(/(?:\r\n|\r|\n)/g, '<br/> ')};
  }

  render() {
    return this.props.building ?
      <div className='building-overview'>
        <h1>Overview</h1>
        <p dangerouslySetInnerHTML={this.getMarkup(this.props.building.overview_description)} />
      </div>
    : <span/>
  }
} 
