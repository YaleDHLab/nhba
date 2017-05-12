/**
* Method to construct a query url for finding buildings that
* match 0 or more search fields or terms
*
* @args:
*   {obj} state: a state object from the Search component
*   {obj} selectFields: an array of objects with label, field keys
* @returns:
*   {str} a URI-escaped query string for building data
**/

module.exports = (state, selectFields) => {
  let queryTerms = {}
  selectFields.map((field) => {
    let values = Array.from(state[field])

    if (field == 'tour_ids') {
      let tourValues = []
      values.map((value) => {
        tourValues.push(state.tourTitleToId[value])
      })
      values = tourValues;
    }

    if (values.length > 0) {
      var encodedValues = []
      values.map((value) => {

        // Replace ' ' in strings with _ so the server can handle
        // whitespace. All fields but the tour_ids are strings.
        typeof value == 'string' ?
            encodedValues.push(value.split(' ').join('_'))
          : encodedValues.push(value)
      })

      queryTerms[field] = encodedValues
    }
  })

  let url = 'buildings';

  if (queryTerms) {
    url += '?filter=true&'
    _.keys(queryTerms).map((field) => {
      url += field + '=' + queryTerms[field].join('+') + '&'
    })
  }

  return url;
}