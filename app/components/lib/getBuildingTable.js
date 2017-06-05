import React from 'react'

/**
* General function called to create building tables
* viewed within the building view route; while doing so,
* ensure each row has two fields if possible
*
* @args: {array} tableFields: an array of table field objects
*         each with field and label attributes
*        {obj} building: a building object
*
**/

module.exports = (tableFields, building) => {
  let cells = []
  tableFields.map((f, i) => {
    let value = building[f.field];
    let valueString = Array.isArray(value) ? value.join(', ') : value;
    if (value && value.length > 0) {
      cells.push ( <td key={i}>{f.label}: {valueString}</td> )
    }
  })

  let rows = [];
  let rowCells = [];
  cells.map((c, i) => {
    rowCells.push(c);
    if (rowCells.length % 2 == 0) {
      rows.push(<tr key={i}>{rowCells}</tr>)
      rowCells = [];
    }

    if (i+1 === cells.length && rowCells.length > 0) {
      rows.push(<tr key={i+1}>{rowCells}</tr>)
    }
  })

  return rows;
}
    