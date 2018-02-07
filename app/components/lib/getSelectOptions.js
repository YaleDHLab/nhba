/**
 * @args:
 *   buildings: an array of building objects
 *   selects: an array of select objects with label and field keys
 * @returns:
 *   options: an object mapping each select field to its options
 **/

import _ from 'lodash';
import sortEras from './sortEras';

module.exports = function(buildings, selects) {
  let options = {};

  // identify the select options that have fields (ie all but the sort)
  const selectFields = _.filter(selects, select => select.field);

  // initialize an empty set to contain the options for each field
  selectFields.map(select => {
    options[select.field] = new Set();
  });

  // add each building's value to the options for each field
  buildings.map(building => {
    selectFields.map(select => {
      options = addOption(building, select.field, options);
    });
  });

  // transform the options to d[selectField] = [options]
  Object.keys(options).map(option => {
    options[option] = Array.from(options[option]);
  });

  // perform any required sorting
  options.eras = sortEras(options.eras);

  return options;
};

// helper to add all options for a given field to an 'options' object
const addOption = (building, field, options) => {
  if (building[field] && building[field].length > 0) {
    // ensure the levels for the current factor are an array
    const levels = _.isArray(building[field])
      ? building[field]
      : [building[field]];

    levels.map(level => {
      options[field].add(level);
    });
  }

  return options;
};
