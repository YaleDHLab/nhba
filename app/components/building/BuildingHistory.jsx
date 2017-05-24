import React from 'react'

const buildingHistoryFields = [
  {field: 'physical_description', label: 'Physical Description'},
  {field: 'streetscape', label: 'Streetscape'},
  {field: 'social_history', label: 'Social History'},
  {field: 'site_history', label: 'Site History'}
];

export default class BuildingHistory extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='building-history'>
        {buildingHistoryFields.map((field, i) => {
          return this.props.building && this.props.building[field.field] ?
              <div key={i}>
                <h2 className='subfield'>{field.label}</h2>
                <div>
                  {this.props.building[field.field]}
                </div>
              </div>
            : null
        })}
      </div>
    )
  }
} 
