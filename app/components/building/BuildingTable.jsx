import React from 'react'

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

    // some tableFields are missing from buildings; ensure
    // each row in the table has two cells if possible

    let cells = []
    tableFields.map((f, i) => {
      let value = this.props.building[f.field];
      let valueString = Array.isArray(value) ? value.join(' ') : value;
      if (value) cells.push ( <td key={i}>{f.label}: {valueString}</td> )
    })

    let rows = [];
    let rowCells = [];
    cells.map((c, i) => {
      rowCells.push(c);
      if (rowCells.length % 2 == 0) {
        rows.push(<tr key={i}>{rowCells}</tr>)
        rowCells = [];
      }

      if (i+1 === cells.length && rowCells) rows.push(<tr key={i}>{rowCells}</tr>)
    })

    return (
      <table className='building-table'>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}