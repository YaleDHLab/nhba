import React from 'react'
import Multiselect from './Multiselect'
import getSelectOptions from './lib/getSelectOptions'
import selects from './lib/selects.js'
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
    if (!_.isEqual(this.props.buildings, prevProps.buildings)) {
      this.setSelectOptions()
    }
  }

  setSelectOptions() {
    const buildings = this.props.buildings;
    const tourIdToTitle = this.props.tourIdToTitle;
    const options = getSelectOptions(buildings, selects, tourIdToTitle)
    this.setState({options: options})
  }

  render() {
    const selectFields = (
      selects.map((select, i) => {
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

