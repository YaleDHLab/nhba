import React from 'react'
import Multiselect from './Multiselect'
import getSelectOptions from './lib/getSelectOptions'
import filterSelects from './lib/filterSelects.js'
import _ from 'lodash'

export default class Filters extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: {}
    }

    this.setSelectOptions = this.setSelectOptions.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.buildings, this.props.buildings) ||
       (!_.isEqual(prevProps.tourIdToTitle, this.props.tourIdToTitle))) {
      this.setSelectOptions()
    }
  }

  setSelectOptions() {
    const buildings = this.props.buildings;
    const tourIdToTitle = this.props.tourIdToTitle;
    const options = getSelectOptions(buildings, filterSelects, tourIdToTitle)
    this.setState({options: options})
  }

  render() {
    const selectFields = (
      filterSelects.map((select, i) => {
        const values = this.props[select.field] ?
            _.toArray(this.props[select.field])
          : []

        return (
          <Multiselect
            key={i}
            label={select.label}
            field={select.field}
            values={values}
            options={this.state.options[select.field]}
            handleChange={this.props.updateSelect} />
        )
      })
    )

    return (
      <div className='filters'>
        <div className='input-container'>
          <div className='search-icon'
            onClick={this.props.runFulltextSearch} />
          <input type='text'
            className='building-search'
            onKeyDown={this.props.handleInputKeys}></input>
        </div>
        <div className='select-container'>
          {selectFields}

          <select value={this.props.sort}
            onChange={this.props.updateSort}
            className='sortby custom-select'>
            <option disabled>Sort by</option>
            <option value='proximity'>Proximity to me</option>
            <option value='updated'>Updated</option>
          </select>

        </div>
      </div>
    )
  }
}

