import React from 'react'
import Select from './filters/Select'
import _ from 'lodash'

const selects = [
  {label: 'Tour', field: 'tour_ids'},
  {label: 'Previous Use', field: 'structures'}, // validate this is the right field
  {label: 'Current Use', field: 'current_uses'},
  {label: 'Style', field: 'styles'},
  {label: 'Era', field: 'eras'},
  {label: 'Neighborhood', field: 'neighborhoods'},
  {label: 'Sort by'},
];

export default class Filters extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: {}
    }

    this.getSelectOptions = this.getSelectOptions.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.props.buildings, prevProps.buildings)) {
      this.getSelectOptions()
    }
  }

  getSelectOptions() {
    let options = {};

    // identify the select options that have fields (ie all but the sort)
    const selectFields = _.filter(selects, (select) => select.field)

    // initialize an empty set to contain the options for each field
    selectFields.map((select) => {
      options[select.field] = new Set()
    })

    // helper to add all options for a given field to an 'options' object
    const addOption = (building, field, options) => {
      if (building[field] && building[field].length > 0) {

        // ensure the levels for the current factor are an array
        const levels = _.isArray(building[field]) ?
            building[field]
          : [building[field]]

        // tour id values should be represented by their labels
        const tourIdToTitle = this.props.tourIdToTitle;
        if (field == 'tour_ids') {
          levels.map((level) => {
            tourIdToTitle && tourIdToTitle[level] ?
                options[field].add(tourIdToTitle[level])
              : level
          })
        } else {
          levels.map((level) => {
            options[field].add(level)
          })
        }
      }

      return options;
    }

    // add each building's value to the options for each field
    const buildings = this.props.buildings;
    buildings.map((building) => {
      selectFields.map((select) => {
        options = addOption(building, select.field, options)
      })
    })

    // transform the options to d[selectField] = [options]
    Object.keys(options).map((option) => {
      options[option] = Array.from(options[option])
    })

    this.setState({options: options})
  }

  render() {
    const selectFields = (
      selects.map((select, i) => {
        const values = this.props[select.field] ?
            _.toArray(this.props[select.field])
          : []

        return (
          <Select
            key={i}
            select={select}
            values={values}
            options={this.state.options[select.field]}
            updateSelect={this.props.updateSelect} />
        )
      })
    )

    return (
      <div className='filters'>
        <div className='button'>Add a Building</div>
        <div className='input-container'>
          <div className='search-icon' />
          <input type='text' className='building-search'></input>
        </div>
        <div className='select-container'>
          {selectFields}
        </div>
      </div>
    )
  }
}

