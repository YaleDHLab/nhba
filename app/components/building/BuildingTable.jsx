import React from 'react'

const table = {
  rows: [
    [
      {label: 'Style', field: 'styles'},
      {label: 'Architect', field: 'architect'}
    ],
    [
      {label: 'Built', field: 'year_built'},
      {label: 'Client', field: 'client'}
    ],
    [
      {label: 'Use', field: 'current_uses'},
      {label: 'Current Tenant', field: 'current_tenant'}
    ],
    [
      {label: 'Neighborhood', field: 'neighborhoods'},
      {label: 'Researcher', field: 'researcher'}
    ]
  ]
}

export default class BuildingTable extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let tds = [];
    table.rows.map((row, i) => {
      [0,1].map((idx) => {
        let field = this.props.building[row[idx].field];
        if ( field && field.length ) {
          field = _.isArray(field) ? field : [field]
          tds.push(<td>{row[idx].label}: {field.join(' ')}</td>)
        }
      })
    })

    return (
      <table className='building-table'>
        <tbody>
          {table.rows.map((row, i) => {
            return (
              <tr key={i}>
                <td>{row[0].label}: {this.props.building[row[0].field]}</td>
                <td>{row[1].label}: {this.props.building[row[1].field]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}