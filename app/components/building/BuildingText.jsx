import React from 'react'
import BuildingTable from './BuildingTable'
import BuildingCollapsible from './BuildingCollapsible'

const tableFields = [
  {label: 'Style', field: 'styles'},
  {label: 'Architect', field: 'architect'},
  {label: 'Built', field: 'year_built'},
  {label: 'Client', field: 'client'},
  {label: 'Use', field: 'current_uses'},
  {label: 'Current Tenant', field: 'current_tenant'},
  {label: 'Neighborhood', field: 'neighborhoods'},
  {label: 'Researcher', field: 'researcher'}
]

export default class BuildingText extends React.Component {
  render() {
    const name = this.props.building.building_name ?
        this.props.building.building_name
      : this.props.building.address;

    let fields = [];
    if (this.props.building && this.props.building.overview_description) {
      this.props.fields.map((field, i) => {
        if (field.collapsible) {
          fields.push(
            <BuildingCollapsible
              childComponent={field.component}
              label={field.label} />
          );
        } else {
          fields.push(field.component)
        }
      })
    }

    return (
      <div className='building-text'>
        <h1 className='address'>{name}</h1>

        <BuildingTable
          building={this.props.building}
          tableFields={tableFields} />

        {fields.map((field, i) => {
          return <div key={i}>{field}</div>
        })}
      </div>
    )
  }
}