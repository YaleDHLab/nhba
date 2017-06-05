import React from 'react'
import getNewlineMarkup from '../lib/getNewlineMarkup'

const buildingHistoryFields = [
  {field: 'physical_description', label: 'Physical Description'},
  {field: 'streetscape', label: 'Streetscape'},
  {field: 'social_history', label: 'Social History'},
  {field: 'site_history', label: 'Site History'}
];

export default class BuildingHistory extends React.Component {
  render() {
    return (
      <div className='building-history'>
        {buildingHistoryFields.map((field, i) => {
          return this.props.building && this.props.building[field.field] ?
              <div key={i}>
                <h2 className='subfield'>{field.label}</h2>
                <div dangerouslySetInnerHTML={
                  getNewlineMarkup(this.props.building[field.field])
                } />
              </div>
            : null
        })}
      </div>
    )
  }
} 
