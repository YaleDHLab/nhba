import React from 'react'
import BuildingTable from './BuildingTable'

const fields = [
  {
    label: 'Description',
    field: 'description'
  },
  {
    label: 'Streetscape',
    field: 'streetscape'
  },
  {
    label: 'Social History',
    field: 'socialHistory'
  },
];

export default class BuildingText extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='building-text'>
        <h1 className='address'>{this.props.building.address}</h1>

        <BuildingTable building={this.props.building} />

        {this.props.building && this.props.building.description ?
            fields.map((field, i) => {
              return (
                <div className='field' key={i}>
                  <h1 className='label'>{field.label}</h1>
                  <p className='text'>{this.props.building[field.field]}</p>
                </div>
              )
            })
          : <span>hm</span>
        }
      </div>
    )
  }
}