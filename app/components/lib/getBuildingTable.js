import React from 'react';

/**
 * General function called to create building tables
 * viewed within the building view route; while doing so,
 * ensure each row has two fields if possible
 *
 * @args: {array} tableFields: an array of table field objects
 *         each with field and label attributes
 *        {obj} building: a building object
 *
 * */

module.exports = (tableFields, building) => {
  const cells = [];
  tableFields.forEach((f, i) => {
    const value = building[f.field];
    const valueString = Array.isArray(value) ? value.join(', ') : value;
    if (value && (value.length > 0 || !Number.isNaN(parseFloat(value)))) {
      if (f.type && f.type === 'url') {
        cells.push(
          <td key={i}>
            <div className="table-label">{f.label}</div>:
            <span> </span>
            <a target="_blank" href={valueString.trim()}>
              {valueString}
            </a>
          </td>
        );
      } else if (f.type && f.type === 'time') {
        cells.push(
          <td key={i}>
            <div className="table-label">{f.label}</div>:{' '}
            {new Date(valueString * 1000).toDateString()}
          </td>
        );
      } else {
        cells.push(
          <td key={i}>
            <div className="table-label">{f.label}</div>: {valueString}
          </td>
        );
      }
    }
  });

  const rows = [];
  let rowCells = [];
  cells.forEach((c, i) => {
    rowCells.push(c);
    if (rowCells.length % 2 === 0) {
      rows.push(<tr key={i}>{rowCells}</tr>);
      rowCells = [];
    }

    if (i + 1 === cells.length && rowCells.length > 0) {
      rows.push(<tr key={i + 1}>{rowCells}</tr>);
    }
  });

  return rows;
};
