import React from 'react'

const table = {
  rows: [
    [
      {label: 'Style', field: 'style'},
      {label: 'Architect', field: 'architect'}
    ],
    [
      {label: 'Built', field: 'yearBuilt'},
      {label: 'Client', field: 'client'}
    ],
    [
      {label: 'Use', field: 'currentUse'},
      {label: 'Current Tenant', field: 'currentTenant'}
    ],
    [
      {label: 'Neighborhood', field: 'neighborhood'},
      {label: 'Researcher', field: 'researcher'}
    ]
  ]
}

export default class BuildingTable extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <table className='building-table'>
        <tbody>
          {table.rows.map((row, i) => {
            return (
              <tr key={i}>
                <td>{row[0].label}: {this.props.building[row[0].field]}</td>
                <td>{row[1].label}: {this.props.building[row[0].field]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}