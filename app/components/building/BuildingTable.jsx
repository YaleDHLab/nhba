import React from 'react'
import getBuildingTable from '../lib/getBuildingTable'

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

export default class BuildingTable extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const rows = getBuildingTable(tableFields, this.props.building)

    return (
      <table className='building-table'>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}