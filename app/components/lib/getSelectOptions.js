/**
* @args:
*   buildings: an array of building objects
*   tourIdToTitle: an object mapping tourId values to their labels
*   selects: an array of select objects with label and field keys
* @returns:
*   options: an object mapping each select field to its options
**/

import _ from 'lodash'

module.exports = function(buildings, selects, tourIdToTitle) {
  let options = {};

  // identify the select options that have fields (ie all but the sort)
  const selectFields = _.filter(selects, (select) => select.field)

  // initialize an empty set to contain the options for each field
  selectFields.map((select) => {
    options[select.field] = new Set()
  })

  // helper to add all options for a given field to an 'options' object
  const addOption = (building, field, options) => {
    if (building[field] && building[field].length > 0) {

      // ensure the levels for the current factor are an array
      const levels = _.isArray(building[field]) ?
          building[field]
        : [building[field]]

      // tour id values should be represented by their labels
      if (field == 'tour_ids') {
        levels.map((level) => {
          tourIdToTitle && tourIdToTitle[level] ?
              options[field].add(tourIdToTitle[level])
            : level
        })
      } else {
        levels.map((level) => {
          options[field].add(level)
        })
      }
    }

    return options;
  }

  // add each building's value to the options for each field
  buildings.map((building) => {
    selectFields.map((select) => {
      options = addOption(building, select.field, options)
    })
  })

  // transform the options to d[selectField] = [options]
  Object.keys(options).map((option) => {
    options[option] = Array.from(options[option])
  })

  return options;
}