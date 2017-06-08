import React from 'react'
import BuildingTable from './BuildingTable'
import BuildingCollapsible from './BuildingCollapsible'

export default class BuildingText extends React.Component {
  render() {
    const name = this.props.building.building_name ?
        this.props.building.building_name
      : this.props.building.address;

    let fields = [];
    if (this.props.building) {
      this.props.fields.map((field, i) => {
        if (field.collapsible) {
          fields.push(
            <div key={i} id={field.href}>
              <BuildingCollapsible
                childComponent={field.component}
                label={field.label} />
            </div>
          );
        } else {
          fields.push(
            <div key={i} id={field.href}>
              {field.component}
            </div>
          )
        }
      })
    }

    let tableFields = [
      {label: 'Year Built', field: 'year_built'},
      {label: 'Era', field: 'era'},
      {label: 'Functions', field: 'current_uses'},
      {label: 'Style', field: 'styles'},
      {label: 'Architect', field: 'architect'},
      {label: 'Client', field: 'client'},
      {label: 'Neighborhood', field: 'neighborhoods'},
      {label: 'Tour', field: 'tours'},
      {label: 'Researcher', field: 'researcher'},
    ]

    if (this.props.building.building_name) {
      tableFields.unshift({
        label: 'Address',
        field: 'address'
      })
    }

    return (
      <div className='building-text'>
        <h1 className='address'>{name}</h1>
        <BuildingTable
          building={this.props.building}
          tableFields={tableFields} />
        {fields}
      </div>
    )
  }
}