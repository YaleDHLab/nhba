import React from 'react'

const selects = [
  'Tour', 'Building Type', 'Use',
  'Style', 'Era', 'Neighborhood', 'Sort by'
];

export default class Filters extends React.Component {
  constructor(props) {
    super(props)

    this.getSelect = this.getSelect.bind(this)
  }

  getSelect(type, key) {
    return (
      <select className='custom-select' key={key}>
        <option value='volvo'>{type}</option>
        <option value='saab'>Saab</option>
        <option value='mercedes'>Mercedes</option>
        <option value='audi'>Audi</option>
      </select>
    )
  }

  render() {
    return (
      <div className='filters'>
        <div className='button'>Add a Building</div>
        <input type='text' className='building-search'></input>
        <div className='select-container'>
          {selects.map((select, i) => {
            return this.getSelect(select, i)
          })}
        </div>
      </div>
    )
  }
}
