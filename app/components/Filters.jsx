import React from 'react'
import Select from './filters/Select'
import _ from 'lodash'

const selects = [
  {label: 'Tour', field: 'tour_ids'},
  {label: 'Building Type', field: 'structures'}, // validate this is the right field
  {label: 'Use', field: 'current_uses'},
  {label: 'Style', field: 'styles'},
  {label: 'Era', field: 'eras'},
  {label: 'Neighborhood', field: 'neighborhoods'},
  {label: 'Sort by'},
];

export default class Filters extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      'tour_ids': [],
      'building_types': [],
      'current_uses': [],
      'styles': [],
      'eras': [],
      'neighborhoods': [],
      'sort': null,
      'options': {}
    }

    this.getSelectOptions = this.getSelectOptions.bind(this)
    this.updateSelect = this.updateSelect.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (_.isEqual(this.props.buildings, prevProps.buildings)) {} else {
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

    // add each building's value to the options for each field
    const buildings = this.props.buildings;
    buildings.map((building) => {
      selectFields.map((select) => {
        const field = select.field;
        if (building[field] && building[field].length > 0) {

          // if this metadata field contains an array of values, add each
          if (Array.isArray(building[field])) {
            building[field].map((value) => {
              options[field].add(value)
            })
          } else {
            options[field].add(building[field])
          }
        }
      })
    })

    Object.keys(options).map((option) => {
      options[option] = Array.from(options[option])
    })

    this.setState({options: options})
  }

  updateSelect(field, value) {
    let state = Object.assign({}, this.state)
    state[field] = value;
    this.setState(state)
  }

  render() {
    console.log(selects, this.state.options)

    return (
      <div className='filters'>
        <div className='button'>Add a Building</div>
        <div className='input-container'>
          <div className='search-icon' />
          <input type='text' className='building-search'></input>
        </div>
        <div className='select-container'>
          {selects.map((select, i) => {
            return (
              <Select
                key={i}
                select={select}
                options={this.state.options[select.field]}
                updateSelect={this.updateSelect} />
            )
          })}
        </div>
      </div>
    )
  }
}

